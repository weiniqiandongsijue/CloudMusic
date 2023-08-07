import Vue from "vue";
import Vuerouter from "vue-router";

Vue.use(Vuerouter)

//解决重复点击当前所在菜单引起的路由重复报错问题
// 获取原型对象中的push函数
const originalPush = Vuerouter.prototype.push;
// 修改原型对象中的push函数
Vuerouter.prototype.push = function push(location){
    return originalPush.call(this , location).catch(err=>err)
}


const router = new Vuerouter({
    routes:[
        {
            name:'home',
            path:'/',
            redirect:'Find',  //重定向
            component:()=> import('../pages/Main'),
            // meta:{},
            children:[
                {
                    name:'Find',
                    path:'Find',
                    component:()=> import('../pages/Find'),

                },
                {
                    name:'my',
                    path:'MyInfo',
                    component:()=> import('../pages/MyInfo'),
                }
            ]
        },
        {
            name:'playlistdetail',
            path:'/playlistdetail',
            component:()=> import('../pages/PlaylistDetail')
        }
    ]
})

export default router