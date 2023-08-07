<template>
  <div class="mainpage">
    <!-- <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh"> -->
    <TopNav/>
    <router-view></router-view>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
import TopNav from '@/components/home/TopNav';

export default {
    name:'Main',
    components:{TopNav},
    data() {
      return {
        isLoading:false,
      }
    },
    methods: {
      onRefresh(){
        setTimeout(() => {
          this.isLoading = false;
          // this.$refs.musiclist.Playlist();
        }, 1000);
      },
    },
}
</script>

<style lang="less" scoped>
  .mainpage{
    animation: inpage 1s;
  }
  @keyframes inpage {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>