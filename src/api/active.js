import { postAxios, getAxios } from '@/lib/http';
export const activeApi = {
  // 分页查询
  getMessage: (data) => {
    return postAxios('/admin/message/page/query', data);
  },
  getDetail: (messageId) => {
    return getAxios(`/admin/message/detail/${messageId}`);
  },
  deleteMessage: (data) => {
    return postAxios('/admin/message/batchDelete', data);
  },
  deleteFaceFuse: (data) => {
    return postAxios('/admin/faceFuse/batchDelete', data);
  },
  getFaceFuse: (data) => {
    return postAxios('/admin/faceFuse/query', data);
  },
};
