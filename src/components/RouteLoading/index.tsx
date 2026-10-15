import { Spin } from 'gz-ui-web';
import styles from './index.module.less';

const RouteLoading: React.FC = () => (
  <div className={styles.routeLoading}>
    <Spin size="large" />
  </div>
);

export default RouteLoading;
