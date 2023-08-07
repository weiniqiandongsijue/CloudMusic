<template>
    <div class="playlist">
        <div class="playlist-top">
            <p class="playlist-text">发现好歌单</p>
            <button class="btn">
                <lord-icon src="https://cdn.lordicon.com/zmkotitn.json" 
                    trigger="loop"
                    delay="2000"
                    colors="primary:#b4b4b4"
                    style="width:35px;height:35px"
                    class="btn-icon">
                </lord-icon>
            </button>
        </div>
            <div class="playlist-content">
                <van-swipe :loop="false" :width="150" :show-indicators="false" class="playlist-swipe">
                    <van-swipe-item class="swipe-item" v-for="(item,index) of PlayList" :key="index">
                        <div class="swipe-a" @click="getId(item.id)">
                            <div class="playlist-count">
                                <span>{{PlayCount(item.playCount)}}</span>
                                <ion-icon name="play" class="swipe-icon"></ion-icon>
                            </div>
                            <div class="swipe-opacity" v-show="!loading"></div>
                            <!-- 骨架屏 -->
                            <van-skeleton avatar avatar-size="2.8rem" avatar-shape="square" class="skeleton-img" :loading="loading">
                                <img :src="item.picUrl" :alt="item.name" class="swipe-img">
                            </van-skeleton>
                            <van-skeleton :row="2" row-width="2.8rem" class="skeleton-text" round :loading="loading">
                                <span class="swipe-text">{{ item.name }}</span>
                            </van-skeleton>
                        </div>
                    </van-swipe-item>
                </van-swipe>
            </div>

        <!-- 不使用骨架屏 -->
        <!-- <div class="playlist-content">
            <van-swipe :loop="false" :width="150" :show-indicators="false" class="playlist-swipe">
                <van-swipe-item class="swipe-item" v-for="(item,index) of PlayList" :key="index">
                    <div class="swipe-a" @click="getId(item.id)">
                        <div class="playlist-count">
                            <span>{{PlayCount(item.playCount)}}</span>
                            <ion-icon name="play" class="swipe-icon"></ion-icon>
                        </div>
                        <div class="swipe-opacity"></div>
                        <img :src="item.picUrl" :alt="item.name" class="swipe-img">
                        <span class="swipe-text">{{ item.name }}</span>
                    </div>
                </van-swipe-item>
            </van-swipe>
        </div> -->
    </div>
</template>

<script>
import { getMusicList } from '@/api';
export default {
    name: 'MusicList',
    data() {
        return {
            PlayList: [],
            loading:true
        }
    },
    methods: {
        //取得推荐歌单数据
        async Playlist() {
            let res = await getMusicList()
            this.PlayList = res.data.result
            setTimeout(()=>{
                this.loading = false
            },2000)
            // console.log(this.$store.state.file.number,'number')
            console.log(res, 'MusicList的res数据')
        },
        //播放量显示优化
        PlayCount(num){
            if(num >= 100000000){
                return (num/100000000).toFixed(1)*10/10 + '亿'
            }
            if(num >= 10000){
                return (num/10000).toFixed(1)*10/10 + "万"
            }
        },
        //跳转至歌单详情页 playlistId是点击事件传入的item.id参数
        getId(playlistId){
            // //取得歌单的id
            // this.$store.commit('GetId',playlistId);
            //判断页面是否加载完成
            if(this.loading == false){
                this.$router.push({path:'/playlistdetail', query:{id:playlistId}})
            }
        }
    },
    computed:{
        // PlayCount(num){
        //     if(num >= 100000000){
        //         return (num/100000000).toFixed(1) + '亿'
        //     }
        //     else if(num >= 10000){
        //         return (num/10000).toFixed(1) + "万"
        //     }
        //     else{
        //         return ''
        //     }
        // }
    },
    mounted() {
        this.Playlist();
    },
}
</script>

<style lang="less" scoped>
    .playlist{
        width: 100%;
        height: 5rem;
        padding: .2rem;
        .playlist-top{
            width: 100%;
            height: .6rem;
            display: flex;
            justify-content: space-between;
            .playlist-text{
                margin-top: .02rem;
                font-size: .4rem;
                font-weight: 900;
            }
            .btn{
               width: 1rem;
               border: 2px solid #ccc;
               text-align: center;
               background-color: transparent;
               border-radius: .5rem;
               color:rgba(0, 0, 0, .5);
               .btn-icon{
                position: relative;
                bottom: .06rem;
               }
            }
        }
        .playlist-content{
            width: 100%;
            height: 4.5rem;
            .playlist-swipe{
                height: 100%;
                margin-top: .2rem;
                .swipe-item{
                    overflow: hidden;
                    .swipe-a{
                        // display: block;
                        height: 3.8rem;
                        border-radius: .3rem;
                        // text-decoration: none;
                        // color: #000;
                        .playlist-count{
                            width: 82px;
                            position: absolute;
                            left: 1rem;
                            justify-content: center;
                            margin-top: .06rem;
                            .swipe-icon{
                                width: 15px;
                                height: 15px;
                                float: right;
                                margin-top: .06rem;
                                color: rgba(255, 255, 255, 1);
                                // padding: 0 .02rem 0 0;
                                font-weight: 900;
                                // vertical-align:bottom;
                                mix-blend-mode: hard-light;
                            }
                            span{
                                color: rgba(255, 255, 255, 1);
                                mix-blend-mode: hard-light;
                                float: right;
                            }
                        }
                        // img骨架屏
                        .skeleton-img{
                            // margin: .2rem 0 0 .2rem;
                            margin-left: .1rem;
                            padding: 0;
                            .van-skeleton__avatar{
                                border-radius: .3rem;
                            }
                        }
                        .swipe-img{
                            width: 100%;
                            // height: 3rem;
                            height: 2.8rem;
                            // padding: 0 .04rem;
                            padding: 0 .1rem;
                            border: 1px solid transparent;
                            border-radius: .3rem;
                        }
                        // 播放量背景，凸显效果
                        .swipe-opacity{
                            position: absolute;
                            width: 142px;
                            height: .5rem;
                            margin:0 .08rem;
                            // border-radius: .3rem;
                            border-top-left-radius: .3rem;
                            border-top-right-radius: .3rem;
                            background:linear-gradient(180deg, #928f8f4a, #ffffff1b);
                            z-index: -2;
                        }
                        //歌单描述文字骨架屏
                        .skeleton-text{
                            margin-top: .1rem;
                            padding-left: .1rem;
                            .van-skeleton__avatar{
                                border-radius: .3rem;
                            }
                            .van-skeleton__row{
                                margin-top: .1rem;
                            }
                        }
                        .swipe-text{
                            // display: block;
                            display: -webkit-box;
                            width: 95%;
                            height: .8rem;
                            margin:0 .1rem;
                            word-break: break-all;   /*允许在单词内换行，更美观*/
                            -webkit-line-clamp: 2;  /*设置文本行数限制*/
                            -webkit-box-orient: vertical;  /*设置文本排列方式*/
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }
    }
</style>