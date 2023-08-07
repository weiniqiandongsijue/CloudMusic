<template>
  <div class="container">
    <!-- <ion-icon name="menu-outline" class="menu-icon"></ion-icon> -->
    <ion-icon name="menu-sharp" class="menu-icon"></ion-icon>
    <ul class="navbar">
        <li class="navbar-item" @click="goMyInfo">我的</li>
        <li class="navbar-item" @click="goFind">发现</li>
        <li class="navbar-item">云村</li>
        <li class="navbar-item">视频</li>
    </ul>
    <!-- <div class="line-item"></div> -->
    <ion-icon name="search-outline" class="menu-search" @click="openSearchMenu"></ion-icon>
    <div class="searchBox">
        <MusicSearch/>
    </div>
  </div>
</template>

<script>
import MusicSearch from '@/components/Search/MusicSearch.vue';
export default {
    name:'TopNav',
    components:{MusicSearch},
    methods:{
        goMyInfo(){
            this.$router.push({path:'MyInfo'})
        },
        goFind(){
            this.$router.push({path:'Find'})
        },
        openSearchMenu(){
            this.$store.state.file.showSearch = true;
        }
    }
}
</script>

<style lang="less" scoped>
    .container{
        width: 100%;
        height: 1rem;
        padding: .2rem;
        display: flex;
        justify-content: space-between;
        .menu-icon{
            font-size: 0.6rem;
        }
        .navbar{
            width: 70%;
            height: 100%;
            display: flex;
            list-style: none;
            // flex-basis: 6rem;
            justify-content: space-around;
            .navbar-item{
                font-size: .41rem;
                font-weight: 400;
                letter-spacing: 2px;
            }
        }
        // .line-item{
        //     position: absolute;
        //     width: .85rem;
        //     height: .05rem;
        //     top: 0.9rem;
        //     left: 1.46rem;
        //     background-color: #5080ef;
        // }
        .menu-search{
            font-size: 0.6rem;
        }
    }
</style>
