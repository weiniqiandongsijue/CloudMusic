<template>
    <div class="progress-container">
        <span class="current-time">{{ formatTime(current) }}</span>
        <div class="progress-bar" ref="progressBar">
            <!-- 整条直线 -->
            <div class="barinner"  @click="clickProgress">
                <!-- 已经听完的进度 -->
                <div class="progress" :style="progressStyle" ref="doneProgress"></div>
                <!-- 按钮 -->
                <div class="progressBar-btn-wrapper" 
                :style="btnStyle" 
                @touchstart.prevent="onTouchStart" 
                @touchmove.prevent="onTouchMove" 
                @touchend.prevent="onTouchEnd">
                    <div class="progressBar-btn" ref="progressBarBtn"></div>
                </div>
            </div>
        </div>
        <span class="duration-time">{{formatTime(duration)}}</span>
    </div>
</template>

<script>
export default {
    name:'progressBar',
    props:['current','duration','isOpen'],
    data() {
        return {
            offset:0,
            touch:{},
            proportion:0,
        }
    },
    methods:{
        formatTime(interval){
          // interval 向下取整
          interval = interval | 0
          // 不足两位的话就向前填充一个0
          let minute = ((interval / 60 | 0) + '')
          let second = ((interval % 60 | 0) + '')
          let len = minute.length
          for (; len < 2; len++) {
            minute = '0' + minute
          }
          len = second.length
          for (; len < 2; len++) {
            second = '0' + second
          }
          return `${minute}:${second}`
        },
        onTouchStart(e){
            // console.log(e,'onTouchStart--e')
            this.touch.x1=e.changedTouches[0].clientX
            // 已经听完的进度条初始宽度
            this.touch.beginWidth = this.$refs.doneProgress.clientWidth;
        },
        onTouchMove(e){
            //计算touch移动的偏移量(delta)
            const delta = e.changedTouches[0].clientX-this.touch.x1;
            // touchmove移动后的已经听完的进度条的长度(tempWidth) = 之前的width + touchmove增加的偏移量
            const tempWidth = this.touch.beginWidth + delta;
            // 再拿到barWidth(进度条长度度减去按钮的长度度)
            const barWidth = this.$refs.progressBar.clientWidth - 7;
            // 已经听完的进度条的长度 / barwidth = 进度条现在应该有的进度
            const Newprogress = tempWidth/barWidth;
            //moveRange: 已经听完的进度条在整个进度条上的长度
            let moveRange = barWidth * Newprogress;
            // 按钮的width固定为7px
            let endProgress = this.$refs.progressBar.clientWidth - 7;
            if(moveRange >= 0 && moveRange <= endProgress){
                //确保touchmove事件只有在进度条范围内时才将值传给offset,实现切换歌曲进度的功能
                this.offset = barWidth * Newprogress;
            }
            this.$refs.progressBarBtn.classList.add('move-btn');
            this.$emit('progress-changing',Newprogress);
        },
        onTouchEnd(){
            const barWidth = this.$refs.progressBar.clientWidth - 7;
            // 已经听完的进度条在整个进度条上的比例
            const progress = this.$refs.doneProgress.clientWidth / barWidth;
            this.$emit('progress-changed',progress);
            this.$refs.progressBarBtn.classList.remove('move-btn');
        },
        // 点击进度条跳转
        clickProgress(e){
        //   console.log('getBoundingClientRect', this.$refs.progressBar.getBoundingClientRect());
          const rect = this.$refs.progressBar.getBoundingClientRect()
          // rect.x 整个进度条与左边屏幕之间的长度
          // 黄条应有的宽度
          const offsetWidth = e.pageX - rect.x;
          const barWidth =this.$refs.progressBar.clientWidth - 7;
          const progress = offsetWidth/barWidth;
          this.$emit('progress-changed', progress);
        }
    },
    computed:{
        progress(){
            return this.current / this.duration
        },
        progressStyle(){
            return `width: ${this.offset}px`
        },
        btnStyle(){
            return `transform: translateX(${this.offset}px)`
        }
    },
    watch:{
        progress(newValue){
          // 进度条宽度
          this.$store.state.file.bWidth = this.$refs.progressBar.clientWidth;
          const barWidth = this.$store.state.file.bWidth - 7;
          this.proportion = newValue;
          // 偏移量
          this.offset = barWidth * newValue;
        },
        //监听的目的:解决当歌曲暂停时打开页面进度条按钮位置不正确的问题 原因:当页面关闭时,总进度条的width为0
        isOpen(newValue){
            if(newValue == true){
                this.$store.state.file.bWidth = this.$refs.progressBar.clientWidth;
                const barWidth = this.$store.state.file.bWidth - 7;
                // 偏移量
                this.offset = barWidth * this.proportion;
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .progress-container{
        display: flex;
        .current-time{
            position: relative;
            top: 5px;
            width: 40px;
            height: 20px;
            font-size: 8px;
            margin: 0 auto;
            padding: 0 8px;
            color: rgba(255, 255, 255, .6);
        }
        .duration-time{
            position: relative;
            top: 5px;
            width: 40px;
            height: 20px;
            font-size: 8px;
            margin: 0 auto;
            padding: 0 8px;
            color: rgba(255, 255, 255, .3);
        }
        .progress-bar{
            width: 250px;
            height: 30px;
            .barinner{
                position: relative;
                top: 11px;
                height: 2px;
                background-color: rgba(255, 255, 255, .2);
                border-radius: 5px;
                .progress{
                    position: absolute;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 1);
                }
                .progressBar-btn-wrapper{
                    position: absolute;
                    left: -8px;
                    top: -11px;
                    width: 20px;
                    height: 20px;
                    .progressBar-btn{
                        position: relative;
                        top: 8.5px;
                        left: 7px;
                        box-sizing: border-box;
                        width: 7px;
                        height: 7px;
                        border: none;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 1);
                        transition: all .1s;
                    }
                    .move-btn{
                        top: 6.5px;
                        width: 10px;
                        height: 10px;
                        transition: all .1s;
                    }
                }
            }
        }
    }

</style>