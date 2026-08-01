import { gzFetch } from '@gz-fronted/gz-pc/fetch';

// 定义接口返回的数据类型
export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

// 示例 API 服务
export const userService = {
  // 获取用户信息
  getUserInfo: (userId: number): Promise<UserInfo> => {
    return gzFetch<UserInfo>({
      url: `/users/${userId}`,
      method: 'GET',
    });
  },

  // 更新用户信息
  updateUserInfo: (userId: number, params: Partial<UserInfo>): Promise<UserInfo> => {
    return gzFetch<UserInfo, Partial<UserInfo>>({
      url: `/users/${userId}`,
      method: 'PUT',
      params,
    });
  },
};
