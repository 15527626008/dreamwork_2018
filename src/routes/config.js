export default {
    menus: [    // 菜单相关路由
        { key: '/app/dashboard/index', title: '资讯', icon: 'file-text', component: 'News',className:'text-2x text-grey',source:''},
       
       
        {
            key: '/app/star', title: '收藏',icon: 'star',component:'Collections',className:'text-2x text-danger',source:''
        },
        {
            key: '/app/tool', title: '查快递', icon: 'search', component: 'Tools',className:'text-2x text-info',source:'http://localhost:3008/listUsers'
        },
        
    ],
    others: []  // 非菜单相关路由
}