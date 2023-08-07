<template>
  <div class="list">
    <ul class="list-ul">
        <li class="list-li">
            <a href="javascript:void(0)" class="list-item">
                <lord-icon
                    src="https://cdn.lordicon.com/xryjrepg.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#f4a09c"
                    style="width:45px;height:45px"
                    class="item-love">
                </lord-icon>
                <span>猜你喜欢</span>
            </a>
        </li>
        <li class="list-li">
            <a href="javascript:void(0)" class="list-item">
                <lord-icon
                    src="https://cdn.lordicon.com/ovqhybfd.json"
                    trigger="loop"
                    delay="2100"
                    colors="outline:#121331,primary:#4bb3fd"
                    style="width:50px;height:50px"
                    class="item-icon">
                </lord-icon>
                <span>私人FM</span>
            </a>  
        </li>        
        <li class="list-li">
            <a href="javascript:void(0)" class="list-item">
                <lord-icon
                    src="https://cdn.lordicon.com/qedjceeb.json"
                    trigger="loop"
                    delay="2200"
                    colors="outline:#121331,primary:#646e78,secondary:#2ca58d,tertiary:#ffc738,quaternary:#ebe6ef"
                    style="width:50px;height:50px"
                    class="item-icon">
                </lord-icon>
                <span>歌单</span>
            </a> 
        </li>
        <li class="list-li">
            <a href="javascript:void(0)" class="list-item">
                <lord-icon
                    src="https://cdn.lordicon.com/abkxerbf.json"
                    trigger="loop"
                    delay="2300"
                    colors="outline:#121331,primary:#646e78,secondary:#4bb3fd,tertiary:#ffc738,quaternary:#f28ba8"
                    style="width:50px;height:50px"
                    class="item-icon">
                </lord-icon>
                <span>排行榜</span>
            </a>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
    name:'IconList'
}
</script>

<style lang="less" scoped>
    .list{
        width: 100%;
        height: 2rem;
        overflow: hidden;
        margin-top: .2rem;
        .list-ul{
            // width: inherit;
            height: inherit;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .list-li{
                width: 25%;
                height: 100%;
                margin: 0;
                padding: 0;
                .list-item{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    text-decoration: none;
                    align-content: center;
                    text-align: center;
                    color: #000;
                    //爱心图标的大小为45px,比其他图标小了5px
                    .item-love{
                        position: relative;
                        margin: .05rem 0;
                        left: .45rem;
                    }
                    .item-icon{
                        position: relative;
                        left: .4rem;
                    }
                }
            }
        }
    }
</style>