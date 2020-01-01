import Main from '@/components/main';
// 基础设置
export const active = [
  {
    path: '/active',
    name: 'active',
    component: Main,
    meta: {
      title: '活动管理',
      icon: 'md-megaphone'
    },
    children: [
      {
        path: '/active/message-list',
        name: 'MessageList',
        meta: {
          title: '留言列表'
        },
        component: () => import('@/views/active/message-list.vue')
      },
      {
        path: '/active/message-detail',
        name: 'MessageDetail',
        meta: {
          title: '留言详情',
          hideInMenu:true
        },
        component: () => import('@/views/active/message-detail.vue')
      },
      {
        path: '/active/compound-list',
        name: 'compoundList',
        meta: {
          title: '合成列表'
        },
        component: () => import('@/views/active/compound-list.vue')
      }
    ]
  }
];
