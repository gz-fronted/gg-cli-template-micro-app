import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

/**
 * 404 页面组件
 * 当用户访问不存在的路由时展示
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--gz-color-bg-layout)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="404"
        title={<span style={{ color: 'var(--gz-color-text)' }}>404</span>}
        subTitle={
          <span style={{ color: 'var(--gz-color-text-secondary)' }}>
            抱歉，您访问的页面不存在。
          </span>
        }
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
}
