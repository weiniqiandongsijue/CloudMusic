<template>
  <div class="mlSearch-container">
    <div class="mlSearch-top" ref="mlSearchTop">
        <div class="mlSearchTop-Box">
            <ion-icon name="arrow-back-outline" class="mlSearch-arrow" @click="backmusiclist"></ion-icon>
            <input type="text" v-model="singName" class="mlSearch-input" placeholder="搜索歌单内歌曲">
            <ion-icon name="close-outline" class="mlSearch-clear" @click="clearText"></ion-icon>
        </div>
    </div>
    <div class="mlSearch-center" ref="mlSearchBottom">
        <div class="mlSearch-box">
            <!-- 搜索到的音乐列表 -->
            <ul class="table-music">
                <li class="table-item" v-for="(item,index) of listsongs" :key="index">
                    <div class="item-singlemusic" @click="playsearchmusic(item,index)">
                        <!-- <span class="item-index">{{ index + 1 }}</span> -->
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
                </li>
            </ul>
        </div>
        <div v-show="showtext" class="mlSearchbox-tips">
            <div class="mlSearchbox-text">未找到与"<div class="textword">{{ singName }}</div>"相关的内容</div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    name:'MusicListDetail',
    data() {
        return {
            singName:'',
            showtext:false,
        }
    },
    methods: {
        // 返回音乐歌单列表
        backmusiclist(){
            this.$refs.mlSearchTop.classList.add('transform-topout');
            this.$refs.mlSearchBottom.classList.add('transform-bottomout');
            setTimeout(() => {             
                this.$store.state.file.showsearchbox = false;
                this.$refs.mlSearchTop.classList.remove('transform-topout');
                this.$refs.mlSearchBottom.classList.remove('transform-bottomout');
                this.singName = '';
            }, 500);
        },
        //点击播放音乐
        playsearchmusic(item){
            this.PlayMusic(item)
            this.playMelody(item)
        },
        clearText(){
            this.singName = '';
        },
        ...mapMutations(['SearchMusicList','PlayMusic','playMelody'])
    },
    computed:{
        //返回搜索结果
        listsongs(){
            return this.$store.state.file.listsongs
        }
    },
    watch:{
        //实时监听输入框的值判断是否执行搜索功能
        singName(newValue){
                this.SearchMusicList(newValue)
                // 判断输入的搜索内容是否存在
                if(newValue.trim() !== '' && this.listsongs.toString() == ''){
                    this.showtext = true;
                }
                else{
                    this.showtext = false;
                }
        }
    },
    mounted(){
        //每次打开搜索页面不会触发,但是出现动画的原因:在元素最开始挂载的时候已经给下方两个ref添加了动画
        this.$refs.mlSearchTop.classList.add('transform-topin');
        this.$refs.mlSearchBottom.classList.add('transform-bottomin');
    },
}
</script>

<style lang="less" scoped>
    .mlSearch-container{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        z-index: 10;
        overflow: hidden;
        // background-color: rgba(255, 255, 255, 0.6);
        .mlSearch-top{
            position: sticky;
            top: 0;
            width: 100%;
            height: 1rem;
            background-color: rgba(255, 255, 255, 0.9);
            .mlSearchTop-Box{
                position: relative;
                padding-top: .2rem;
                display: flex;
                justify-content: space-around;
                justify-items: center;
                .mlSearch-arrow{
                    position: relative;
                    left: -0.1rem;
                    top: 0;
                    font-size: .6rem;
                    color: rgba(152, 149, 149, 0.6);
                }
                .mlSearch-input{
                    position: relative;
                    left: -0.6rem;
                    width: 5.6rem;
                    height: .6rem;
                    border:.02rem solid rgba(152, 149, 149, 0.6);
                    border-radius: .26rem;
                    padding: 0 .2rem;
                    color: rgba(0, 0, 0, 0.5);
                }
                ::-webkit-input-placeholder{
                    color: rgba(0, 0, 0, 0.3);
                }
                .mlSearch-clear{
                    position: absolute;
                    font-size: 30px;
                    border:1px solid rgba(0, 0, 0, 0.3);
                    border-radius: 13px;
                    right: 9px;
                    top: 9px;
                    color: rgba(152, 149, 149, 0.6);
                }
            }
        }
        .mlSearch-center{
            position: relative;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            .mlSearch-box{
                width: 100%;
                height: 12.2rem;
                overflow: hidden;
                overflow-y: scroll;
                .table-music{
                    position: relative;
                    padding: 0 .2rem 0 .4rem;
                    .table-item{
                    display: flex;
                    justify-content: space-between;
                    transition: all .3s;
                    .item-singlemusic{
                        display: flex;
                        height: 1rem;
                        .item-index{
                            display: block;
                            width: .8rem;
                            height: 1rem;
                            line-height: .54rem;
                            text-align: center;
                            float: left;
                            font-size: .36rem;
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
            ::-webkit-scrollbar{
                display: none;
            }
        }
        .transform-topin{
            animation: topin .5s;
        }
        @keyframes topin {
            0%{
                transform: translateY(-100px);
                opacity: 0;
            }
            100%{
                transform: translateY(0);
                opacity: 1;
            }
        }
        .transform-topout{
            animation: topout .5s;
        }
        @keyframes topout {
            0%{
                transform: translateY(0);
                opacity: 1;
            }
            100%{
                transform: translateY(-100px);
                opacity: 0;
            }
        }
        .transform-bottomin{
            animation: bottomin .5s;
        }
        @keyframes bottomin {
            0%{
                transform: translateY(100px);
                opacity: 0;
            }
            100%{
                transform: translateY(0);
                opacity: 1;
            }
        }
        .transform-bottomout{
            animation: bottomout .5s;
        }
        @keyframes bottomout {
            0%{
                transform: translateY(0);
                opacity: 1;
            }
            100%{
                transform: translateY(100px);
                opacity: 0;
            }
        }
        .mlSearchbox-tips{
            position: absolute;
            top: 25%;
            width: 7rem;
            left: .26rem;
            text-align: center;
            white-space: pre-wrap;
            .mlSearchbox-text{
                width: 7rem;
                height: 2rem;
                padding: 0 .2rem;
                word-wrap: break-word;
                word-break: normal;
                color: rgba(152, 149, 149, .7);
                .textword{
                    font-size: 14px;
                }
            }
        }
    }
</style>