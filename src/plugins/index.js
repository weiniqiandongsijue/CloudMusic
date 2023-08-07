//按需引入vant组件库
import { Button,Swipe,SwipeItem,Lazyload,Skeleton,Overlay,Popup,PullRefresh,ActionSheet,Dialog  } from 'vant';

var plugins = [
    Button,Swipe,SwipeItem,Lazyload,Skeleton,Overlay,Popup,PullRefresh,ActionSheet,Dialog 
]

export default function getVant(app){
    // console.log(app,'app')
    // app.use(Button)
    plugins.forEach( item =>{
        return app.use(item)
    })
}