export default {
    state:{
        //歌单Id
        number: 0,
        //歌单创建用户Id
        userId: 0,
        //歌单详情
        playlist:{
            //歌单创建用户信息
            creator:{},
        },
        //歌单歌曲数量限制
        limit: 20,
        //歌单歌曲数量限制
        offset: 0,
        //歌单列表
        songs: [],
        //在歌单列表中搜索返回的歌单列表
        listsongs:[],
        // 播放列表
        playSongs: [],
        // 当前正在播放的音乐
        playingMelody:{},
        //当前正在播放的音乐(备份)，用于歌词页面切换音乐功能，playingMelody由于使用深拷贝,使用indexOf和forEach无法从playSong中取得index值!
        Melody:{},
        songsIndex: 0,
        // 用于歌曲详情页的弹出层显示
        flag:false,
        //歌词
        lyric:[],
        bWidth:0,
        // 歌词页面播放暂停按钮切换
        isPlaying:true,
        //歌单搜索页显示
        showsearchbox:false,
        //主页搜索页显示
        showSearch:false,
        //搜索历史
        historysearch:[],
        hotsearch:[],
    },
    actions:{

    },
    mutations:{
        //将歌单id传入vuex中的state中
        GetId(state,id){
            state.number = id
        },
        getPlayList(state,data){
            state.playlist = data
            //将数据保存到sessionStorage中
            sessionStorage.setItem('playlistDetail',JSON.stringify(state.playlist))
        },
        getPlayListAll(state,data){
            state.songs = data
        },
        //点击歌曲生成播放列表
        PlayMusic(state,data){
            // some方法同样用于检测是否有满足条件的元素，如果有，则不继续检索后面的元素，直接返回true
            let result = state.playSongs.some(item => item.id == data.id)
            if(!result){
                state.playSongs.push(data)
            }
            // console.log(state.playSongs,'songs')
        },
        //点击歌单歌曲播放音乐
        playMelody(state,data){
            //如果不使用JSON深拷贝,会出现删除播放列表中的歌曲后再点击该歌曲歌手名字不显示，watch属性不触发的问题
            state.playingMelody = JSON.parse(JSON.stringify(data));
            state.Melody = data;
            // console.log(state.playingMelody,'playingMelody')
        },
        // 从播放列表中播放音乐
        MusicFormList(state,data){
            if(state.playingMelody !== data){
                state.playingMelody = JSON.parse(JSON.stringify(data))
                state.Melody = data;
            }
        },
        // 播放全部按钮
        SelectAllMusic(state,data){
            state.playSongs = data
            state.playingMelody = state.playSongs[0]
            // console.log(state.playSongs[0],'data')
        },
        //删除播放列表中的音乐
        DelMusicList(state,data){
            let index = state.playSongs.indexOf(data);
            state.playSongs.splice(index,1);
            if(state.playingMelody.id == data.id){
                let length = state.playSongs.length;
                // 如果为最后一首,则跳转为第一首
                if(length !== 0){
                    index == length ? index = 0 : index;
                    state.playingMelody = JSON.parse(JSON.stringify(state.playSongs[index]));
                }
            }

            //当playSongs和songs的内存地址相同时,使用下方方法解决问题
            // let delplaySongs = state.playSongs.toSpliced(index,1)
            // state.playSongs = delplaySongs
        },
        //上一首音乐
        SelectPreviousMusic(state,data){
            let index = state.playSongs.indexOf(data);
            let length = state.playSongs.length;
            // 如果为最后一首,则跳转为第一首
            if(length !== 0){
                if(length == 1){
                    index = 0;
                    state.playingMelody = JSON.parse(JSON.stringify(state.playSongs[index]));
                    state.Melody = state.playSongs[index];
                }
                else{
                    index == 0 ? index = length-1 : index--;
                    state.playingMelody = JSON.parse(JSON.stringify(state.playSongs[index]));
                    state.Melody = state.playSongs[index];
                }
            }
            //取得index值得第二种方法
            // state.playSongs.forEach((element,index)=>{
            //     if(element === data){
            //         console.log(index,'index')
            //     }
            //     else{
            //         console.log(element,'执行力')
            //     }
            // })
        },
        //下一首音乐
        SelectNextMusic(state,data){
            let index = state.playSongs.indexOf(data);
            let length = state.playSongs.length;
            // 如果为最后一首,则跳转为第一首
            if(length !== 0){
                if(length == 1){
                    index = 0;
                    state.playingMelody = JSON.parse(JSON.stringify(state.playSongs[index]));
                    state.Melody = state.playSongs[index];
                }
                else{
                    index == length-1 ? index = 0 : index++;
                    state.playingMelody = JSON.parse(JSON.stringify(state.playSongs[index]));
                    state.Melody = state.playSongs[index];
                }
            }
        },
        //清空播放列表(app.vue中调用)
        PurgeallMusic(state){
            state.playSongs = [];
        },
        // 在歌单列表搜索
        SearchMusicList(state,data){
            state.listsongs = [];
            if(data.trim() !== ''){
                state.songs.forEach((element)=>{
                    let singname = element.name;
                    let singername = [];
                    let nameString = '';
                    //取出歌手名字
                    element.ar.forEach((singer)=>{
                        singername.push(singer.name);
                        // 将数组转化为字符串
                         nameString =singername.join();
                    })
                    //如果歌曲名字或者歌手名字符合条件(全部转换为小写)
                    if(singname.toLowerCase().includes(data.toLowerCase()) || nameString.toLowerCase().includes(data.toLowerCase())){
                        state.listsongs.push(element);
                    }
                })
                // console.log(state.listsongs,'listsongs');
            }
            else{
                state.listsongs = [];
            }

        },
        //首页搜索音乐
        SearchMusic(state,data){
            //历史记录最大数量为10
            if(state.historysearch.length < 10){
                //如果当前数组的长度>=1且data不为空
                if(state.historysearch.length >=1 && data.trim() !== ''){
                    // 如果当前数组中有元素与data相同
                    if(state.historysearch.includes(data)){
                        state.historysearch.forEach((element,index)=>{
                            //如果数组长度大于1且其中有元素与data相同
                            if(state.historysearch.length > 1 && element == data){
                                //将与data相同的元素删除
                                state.historysearch.splice(index,1);
                                // 将相同的元素放到第一个
                                state.historysearch.unshift(element);
                            }
                        })
                    }
                    // 如果当前数组中没有元素与data相同
                    else{
                        state.historysearch.unshift(data)
                    }
                }
                //如果当前数组长度小于1且data不为空
                else if(state.historysearch.length < 1 && data.trim() !== ''){
                    state.historysearch.push(data)
                }
            }
            else{
                if(state.historysearch.includes(data)){
                    state.historysearch.forEach((element,index)=>{
                        //如果数组长度大于1且其中有元素与data相同
                        if(element == data){
                            //将与data相同的元素删除
                            state.historysearch.splice(index,1);
                            // 将相同的元素放到第一个
                            state.historysearch.unshift(element);
                        }
                    })
                }
                // 如果当前数组中没有元素与data相同
                else{
                    state.historysearch.pop();
                    state.historysearch.unshift(data);
                }
            }
        },
        //清空历史记录
        PurgeHistory(state){
            state.historysearch = [];
        }
    },
    getters:{

    }
}