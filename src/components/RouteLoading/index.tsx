import { Spin } from '@chenhui996/gg-ui';
import styles from './index.module.less';

const RouteLoading: React.FC = () => (
  <div className={styles.routeLoading}>
    <Spin size="large" />
  </div>
);

export default RouteLoading;
