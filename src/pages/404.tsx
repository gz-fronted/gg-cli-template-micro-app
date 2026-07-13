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
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="404"
        title={<span style={{ color: '#fff' }}>404</span>}
        subTitle={
          <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
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
