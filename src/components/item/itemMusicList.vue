<template>
    <div class="itemMusicList">
        <div class="table-container" v-show="show">
            <button class="table-btn" @click="selectAllmusic">
                <div class="btn-left">
                    <ion-icon name="play-circle" class="play-icon"></ion-icon>
                    <div class="left-content">
                        <span class="left-text">播放全部</span>
                        <span class="left-count">({{songs.length}})</span>
                    </div>
                </div>
                <div class="btn-right">
                    <button class="btn-download">
                        <ion-icon name="arrow-down-circle-outline" class="download-icon"></ion-icon>
                    </button>
                    <button class="btn-all">
                        <ion-icon name="list-circle-outline" class="all-icon"></ion-icon>
                    </button>
                </div>
            </button>
            <ul class="table-music">
                <li class="table-item" v-for="(item,index) of songs" :key="index">
                    <van-skeleton row="2" row-width="175" class="" :loading="loading">
                        <div class="item-singlemusic" @click="playmusic(item,index)">
                            <span class="item-index">{{ index + 1 }}</span>
                            <div class="item-center">
                                <p class="item-musicname">{{ item.name }}</p>
                                <div class="item-singer">
                                    <div v-for="(singer,index) of item.ar" :key="index">
                                        <span>{{ singer.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-rightbtn">
                            <button class="item-playicon" v-show="item.mv">
                                <ion-icon name="caret-forward-outline" class="btn-playicon"></ion-icon>
                            </button>
                            <button class="item-doticon">
                                <ion-icon name="ellipsis-vertical" class="btn-doticon"></ion-icon>
                            </button>
                        </div>
                    </van-skeleton>
                </li>
            </ul>
        </div>
        <div class="loading-main" v-show="!show">
            <lord-icon
                src="https://cdn.lordicon.com/zzymiwrq.json"
                trigger="loop"
                colors="outline:#121331,primary:#3a3347"
                style="width:50px;height:50px"
                delay="500"
                class="loading-icon">
            </lord-icon>
            <span class="loading-text"> Loading</span>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name:'itemMusicList',
    data() {
        return {
            loading:false,
            show:false
        }
    },
    methods:{
        playmusic(item){
            this.PlayMusic(item)
            this.playMelody(item)
        },
        selectAllmusic(){
            //防止浅拷贝songs和playSongs指向相同的内存地址,当对某一方进行数据修改时，另一方也会跟着改变
            this.SelectAllMusic(JSON.parse(JSON.stringify(this.songs)))
            // console.log(this.songs,'songs')
        },
        ...mapMutations(['PlayMusic']),
        ...mapMutations(['playMelody']),
        ...mapMutations(['SelectAllMusic'])
    },
    computed:{
        songs(){
            return this.$store.state.file.songs
        }
    },
    mounted(){
        setTimeout(() => {
            this.show = true
        }, 2000);
    }
}
</script>

<style lang="less" scoped>
    .itemMusicList{
    .table-container{
        width: 100%;
        margin: 0;
        padding: 0;
        // overflow: hidden;
        background-color: rgba(255,255,255,1);
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem;
        .table-btn{
            position: sticky;
            top: 0;
            width: 100%;
            height: 1rem;
            // height: .8rem;
            background-color: rgba(255,255,255,1);
            border: none;
            border-top-left-radius: .3rem;
            border-top-right-radius: .3rem;
            align-items: center;
            transition:all .3s;
            .btn-left{
                float: left;
                display: flex;
                margin-left: .3rem;
                align-items: center;
                .play-icon{
                    font-size: .5rem;
                    color: rgba(224, 64, 64, 0.986);
                }
                .left-content{
                    margin-left: .3rem;
                    .left-text{
                        font-size: .28rem;
                        font-weight: 600;
                    }
                    .left-count{
                        margin-left: .1rem;
                        font-size: .2rem;
                    }
                }
            }
            .btn-right{
                width: 1.4rem;
                float: right;
                margin-right: .3rem;
                align-items: center;
                .btn-download{
                    border:none;
                    float: right;
                    background: none;
                    .download-icon{
                    font-size: .5rem;
                    }
                }
                .btn-all{
                    border: none;
                    background: none;
                    .all-icon{
                        font-size: .5rem;
                    }
                }
            }
        }
        .table-btn:active{
            background-color: rgba(212, 203, 203, 0.4);
            transform: scale(.98);
            border-radius: .2rem;
        }
        .table-music{
            width: 100%;
            .table-item{
                display: flex;
                justify-content: space-between;
                transition: all .3s;
                .item-singlemusic{
                    display: flex;
                    height: 1rem;
                    .item-index{
                        display: block;
                        width: 40px;
                        height: 1rem;
                        line-height: .54rem;
                        text-align: center;
                        float: left;
                        font-size: 18px;
                        margin:.3rem 0 0 0;
                        color:rgba(152, 149, 149, 0.7);
                    }
                    .item-center{
                        display: flex;
                        width: 5.2rem;
                        flex-direction: column;
                        margin: .16rem 0 0 .1rem;
                        padding: 0;
                        .item-musicname{
                            letter-spacing: .01rem;
                            margin-bottom: .06rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        .item-singer{
                            display: flex;
                            height: .3rem;
                            flex-direction: row;
                            line-height: .3rem;
                            letter-spacing: .01rem;
                            font-size: .26rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow:ellipsis;
                            color: rgba(0, 0, 0, 0.5);
                            // 除了最后一位歌手以外的歌手后面都加斜杠分隔
                            :not(:last-child)::after{
                            content: "/";
                            }
                        }                
                    }
                }
                .item-rightbtn{
                        display: flex;
                        height: 100%;
                        .item-playicon{
                            position: relative;
                            width: .5rem;
                            height: .42rem;
                            top: .3rem;
                            right: .1rem;
                            line-height: .42rem;
                            background-color: transparent;
                            border: .04rem solid rgba(152, 149, 149, 0.6);
                            border-radius: .18rem;
                            color: rgba(152, 149, 149, 0.6);
                            .btn-playicon{
                                margin:.04rem .08rem;
                            }
                        }
                        .item-doticon{
                            width: .6rem;
                            height: 1rem;
                            line-height: 1.1rem;
                            background-color: transparent;
                            border: none;
                            color: rgba(152, 149, 149, 0.6);
                            .btn-doticon{
                                font-size: .4rem;
                                margin-top: .32rem;
                            }
                        }
                    }
            }
            .table-item:active{
                background-color: rgba(212, 203, 203, 0.4);
                transform: scale(.95);
                border-radius: .24rem;
            }
        }
    }
    //加载动画
    .loading-main{
        position: absolute;
        display: flex;
        width: 120px;
        height: 50px;
        line-height: 55px;
        left: 120px;
        top: 400px;
        .loading-icon{
            position: relative;
        }
        .loading-text{
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            font-size: 18px;
            letter-spacing: 2px;
            font-weight: 500;
        }
    }
    }

</style>