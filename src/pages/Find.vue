<template>
  <div class="Find-container">
    <SwiperTop/>
    <IconList/>
    <MusicList ref="musiclist"/>
  </div>
</template>

<script>
import SwiperTop from '@/components/home/SwiperTop';
import IconList from '@/components/home/IconList';
import MusicList from '@/components/home/MusicList';
export default {
  name:'Find',
  components:{SwiperTop,IconList,MusicList},
}
</script>

<style lang="less" scoped>

</style>