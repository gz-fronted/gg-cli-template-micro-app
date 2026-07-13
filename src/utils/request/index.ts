/**
 * 通用网络请求工具 (Axios Encapsulation)
 * 封装了全局请求拦截、响应处理和错误统一处理
 */
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// 定义通用的后端响应结构
export interface BaseResponse<T = unknown> {
  code: number; // 业务状态码 (0/200: 成功, 其他: 失败)
  data: T; // 业务数据
  message: string; // 提示信息
}

// 创建 Axios 实例的工厂函数
function createRequest(config: AxiosRequestConfig) {
  const instance = axios.create(config);

  // 请求拦截器
  instance.interceptors.request.use(
    (reqConfig) => {
      // 在发送请求之前做些什么，例如添加 token
      const token = localStorage.getItem('token');
      if (token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
      const { data } = response;
      // 根据自定义的 code 判断请求是否成功 (假设 0 或 200 为成功)
      if (data.code === 0 || data.code === 200) {
        return data.data as any; // 拆包返回 data
      } else {
        // 处理业务错误，例如提示用户
        console.error(data.message || '请求失败');
        return Promise.reject(new Error(data.message || '请求失败'));
      }
    },
    (error) => {
      // 处理 HTTP 错误，例如 401, 404, 500 等
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 401:
            console.error('未授权，请重新登录');
            // 执行登出逻辑等
            break;
          case 403:
            console.error('拒绝访问');
            break;
          case 404:
            console.error('请求地址错误');
            break;
          case 500:
            console.error('服务器内部错误');
            break;
          default:
            console.error(`请求错误: ${status}`);
        }
      } else {
        console.error('网络连接异常,请稍后再试!');
      }
      return Promise.reject(error);
    },
  );

  // 返回封装好的请求方法对象
  return {
    /**
     * 发送 GET 请求
     * @param url 请求地址
     * @param config Axios 配置
     */
    get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      return instance.get(url, config);
    },
    /**
     * 发送 POST 请求
     * @param url 请求地址
     * @param data 请求体数据
     * @param config Axios 配置
     */
    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
      return instance.post(url, data, config);
    },
    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
      return instance.put(url, data, config);
    },
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      return instance.delete(url, config);
    },
  };
}

// 导出默认 request 实例
// 可以直接 import { request } from '@/utils/request' 使用
export const request = createRequest({
  // 从环境变量 VITE_API_BASE_URL 获取基础地址，默认为 /api
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 超时时间 10s
});
