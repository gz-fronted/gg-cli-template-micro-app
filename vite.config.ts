import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { microAppRuntime } from './scripts/micro-app-runtime.ts';
// import garfishPlugin from 'vite-plugin-garfish-mf';
// import cdn from 'vite-plugin-cdn-import'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');

  return {
    base: env.VITE_API_SERVER,
    server: {
      port: 3001,
      cors: true,
      origin: 'http://localhost:3001',
    },
    // 其他配置...
    plugins: [
      react(),
      // garfishPlugin({
      //   base: 'http://localhost:3001',
      // }),
      // 暂时注释 CDN 抽离配置，因为内网环境暂不支持
      /*
      cdn({
        modules: [
          {
            name: 'react',
            var: 'React',
            path: `https://unpkg.com/react@19.2.4/umd/react.production.min.js`,
          },
          {
            name: 'react-dom',
            var: 'ReactDOM',
            path: `https://unpkg.com/react-dom@19.2.4/umd/react-dom.production.min.js`,
          },
          {
            name: 'dayjs',
            var: 'dayjs',
            path: `https://unpkg.com/dayjs@1.11.10/dayjs.min.js`,
          },
          {
            name: 'antd',
            var: 'antd',
            path: `https://unpkg.com/antd@6.3.3/dist/antd.min.js`,
          }
        ]
      }),
      */
      babel({ presets: [reactCompilerPreset()] }),
      microAppRuntime({
        // 原有库级分包规则在共享 ESM 依赖层执行，页面 IIFE 仍按实例创建。
        sharedChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/echarts') || id.includes('node_modules/zrender')) {
            return 'vendor-echarts';
          }
          if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
            return 'vendor-antd';
          }
        },
      }),
      process.env.ANALYZE === 'true' &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 生产环境打包配置
    build: {
      // 消除打包大小超过 500kb 警告
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    // Vitest 测试配置
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/setupTests.ts', 'dist/'],
      },
    },
  };
});
