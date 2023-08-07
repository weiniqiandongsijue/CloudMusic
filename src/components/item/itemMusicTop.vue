<template>
  <div class="listitem-container">
    <img :src="playlist.coverImgUrl" alt="图片丢失了" class="listitem-img" v-show="!loading">
    <!-- 歌单背景层，过渡用 -->
    <div class="top-coverimg" v-show="loading"></div>
    <div class="listitem-top">
        <div class="leftitem">
            <ion-icon name="arrow-back-outline" class="item-arrow" @click="back"></ion-icon>
            <div class="leftitem-wrap">
              <!-- 将span标签的长度以变量的形式传给css使用 -->
              <div class="leftitem-title" ref="title" :style="{'--width':pWidth}">
                <!-- {{title}} -->
                <span ref="leftitemSpan">{{title}}</span>
                <span class="leftitem-title1" v-show="title == playlist.name">{{title}}</span>
              </div>
            </div>
        </div>
        <div class="rightitem">
            <ion-icon name="search" class="item-search icon" @click="openSearchmenu"></ion-icon>
            <ion-icon name="menu-sharp" class="item-sharp icon"></ion-icon>
        </div>
    </div>
    <div class="listitem-center">
      <van-skeleton avatar avatar-size="2.6rem" avatar-shape="square" class="skeleton-centerimg" :loading="loading">
        <img :src="playlist.coverImgUrl" alt="" class="center-img">
      </van-skeleton>
      <!-- 播放量 -->
      <div class="center-count" v-show="!loading">
          <span class="count-text">{{PlayCount(playlist.playCount)}}</span>
          <ion-icon name="play" class="count-icon"></ion-icon>
      </div>
      <div class="center-text">
          <van-skeleton row="2" :row-width="[155,135]" class="skeleton-centername" :loading="loading">
            <!-- 歌单名字 -->
            <p class="text-name">{{ playlist.name }}</p>
          </van-skeleton>
          <div class="center-user">
            <van-skeleton avatar avatar-size=".6rem" avatar-shape="square" title title-width="100" class="skeleton-user" :loading="loading">
                <img :src="creator.backgroundUrl" alt="" class="user-img"/>
                <span class="user-name">{{ creator.nickname }}</span>
                <button class="user-btn">
                  <ion-icon name="add-outline" class="icon-add"></ion-icon>
                  <span class="btn-text">关注</span>
                </button>
            </van-skeleton>
          </div>
          <ul class="center-tag">
              <li class="center-taglist" v-for="item of playlist.tags" :key="item.index">
                <van-skeleton row="1" row-width="45" class="skeleton-taglist" :loading="loading">
                  <div class="tag-list">
                    <span class="tag-item">{{ item }}</span>
                    <ion-icon name="chevron-forward-outline" class="tag-lefticon"></ion-icon>
                  </div>
                </van-skeleton>
              </li>
          </ul>
      </div>
    </div>
    <div class="listitem-footer" @click="openDetail">
      <van-skeleton row="1" row-width="6.6rem" class="skeleton-description" :loading="loading">
        <p class="footer-description" ref="description">
          {{ playlist.description }}
        </p>
      </van-skeleton>
      <ion-icon name="chevron-forward-outline" class="description-lefticon" v-show="!loading"></ion-icon>
    </div>
    <div class="listitem-bottom">
      <button class="btn-share" v-show="!loading">
        <ion-icon name="arrow-redo-sharp" class="share-icon"></ion-icon>
        <span class="share-text">{{ playlist.shareCount }}</span>
      </button>
      <button class="btn-msg" v-show="!loading">
        <ion-icon name="chatbubble-ellipses-sharp" class="msg-icon"></ion-icon>
        <span class="msg-text">{{ playlist.commentCount }}</span>
      </button>
      <button class="btn-collect" v-show="!loading">
        <ion-icon name="duplicate-sharp" class="collect-icon"></ion-icon>
        <span class="collect-text">{{ PlayCount(playlist.subscribedCount) }}</span>
      </button>
    </div>
    <!-- 详情页 -->
    <van-overlay :show="flag" class-name="overlay" :lock-scroll="false" @click="closeOverlay">
      <div class="overlay-top">
        <button @click="closeOverlay" class="top-btn">
          <ion-icon name="close-outline" class="close-icon"></ion-icon>
        </button>
      </div>
      <div class="overlay-center">
        <img :src="playlist.coverImgUrl" alt="" class="overlay-img">
        <span class="overlay-text">{{ playlist.name }}</span>
      </div>
      <div class="overlay-line"></div>
      <!-- tag标签 -->
      <div class="overlay-tag">
        标签 :
        <ul class="overlay-lists">
          <li class="overlay-item" v-for="item of playlist.tags" :key="item.index">
            <span class="item-text">{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="overlay-description">{{ playlist.description }}</div>
    </van-overlay>
    <!-- 歌单搜索 -->
    <div class="SearchBox">
      <MusicListSearch v-show="this.$store.state.file.showsearchbox"/>
    </div>
  </div>
</template>

<script>
import MusicListSearch from '@/components/Search/MusicListSearch'
export default {
    name:'itemmusictop',
    components:{MusicListSearch},
    data() {
      return {
        loading:true,
        title:'歌单',
        // 歌单左上角第一个span名字标签的长度
        pWidth:'',
        showsearchbox:false,
      }
    },
    methods:{
      //返回上一级
      back(){
        //返回上一级路由
        // this.$router.back()
        this.$router.push({path:'/'})
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
      //打开详情页
      openDetail(){
        this.$store.state.file.flag = true
        this.$emit('openDetail',this.openDetail)
      },
      //关闭详情页
      closeOverlay(){
        this.$store.state.file.flag = false
        this.$emit('closeOverlay',this.closeOverlay)
      },
      handleScroll(){
        let scrollTop =
        document.documentElement.scrollTop || //firefox
        document.body.scrollTop || //chrome
        window.pageYOffset
        // console.log('距离顶部高度',scrollTop)
        //当骨架屏消失的时候执行，骨架屏存在的时候title无法得到
        if(this.loading ==false){
          if(scrollTop > 100){
            this.title = this.playlist.name
            if(this.$refs.title){
              this.$nextTick(()=>{
                this.$refs.title.classList.add('leftitem-move')
              })
            }
          }
          else{
            this.title = '歌单'
            if(this.$refs.title){
              this.$nextTick(()=>{
                  this.$refs.title.classList.remove('leftitem-move')
                })
            }
          }
        }
      },
      openSearchmenu(){
        this.$store.state.file.showsearchbox = true;
      },
    },
    computed:{
      playlist(){
        return this.$store.state.file.playlist || JSON.parse(sessionStorage.getItem('playlistDetail'))
      },
      // 遇到的问题:进入歌单详情页时会提示该属性不存在  解决方法:在vuex state中的playlist中写入creator属性
      creator(){
        // console.log(this.$store.state.file.playlist.creator,'计算属性 creator')
        return this.playlist.creator || JSON.parse(sessionStorage.getItem('playlistDetail')).creator
      },
      flag(){
        return this.$store.state.file.flag
      }
    },
    watch:{
      //实时左上角监测歌单名字变化
      title(newValue){
        if(newValue.length > 2){
          // console.log('执行力')
          if(this.$refs.leftitemSpan){
            setTimeout(() => {
              // 取得歌单名字跑马灯需要运动的长度，长度等于第一个span的长度(this.$refs.leftitemSpan.offsetWidth)加上与第二个span之间的距离(margin-left)
              this.pWidth = -this.$refs.leftitemSpan.offsetWidth + -60 + 'px'
              // console.log(this.pWidth,'@@@')
            }, 100);
          }
        }
      }
    },
    mounted(){
      setTimeout(()=>{
        //关闭骨架屏
        this.loading = false
      },2000),
      window.addEventListener('scroll', this.handleScroll, true)
    },
    updated(){
      //先判断该元素是否存在
      if(this.$refs.description){
          this.$nextTick(() => {
            var width = this.$refs.description.offsetWidth;
            if(width >=330){
              //添加类名，目的是当描述文字的宽度大于330px时后面的图标仍然显示
              this.$refs.description.classList.add('description')
            }
        })
      }
    },
    destroyed() {
      // console.log('销毁了')
      //清除sessionStorage中的数据
      sessionStorage.removeItem('playlistDetail')
      window.removeEventListener('scroll', this.handleScroll)
    },
}
</script>

<style lang="less" scoped>
@font-size: 0.6rem;
.listitem-container {
  
  .listitem-img {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 7rem;
      position: fixed;
      object-fit: cover;
      filter: blur(25px);
      border-radius: 5px;
      z-index: -1;
    }
  //歌单背景层
  .top-coverimg{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 6rem;
    position: fixed;
    object-fit: cover;
    filter: blur(25px);
    border-radius: 5px;
    background-color: rgba(0, 0, 0, .2);
    z-index: -1;
  }
  .listitem-top {
    position: sticky;
    top: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    z-index: 2;
    .leftitem {
      display: flex;
      margin: .1rem .2rem;
      .item-arrow {
        font-size: @font-size;
        color: rgba(255, 255, 255, .9);
      }
      .leftitem-wrap{
        display: flex;
        width: 4rem;
        height: .6rem;
        overflow: hidden;
        .leftitem-title {
          position: relative;
          display: block;
          // overflow: hidden;
          white-space: nowrap;
          font-size: .4rem;
          margin: .025rem 0 0 .2rem;
          color: rgba(255, 255, 255, .9);
          font-weight: 400;
          // transform: translateX(50px);
        }
        .leftitem-title1{
          margin-left: 60px;
          // margin-left: 26px;
        }
        .leftitem-move{
          font-size: .34rem;
          transform: translateX(0);
          animation: move 12s infinite linear;
        }
        @keyframes move {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(var(--width));
            }
        }
        // .leftitem-title2 {
        //   position: relative;
        //   display: block;
        //   // overflow: hidden;
        //   white-space: nowrap;
        //   font-size: .4rem;
        //   margin: .025rem 0 0 .6rem;
        //   // margin: .025rem 0 0 .2rem;
        //   color: rgba(255, 255, 255, .9);
        //   font-weight: 400;
        //   // transform: translateX(50px);
        // }
        // .leftitem-move1{
        //   font-size: .34rem;
        //   transform: translateX(100px);
        //   animation: move1 20s infinite linear;
        // }
        // @keyframes move1 {
        //     0% {
        //       transform: translateX(100px);
        //     }
        //     100% {
        //       transform: translateX(-400px);
        //     }
        // }
      }

    }

    .rightitem {
      width: 25%;
      margin: .1rem .2rem;
      justify-content: space-between;
      .item-search {
        font-size: .55rem;
        margin: .02rem .1rem;
      }
      .item-sharp {
        font-size: @font-size;
        float: right;
        margin-right: .1rem;
      }
    }
    .icon {
      fill: rgba(255, 255, 255, .9);
    }
  }
  .listitem-center {
    position: relative;
    display: flex;
    width: 100%;
    height: 3rem;
    margin-top: .2rem;
    // align-items: center;
    //图片骨架屏
    .skeleton-centerimg{
      margin:0 0 0 .2rem;
      padding: 0;
      .van-skeleton__avatar{
          margin: 0;
          border-radius: .3rem;
          background-color: rgba(255, 255, 255, .4);
      }
    }
    .center-img {
      width: 2.6rem;
      height: 2.6rem;
      margin-left: .2rem;
      border-radius: .3rem;
    }
    .center-count{
      position: absolute;
      width: 1.64rem;
      left: 1rem;
      color: #fff;
      justify-content: center;
      margin-top: .05rem;
      .count-text{
        float: right;
      }
      .count-icon{
        float: right;
        margin-top: .06rem;
      }
    }
    //右边div
    .center-text {
      margin-left: .2rem;
      //歌单名字骨架屏
      .skeleton-centername{
        .van-skeleton__row{
          margin: .1rem 0 .02rem -.3rem;
          border-radius: .1rem;
          background-color: rgba(255, 255, 255, .4);
        }
      }
      // 歌单名字
      .text-name {
        overflow: hidden;
        width: 3.5rem;
        font-size: .33rem;
        font-weight: 600;
        color: rgba(255, 255, 255, .95);
      }
      //中间用户信息
      .center-user {
        display: flex;
        margin-top: .3rem;
        align-items: center;
        // 用户信息骨架屏
        .skeleton-user{
          margin-left: -0.24rem;
          .van-skeleton__avatar{
            margin: 0 .1rem 0 0;
            border-radius: .3rem;
            background-color: rgba(255, 255, 255, .4);
          }
          .van-skeleton__title{
            margin-left: .06rem;
            border-radius: .1rem;
            background-color: rgba(255, 255, 255, .4);
          }
        }
        .user-img {
          width: .6rem;
          height: .6rem;
          border-radius: 50%;
          margin: 0 .1rem;
        }
        .user-name {
          color: rgba(255, 255, 255, .6);
          font-size: .26rem;
        }
        //关注按钮
        .user-btn{
          display: flex;
          width: 1.2rem;
          height: .5rem;
          margin-left: .12rem;
          padding-left: .08rem;
          background-color: rgba(255, 255, 255, .1);
          border: none;
          border-radius: .46rem;
          align-items: center;
          .icon-add{
            color: rgba(255, 255, 255, .8);
            font-size: .4rem;
          }
          .btn-text{
            color: rgba(255, 255, 255, .8);
            font-size: .26rem;
          }
        }
      }
      //tag标签
      .center-tag{
        display: flex;
        margin:.25rem 0;
        // tag骨架屏
        .skeleton-taglist{
          .van-skeleton__row{
          margin:.04rem -.3rem 0 -.14rem;
          border-radius: .1rem;
          background-color: rgba(255, 255, 255, .4);
          }
        }
        .tag-list{
          display: flex;
          height: .4rem;
          margin: 0 .1rem;
          background-color: rgba(255, 255, 255, .2);
          border-radius: .1rem;
          .tag-item{
            display: block;
            height: .4rem;
            line-height: .4rem;
            padding: .02rem .12rem;
            font-size: .2rem;
            color: rgba(255, 255, 255, .9);
          }
          .tag-lefticon{
            margin-left: -.14rem;
            padding-top: .042rem;
            color: rgba(255, 255, 255, .9);
          }
        }
      }
    }
  }

  .listitem-footer{
    display: flex;
    align-items: center;
    margin: 0 11px;
    //歌单描述骨架屏
    .skeleton-description{
      .van-skeleton__row{
          // margin:.04rem -.3rem 0 -.14rem;
          margin: .02rem 0 0 -.3rem;
          border-radius: .1rem;
          background-color: rgba(255, 255, 255, .4);
        }
    }
    .footer-description{
      overflow: hidden;
      white-space: nowrap;
      color: rgba(255, 255, 255, .6);
      font-size: 13px;
    }
    //用于判断文字描述的长度大于330px时添加
    .description{
      width: 335px;
    }
    .description-lefticon{
      color: rgba(255, 255, 255, .4);
    }
  }
  .listitem-bottom{
    display: flex;
    width: 100%;
    height: 2rem;
    margin: 10px 7;
    align-items: center;
    justify-content: space-around;
    .btn-share{
      display: flex;
      width: 27%;
      height: 45px;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, .2);
      border: none;
      border-radius: 28px;
      .share-icon{
        font-size: 20px;
        color: #fff;
      }      
      .share-text{
        display: block;
        color: #fff;
        margin: 2px 0 0 5px;
        font-size: 13px;
      }
    }
    .btn-msg{
      display: flex;
      width: 27%;
      height: 45px;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, .2);
      border: none;
      border-radius: 28px;
      .msg-icon{
        font-size: 20px;
        color: #fff;
      }
      .msg-text{
        display: block;
        color: #fff;
        margin: 2px 0 0 5px;
        font-size: 13px;
      }
    }
    .btn-collect{
      display: flex;
      width: 27%;
      height: 45px;
      justify-content: center;
      align-items: center;
      background-color: rgba(235, 18, 18, 1);
      border: none;
      border-radius: 28px;

      .collect-icon{
        font-size: 20px;
        color: #fff;
      }
      .collect-text{
        display: block;
        color: #fff;
        margin: 2px 0 0 5px;
        font-size: 13px;
      }
    }
  }
  .overlay{
    z-index: 99;
    // filter: blur(5px);
    .overlay-top{
      width: 100%;
      height: 1rem;
      .top-btn{
        margin: .2rem .2rem;
        float: right;
        border: none;
        background-color: transparent;
        .close-icon{
          font-size: @font-size + .1rem;
          color: rgba(255, 255, 255, .8);
        }
      }
    }
    .overlay-center{
      display: flex;
      width: 100%;
      height: 6rem;
      flex-direction: column;
      align-items: center;
      text-align: center;
      .overlay-img{
        width: 4.5rem;
        height: 4.5rem;
        margin-left: .2rem;
        border-radius: .4rem;
      }
      .overlay-text{
        display: block;
        margin-top: 15px;
        color: rgba(255, 255, 255, .6);
        font-size: 14px;
      }
    }
    .overlay-line{
      width: 50%;
      height: .02rem;
      margin-left: 1.9rem;
      background: linear-gradient(to right, rgba(255,255,255,.1) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,.1) 100%);
      border-radius: .5rem;
    }
    .overlay-tag{
      display: flex;
      width: 100%;
      height: .5rem;
      margin: .5rem .5rem;
      color: rgba(255, 255, 255, .6);
      line-height: .5rem;
      .overlay-lists{
        display: flex;
        .overlay-item{
          width: 1.65rem;
          height: .5rem;
          margin: 0 .14rem;
          text-align: center;
          line-height: .5rem;
          color: rgba(255, 255, 255, .8);
          letter-spacing: 2px;
          border: none;
          border-radius: .5rem;
          background-color: rgba(255, 255, 255, .1);
          .item-text{
            font-size: .26rem;
          }
        }
      }
    }
    .overlay-description{
      height: 180px;
      margin: 50px 25px;
      padding: 5px 15px;
      border: none;
      text-align: justify;
      color: rgba(255, 255, 255, .6);
      overflow-y:scroll;
      letter-spacing: 1px;
    }
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .SearchBox{
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}</style>