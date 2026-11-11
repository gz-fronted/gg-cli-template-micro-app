import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'path';

const root = path.resolve(process.argv[2] || 'dist');
const manifest = JSON.parse(await readFile(path.join(root, 'micro-app-runtime.json'), 'utf8'));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const page = await readFile(path.join(root, manifest.page), 'utf8');
assert.ok(html.includes(manifest.page));
assert.ok(!/<script[^>]*type=["']module/.test(html), '页面入口必须是经典脚本');
assert.ok(
  page.indexOf('registerProvider(provider)') < page.indexOf('ready = import(runtimeUrl)'),
  'provider 必须先同步注册',
);
assert.ok(page.includes('return MicroAppPage.provider'), '页面导出的 provider 必须连接到 shim');
assert.ok(page.includes('document.currentScript'), '跨端口运行时地址应基于实际入口');
assert.ok(manifest.dependencies.includes('axios'), 'Axios 的全局调度器必须共享');
for (const dep of manifest.dependencies) {
  assert.ok(
    !path.posix.isAbsolute(dep) && !path.win32.isAbsolute(dep),
    '源码绝对路径不能进入运行时',
  );
  assert.ok(
    !/^(?:@gz-fronted\/gz-pc|@garfish\/bridge|zustand|msw)(?:\/|$)/.test(dep),
    '会话模块不能共享',
  );
}
assert.ok(Array.isArray(manifest.runtimeChunks), '缺少共享运行时分包清单');
assert.ok(manifest.runtimeChunks.includes(manifest.runtime), '运行时入口必须在分包清单内');
assert.equal(new Set(manifest.runtimeChunks).size, manifest.runtimeChunks.length, '分包清单重复');
for (const chunk of manifest.runtimeChunks) {
  assert.match(chunk, /^assets\/js\/[^/]+\.js$/, 'JS 产物应保持分类目录');
  await stat(path.join(root, chunk));
}
for (const name of ['vendor-react', 'vendor-antd', 'vendor-echarts']) {
  assert.ok(
    manifest.runtimeChunks.some((file) => path.basename(file).startsWith(`${name}-`)),
    `缺少 ${name} 分包`,
  );
}
assert.match(manifest.page, /^assets\/js\/page-[a-f\d]+\.js$/, '页面入口应保持分类目录');
for (const match of html.matchAll(/href="([^"]+\.css)"/g)) {
  const filename = new URL(match[1], 'http://local/').pathname;
  assert.match(filename, /\/assets\/css\/[^/]+\.css$/, 'CSS 产物应保持分类目录');
  await stat(path.join(root, filename));
}
console.log(
  JSON.stringify({
    result: 'passed',
    page: manifest.page,
    runtime: manifest.runtime,
    dependencies: manifest.dependencies,
  }),
);
