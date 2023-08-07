<template>
  <div class="MusicSearch-container" v-show="showSearch" ref="MusicSearchcontainer">
    <div class="containerBox" ref="MusicSearchBox">
      <!-- 选项卡背景层 -->
      <div class="Dialog-overlay" @click="closeDailog" v-show="showOverlay"></div>
      <div class="MusicSearch-header" ref="MusicSearchHeader">
        <ion-icon name="arrow-back" class="header-back" @click="backtoMain"></ion-icon>
        <ion-icon name="search-outline" class="header-search"></ion-icon>
        <input type="text" class="header-input" v-model="vocabulary" :placeholder="keyWord" maxlength="40" ref="headerInput">
        <ion-icon name="close-outline" class="header-close" v-show="vocabulary.length" @click="cleanvocabulary"></ion-icon>
        <button class="header-sbtn" @click="searchmusic">搜索</button>
      </div>
      <div class="MusicSearch-suggest" v-show="vocabulary">
        <!-- 当搜索建议不为空时 -->
        <div class="suggest-Dataexists" v-show="result">
          <ul class="suggest-resultbox">
            <li class="resultbox-item"  @click="changevocabulary">
              <ion-icon name="search-outline" class="resultbox-searchicon"></ion-icon>
              <span class="resultbox-text">{{ vocabulary }}</span>
            </li>
            <li v-for="(item) of searchsongs" :key="item.id" class="resultbox-item"  @click="changesongs(item.name)">
              <ion-icon name="search-outline" class="resultbox-searchicon"></ion-icon>
              <span class="resultbox-text">{{ item.name }}</span>
            </li>
            <li v-for="(item) of searchartists" :key="item.id" class="resultbox-item"  @click="changeartists(item.name)">
              <ion-icon name="search-outline" class="resultbox-searchicon"></ion-icon>
              <span class="resultbox-text">{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <!-- 当搜索建议为空时 -->
        <div class="suggest-Datanoexists" v-show="!result">
          <div class="Datanoexists-Box" @click="changevocabulary">
            <ion-icon name="search-outline" class="Datanoexists-searchicon"></ion-icon>
            <div class="Datanoexists-text">
              搜索"{{ vocabulary }}"
            </div>
          </div>
        </div>
      </div>
      <div class="MusicSearch-content">
        <div class="MusicSearch-top" ref="MusicSearchTop">
          <button class="MusicSearch-singer">
            <ion-icon name="person-sharp" class="top-person"></ion-icon>
            <span class="person-text">歌手</span>
          </button>
          <button class="MusicSearch-styles">
            <ion-icon name="musical-notes" class="top-notes"></ion-icon>
            <span class="notes-text">曲风</span>
          </button>
          <button class="MusicSearch-area">
            <ion-icon name="musical-note" class="top-area"></ion-icon>
            <span class="area-text">专区</span>
          </button>
          <button class="MusicSearch-identify">
            <ion-icon name="mic" class="top-mic"></ion-icon>
            <span class="mic-text">识曲</span>
          </button>
        </div>
        <div class="MusicSearch-history" v-show="historysearch.length" ref="HistoryMusicSearch">
          <div class="history-head">
            <span class="historyhead-text">搜索历史</span>
            <ion-icon name="trash-outline" class="historyhead-trash" @click="openhistorydialog"></ion-icon>
            <!-- 删除历史记录选项卡 -->
            <div class="historyhead-dialog" ref="HeadDialog">
              <div class="dialog-triangle"></div>
              <div class="dialog-content">
                <p class="dialog-text">确定清空全部历史记录?</p>
                <div class="dialog-btnmenu">
                  <button class="btnmenu-right" @click="purgehistory">
                    <ion-icon name="checkmark-outline" class="righticon"></ion-icon>
                  </button>
                  <button class="btnmenu-fault" @click="closeDailog">
                    <ion-icon name="close-outline" class="faulticon"></ion-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="history-content" ref="ContentBox">
            <ul class="historyContent-box">
              <li class="historyContent-boxitem" v-for="(item,index) of historysearch" :key="index" ref="boxItem">
                <button class="boxitem-btn" >{{ item }}</button>
              </li>
              <!-- 展开收起按钮 -->
              <button class="historyContent-change" @click="changeContent" ref="ChangeBtn">
                <ion-icon name="chevron-down-outline" class="change-bottom" v-show="changeIcon"></ion-icon>
                <ion-icon name="chevron-up-outline" class="change-top" v-show="!changeIcon"></ion-icon>
              </button>
            </ul>
          </div>
        </div>
        <div class="MusicSearch-guesslike"></div>
        <div class="MusicSearch-bottom" ref="MusicSearchBottom">
          <div class="bottom-hotmusic">
            <div class="bottom-header">
              <span class="header-title">热搜榜</span>
              <button class="header-play">
                <ion-icon name="play" class="headerplay-icon"></ion-icon>
                <span class="headerplay-text">播放</span>
              </button>
            </div>
            <div class="bottom-line"></div>
            <div class="bottom-content">
              <ul class="bottom-comtentbox">
                <li class="comtentbox-items" v-for="(item,index) of hotsearch" :key="index" @click="tosearch(item.searchWord)">
                  <div class="comtentbox-item">
                    <div class="item-ordinal">
                      {{ index+1 }}
                    </div>
                    <span class="item-title">
                      {{ item.searchWord }}
                    </span>
                    <div class="item-hoticon" v-show="item.iconType == 1">
                      <span class="honticon-text">热</span>
                    </div>
                    <div class="item-upicon" v-show="item.iconType == 5">
                      <div class="round-triangle"></div>
                      <div class="round-line"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getSearchKeyword,getSearchHotMusic,getMusicSuggest } from '@/api'
export default {
    name:'MusicSearch',
    data() {
        return {
          vocabulary:'',
          changeIcon:true,
          showOverlay:false,
          // 搜索框关键字
          keyWord:'',
          // 搜索建议艺术家
          searchartists:[],
          // 搜索建议歌曲
          searchsongs:[],
          //判断搜索建议是否为空
          result:0,
        }
    },
    methods:{
      //返回主页面
      backtoMain(){
        this.$refs.MusicSearchcontainer.classList.add('container-back');
        // this.$refs.MusicSearchBox.classList.add('container-back');
        setTimeout(() => {
          this.$store.state.file.showSearch = false;
          this.$refs.MusicSearchcontainer.classList.remove('container-back');
          // this.$refs.MusicSearchBox.classList.remove('container-back');
        }, 500);
      },
      //搜索音乐按钮
      searchmusic(){
        this.SearchMusic(this.vocabulary);
        if(this.changeIcon){
          //加一个定时，不然无法取到元素
          setTimeout(() => {
            this.defaultClose();
          }, 10);
        }
        else{
          setTimeout(() => {
            this.openAllhistory()
          }, 10);
        }
        if(this.vocabulary == ''){
         this.vocabulary = this.keyWord;
         this.$refs.headerInput.focus();
        }
      },
      //展开收起历史记录
      changeContent(){
        this.changeIcon = !this.changeIcon;
        if(this.changeIcon){
          setTimeout(() => {
            this.defaultClose();
          }, 10);
        }else{
          setTimeout(() => {
            this.openAllhistory()
          }, 10);
        }
      },
      //实现思路:取到整个历史记录ul的宽度(width),当用户点击搜索后，将数据存入到 historysearch 数组中,
      // 使用foreach循环取到每一个li的宽度,同时，通过判断将所有li的宽度相加,当相加的宽度大于ul的宽度后,将从相加的值大于ul宽度时的li元素开始隐藏
      //默认关闭历史记录
      defaultClose(){
        let AllWidth = 0;
        let tags = this.$refs.boxItem;
        let ContentBoxwidth = this.$refs.ContentBox.getBoundingClientRect().width;
        if(tags){
          tags.forEach((item)=>{
            let itemwidth = item.getBoundingClientRect().width;
              AllWidth < ContentBoxwidth ? AllWidth += itemwidth : AllWidth;
              //25 为收起展开按钮的宽度
              //如果相加的值大于ContentBoxwidth
              if(AllWidth + 25 > ContentBoxwidth){
                this.$refs.ChangeBtn.style.display = 'inline-block';
                //从所有相加到大于ContentBoxwidth的item元素开始全部隐藏
                  item.style.display = 'none';
              }
          })
        }

      },
      //展开历史记录
      openAllhistory(){
        let tags = this.$refs.boxItem;
        tags.forEach((item)=>{
            item.style.display = 'inline-block';
        })
      },
      //打开选项卡
      openhistorydialog(){
        this.$refs.HeadDialog.style = 'visibility: visible;opacity: 1;'
        this.showOverlay = true;
      },
      //点击背景层(遮罩层)关闭历史记录删除选项卡
      closeDailog(){
        this.$refs.HeadDialog.style = 'visibility: hidden;opacity: 0;'
        this.showOverlay = false;
      },
      //清空历史记录
      purgehistory(){
        this.PurgeHistory();
        this.$refs.HeadDialog.style = 'visibility: hidden;opacity: 0;';
        this.$refs.ChangeBtn.style.display = 'none';
        this.showOverlay = false;
      },
      //请求输入框关键字
      async getSearchKeyword(){
        let res = await getSearchKeyword();
        let {data} = res.data;
        this.keyWord = data.realkeyword;
      },
      async getSearchHotMusic(){
        let res = await getSearchHotMusic();
        let {data} = res.data;
        this.$store.state.file.hotsearch = data;
      },
      async getMusicSuggest(data){
        let res = await getMusicSuggest(data);
        let {result} = res.data;
        this.result = Object.keys(result).length;
        this.searchartists = result.artists;
        this.searchsongs = result.songs;
      },
      // 点击热搜榜单关键字搜索
      tosearch(data){
        this.vocabulary = data;
        this.$refs.headerInput.focus();
      },
      //点击搜索建议
      changevocabulary(){
        
      },
      //点击搜索建议
      changeartists(data){
        this.vocabulary = data
      },
      //点击搜索建议
      changesongs(data){
        this.vocabulary = data
      },
      //清除输入框
      cleanvocabulary(){
        this.vocabulary = '';
      },
      ...mapMutations(['SearchMusic','PurgeHistory'])
    },
    computed:{
      showSearch(){
        return this.$store.state.file.showSearch;
      },
      historysearch(){
        return this.$store.state.file.historysearch;
      },
      hotsearch(){
        return this.$store.state.file.hotsearch;
      }
    },
    watch:{
      //监听是否打开搜索页面
      showSearch(newValue){
        if(newValue == true){
          //判断历史记录是否为空
          if(this.historysearch != ''){
            setTimeout(() => {
              this.defaultClose();
            }, 10);
          }
          //历史记录展开图标
          this.changeIcon = true;
          //调用输入框关键字
          this.getSearchKeyword();
          this.getSearchHotMusic();
        }
      },
      historysearch(newValue){
        if(newValue){
          // if(newValue.length > 0){
          //   this.$refs.boxItem.style = 'text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'
          // }
        }
      },
      vocabulary(newValue){
        if(newValue !== ''){
          this.getMusicSuggest(newValue);
          this.$refs.MusicSearchcontainer.style = 'overflow:hidden'
        }
        else{
          this.$refs.MusicSearchcontainer.style = 'overflow:auto'
        }
      }
    },
    mounted(){
        this.$refs.MusicSearchTop.classList.add('container-show');
        this.$refs.MusicSearchBottom.classList.add('container-show');
        this.$refs.MusicSearchHeader.classList.add('container-show');
        this.$refs.HistoryMusicSearch.classList.add('container-show');
        this.$refs.MusicSearchcontainer.classList.add('container-color');
    }
}
</script>

<style lang="less" scoped>
  .MusicSearch-container{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgb(244, 244, 244);
    transition: all .5s;
    .containerBox{
      position: relative;
      padding-bottom: .1rem;
      background-color: rgb(244, 244, 244);
      z-index: 10;
      transition: all .5s;
      //背景层
      .Dialog-overlay{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 10;
      }
      .MusicSearch-header{
        position: sticky;
        display: flex;
        width: 100%;
        height: 1.2rem;
        padding: .2rem 0;
        // top: -0.02rem;
        top: 0;
        justify-items: center;
        justify-content: space-around;
        z-index: 24;
        background-color: rgb(244, 244, 244);
        .header-back{
          position: relative;
          top: .04rem;
          left: .1rem;
          font-size: .6rem;
          color: rgba(0, 0, 0, 0.8);
        }
        .header-search{
          position: absolute;
          font-size: .4rem;
          left: 1.2rem;
          top: .37rem;
          z-index: 11;
        }
        .header-input{
          position: relative;
          left: .1rem;
          width: 5.3rem;
          height: .7rem;
          border: none;
          font-size: .32rem;
          border-radius: .34rem;
          padding: .04rem .68rem 0 .76rem;
        }
        .header-input::-webkit-input-placeholder{
          position: relative;
          top: .02rem;
        }
        .header-close{
          position: absolute;
          font-size: .5rem;
          right: 1.3rem;
          top: .3rem;
          color: rgba(0, 0, 0, .5);
        }
        .header-sbtn{
          position: relative;
          width: 1rem;
          height: .7rem;
          border:none;
          border-radius: .26rem;
          font-size: .32rem;
          background-color: transparent;
          color:rgba(0, 0, 0, 0.8);
        }
      }
      .MusicSearch-suggest{
        position: absolute;
        width: 100%;
        height: 12rem;
        top: 1.32rem;
        background-color: rgb(244, 244, 244);
        z-index: 25;
        .suggest-Dataexists{
          .suggest-resultbox{
            margin: 0 .4rem;
            .resultbox-item{
              display: flex;
              padding: .14rem .06rem;
              border-bottom:.02rem solid rgba(0, 0, 0, .1);
              overflow: hidden;
              white-space: nowrap;
              .resultbox-searchicon{
                position: relative;
                font-size: .38rem;
                top: .04rem;
              }
              .resultbox-text{
                width: 5.7rem;
                margin: 0 .2rem;
                padding: .04rem 0;
                line-height: .42rem;
                vertical-align: middle;
              }
            }
          }
        }
        .suggest-Datanoexists{
          position: relative;
          margin: .2rem .4rem;
          line-height: .42rem;
          border-bottom:.02rem solid rgba(0, 0, 0, .1);
          color: #577bd0;
          .Datanoexists-Box{
            display: flex;
            width: 100%;
            padding: .1rem 0;
            .Datanoexists-searchicon{
                font-size: .38rem;
            }
            .Datanoexists-text{
              margin: 0 .2rem;
            }
          }
        }
      }
      .MusicSearch-content{
        position: relative;
        .MusicSearch-top{
          position: sticky;
          display: flex;
          height: 1rem;
          top: 1.2rem;
          padding: .3rem 0;
          justify-content: space-around;
          background-color: rgb(244, 244, 244);
          z-index: 24;
          .MusicSearch-singer{
            display: flex;
            justify-items: center;
            justify-content: space-around;
            border: none;
            background-color: transparent;
            .top-person{
              position: relative;
              font-size: .37rem;
              margin: 0 .1rem;
              top: .02rem;
              color: rgba(228, 28, 28, 0.8);
            }
            .person-text{
              position: relative;
              font-weight: 600;
              -webkit-user-select:none;
              -moz-user-select:none;
              -ms-user-select:none;
              user-select:none;
            }
          }
          .MusicSearch-singer:active .top-person{
            color: rgba(228, 28, 28,.2);
          }
          .MusicSearch-singer:active .person-text{
            color: rgba(0, 0, 0,.2);
          }

          .MusicSearch-styles{
            display: flex;
            justify-items: center;
            justify-content: space-around;
            border: none;
            background-color: transparent;
            .top-notes{
              position: relative;
              font-size: .42rem;
              margin: 0 .1rem;
              color: rgba(228, 28, 28, 0.8);
            }
            .notes-text{
              font-weight: 600;
              -webkit-user-select:none;
              -moz-user-select:none;
              -ms-user-select:none;
              user-select:none;
            }
          }
          .MusicSearch-styles:active .top-notes{
            color: rgba(228, 28, 28,.2);
          }
          .MusicSearch-styles:active .notes-text{
            color: rgba(0, 0, 0,.2);
          }

          .MusicSearch-area{
            display: flex;
            justify-items: center;
            justify-content: space-around;
            border: none;
            background-color: transparent;
            .top-area{
              position: relative;
              font-size: .42rem;
              margin: 0 .06rem;
              color: rgba(228, 28, 28, 0.8);
            }
            .area-text{
              font-weight: 600;
              -webkit-user-select:none;
              -moz-user-select:none;
              -ms-user-select:none;
              user-select:none;
            }
          }
          .MusicSearch-area:active .top-area{
            color: rgba(228, 28, 28,.2);
          }
          .MusicSearch-area:active .area-text{
            color: rgba(0, 0, 0,.2);
          }

          .MusicSearch-identify{
            display: flex;
            justify-items: center;
            justify-content: space-around;
            border: none;
            background-color: transparent;
            .top-mic{
              position: relative;
              font-size: .42rem;
              margin: 0 .06rem;
              color: rgba(228, 28, 28, 0.8);
            }
            .mic-text{
              font-weight: 600;
              -webkit-user-select:none;
              -moz-user-select:none;
              -ms-user-select:none;
              user-select:none;
            }
          }
          .MusicSearch-identify:active .top-mic{
            color: rgba(228, 28, 28,.2);
          }
          .MusicSearch-identify:active .mic-text{
            color: rgba(0, 0, 0,.2);
          }
          :not(:last-child):after{
            content: '|';
            position: relative;
            left: .4rem;
            top: .02rem;
            color: rgba(0, 0, 0, .3);
          }
        }
        .MusicSearch-history{
          position: relative;
          margin: 0 .3rem;
          top: .4rem;
          .history-head{
            width: 100%;
            height: .5rem;
            display: flex;
            justify-content: space-between;
            justify-items: center;
            .historyhead-text{
              position: relative;
              top: .04rem;
              font-size: .28rem;
              font-weight: 600;
            }
            .historyhead-trash{
              position: relative;
              top: .02rem;
              right: .31rem;
              font-size: .36rem;
              color: rgba(0, 0, 0, 0.4);
            }
            .historyhead-dialog{
              position: absolute;
              top: .44rem;
              right: -0.14rem;
              visibility: hidden;
              opacity: 0;
              z-index: 22;
              transition: all .3s;
              .dialog-triangle{
                position: relative;
                width:0;
                height:0;
                left: 2.2rem;
                bottom: .04rem;
                border-right: .18rem solid transparent;
                border-left: .18rem solid transparent;
                border-bottom: .18rem solid rgb(255, 255, 255);
                filter: drop-shadow(0 0 .02rem rgba(0, 0, 0, .3));
              }
              .dialog-content{
                position: relative;
                width: 3rem;
                height: 1rem;
                background-color: #fff;
                border-radius: .2rem;
                filter: drop-shadow(0 0 .08rem rgba(0, 0, 0, .3));
                .dialog-text{
                  position: relative;
                  top: .04rem;
                  text-align: center;
                  font-size: .26rem;
                }
                .dialog-btnmenu{
                  position: relative;
                  top: .14rem;
                  display: flex;
                  justify-content: space-around;
                  .btnmenu-right{
                    position: relative;
                    width: 1rem;
                    background-color: transparent;
                    border:.04rem solid #5080ef;
                    border-radius: .26rem;
                    text-align: center;
                    .righticon{
                      position: relative;
                      top: .03rem;
                    }
                  }
                  .btnmenu-fault{
                    position: relative;
                    width: 1rem;
                    background-color: transparent;
                    border:.04rem solid #5080ef;
                    border-radius: .26rem;
                    text-align: center;
                    .faulticon{
                      position: relative;
                      top: .04rem;
                    }
                  }
                }
              }
            }
            
          }
          .history-content{
            margin: 0 .1rem;
            .historyContent-box{
              display: flex;
              flex-wrap: wrap;
              .historyContent-boxitem{
                width: 3.4rem;
                margin: .1rem 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: all .5s;
                .boxitem-btn{
                  // position: relative;
                  height: .5rem;
                  margin: 0 .04rem;
                  padding: .08rem .1rem;
                  letter-spacing: .01rem;
                  background-color: #ffffff;
                  border: .02rem solid #fff;
                  border-radius: .26rem;
                  color: rgba(59, 57, 57, 0.9);
                  font-size: .26rem;
                  text-align: center;
                }
              }
              .historyContent-change{
                display: none;
                position: relative;
                top: .1rem;
                width: .5rem;
                height: .5rem;
                border: .02rem solid #fff;
                background-color: #ffffff;
                border-radius: 50%;
                .change-bottom{
                  position: relative;
                  top: .06rem;
                  right: .014rem;
                  font-size: .4rem;
                }
                .change-top{
                  position: relative;
                  top: .02rem;
                  font-size: .4rem;
                }
              }
            }
          }
        }
        .MusicSearch-bottom{
          position: relative;
          margin: .6rem 0;
          .bottom-hotmusic{
            margin: 0 .2rem;
            background-color: #fff;
            border: none;
            border-radius: .26rem;
            .bottom-header{
              position: relative;
              display: flex;
              top: .1rem;
              padding: .4rem .6rem;
              .header-title{
                position: relative;
                font-size: .4rem;
                font-weight: 600;
              }
              .header-play{
                position: relative;
                display: flex;
                justify-content: center;
                justify-items: center;
                top: .1rem;
                left: .2rem;
                width: 1.1rem;
                height: .44rem;
                border: none;
                border-radius: .2rem;
                background-color: rgba(200, 198, 198, 0.4);
                .headerplay-icon{
                  position: relative;
                  top: .1rem;
                  font-size: .26rem;
                }
                .headerplay-text{
                  position: relative;
                  top: .04rem;
                  font-size: .28rem;
                  font-weight: 600;
                }
              }
            }
            .bottom-line{
              position: relative;
              width: 80%;
              height: .02rem;
              top: 0;
              left: 10%;
              border-radius: .1rem;
              background-color: rgba(200, 198, 198, 0.4);
            }
            .bottom-content{
              position: relative;
              // height: 100%;
              margin: 0 .2rem;
              padding: .2rem 0;
              .bottom-comtentbox{
                position: relative;
                margin: 0 .2rem;
                .comtentbox-items{
                  position: relative;
                  display: flex;
                  margin: .3rem 0;
                  padding: .05rem .1rem;
                  transition: all .5s;
                  border-radius: .24rem;
                  .comtentbox-item{
                    width: 100%;
                    .item-ordinal{
                      display: inline-block;
                      width: .4rem;
                      text-align: center;
                      font-size: .36rem;
                    }
                    .item-title{
                      font-size: .32rem;
                      margin: 0 .2rem;
                    }
                    .item-hoticon{
                      position: relative;
                      display: inline-block;
                      width: .34rem;
                      height: .34rem;
                      right: .2rem;
                      border:none;
                      background-color: rgba(228, 28, 28, 0.9);
                      border-radius: .08rem;
                      justify-items: center;
                      .honticon-text{
                        position: relative;
                        left: .05rem;
                        bottom: .02rem;
                        color: #fff;
                        font-size: .24rem;
                      }
                    }
                    .item-upicon{
                      position: relative;
                      display: inline-block;
                      right: .2rem;
                      top: .06rem;
                      .round-triangle{
                        width: .1rem;
                        height: .1rem;
                        border-bottom-left-radius: .06rem;
                        background-color: rgba(228, 28, 28, 0.9);
                        transform: rotate(0deg) skewX(-30deg) scale(1, .866);
                        &::before, &::after {
                            content: "";
                            position: absolute;
                            background-color: inherit;
                            width: .1rem;
                            height: .1rem;
                            border-bottom-left-radius: .06rem;
                        }
                        &::before {
                            transform: rotate(135deg) skewY(-45deg) scale(.707, 1.414) translate(-50%, 0);
                        }
                        &::after {
                            transform: rotate(-135deg) skewX(-45deg) scale(1.414, .707) translate(0%, 50%);
                        }
                      }
                      .round-line{
                        position: relative;
                        bottom: .04rem;
                        left: .044rem;
                        width: .06rem;
                        height: .2rem;
                        border-radius: .2rem;
                        background-color: rgba(228, 28, 28, 0.9);
                      }
                    }
                  }
                }
                .comtentbox-items:active{
                  background-color: rgba(0,0,0,.1);
                  transform: scale(.95);
                }
              }
            }
          }
        }
      }
      //进场动画
      .container-show{
        animation: display 1s;
      }
      @keyframes display {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
  ::-webkit-scrollbar{
    display: none;
  }
  .container-color{
    animation: changecolor .5s;
  }
  @keyframes changecolor {
    0% {
      background-color:rgba(0, 0, 0, 0);
    }
    100% {
      background-color: rgb(244, 244, 244);
    }
  }
  .container-back{
    animation: backmian .5s;
  }
  @keyframes backmian {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(500px);
      opacity: 0;
    }
  }
</style>