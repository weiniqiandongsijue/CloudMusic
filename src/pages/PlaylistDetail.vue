<template>
      <div class="playlist-container">
        <itemMusicTop @openDetail="openDetail" @closeOverlay="closeOverlay" ref="itemMusicTop"/>
        <itemMusicList/>
    </div>
</template>

<script>
import { getMusicListDetail,getMusicListAll } from '@/api';
import itemMusicTop from '@/components/item/itemMusicTop';
import itemMusicList from '@/components/item/itemMusicList';
export default {
    name:'PalylistDetail',
    components:{itemMusicTop,itemMusicList},
    data() {
      return {
        playlist:{},
      }
    },
    methods: { 
       //取得歌单详情
       async getMusicListDetail(){
            let res = await getMusicListDetail();
            //将res数据传入到vuex中
            this.$store.commit('getPlayList',res.data.playlist)
            //将用户id传给vuex state中的userId
            this.$store.state.file.userId = res.data.playlist.userId;
            console.log(res,'getMusicListDetail的res')
       },
       //取得对应id歌单的歌曲
       async getMusicListAll(){
          let res = await getMusicListAll();
          this.$store.commit('getPlayListAll',res.data.songs)
          console.log(res,'取得歌单歌曲的res')
       },
       openDetail(){
        //当遮罩层出现时，禁止页面滑动
        document.body.className='noscroll'
       },
       closeOverlay(){
        document.body.className=''
       }
    },
    mounted(){
      let playlistId = this.$route.query.id;
      //取得歌单的id
      this.$store.commit('GetId',playlistId);

      //取得对应id的歌单详情
      this.getMusicListDetail();
      //取得对应id歌单的歌曲
      this.getMusicListAll();
    }
}
</script>

<style lang="less">
  body,html{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-y: auto;
  }
  body::-webkit-scrollbar{
    // 需要设置高度和宽度才会生效
    display: none;
  }
  // 静止遮罩层后方区域滚动
  .noscroll{
    overflow-y: hidden;
  }
  .playlist-container{
    animation: into .5s;
  }
  @keyframes into {
    0% {
      transform: translateX(500px);
    }
    100% {
      transform: translateX(0);
    }
  }
  .outto{
    animation: out .5s;
  }
  @keyframes out {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-500px);
    }
  }
</style>