import { Typography } from 'antd';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Button } from '@chenhui996/gg-ui';
import styles from './index.module.less';

const { Title } = Typography;

/**
 * 欢迎语组件 (WelcomeHeader)
 * 展示用户个性化问候语和任务概览
 */
const WelcomeHeader = () => {
  // 从全局 Store 中获取由主应用透传过来的用户信息
  const user = useGlobalStore((state) => state.user);
  const token = useGlobalStore((state) => state.token);

  console.log('[micro-app user]', user);
  console.log('[micro-app token]', token);

  const displayName = user?.name || '游客';
  const roleInfo = user?.dept ? `[${user.dept}] ` : '';

  return (
    <div className={styles.welcomeHeader}>
      <Title level={2} style={{ color: 'var(--gz-color-text)' }}>
        您好，{roleInfo}
        {displayName}，您已正常启动一个【子应用】
        <Button>去任务列表</Button>
      </Title>
    </div>
  );
};

export default function Home() {
  return (
    <div className={styles.homePage}>
      <WelcomeHeader />
    </div>
  );
}
