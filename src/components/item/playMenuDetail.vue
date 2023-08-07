<template>
  <div class="menudetail-container">
    <div class="menudetail-switchmenu">
      <ion-icon name="refresh-outline" class="menudetail-loop"></ion-icon>
    </div>
    <ion-icon name="play-skip-back" class="menudetail-left" @click="previousMusic"></ion-icon>
    <div class="menudetail-playmenu">
      <ion-icon name="play-circle" class="menudetail-play" @click="playMusic" v-show="this.$store.state.file.isPlaying"></ion-icon>
      <ion-icon name="pause-circle" class="menudetail-pause" @click="pauseMusic" v-show="!this.$store.state.file.isPlaying"></ion-icon>
    </div>
    <ion-icon name="play-skip-forward" class="menudetail-right" @click="nextMusic"></ion-icon>
    <ion-icon name="menu-outline" class="menudetail-playlist" @click="openPlaylist"></ion-icon>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    name:'playMenuDetail',
    props:['Play','Pause','openmelodylist','handleMusic'],
    data() {
        return {
          //标志位
          isTurn:true,
        }
    },
    methods:{
      playMusic(){
        this.Play();
      },
      pauseMusic(){
        this.Pause();
      },
      openPlaylist(){
        this.openmelodylist();
      },
      previousMusic(){
        if(this.isTurn){
          this.isTurn = false;
          this.SelectPreviousMusic(this.Melody);
          this.handleMusic();
          setTimeout(() => {
            this.isTurn = true;
          }, 1000);
        }
      },
      nextMusic(){
        if(this.isTurn){
          this.isTurn = false;
          this.SelectNextMusic(this.Melody);
          this.handleMusic();
          setTimeout(() => {
            this.isTurn = true;
          }, 1000);
        }
      },
      ...mapMutations(['SelectPreviousMusic','SelectNextMusic'])
    },
    computed:{
      Melody(){
        return this.$store.state.file.Melody
      }
    }
}
</script>

<style lang="less" scoped>
  .menudetail-container{
    display: flex;
    justify-content: space-around;
    justify-items: center;
    width: 100%;
    height: 60px;
    .menudetail-switchmenu{
      .menudetail-loop{
        position: relative;
        top: 16px;
        font-size: 30px;
        color: rgba(255, 255, 255, .6);
      }
    }
    .menudetail-left{
      position: relative;
      top: 16px;
      font-size: 30px;
      color: rgba(255, 255, 255, .9);
    }
    .menudetail-playmenu{
      display: flex;
      justify-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      .menudetail-play{
        position: absolute;
        font-size: 60px;
        color: rgba(255, 255, 255, .9);
      }
      .menudetail-pause{
        position: absolute;
        font-size: 60px;
        color: rgba(255, 255, 255, .9);
      }
    }
    .menudetail-right{
      position: relative;
      top: 16px;
      font-size: 30px;
      color: rgba(255, 255, 255, .9);
    }
    .menudetail-playlist{
      position: relative;
      top: 16px;
      font-size: .64rem;
      color: rgba(255, 255, 255, .9);
      left: .06rem;
    }
  }
</style>