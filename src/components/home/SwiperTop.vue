<template>
  <div class="container">
    <van-swipe :autoplay="3000" class="swiper" indicator-color="#5080ef" :show-indicators="!loading">
        <van-swipe-item v-for="(image, index) in images" :key="index" class="swiper-item">
            <!-- 骨架屏 -->
            <van-skeleton avatar avatar-shape="square" round class="skeleton" :loading="loading">
                <a :href="ImageUrl(image.url)">
                    <img v-lazy="image.pic" class="swiper-img" />    
                </a>
            </van-skeleton>
        </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { getBanner } from '@/api'
export default {
    name:'SwpierTop',
    data(){
        return{
            images:[],
            loading:true
        }
    },
    methods: {
        ImageUrl(url){
            if(url == null){
                return;
            }
            else{
                return url;
            }
        }
    },
  mounted(){
        // 第一种方法
        // getBanner().then(({data})=>{
        //         console.log(data,'data')
        //         this.images = data.banners
        //         console.log(this.images,'images')
        //         // data.banners.forEach(item => {
        //         //     this.images = item.pic
        //         //     console.log(this.images,'this.images')
        //         // });
        //     })

        //第二种方法 必须为立即执行函数
        (async () => {
            let res = await getBanner();
            this.images = res.data.banners;
            setTimeout(()=>{
                this.loading = false
            },2000)
            // console.log(this.images.url,'url')
            console.log(res,'SwpierTop的res')
        })()
    }
}
</script>

<style lang="less" scoped>
    .container{
        .swiper{
            width:100%;
            height: 3rem;
            .swiper-item{
                padding: 0 0.2rem;
                .skeleton{
                    margin: 0;
                    padding: 0;
                    .van-skeleton__avatar{
                        border-radius: .2rem;
                        width: 7.1rem;
                        height: 3rem;
                    }
                }
                .swiper-img{
                    width: 100%;
                    height: 100%;
                    border-radius: 0.2rem;
                }
            }
        }
    }
</style>