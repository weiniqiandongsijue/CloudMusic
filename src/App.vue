<template>
  <div class="app-container">
    <router-view/>
    <div class="bottom-musicbox" ref="musicBox" @click="showlyrics">
      <!-- 唱片 -->
      <div class="bottom-left">
        <div class="bottom-record" v-if="playSongs.length" ref="record">
          <img :src="playingmelody.al.picUrl" class="record-img">
        </div>
      </div>
      <!-- 歌曲信息 -->
      <div class="bottom-musictext" v-if="playSongs.length">
        <span class="musictext-mname">{{ playingmelody.name }}</span>
        <span class="span-dot">-</span>
        <span class="musictext-msinger" ref="sname"></span>
        <!-- <span class="musictext-msinger">{{ playingmelody.ar.name }}</span> -->

        <audio controls :src="`https://music.163.com/song/media/outer/url?id=${playingmelody.id}.mp3`"
        ref="audio"
        @timeupdate="timeupdate"
        @ended="ended"
        v-if="playSongs.length"
        style="display: none;"
        ></audio>
      </div>
      <div class="bottom-right">
        <div class="bottom-playing" @click.stop="playingMusic">
          <!-- 播放按钮 -->
          <div class="bottom-play" ref="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" class="mySvg">
                <circle class="play-background" cx="35%" cy="35%" r="35%" fill="transparent" />
                <circle
                  class="play-bar"
                  cx="35%"
                  cy="35%"
                  r="35%"
                  fill="transparent"
                  :stroke-dasharray="dashArray"
                  :stroke-dashoffset="dashOffset"
                />
              </svg>
              <!-- <ion-icon :name="this.isStatus ? 'play' : 'pause'" class="bottom-playicon" ref="playicon"></ion-icon> -->
              <!-- 暂停按钮 当this.isStatus为false时显示 -->
              <ion-icon name="pause" class="bottom-playicon" ref="playicon" v-show="!this.$store.state.file.isPlaying"></ion-icon>
              <!-- 暂停按钮 当this.isStatus为true时显示 -->
              <ion-icon name="play" class="bottom-playicon" ref="playicon2" v-show="this.$store.state.file.isPlaying"></ion-icon>
          </div>
        </div>
        <!-- 播放列表按钮 -->
        <div class="bottom-musicmenu" @click.stop="openmelodylist">
          <ion-icon name="menu-outline" class="musicmenu-icon"></ion-icon>
        </div>
      </div>
    </div>
    <!-- 播放列表 -->
    <div class="showplaylist">
        <van-action-sheet v-model="show" round close-icon="action-sheet" close-on-popstate>
          <div class="melodylist">
            <div class="melodylist-sticky">
              <div class="melodylist-title">
                <!-- 顶部文字 -->
                <span class="melodylist-text">当前播放</span>
                <span class="melodylist-count">({{ playSongs.length }})</span>
              </div>
              <div class="melodylist-top" >
              <div class="top-leftcontent">
                <ion-icon name="refresh-outline" class="leftcontent-icon"></ion-icon>
                <span class="leftcontent-text">循环播放</span>
              </div>
              <div class="top-rightcontent">
                <ion-icon name="download-outline" class="rightcontent-icon"></ion-icon>
                <ion-icon name="duplicate-outline" class="rightcontent-icon"></ion-icon>
                <ion-icon name="trash-outline" class="rightcontent-icon" @click="openshowDialog"></ion-icon>
              </div>
              </div>
            </div>
          <div class="melodylist-center">
            <ul class="center-listcontent">
              <li v-for="(item,index) of playSongs" :key="index" class="listcontent-item">
                <div class="item-onemelody" @click="playMelodylist(item)">
                  <div class="onemelody-left">
                    <span class="onemelody-title">{{ item.name }}</span>
                    <span class="onemelody-dot">·</span>
                    <!-- 歌手名字 -->
                    <ul class="onemelody-sname">
                      <li v-for="(data,index) of item.ar" :key="index" class="sname-item">
                        <span class="item-singername">{{ data.name }}</span>
                      </li>
                    </ul>
                  </div>
                  <!-- 删除歌曲图标 -->
                  <div class="onemelody-right" @click.stop="dellistmusic(item)">
                    <ion-icon name="close-outline" class="center-closeicon"></ion-icon>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="melodylist-dialogbox">
            <van-dialog v-model="showDialog" 
              title="确认要清空播放列表?" 
              show-cancel-button 
              class="melodylist-dialog" 
              close-on-popstate
              @confirm="purgeallmusic"
            >
            </van-dialog>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!-- 歌词详情页 -->
    <div class="showlyrics">
      <van-popup v-model="popupshow" position="bottom" :style="{ height: '100%' }">
        <div class="lyrics-background" v-if="playSongs.length" ref="lyricsBackground">
          <img :src="playingmelody.al.picUrl" class="lyrics-img" >
        </div>
        <!-- 歌词页面遮罩层 -->
        <div class="lyrics-overlay" ref="lyricsOverlay"></div>
        <div class="lyrics">
          <div class="lyrics-top">
            <ion-icon name="chevron-down-outline" class="return-icon" @click="returnPlaylist"></ion-icon>
            <div class="top-singer">
              <div class="topsinger-box" ref="topsingerBox">
                <div class="topsinger-mnames" ref="topsingerDiv" :style="{'--width':spanWidth}">
                  <span class="topsinger-mname" ref="singnameSpan" >{{ playingmelody.name }}</span>
                  <span class="topsinger-mname1" ref="singnameSpan1" v-show="showTitle">{{ playingmelody.name }}</span>
                </div>
              </div>
              <span ref="lname" class="topsinger-sname"></span>
            </div>
            <ion-icon name="share-social-outline" class="topsinger-shareicon"></ion-icon>
          </div>
            <div class="lyrics-Upper" v-show="!showPhonograph" >
              <div class="Upper-box">
                <div class="Upper-overlay" ref="Upperoverlay"></div>
                <div class="lyrics-text" @click="toLyrics">歌词</div>
                <div class="lyrics-encyclopedia" @click="toEncyclopedia">百科</div>
              </div>
            </div>
            <div class="lyrics-phonograph" v-show="showPhonograph" @click="changeshowMian">
                <img src="@/assets/1.png" class="phonograph-head" ref="phonographHead">
                <div class="phonograph-rotate">
                  <img src="@/assets/2.png" class="phonograph-body" ref="phonographBody">
                  <img :src="playingmelody.al.picUrl" v-if="playSongs.length" class="phonograph-content" ref="phonographContent">
                </div>
                <div class="phonograph-iconmenu">
                  <ion-icon name="heart-outline" class="iconmenu-hearticons"></ion-icon>
                  <ion-icon name="arrow-down-circle-outline" class="iconmenu-downicon"></ion-icon>
                  <button class="iconmenu-wordicon">
                    <span class="wordicon-text">词</span>
                  </button>
                  <ion-icon name="chatbubble-ellipses-outline" class="iconmenu-chaticon"></ion-icon>
                  <button class="iconmenu-other">
                    <div class="otherround"></div>
                    <div class="otherround"></div>
                    <div class="otherround"></div>
                  </button>
                </div>
            </div>
            <div class="lyrics-main" v-show="!showPhonograph" @click="changeshowPhonograph">
              <div class="lyricsmain-box">
                <!-- 歌词 -->
                <div class="main-songlyrics" v-show="!showPhonograph">          
                  <div class="songlyrics-word" ref="songlyricsWord">
                    <!-- 歌词滚动第一种方法 -->
                    <!-- <div class="songlyrics-frame" :style="lyricMove"> -->
                    <div class="songlyrics-frame">
                      <!-- 歌词 -->
                      <p class="songlyrics-p" 
                        v-for="(item,index) of lyric" 
                        :key="index" 
                        :style="{'font-size': (index == currentRow ? '.35rem':'.3rem'),'color':(index == currentRow ? 'rgba(255,255,255,1)':'rgba(255,255,255,.3)')}"
                        ref="lyricsP">
                        {{ item.text }}
                      </p>
                    </div>
                  </div>
                  <div class="songlyricsFields">
                    <button class="songlyrics-playicon">
                        <ion-icon name="caret-forward-outline" class="btn-playicon"></ion-icon>
                    </button>
                    <div class="songlyricsFields-right">
                      <button class="songlyrics-transbtn">
                          <span class="transbtn-text">译</span>
                      </button>
                        <ion-icon name="ellipsis-vertical-circle-outline" class="dotsicon"></ion-icon>
                    </div>
                  </div>
                </div>
                <!-- 百科 -->
                <div class="main-encyclopedia">
                  这是百科界面
                <div class="music-encyclopedia">

                  </div>
                  <div class="similar-lyrics">

                  </div>
                  <div class="similar-playlist">

                  </div>
                </div>
              </div>
            </div>
            <!-- 歌词进度条 -->
            <div class="lyrics-mbox">
              <div class="lyrics-Progresswrapper">
                <progressBar :current="current" 
                :duration="duration"
                :isOpen="isOpen"
                @progress-changing="onProgressChanging" 
                @progress-changed='progressChanged'/>
              </div>
            </div>
            <div class="lyrics-footer">
              <playMenuDetail :Play="Play" :Pause="Pause" :openmelodylist="openmelodylist" :handleMusic="handleMusic"/>
            </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
import { getMusiclyrics,getMusicWikis } from '@/api';
import progressBar from '@/components/item/progressBar.vue';
import playMenuDetail from './components/item/playMenuDetail.vue';
export default {
  name: 'App',
  components:{progressBar,playMenuDetail},
  data(){
    return{
      dashArray:0,
      dashOffset:0,
      current:0,
      duration:0,
      //播放列表
      show:false,
      //歌词页
      popupshow:false,
      //节流阀
      flag:true,
      showPhonograph:true,
      // 当前歌词位置
      currentRow:0,
      // lyricMove:{
      //   top:''
      // },
      spanWidth:'',
      //歌词栏歌曲名字宽度
      showTitle:false,
      //滑动歌曲进度条标志位
      progressChanging:false,
      mplay:true,
      //判断歌词页面是否打开
      isOpen:true,
      showDialog:false,
    }
  },
  computed:{
    playSongs(){
      return this.$store.state.file.playSongs
    },
    getDashOffset() {
      return this.dashOffset
    },
    playingmelody(){
      return this.$store.state.file.playingMelody
    },
    lyric(){
      return this.$store.state.file.lyric
    },
    // 对象写法
    ...mapState({
        songIndex:state => state.file.songsIndex
      })
  },
  methods:{
    timeupdate(e){
      console.log("e===>", e.target.currentTime);
      //当前播放时间
      this.current = e.target.currentTime;
      // 总时长
      this.duration = this.$refs.audio.duration;
      // console.log(this.$refs.audio.duration,'duration')
      // duration是一个双精度浮点数，指明了音频在时间轴中的持续时间（总长度），以秒为单位。
      // 计算播放进度比例
      //下方if主要用于解决歌曲进度与播放按钮的圆形进度条不一致的问题,经测试，每分钟之间大致相差20s
      if(this.$refs.audio.duration <= 180){
          let duration = this.$refs.audio.duration + 73;
          //Math.min():返回作为输入参数的数字中最小的一个.
          let percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
      }
      if(this.$refs.audio.duration > 180 && this.$refs.audio.duration <= 240 ){
          let duration = this.$refs.audio.duration + 93;
          //Math.min():返回作为输入参数的数字中最小的一个.
          let percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
      }
      if(this.$refs.audio.duration > 240 && this.$refs.audio.duration <= 300 ){
          let duration = this.$refs.audio.duration + 113;
          //Math.min():返回作为输入参数的数字中最小的一个.
          let percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
      }
      if(this.$refs.audio.duration > 300 && this.$refs.audio.duration <= 360 ){
          let duration = this.$refs.audio.duration + 133;
          //Math.min():返回作为输入参数的数字中最小的一个.
          let percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
      }
      // console.log(this.$refs.audio.duration,'timeupdate中的duration')
      //如果进度条拖动已完成
      if(!this.progressChanging){
        this.current = e.target.currentTime
      }
    },
    ended(){
      // 初始化 圆形进度条的周长
      if(this.$refs.play){
        let circleWidth = this.$refs.play.offsetWidth;
        this.dashArray = Math.PI * circleWidth;
        this.dashOffset = Math.PI * circleWidth;
      }
    },
    //播放音乐
    playingMusic(){
      // this.$refs.audio.src.require(`https://music.163.com/song/media/outer/url?id=${this.playingmelody.id}.mp3`);
      // console.log("this.audio.paused===>",this.$refs.audio.paused)
        if(this.$refs.audio.paused){
          this.Play();
        }
        else{
          this.Pause();
        }
    },
    //音乐播放
    Play(){
      this.$nextTick(function(){
              this.$refs.audio.play();
          });
          this.$store.state.file.isPlaying = false;
          this.$refs.playicon.classList.add('pause-icon');
          this.$refs.record.classList.add('record-rotate');
          this.$refs.record.classList.remove('record-paused');
          this.mplay = true;

          // 歌词栏动画
          setTimeout(()=>{
            if(this.$refs.phonographHead){
              // animation 和 transition 动画冲突,需要错开执行
              setTimeout(() => {
                this.$refs.phonographHead.classList.add('phonographHead-repeatedly');
              }, 500);
                this.$refs.phonographHead.classList.add('transform-go');
                this.$refs.phonographHead.classList.remove('transform-back');

              this.$refs.phonographBody.classList.add('rotate-phonograph');
              this.$refs.phonographBody.classList.remove('animation-pause');
              this.$refs.phonographContent.classList.add('rotate-phonograph');
              this.$refs.phonographContent.classList.remove('animation-pause');
            }
          },100)
    },
    //音乐暂停
    Pause(){
      this.$nextTick(function(){
              this.$refs.audio.pause();
          });
          this.$store.state.file.isPlaying = true;
          this.$refs.playicon.classList.remove('pause-icon');
          this.$refs.record.classList.add('record-paused');
          this.mplay = false;
          // 歌词栏动画
          setTimeout(()=>{
            if(this.$refs.phonographHead){
              // animation 和 transition 动画冲突,需要错开执行
              this.$refs.phonographHead.classList.remove('phonographHead-repeatedly');
              setTimeout(() => {
                this.$refs.phonographHead.classList.remove('transform-go');
                this.$refs.phonographHead.classList.add('transform-back');
              }, 500);

              this.$refs.phonographBody.classList.add('animation-pause');
              this.$refs.phonographContent.classList.add('animation-pause');
            }
          },100)
    },
    // 打开播放列表
    openmelodylist(){
      setTimeout(()=>{
        this.show = true
      },200)
    },
    // 删除播放列表中的音乐
    dellistmusic(data){
      this.DelMusicList(data)
      // let index = this.playSongs.indexOf(data);
      // let length = this.playSongs.length;
      // index == 0 ? index = length-1 : index--;
      // this.playMelody = {};
      // this.playMelody = this.playSongs[index];
    },
    //播放列表点击事件(从播放列表播放音乐)
    playMelodylist(data){
      this.MusicFormList(data)
    },
    //进入歌词界面
    showlyrics(){
      this.popupshow = true
    },
    //返回播放列表
    returnPlaylist(){
      this.popupshow = false
    },
    // 歌词按钮
    toLyrics(){
      if(this.flag == true){
        this.flag = false
        if(this.$refs.Upperoverlay.style.right !== '188px'){
          this.$refs.Upperoverlay.style.right = 188 +'px'
        }
        setTimeout(() => {
          this.flag = true
        }, 2000);
      }
    },
    // 百科按钮
    toEncyclopedia(){
      if(this.flag == true){
        this.flag = false
        if(this.$refs.Upperoverlay.style.right !== '145px'){
          this.$refs.Upperoverlay.style.right = 145 +'px'
        }
        setTimeout(() => {
          this.flag = true
        }, 2000);
      }

      // if(this.$refs.Upperoverlay.style.right !== '149px'){
      //   this.$refs.Upperoverlay.style.right = 149 +'px'
      //   console.log('149')
      // }
    },
    //获取歌词
    async getMusiclyrics(Id){
      let res = await getMusiclyrics(Id)
      let {lyric} = res.data.lrc
      //lyric为字符串
      console.log(lyric,'res')
      //清空之前存入的歌词
      this.$store.state.file.lyric = [];
      this.optimizeLyrics(lyric)
    },
    //优化歌词
    optimizeLyrics(text){
      // split() 方法用于把一个字符串分割成字符串数组
      let arr = text.split('\n');
      // console.log(arr,'arr')
      for (let i = 0; i < arr.length; i++) {
        let temp_row = arr[i];

        let temp_arr = temp_row.split(']');
        let text = temp_arr.pop();
        // console.log(text,'temp_arr');

        temp_arr.forEach(data => {
          // console.log(data,'data')
          let obj = {};
          let temp_arr = data.substr(1,data.length-1).split(':');
          //将取得的时间转化为以秒为单位的时间
          let ts = parseInt(temp_arr[0]) * 60 + Math.ceil(temp_arr[1]);
          // console.log(temp_arr,'temp_arr');
          // console.log(ts,'ts')
          obj.time = ts;
          obj.text = text;
          this.lyric.push(obj);
        });
      }
      this.lyric.sort(this.sortRule);

    },
    //歌词排序规则
    sortRule(a,b){
      return a.time - b.time;
    },
    changeshowPhonograph(){
      this.showPhonograph = !this.showPhonograph
    },
    //从留声机切换到歌词
    changeshowMian(){
      this.showPhonograph = !this.showPhonograph
    },
    async getMusicWikis(Id){
      let res = await getMusicWikis(Id);
      console.log(res,'res')
    },
    //歌词进度条拖动时事件
    onProgressChanging(data) {
      //data:已经已经听完的进度条在整个进度条上的比例
      this.progressChanging = true;
      // 实时修改currentTime值  currentTime =  歌曲总时长 * 已经已经听完的进度条在整个进度条上的比例
      this.$refs.audio.currentTime = this.duration * data;
    },
    //歌词进度条拖动完成事件
    progressChanged(data){
      //data:已经已经听完的进度条在整个进度条上的比例
      this.progressChanging = false;
      this.$refs.audio.currentTime = this.duration * data;
    },
    //歌单页面切换音乐动画
    handleMusic(){
      this.$refs.lyricsOverlay.classList.remove('opacity-turnoff');
      setTimeout(() => {
        this.$refs.lyricsBackground.classList.remove('opacity-turn');
      }, 100);
      setTimeout(() => {
        this.$refs.lyricsOverlay.classList.add('opacity-turnoff');
        this.$refs.lyricsBackground.classList.add('opacity-turn');
      }, 500);
    },
    openshowDialog(){
      this.showDialog = true
    },
    purgeallmusic(){
      this.PurgeallMusic();
    },
    ...mapMutations(['MusicFormList']),
    ...mapMutations(['DelMusicList']),
    ...mapMutations(['PurgeallMusic']),
  },
  watch:{
    //实时监听playsongs的数据,隐藏或显示播放栏
    playSongs(newValue){
      if(newValue.length == 0){
        this.$refs.musicBox.classList.add('box');
        this.popupshow = false;
        this.show = false;
      }else{
        this.$refs.musicBox.classList.remove('box');
      }
    },
    //实时监听正在播放的音乐
    playingmelody(newValue){
      // 判断最下方播放栏歌手名字是否有多个
      // 使用该方法的目的是为了可以在名字超出范围后使用省略号
      // console.log(newValue,'newValue')
      if(newValue.ar.length > 1){
          let text = '';
          let nameIndex = newValue.ar.length
          //如果有多个,则在名字后方加 / 分隔开
          for(let i=0;i < nameIndex-1;i++){
              text += newValue.ar[i].name +'/'
          }
          setTimeout(()=>{
            if(this.$refs.sname){
              text += newValue.ar[nameIndex-1].name
              this.$refs.sname.innerHTML = text
            }
          },1)
      }
      else{
          //如果只有一个,则原封不动赋值
        setTimeout(()=>{
            if(this.$refs.sname){
              this.$refs.sname.innerHTML = newValue.ar[0].name
            }
          },1)
      }
      // 如果歌曲改变，自动播放
      setTimeout(() => {
        if(this.$refs.audio){
          this.$nextTick(function(){
              // this.$refs.audio.play();
              this.Play();
          })
          // this.isStatus = false;
          // this.$refs.playicon.classList.add('pause-icon');
          // this.$refs.record.classList.add('record-rotate');
          // this.$refs.record.classList.remove('record-paused');
        }
      }, 200);
      //调用getMusiclyrics传入id获取对应歌曲的歌词
      this.getMusiclyrics(newValue.id);
      //调用getMusiclyrics传入id获取对应歌曲的百科信息
      this.getMusicWikis(newValue.id);
      // 打开歌词栏
      setTimeout(() => {
        this.popupshow = true;
        setTimeout(() => {
            this.$refs.lyricsOverlay.classList.add('opacity-turnoff')
            this.$refs.lyricsBackground.classList.add('opacity-turn')
          }, 500);
      }, 100);
      // 歌词栏动画
      setTimeout(()=>{
        if(this.$refs.phonographHead){
          // this.$refs.phonographHead.style.transform = 'rotate(-2deg)';
          // this.$refs.phonographHead.classList.remove('phonographHead-repeatedly');
          // setTimeout(() => {
          //   this.$refs.phonographHead.classList.remove('transform-go');
          //   this.$refs.phonographHead.classList.add('transform-back');
          // }, 300);
          this.$refs.phonographHead.classList.add('phonographHead-repeatedly');
          this.$refs.phonographBody.classList.add('rotate-phonograph');
          this.$refs.phonographContent.classList.add('rotate-phonograph');
        }
      },100)
      //歌词栏歌曲名字显示优化
      if(newValue.name.length > 10){
          if(this.$refs.singnameSpan){
            setTimeout(() => {
              this.$refs.topsingerBox.style.justifyContent = 'flex-start';
              // 取得歌单名字跑马灯需要运动的长度，长度等于第一个span的长度(this.$refs.leftitemSpan.offsetWidth)加上与第二个span之间的距离(margin-left)
              this.spanWidth = -this.$refs.singnameSpan.offsetWidth + -60 + 'px';
              //添加移动动画
              this.$refs.topsingerDiv.classList.add('leftmove');
            }, 100);
          }
          if(this.$refs.singnameSpan1){
            //显示第二个歌曲名字
            this.showTitle = true;
          }
      }
      else{
        if(this.$refs.topsingerBox){
            setTimeout(() => {
              //将歌曲名字居中
              this.$refs.topsingerBox.style.justifyContent = 'center';
            }, 100);
          }
      }
    },
    //实时监听播放进度条
    getDashOffset() {
      let percent = 0;
      if (this.$refs.audio) {
        // 计算播放进度比例
        //下方if主要用于解决歌曲进度与播放按钮的圆形进度条不一致的问题,经测试，每分钟之间相差20s
        if(this.$refs.audio.duration <= 180){
          let duration = this.$refs.audio.duration + 73;
          percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
        }
        if(this.$refs.audio.duration > 180 && this.$refs.audio.duration <= 240 ){
          let duration = this.$refs.audio.duration + 93;
          percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
        }
        if(this.$refs.audio.duration > 240 && this.$refs.audio.duration <= 300 ){
          let duration = this.$refs.audio.duration + 113;
          percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;          
        }
        if(this.$refs.audio.duration > 300 && this.$refs.audio.duration <= 360 ){
          let duration = this.$refs.audio.duration + 133;
          percent = Math.min(1, this.current / duration);
          this.dashOffset = (1 - percent) * this.dashArray;
        }
      } 
      else {
        this.dashOffset = (1 - 0) * this.dashArray;
      }
      if(this.$refs.audio){
        // 如果歌曲播放完毕
        if(this.current == this.$refs.audio.duration){
              //如果歌曲为播放状态
              if(this.mplay){
                this.current = 0;
                this.$nextTick(()=>{
                this.Play();
                })
              }
              //如果歌曲为暂停状态
              else{
                this.current == this.$refs.audio.duration
                this.$nextTick(()=>{
                    this.Pause();
                })
              }
        }
      }

    },
    //如果打开歌词页面,将歌手名传过来
    popupshow(newValue){
      if(newValue){
          setTimeout(() => {
            this.$refs.lname.innerHTML = this.$refs.sname.innerHTML
          }, 200);
      }
      this.isOpen = newValue;
      // console.log(newValue,'newValue')
    },
    //监听歌曲时间
    current(){
      this.lyric.forEach((element,index)=>{
        // let time = parseInt(this.current)
        if(element.time <= this.current && element.time + 1 >= this.current ){
          // console.log([this.$refs.lyricsP[index]],'active')
          let Top = this.$refs.lyricsP[index].offsetTop
          // console.log(this.$refs.songlyricsWord.scrollTop,'scrollTop');
          if(element.text == ''){
            this.currentRow = index-1; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
          }
          else{
            setTimeout(() => {
              this.$refs.songlyricsWord.scrollTop = Top - 200;
            }, 500);
              //第一种方法，存在问题:当元素的top值改变时,父元素无法向上滚动
              // this.lyricMove.top = - index * 30 + "px";
              this.currentRow = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
          }
        }
      })
    },
    //打开歌词页面实现背景层切换
    isOpen(newValue){
        if(newValue == true){
          setTimeout(() => {
            this.$refs.lyricsOverlay.classList.add('opacity-turnoff');
            this.$refs.lyricsBackground.classList.add('opacity-turn');
          }, 500);
        }
        if(newValue == false){
          this.$refs.lyricsOverlay.classList.remove('opacity-turnoff');
          this.$refs.lyricsBackground.classList.remove('opacity-turn');
        }
    }
  },
  mounted(){
    //初始化播放栏
    if(this.playSongs.length < 1){
        this.$refs.musicBox.classList.add('box')
    }
    this.$nextTick(() => {
      // 初始化圆的周长
      if(this.$refs.play){
        let circleWidth = this.$refs.play.offsetWidth;
        this.dashArray = Math.PI * circleWidth;
        this.dashOffset = Math.PI * circleWidth;
      }
    });
  },
}
</script>

<style lang="less">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .app-container{
    margin-bottom: 1rem;
    .box{
      transform: translateY(1rem);
    }
    .bottom-musicbox{
      position: fixed;
      bottom: -0.02rem;
      width: 100%;
      height: 1.02rem;
      line-height: 1rem;
      border-radius: .08rem;
      border-top: .02rem solid rgba(0, 0, 0, .1);
      background-color: rgba(255, 255, 255, 1);
      display: flex;
      transition: all 1s;
      z-index: 20;
      .bottom-left{
        width: 1rem;
        height: 1rem;
        margin:.05rem .3rem;
        .bottom-record{
          display: flex;
          width: 0.92rem;
          height: 0.92rem;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.9);
          @keyframes rotate {
              0% {
                transform: rotate(0);
              }
              100% {
                transform: rotate(360deg);
              }
          }
          .record-img{
            width: 0.65rem;
            height: 0.65rem;
            margin: auto;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        .record-rotate{
          animation: rotate 20s infinite linear;
        }
        .record-paused{
          animation-play-state: paused;
        }
      }
      .bottom-musictext{
        display: flex;
        width: 4rem;
        height: 1rem;
        line-height: 1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .musictext-mname{
          // width: 2rem;
          letter-spacing: .01rem;
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis;
        }
        .span-dot{
          display: block;
          width: .1rem;
          margin: -0.04rem .08rem;
          color: rgba(0, 0, 0, .4);
        }
        .musictext-msinger{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: .28rem;
          color: rgba(0, 0, 0, .5);
          letter-spacing: .01rem;
        }
      }
      .bottom-right{
        display: flex;
        margin-left: .5rem;
        .bottom-playing{
          position: relative;
          width: .6rem;
          height: .6rem;
          top: .2rem;
          border-radius: 50%;
          .bottom-play{
            position: absolute;
            display: flex;
            width: 0.9rem;
            height: 0.9rem;
            bottom: -0.14rem;
            right: -0.1rem;
            .play-background{
              stroke-width: 0.06rem;
              transform-origin: 2.12rem 1.74rem;
              transform: scale(0.9);
              stroke: rgba(0, 0, 0, 0.1);
            }
            .play-bar{
              stroke-width: 0.06rem;
              // transform-origin: center 19px;
              transform-origin: .5rem .3rem;
              transform: scale(0.9) rotate(-90deg);
              stroke: rgba(79, 80, 84, .8);
            }
            .bottom-playicon{
              position: absolute;
              font-size: .35rem;
              left: .34rem;
              top: .28rem;
              font-weight: 800;
              color: rgba(79, 80, 84, 1);
            }
            // 给暂停图标添加一个类
            .pause-icon{
              left: .322rem;
            }
          }
        }
        .bottom-musicmenu{
          height: 1rem;
          margin-top: .2rem;
          line-height: 1rem;
          .musicmenu-icon{
            margin: 0;
            padding: 0;
            font-size: .6rem;
            margin:0 .2rem;
            transition: all .2s;
          }
          .musicmenu-icon:active{
            background-color: rgba(79, 80, 84, .3);
            border-radius: 12px;
            transform: scale(.95);
        }
        }
      }

    }
    //播放列表
    .showplaylist{
      // 遮罩层背景  下方类名可通过浏览器开发查看得到
      .van-overlay{
        background-color: rgba(0, 0, 0, .5);
      }
      .van-action-sheet{
        position: absolute;
        width: 90%;
        height: 8rem;
        left: 5%;
        bottom: .5rem;
        .melodylist{
          width: 100%;
          height: 100%;
          padding: .3rem;
          overflow: hidden;
          // 播放列表标题栏
          .melodylist-sticky{
            position: sticky;
            top: 0;
            background-color: #fff;
          }
          .melodylist-title{
            top: 0;
            width: 100%;
            height: .5rem;
            margin: .1rem 0 .2rem 0;
            .melodylist-text{
              font-size: .34rem;
              font-weight: 700;
            }
            .melodylist-count{
              font-size: .24rem;
              letter-spacing: .02rem;
              font-weight: 500;
              color: rgba(79, 80, 84, .8);
            }
          }
          .melodylist-top{
            display: flex;
            height: .8rem;
            line-height: .8rem;
            justify-content: space-between;
            .top-leftcontent{
              display: flex;
              width: 2rem;
              height: .8rem;
              line-height: .8rem;
              .leftcontent-icon{
                position: relative;
                top: .17rem;
                margin-right: .1rem;
                font-size: .4rem;
                color: rgba(79, 80, 84, .8);
              }
              .leftcontent-text{
                font-size: .26rem;
              }
            }
            .top-rightcontent{
              display: flex;
              width: 2rem;
              height: .8rem;
              justify-content: space-around;
              .rightcontent-icon{
                position: relative;
                top: .16rem;      
                font-size: .44rem;
                color: rgba(79, 80, 84, .8);
              }
            }
          }
          //播放列表中的ul
          .melodylist-center{
            width: 100%;
            height: 5.6rem;
            overflow-y: scroll;
            scroll-behavior: smooth;
            .center-listcontent{
              .listcontent-item{
                width: 100%;
                height: .8rem;
                line-height: .8rem;
                .item-onemelody{
                  display: flex;
                  justify-content: space-between;
                  border-radius: 12px;
                  transition: all .2s;
                  .onemelody-left{
                    display: flex;
                    width: 4.8rem;
                    .onemelody-title{
                      font-size: .3rem;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      -webkit-user-select:none;
                      -moz-user-select:none;
                      -ms-user-select:none;
                      user-select:none;
                    }
                    .onemelody-dot{
                      margin: 0 .1rem;
                      -webkit-user-select:none;
                      -moz-user-select:none;
                      -ms-user-select:none;
                      user-select:none;
                    }
                    .onemelody-sname{
                      display: flex;
                      width: 2.3rem;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      .sname-item{
                        .item-singername{
                          font-size: .26rem;
                          color: rgba(79, 80, 84, .8);
                          -webkit-user-select:none;
                          -moz-user-select:none;
                          -ms-user-select:none;
                          user-select:none;
                        }
                      // 除了最后一位歌手以外的歌手后面都加斜杠分隔
                      }
                      :not(:last-child)::after{
                        content: "/";
                      }
                    }
                  }
                  .onemelody-right{
                    position: relative;
                    border-radius: .2rem;
                    z-index: -1;
                    .center-closeicon{
                      position: relative;
                      top: .14rem;
                      font-size: .5rem;
                      color: rgba(79, 80, 84, .5);
                      transition: all .2s;
                    }
                    .center-closeicon:active{
                      color: rgba(79, 80, 84, .2);
                    }
                  }
                }
                .item-onemelody:active{
                  background-color: rgba(79, 80, 84, .3);
                  transform: scale(.98);
                }
              }
            }
          }
          ::-webkit-scrollbar {
              display: none; /* Chrome Safari */
          }
          .melodylist-dialogbox{
            .melodylist-dialog{
              position: absolute;
              top: 2.2rem;
              padding: 0 .6rem;
              .van-dialog__header{
                position: relative;
                right: .1rem;
                bottom: .1rem;
                font-size: .26rem;
                text-align: start;
                color: rgba(130, 126, 126, 0.8);
              }
              .van-dialog__footer{
                position: relative;
                width: 180px;
                margin: 0;
                padding: 0;
                left: 1.6rem;
                bottom: .1rem;
                .van-dialog__cancel{
                  font-size: .28rem;
                  font-weight: 600;
                  letter-spacing: .02rem;
                  color: rgba(225, 31, 31, 0.9);
                }
                .van-dialog__cancel::before{
                  border-radius: .24rem;
                }
                .van-dialog__confirm{
                  font-size: .28rem;
                  font-weight: 600;
                  letter-spacing: .02rem;
                  color: rgba(225, 31, 31, 0.9);
                }
                .van-dialog__confirm::before{
                  border-radius: .24rem;
                }
              }
            }
          }
        }
      }
      .van-popup--round{
          border-radius: .32rem;
      }
    }
    //歌词详情页
    .showlyrics{
      width: 100%;
      height: 100%;
      .lyrics-background{
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -99;
        opacity: 0;
        transition: all .5s;
        .lyrics-img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.2);
          filter: blur(.5rem) brightness(70%);
        }
      }
      .opacity-turn{
        opacity: 1;
      }
      .lyrics-overlay{
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        // filter: blur(.5rem);
        border-radius: 5px;
        background-color: rgba(0, 0, 0, .9);
        z-index: -99;
        opacity: 1;
        transition: all .5s;
      }
      .opacity-turnoff{
        opacity: 0;
      }
      .lyrics{
        .lyrics-top{
          display: flex;
          width: 100%;
          height: 1rem;
          margin-top: .2rem;
          justify-content: space-between;
          color: rgba(255, 255, 255, 1);
          .return-icon{
            margin-left: .2rem;
            font-size: .6rem;
          }
          .top-singer{
            margin-top: -0.2rem;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;
            .topsinger-box{
              display: flex;
              width: 200px;
              justify-content: center;
              overflow: hidden;
              white-space: nowrap;
              .topsinger-mnames{
                display: flex;
                .topsinger-mname{
                  position: relative;
                  display: block;
                  font-size: .34rem;
                  letter-spacing: .02rem;
                }
                .topsinger-mname1{
                  font-size: .34rem;
                  letter-spacing: .02rem;
                  margin-left: 60px;
                  // display: none;
                }
              }
              .leftmove{
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
            }
            .topsinger-sname{
              margin: .02rem 0;
              font-size:.26rem;
            }
          }
          .topsinger-shareicon{
            margin-right: .2rem;
            font-size: .6rem;
          }
        }
        .lyrics-Upper{
          display: flex;
          width: 100%;
          height: .6rem;
          text-align: center;
          justify-content: center;
          .Upper-box{
            display: flex;
            width: 1.8rem;
            height: .5rem;
            // line-height: .5rem;
            justify-content: space-around;
            border: .04rem solid rgba(255, 255, 255, .1);
            border-radius: .24rem;
            background-color: rgba(0, 0, 0, .1);
            .Upper-overlay{
              position: absolute;
              width: .84rem;
              height: .4rem;
              background-color: rgba(255, 255, 255, .1);
              border-radius: .2rem;
              z-index: 2;
              top: 1.24rem;
              right: 3.76rem;
              transition: all .5s;
            }
            .lyrics-text{
              position: relative;
              top: -0.02rem;
              width: .6rem;
              line-height: .5rem;
              font-size: .26rem;
              color: #fff;
              z-index: 3;
            }
            .lyrics-encyclopedia{
              position: relative;
              top: .04rem;
              width: .6rem;
              font-size: .26rem;
              color: #fff;
              z-index: 3;
            }
          }
        }
        .lyrics-phonograph{
          width: 100%;
          height: 8rem;
          .phonograph-head{
            position: absolute;
            // width: 119px;
            // height: 195px;
            width: 107px;
            height: 176px;           
            left: 172px;
            bottom: 433px;
            transition: all .5s;
            transform: rotate(-30deg);
            // transform: rotate(-2deg);
            transform-origin: 15% 9%;
            object-fit: cover;
            z-index: 8;
            transition: all .5s;
          }
          .transform-go{
            transform: rotate(-2deg);
            transition: all .5s;
          }
          .transform-back{
            transform: rotate(-30deg);
            transition: all .5s;
          }
          // 唱片指针动画类
          .phonographHead-repeatedly{
            animation: repeatedly 5s linear infinite;
          }
          // 唱片指针动画
          @keyframes repeatedly {
            0% {
              transform: rotate(-2deg);
            }
            30%,70% {
              transform: rotate(-1deg);
            }
            50% {
              transform: rotate(-3deg);
            }
            100% {
              transform: rotate(-2deg);
            }
          }
          .phonograph-rotate{
            transition: all .5s;
            .phonograph-body{
              position: absolute;
              width: 280px;
              height: 275px;
              top: 150px;
              left: 40px;
              object-fit: cover;
              z-index: 3;
              transition: all .5s;
            }
            .phonograph-content{
              position: absolute;
              top: 195px;
              left: 88px;
              width: 185px;
              height: 185px;
              object-fit: cover;
              transition: all .5s;
            }
          }
          // 详情页旋转
          .rotate-phonograph{
            animation: xuanzhuan 25s linear infinite;
            transition: all .5s;
          }
          @keyframes xuanzhuan {
              0% {
                transform: rotate(0);
              }
              100% {
                transform: rotate(360deg);
              }
          }
          .phonograph-iconmenu{
            position: relative;
            display: flex;
            top: 9.2rem;
            justify-content: space-around;
            justify-items: center;
            .iconmenu-hearticons{
              font-size: .6rem;
              color: rgba(255, 255, 255, .5);
            }
            .iconmenu-downicon{
              font-size: .6rem;
              color: rgba(255, 255, 255, .5);
            }
            .iconmenu-wordicon{
              position: relative;
              width: .5rem;
              height: .5rem;
              top: .05rem;
              border:.04rem solid rgba(255, 255, 255, .5);
              background-color: rgba(0, 0, 0, .1);
              border-radius: .12rem;
              .wordicon-text{
                color: rgba(255, 255, 255, .5);
                font-size: .26rem;
              }
            }
            .iconmenu-chaticon{
              position: relative;
              bottom: .5px;
              top: .03rem;
              font-size: .57rem;
              color: rgba(255, 255, 255, .5);
            }
            .iconmenu-other{
              position: relative;
              display: flex;
              top: .01rem;
              flex-direction:column;
              background-color: transparent;
              justify-items: center;
              justify-content: center;
              border: none;
              .otherround{
                width: .08rem;
                height: .08rem;
                margin: .04rem 0;
                border: none;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, .5);
              }
              // .otherround2{
              //   width: 5px;
              //   height: 5px;
              //   margin: 5px 0;
              //   background-color: rgb(255, 6, 6);
              // }
              // .otherround3{
              //   width: 5px;
              //   height: 5px;
              //   margin-top: 5px;
              //   background-color: rgb(0, 51, 255);
              // }
            }
          }
          .animation-pause{
            animation-play-state:paused;
          }
        }
        .lyrics-main{
          position: absolute;
          width: 100%;
          height: 9.5rem;
          top: 85px;
          overflow: hidden;
          .lyricsmain-box{
            position: absolute;
            width: 200%;
            height: 9.5rem;
            display: flex;
            .main-songlyrics{
              width: 100%;
              height: 9.5rem;
              .songlyrics-word{
                position: relative;
                width: 100%;
                height: 8.8rem;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                scroll-behavior: smooth;
                overflow-y: scroll;
                transition: all .5s;
                .songlyrics-frame{
                  position: absolute;
                  width: 100%;
                  // height: fit-content;
                  padding-top: 3rem;
                  transition: all .5s;
                  .songlyrics-p{
                    position: relative;
                    width: 95%;
                    color: rgb(0, 0, 0);
                    margin: .3rem .1rem;
                    transition: all .5s;
                    transition-delay: .5s;
                    white-space: normal;
                }
                }
              }
              ::-webkit-scrollbar {
                display: none; /* Chrome Safari */
              }
              // 下方图标
              .songlyricsFields{
                position: relative;
                width: 100%;
                height: .5rem;
                display: flex;
                justify-content: space-between;
                justify-items: center;
                .songlyrics-playicon{
                  position: relative;
                  width: .5rem;
                  height: .42rem;
                  left: .2rem;
                  // top: .3rem;
                  // right: .1rem;
                  line-height: .42rem;
                  background-color: transparent;
                  // border: .04rem solid rgba(152, 149, 149, 0.6);
                  border: .04rem solid rgba(152, 149, 149, 0.6);
                  border-radius: .18rem;
                  // color: rgba(152, 149, 149, 0.6);
                  color: #fff;
                  .btn-playicon{
                      margin:.04rem .08rem;
                  }
                }
                .songlyricsFields-right{
                  width: 2rem;
                  display: flex;
                  justify-content: space-around;
                  justify-items: center;
                  .songlyrics-transbtn{
                    position: relative;
                    display: flex;
                    width: .6rem;
                    height: .4rem;
                    top: .06rem;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, .1);
                    border: .04rem solid rgba(152, 149, 149, 0.6);
                    border-radius: .18rem;
                    color: rgba(152, 149, 149, 0.6);
                    .transbtn-text{
                      font-size: .24rem;
                    }
                  }
                    .dotsicon{
                      position: relative;
                      right: .16rem;
                      color: rgba(152, 149, 149, 0.6);
                      font-size: .52rem;
                    }
                }
              }
            }
            .main-encyclopedia{
              width: 100%;
              .music-encyclopedia{

              }
              .similar-lyrics{

              }
              .similar-playlist{

              }
            }
          }
        }
        .lyrics-mbox{
          width: 100%;
          position: absolute;
          top: 11.3rem;
          // .lyrics-Progresswrapper{}
        }
        .lyrics-footer{
          position: absolute;
          width: 100%;
          height: 1.2rem;
          bottom: .2rem;
        }
      }
    }
  }
</style>
