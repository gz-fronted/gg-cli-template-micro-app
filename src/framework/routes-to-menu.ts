import type { AppRouteObject, RouteMenuMetadata } from '@/router/types';

export interface FrameworkMenuItem {
  children?: FrameworkMenuItem[];
  key: string;
  label: string;
}

export interface FrameworkRouteItem {
  key: string;
  label: string;
}

export interface ActiveMenuState {
  openKeys: string[];
  selectedKey?: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const getMetadataLabel = (metadata?: RouteMenuMetadata): string | undefined => {
  if (isNonEmptyString(metadata?.title)) {
    return metadata.title.trim();
  }

  if (isNonEmptyString(metadata?.name)) {
    return metadata.name.trim();
  }

  return undefined;
};

const getRouteLabel = (route: AppRouteObject, fullPath: string): string =>
  getMetadataLabel(route) ??
  getMetadataLabel(route.handle) ??
  getMetadataLabel(route.meta) ??
  (fullPath === '/' ? 'home' : fullPath.replace(/^\/+/, ''));

const normalizePath = (path: string): string => {
  const normalizedPath = `/${path}`.replace(/\/{2,}/g, '/');
  return normalizedPath.length > 1 ? normalizedPath.replace(/\/$/, '') : normalizedPath;
};

const resolveRoutePath = (parentPath: string, routePath: string): string => {
  if (routePath.startsWith('/')) {
    return normalizePath(routePath);
  }

  return normalizePath(`${parentPath === '/' ? '' : parentPath}/${routePath}`);
};

const isUnavailableMenuPath = (path: string): boolean => path.includes('*') || path.includes(':');

export const createFrameworkMenuItems = (
  routes: readonly AppRouteObject[],
): FrameworkMenuItem[] => {
  const menuKeys = new Set<string>();

  const createItems = (
    currentRoutes: readonly AppRouteObject[],
    parentPath: string,
  ): FrameworkMenuItem[] => {
    const items: FrameworkMenuItem[] = [];

    currentRoutes.forEach((route) => {
      const fullPath = route.index
        ? parentPath || '/'
        : route.path
          ? resolveRoutePath(parentPath, route.path)
          : parentPath;

      if (isUnavailableMenuPath(fullPath)) {
        return;
      }

      const hasChildren = Boolean(route.children?.length);
      const childItems = route.children ? createItems(route.children, fullPath) : [];

      // 根路由和无 path 路由通常只是布局容器，不单独生成菜单项。
      if (hasChildren && (!route.path || fullPath === '/')) {
        items.push(...childItems);
        return;
      }

      if (childItems.length > 0) {
        items.push({
          children: childItems,
          key: `group:${fullPath}`,
          label: getRouteLabel(route, fullPath),
        });
        return;
      }

      if ((!route.index && !route.path) || menuKeys.has(fullPath)) {
        return;
      }

      menuKeys.add(fullPath);
      items.push({
        key: fullPath,
        label: getRouteLabel(route, fullPath),
      });
    });

    return items;
  };

  return createItems(routes, '/');
};

export const getFrameworkRouteItems = (items: readonly FrameworkMenuItem[]): FrameworkRouteItem[] =>
  items.flatMap((item) =>
    item.children?.length
      ? getFrameworkRouteItems(item.children)
      : [{ key: item.key, label: item.label }],
  );

const isPathMatched = (menuPath: string, pathname: string): boolean =>
  menuPath === '/'
    ? pathname === '/'
    : pathname === menuPath || pathname.startsWith(`${menuPath}/`);

export const getActiveMenuState = (
  items: readonly FrameworkMenuItem[],
  pathname: string,
): ActiveMenuState => {
  let activeState: ActiveMenuState = { openKeys: [] };

  const visitItems = (currentItems: readonly FrameworkMenuItem[], parentKeys: string[]): void => {
    currentItems.forEach((item) => {
      if (item.children?.length) {
        visitItems(item.children, [...parentKeys, item.key]);
        return;
      }

      if (
        isPathMatched(item.key, pathname) &&
        (!activeState.selectedKey || item.key.length > activeState.selectedKey.length)
      ) {
        activeState = {
          openKeys: parentKeys,
          selectedKey: item.key,
        };
      }
    });
  };

  visitItems(items, []);
  return activeState;
};
