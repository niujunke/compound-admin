import { postAxios, getAxios } from '@/lib/http';
export const loginApi = {
  // 登录
  login: data => {
    return postAxios('/admin/login', data);
  },
  // 登出
  logout: (token) => {
    return getAxios(`/admin/logout?x-access-token=${token}`);
  }
};
