import {
  AppstoreOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FolderOutlined,
  FundOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MoonOutlined,
  ProfileOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  getDesignTokenCssVariables,
  Input,
  Layout,
  Menu,
  Modal,
  Tooltip,
  type MenuProps,
} from 'gz-ui-web';
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { createBrowserRouter } from 'react-router-dom';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { AppRouteObject } from '@/router/types';
import guozhiLogo from './assets/guozhi-logo.svg';
import styles from './index.module.less';
import {
  createFrameworkMenuItems,
  getActiveMenuState,
  getFrameworkRouteItems,
  type FrameworkMenuItem,
} from './routes-to-menu';

type ApplicationRouter = ReturnType<typeof createBrowserRouter>;

export interface FrameworkProps {
  children?: ReactNode;
  router: ApplicationRouter;
  routes: readonly AppRouteObject[];
}

const LEAF_MENU_ICONS = [
  AppstoreOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FundOutlined,
  ProfileOutlined,
] as const;

const getLeafMenuIcon = (key: string) => {
  if (key === '/') {
    return HomeOutlined;
  }

  const iconIndex = Array.from(key).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return LEAF_MENU_ICONS[iconIndex % LEAF_MENU_ICONS.length];
};

const addMenuIcons = (items: readonly FrameworkMenuItem[]): MenuProps['items'] =>
  items.map((item) => {
    const MenuIcon = item.children ? FolderOutlined : getLeafMenuIcon(item.key);

    return {
      ...item,
      children: item.children ? addMenuIcons(item.children) : undefined,
      icon: <MenuIcon />,
    };
  });

const Framework: React.FC<FrameworkProps> = (props) => {
  const { children, router, routes } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [isRouteSearchOpen, setIsRouteSearchOpen] = useState(false);
  const [routeSearchKeyword, setRouteSearchKeyword] = useState('');
  const [userOpenKeys, setUserOpenKeys] = useState<string[]>([]);
  const { changeThemeMode, themeMode } = useAppTheme();
  const pathname = useSyncExternalStore(
    (onStoreChange) => router.subscribe(onStoreChange),
    () => router.state.location.pathname,
    () => router.state.location.pathname,
  );
  const menuItems = createFrameworkMenuItems(routes);
  const routeItems = getFrameworkRouteItems(menuItems);
  const normalizedRouteSearchKeyword = routeSearchKeyword.trim().toLocaleLowerCase();
  const filteredRouteItems = routeItems.filter(
    (item) =>
      !normalizedRouteSearchKeyword ||
      item.label.toLocaleLowerCase().includes(normalizedRouteSearchKeyword) ||
      item.key.toLocaleLowerCase().includes(normalizedRouteSearchKeyword),
  );
  const activeMenuState = getActiveMenuState(menuItems, pathname);
  const openKeys = collapsed ? [] : [...new Set([...userOpenKeys, ...activeMenuState.openKeys])];
  const sidebarThemeVariables = Object.fromEntries(
    Object.entries(
      getDesignTokenCssVariables({
        includeComponents: true,
        includeCustom: false,
        prefix: 'framework',
        themeMode,
      }),
    ).filter(([key]) => key.startsWith('--framework-components-sidebar-')),
  ) as CSSProperties;

  const handleCollapse = (): void => {
    setCollapsed((currentCollapsed) => !currentCollapsed);
  };

  const handleMenuClick: NonNullable<MenuProps['onClick']> = (event): void => {
    router.navigate(event.key);
  };

  const handleThemeToggle = (): void => {
    changeThemeMode(themeMode === 'gold-dark' ? 'gold-light' : 'gold-dark');
  };

  const handleRouteSearchOpen = (): void => {
    setIsRouteSearchOpen(true);
  };

  const handleRouteSearchClose = (): void => {
    setIsRouteSearchOpen(false);
    setRouteSearchKeyword('');
  };

  const handleRouteSelect = (path: string): void => {
    router.navigate(path);
    handleRouteSearchClose();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault();
        handleRouteSearchOpen();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <Layout className={styles.framework} data-theme-mode={themeMode} style={sidebarThemeVariables}>
      <Layout.Sider
        className={styles.sidebar}
        collapsed={collapsed}
        collapsedWidth={48}
        collapsible
        trigger={null}
        width={200}
      >
        <div className={styles.brand} data-collapsed={collapsed}>
          <span className={styles.brandIdentity} data-collapsed={collapsed}>
            {collapsed ? (
              <Tooltip title="展开侧边栏" placement="right">
                <Button
                  aria-label="展开侧边栏"
                  className={styles.brandLogoButton}
                  type="text"
                  onClick={handleCollapse}
                >
                  <img alt="国智" className={styles.logo} src={guozhiLogo} />
                </Button>
              </Tooltip>
            ) : (
              <img alt="国智" className={styles.logo} src={guozhiLogo} />
            )}
            <span aria-hidden={collapsed} className={styles.brandText} data-collapsed={collapsed}>
              <span className={styles.brandTitle}>智道</span>
              <span className={styles.brandSubtitle}>资管服务平台</span>
            </span>
          </span>
          <Tooltip title="收起侧边栏">
            <Button
              aria-hidden={collapsed}
              aria-label="收起侧边栏"
              className={styles.collapseButton}
              data-collapsed={collapsed}
              icon={<MenuFoldOutlined />}
              tabIndex={collapsed ? -1 : 0}
              type="text"
              onClick={handleCollapse}
            />
          </Tooltip>
        </div>

        <div aria-hidden="true" className={styles.menuDivider}>
          <div className={styles.menuDividerLine} />
        </div>

        <div className={styles.menuContainer}>
          <Menu
            className={styles.routeMenu}
            inlineCollapsed={collapsed}
            items={addMenuIcons(menuItems)}
            mode="inline"
            openKeys={openKeys}
            selectedKeys={activeMenuState.selectedKey ? [activeMenuState.selectedKey] : []}
            onClick={handleMenuClick}
            onOpenChange={setUserOpenKeys}
          />
        </div>

        <div
          aria-label="Framework 本地开发"
          className={styles.sidebarFooter}
          data-collapsed={collapsed}
          role="img"
        >
          <span className={styles.footerIdentity} data-collapsed={collapsed}>
            <span className={styles.footerIcon}>
              <UserOutlined />
            </span>
            <span aria-hidden={collapsed} className={styles.footerLabel} data-collapsed={collapsed}>
              本地开发
            </span>
          </span>
          <SettingOutlined
            aria-hidden={collapsed}
            className={styles.footerSetting}
            data-collapsed={collapsed}
          />
        </div>
      </Layout.Sider>

      <Layout className={styles.main}>
        <Layout.Header className={styles.header}>
          <Button
            aria-label="打开全局搜索"
            className={styles.globalSearchTrigger}
            icon={<SearchOutlined />}
            type="text"
            onClick={handleRouteSearchOpen}
          >
            <span className={styles.globalSearchLabel}>搜索</span>
            <span aria-hidden="true" className={styles.globalSearchShortcut}>
              Ctrl K
            </span>
          </Button>
          <Tooltip title={themeMode === 'gold-dark' ? '切换到浅色主题' : '切换到深色主题'}>
            <Button
              aria-label={themeMode === 'gold-dark' ? '切换到浅色主题' : '切换到深色主题'}
              className={styles.themeToggle}
              icon={themeMode === 'gold-dark' ? <SunOutlined /> : <MoonOutlined />}
              type="text"
              onClick={handleThemeToggle}
            />
          </Tooltip>
        </Layout.Header>
        <Layout.Content className={styles.content}>{children}</Layout.Content>
      </Layout>
      <Modal
        footer={null}
        open={isRouteSearchOpen}
        title="搜索路由"
        width={520}
        onCancel={handleRouteSearchClose}
      >
        <Input
          autoFocus
          placeholder="搜索路由名称或路径"
          prefix={<SearchOutlined />}
          value={routeSearchKeyword}
          onChange={(event) => setRouteSearchKeyword(event.target.value)}
        />
        <div className={styles.routeSearchResults}>
          {filteredRouteItems.length > 0 ? (
            filteredRouteItems.map((item) => (
              <Button
                key={item.key}
                className={styles.routeSearchResult}
                type="text"
                onClick={() => handleRouteSelect(item.key)}
              >
                <span className={styles.routeSearchResultLabel}>{item.label}</span>
                <span className={styles.routeSearchResultPath}>{item.key}</span>
              </Button>
            ))
          ) : (
            <div className={styles.routeSearchEmpty}>暂无匹配路由</div>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default Framework;
