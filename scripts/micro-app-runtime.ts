import path from 'path';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { build, type Plugin, type ResolvedConfig, type Rollup } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

const sharedPackages = [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'dayjs',
  'antd',
  '@ant-design/icons',
  'gz-ui-web',
  'ag-grid-community',
  'ag-grid-enterprise',
  'ag-grid-react',
  '@ag-grid-community/locale',
  'echarts',
  'echarts-for-react',
  'tslib',
  'axios',
];

interface MicroAppRuntimeOptions {
  sharedChunks?: (id: string) => string | undefined;
}

export const normalizeModuleId = (id: string): string => id.replaceAll('\\', '/').split('?')[0];

export const isSharedDependency = (id: string): boolean => {
  if (/\.(css|less)(?:\?|$)/.test(id)) return false;
  if (
    path.posix.isAbsolute(id) ||
    path.win32.isAbsolute(id) ||
    id.startsWith('.') ||
    id.startsWith('\0') ||
    id.startsWith('@/') ||
    id.startsWith('#')
  )
    return false;
  return sharedPackages.some((name) => id === name || id.startsWith(`${name}/`));
};

// 仅构建时启用。库代码使用稳定 ESM URL；业务源码及会话单例在经典页面包内重建。
export const microAppRuntime = (options: MicroAppRuntimeOptions = {}): Plugin => {
  let config: ResolvedConfig;
  let entryObserved = false;
  const dependencies = new Map<string, string>();
  const dependencyName = (id: string): string => {
    let name = dependencies.get(id);
    if (!name) {
      name = `dep${dependencies.size}`;
      dependencies.set(id, name);
    }
    return name;
  };

  return {
    name: 'micro-app-runtime',
    apply: 'build',
    enforce: 'post',
    config: () => ({
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      build: {
        cssCodeSplit: false,
        lib: {
          entry: path.resolve('src/main.tsx'),
          name: 'MicroAppPage',
          formats: ['iife'],
          fileName: () => 'assets/js/page.js',
        },
        rolldownOptions: {
          external: (id) => {
            if (!isSharedDependency(id)) return false;
            dependencyName(id);
            return true;
          },
          output: {
            codeSplitting: false,
            globals: (id) => `__microAppDependencies.${dependencyName(id)}`,
          },
        },
      },
    }),
    configResolved(resolved) {
      config = resolved;
    },
    transform(code, id) {
      if (normalizeModuleId(id) === normalizeModuleId(path.resolve(config.root, 'src/main.tsx'))) {
        entryObserved = true;
        return code;
      }
    },
    async generateBundle(_options, bundle) {
      if (!entryObserved) this.error('业务入口未经过转换，拒绝生成不可挂载的 provider');
      const page = Object.values(bundle).find(
        (item): item is Rollup.OutputChunk => item.type === 'chunk' && item.isEntry,
      );
      if (!page) this.error('缺少页面入口产物');
      const entries = [...dependencies];
      const fetchEntry = createRequire(path.resolve(config.root, 'package.json')).resolve(
        '@gz-fronted/gz-pc/fetch',
      );
      const virtualId = path.resolve(config.root, 'node_modules/.micro-app-shared-entry.js');
      const configuredOutput = config.build.rolldownOptions.output;
      const filenames = Array.isArray(configuredOutput) ? configuredOutput[0] : configuredOutput;
      const result = await build({
        configFile: false,
        root: config.root,
        mode: config.mode,
        base: config.base,
        logLevel: 'warn',
        define: { 'process.env.NODE_ENV': JSON.stringify('production') },
        plugins: [
          {
            name: 'micro-app-shared-entry',
            async resolveId(id) {
              if (id === virtualId) return id;
              // Axios 是 gz-pc 的传递依赖，从其目录解析，兼容 pnpm 非提升安装。
              if (id === 'axios') return this.resolve(id, fetchEntry, { skipSelf: true });
            },
            load: (id) =>
              id === virtualId
                ? entries
                    .map(
                      ([source, name]) =>
                        `import * as ${name} from ${JSON.stringify(source)}; export { ${name} };`,
                    )
                    .join('\n')
                : undefined,
          },
          process.env.ANALYZE === 'true' &&
            visualizer({
              filename: path.resolve(config.root, config.build.outDir, 'shared-runtime-stats.html'),
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
        ],
        build: {
          write: false,
          emptyOutDir: false,
          minify: config.build.minify,
          terserOptions: config.build.terserOptions,
          cssCodeSplit: false,
          lib: { entry: { runtime: virtualId }, formats: ['es'] },
          rolldownOptions: {
            output: {
              entryFileNames: filenames?.entryFileNames ?? 'assets/js/[name]-[hash].js',
              chunkFileNames: filenames?.chunkFileNames ?? 'assets/js/[name]-[hash].js',
              assetFileNames: filenames?.assetFileNames ?? 'assets/[ext]/[name]-[hash].[ext]',
              manualChunks: options.sharedChunks,
            },
          },
        },
      });
      const output = Array.isArray(result) ? result[0] : result;
      if (!output || !('output' in output)) this.error('共享运行时构建未返回唯一产物');
      const runtime = output.output.find(
        (item): item is Rollup.OutputChunk => item.type === 'chunk' && item.isEntry,
      );
      if (!runtime) this.error('缺少共享运行时入口');
      for (const item of output.output) {
        this.emitFile({
          type: 'asset',
          fileName: item.fileName,
          source: item.type === 'chunk' ? item.code : item.source,
        });
      }
      const url = (file: string): string => `${config.base}${file}`;
      const runtimeRelative = path.posix.relative(
        path.posix.dirname(page.fileName),
        runtime.fileName,
      );
      // provider 必须同步注册；Garfish 等待其异步结果，而不是等待模块自行注册。
      page.code =
        `(function () {\n` +
        `var ready;\n` +
        `var provider = async function (appInfo, props) { return (await ready)(appInfo, props); };\n` +
        `if (typeof __GARFISH_EXPORTS__ === 'object' && __GARFISH_EXPORTS__) {\n` +
        ` if (__GARFISH_EXPORTS__.registerProvider) __GARFISH_EXPORTS__.registerProvider(provider);\n` +
        ` else __GARFISH_EXPORTS__.provider = provider;\n}\n` +
        `var runtimeUrl = new URL(${JSON.stringify(runtimeRelative)}, document.currentScript && document.currentScript.src || new URL(${JSON.stringify(url(page.fileName))}, document.baseURI).href).href;\n` +
        `ready = import(runtimeUrl).then(function (__microAppDependencies) {\n` +
        page.code +
        `\nreturn MicroAppPage.provider;\n});\n` +
        `ready.catch(function () {});\n})();\n`;
      // 包装层引用 runtime 哈希；页面文件名也随依赖变化，避免旧入口指向新 runtime。
      const { createHash } = await import('node:crypto');
      const hash = createHash('sha256').update(page.code).digest('hex').slice(0, 12);
      delete bundle[page.fileName];
      page.fileName = `${path.posix.dirname(page.fileName)}/page-${hash}.js`;
      this.emitFile({ type: 'asset', fileName: page.fileName, source: page.code });
      const styleFiles: string[] = [];
      for (const item of Object.values(bundle)) {
        if (item.type === 'asset' && item.fileName.endsWith('.css')) {
          styleFiles.push(item.fileName);
        }
      }
      styleFiles.push(
        ...output.output
          .filter((item) => item.fileName.endsWith('.css'))
          .map((item) => item.fileName),
      );
      const styles = styleFiles
        .map((file) => `<link rel="stylesheet" href="${url(file)}">`)
        .join('\n');
      const html = await readFile(path.resolve(config.root, 'index.html'), 'utf8');
      const scriptTag = /<script\s+type="module"\s+src="\/src\/main\.tsx"><\/script>/;
      if (!scriptTag.test(html)) this.error('index.html 中缺少预期的业务入口 script');
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: html
          .replace(scriptTag, `<script src="${url(page.fileName)}" defer></script>`)
          .replace('</head>', `${styles}\n</head>`),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'micro-app-runtime.json',
        source: JSON.stringify(
          {
            schemaVersion: 1,
            page: page.fileName,
            runtime: runtime.fileName,
            runtimeChunks: output.output
              .filter((item) => item.type === 'chunk')
              .map((item) => item.fileName),
            dependencies: entries.map(([id]) => id),
            lifecycle: 'fresh-page-per-load',
          },
          null,
          2,
        ),
      });
    },
  };
};
