import http from "@/util/request";
import store from "@/store";
//获取首页轮播图
export const getBanner = (params)=>{

    return  http.get('/banner?type=2',params)
}
//获取每日推荐歌单
export const getMusicList = (params)=>{

    return  http.get('/personalized?limit=10',params)
}
//取得歌单详情页的数据  第一种
export const getMusicListDetail = (params)=>{

    return  http.get(`/playlist/detail?id=${store.state.file.number}`,params)
}

//可以直接传参 第二种:(在调用的时候传data过来)

// export function getMusicListDetail(data){
//     return http.get(`/playlist/detail?id=${data}`)
// }

//取得用户信息
// export const getUserDetail = (params)=>{
//     return  http.get(`/user/detail?id=${store.state.file.userId}`,params)
// }

//获取歌单歌曲
export const getMusicListAll = (params)=>{

    return  http.get(`/playlist/track/all?id=${store.state.file.number}&limit=${store.state.file.limit}&offset=${store.state.file.offset}`,params)
}

//获取歌词
export function getMusiclyrics(data){
    return http.get(`/lyric?id=${data}`)
}

//获取对应歌曲的百科信息
export function getMusicWikis(id){
    return http.get(`/song/wiki/summary?id=${id}`)
}

//获取默认搜索关键词
export function getSearchKeyword(){
    return http.get('/search/default')
}

//获取热搜列表
export function getSearchHotMusic(){
    return http.get('/search/hot/detail')
}

//获取搜索建议
export function getMusicSuggest(keywords){
    return http.get(`/search/suggest?keywords=${keywords}`)
}





