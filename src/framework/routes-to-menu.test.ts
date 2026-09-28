import { describe, expect, it } from 'vitest';
import type { AppRouteObject } from '@/router/types';
import {
  createFrameworkMenuItems,
  getActiveMenuState,
  getFrameworkRouteItems,
} from './routes-to-menu';

describe('createFrameworkMenuItems', () => {
  it('递归生成菜单并按 title、name、path 选择名称', () => {
    const testRoutes: AppRouteObject[] = [
      {
        path: '/',
        children: [
          { index: true },
          { path: 'audit-log' },
          {
            path: 'account',
            title: '账户',
            children: [
              { name: '管理', path: 'manage' },
              { handle: { title: '角色' }, path: 'role' },
            ],
          },
        ],
      },
    ];

    expect(createFrameworkMenuItems(testRoutes)).toEqual([
      { key: '/', label: 'home' },
      { key: '/audit-log', label: 'audit-log' },
      {
        children: [
          { key: '/account/manage', label: '管理' },
          { key: '/account/role', label: '角色' },
        ],
        key: 'group:/account',
        label: '账户',
      },
    ]);
  });

  it('排除 wildcard、动态路由和重复路径', () => {
    const testRoutes: AppRouteObject[] = [
      { path: '/audit-log' },
      { path: '/audit-log' },
      { path: '/detail/:id' },
      { path: '*' },
    ];

    expect(createFrameworkMenuItems(testRoutes)).toEqual([
      { key: '/audit-log', label: 'audit-log' },
    ]);
  });

  it('不为仅承载不可见 children 的布局路由生成菜单', () => {
    const testRoutes: AppRouteObject[] = [
      {
        path: '/',
        children: [{ path: '*' }],
      },
      {
        children: [{ path: '/detail/:id' }],
      },
    ];

    expect(createFrameworkMenuItems(testRoutes)).toEqual([]);
  });
});

describe('getActiveMenuState', () => {
  it('选择最长匹配项并返回需要展开的父菜单', () => {
    const items = createFrameworkMenuItems([
      {
        path: '/account',
        children: [{ path: 'manage' }, { path: 'role' }],
      },
    ]);

    expect(getActiveMenuState(items, '/account/manage/detail')).toEqual({
      openKeys: ['group:/account'],
      selectedKey: '/account/manage',
    });
  });
});

describe('getFrameworkRouteItems', () => {
  it('展开分组并只返回可导航的叶子路由', () => {
    expect(
      getFrameworkRouteItems([
        { key: '/', label: '首页' },
        {
          children: [{ key: '/account/manage', label: '管理' }],
          key: 'group:/account',
          label: '账户',
        },
      ]),
    ).toEqual([
      { key: '/', label: '首页' },
      { key: '/account/manage', label: '管理' },
    ]);
  });
});
