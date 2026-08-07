import { Select, type GZThemeMode } from 'gz-ui';
import { persistThemeMode } from '@/config/theme';
import { useGlobalStore } from '@/store/useGlobalStore';
import styles from './index.module.less';

const THEME_MODE_OPTIONS: ReadonlyArray<{
  label: string;
  value: GZThemeMode;
}> = [
  { label: '金色 / 深色', value: 'gold-dark' },
  { label: '金色 / 浅色', value: 'gold-light' },
  { label: '蓝色 / 深色', value: 'blue-dark' },
  { label: '蓝色 / 浅色', value: 'blue-light' },
];

const LocalThemeSwitcher: React.FC = () => {
  const themeMode = useGlobalStore((state) => state.themeMode);
  const setThemeMode = useGlobalStore((state) => state.setThemeMode);

  const handleThemeChange = (nextThemeMode: GZThemeMode) => {
    setThemeMode(nextThemeMode);
    persistThemeMode(nextThemeMode);
  };

  return (
    <div className={styles.themeSwitcher}>
      <span>主题</span>
      <Select
        aria-label="切换主题"
        className={styles.themeSelect}
        options={[...THEME_MODE_OPTIONS]}
        value={themeMode}
        onChange={handleThemeChange}
      />
    </div>
  );
};

export default LocalThemeSwitcher;
