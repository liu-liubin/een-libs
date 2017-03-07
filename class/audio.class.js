/* class for audio  音频文件API类库
 *@AUTHOR LIUBIN
*/
class CreateDom {
    constructor() {
        this.playIcon = '<path fill="currentColor" d="M512 0c-282.624 0-512 229.376-512 512s229.376 512 512 512S1024 794.624 1024 512 794.624 0 512 0z m0 958.976c-246.784 0-446.976-200.192-446.976-446.976s200.192-446.976 446.976-446.976c246.784 0 446.976 200.192 446.976 446.976 0 246.784-200.192 446.976-446.976 446.976z"></path><path fill="currentColor" d="M379.392 328.704h85.504v385.536h-85.504v-385.536zM558.592 328.704h85.504v385.536h-85.504v-385.536z" ></path>';
        this.pauseIcon = '<path fill="currentColor" d="M506.354859 0C226.697842 0 0 221.0304 0 493.696 0 766.3616 226.697842 987.392 506.354859 987.392 786.038158 987.392 1012.709717 766.3616 1012.709717 493.696 1012.709717 221.0304 786.038158 0 506.354859 0L506.354859 0ZM506.354859 916.864C267.027684 916.864 72.336384 727.04 72.336384 493.696 72.336384 260.352 267.027684 70.528 506.354859 70.528 745.682034 70.528 940.373333 260.352 940.373333 493.696 940.373333 727.04 745.682034 916.864 506.354859 916.864L506.354859 916.864ZM413.801017 720.64C411.017842 720.64 408.234667 719.9744 405.661525 718.6944 399.543808 715.6992 395.736633 709.6064 395.736633 703.0016L395.736633 299.9552C395.736633 293.4016 399.465017 287.3856 405.451492 284.3392 411.385458 281.2928 418.605966 281.7536 424.119808 285.4912L713.465458 481.7408C718.27035 484.992 721.158542 490.3168 721.237333 496 721.316124 501.7088 718.559175 507.0592 713.8593 510.4384L424.51365 717.184C421.336633 719.4624 417.581966 720.64 413.801017 720.64L413.801017 720.64Z" ></path>';
        // this.playIcon = 'M512 999.619048C242.712381 999.619048 24.380952 781.336381 24.380952 512 24.380952 242.712381 242.688 24.380952 512 24.380952c269.336381 0 487.619048 218.331429 487.619048 487.619048C999.619048 781.336381 781.336381 999.619048 512 999.619048zM512 115.809524C293.180952 115.809524 115.809524 293.180952 115.809524 512c0 218.843429 177.371429 396.190476 396.190476 396.190476 218.843429 0 396.190476-177.347048 396.190476-396.190476C908.190476 293.180952 730.843429 115.809524 512 115.809524L512 115.809524zM649.142857 633.929143c0 25.234286-20.455619 45.689905-45.689905 45.689905-25.209905 0-45.665524-20.406857-45.714286-45.616762l-0.024381 0 0-243.809524 0.024381 0c0 0 0-0.048762 0-0.097524 0-25.234286 20.48-45.714286 45.714286-45.714286s45.689905 20.48 45.689905 45.714286c0 0.365714 0 0.707048 0 1.072762l0 241.688381C649.142857 633.246476 649.142857 633.563429 649.142857 633.929143L649.142857 633.929143zM466.285714 633.929143c0 25.234286-20.455619 45.689905-45.714286 45.689905-25.185524 0-45.641143-20.406857-45.714286-45.616762l0 0 0-243.809524 0 0c0 0 0-0.048762 0-0.097524 0-25.234286 20.48-45.714286 45.714286-45.714286 25.258667 0 45.714286 20.48 45.714286 45.714286 0 0.365714 0 0.707048 0 1.072762l0 241.688381C466.285714 633.246476 466.285714 633.563429 466.285714 633.929143L466.285714 633.929143z';
        let absY = 'position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);';

        //audio 模版
        this.tpl = `
        <div class="audio-style" style="height:8rem;position:relative;">

            <div style="padding-left:66px;${absY};position:relative;">
                <div AudioTitle style="font-size:1.6rem;padding-bottom:.6rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>

                <div AudioProcess style="position:relative;height:3px;width:100%;background-color:#ccc">
                    <div AudioPlayProcess style="width:0;position:absolute;height:3px;background-color:#23a6f0;">
                        <svg AudioDragDot viewBox="0 0 1024 1024" style="width:20px;height:20px;color:#23a6f0;right:-10px;${absY}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
                            <path fill="currentColor" d="M512 512m-320 0a5 5 0 1 0 640 0 5 5 0 1 0-640 0Z"></path>
                        </svg>
                    </div>
                </div>

                <div AudioTimeStatus style="font-size:15px;padding-top:8px;color:#888;">00:00<span style="font-size:12px;"></span></div>
            </div>

            <div AudioCtrl style="z-index:99;left:16px;width:50px;height:50px;color:#109ae7;${absY}">
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ></svg>
            </div>
        </div>`.trim();
        this.config = {} //音频参数配置
        //style="display:inline-block;width:10px;height:10px;color:#23a6f0;position:absolute;top:-3.5px;right:-3.5px;"
    }
    dom(obj){
        let dom = document.querySelector("[een-audio]") || obj;
        if(!dom) return false;

        dom.innerHTML = this.tpl;
        dom.querySelector("[AudioCtrl] svg").innerHTML = this.pauseIcon; //暂停状态显示按钮
        dom.querySelector("[AudioTitle]").innerHTML = this.config.title || "未知作者";    //音频标题
        let audio = document.createElement('audio')  //生成一个audio元素
            audio.controls =  true  //这样控件才能显示出来
            audio.autobuffer = false;
            audio.preload = "none";
            // audio.setAttribute("style","position:fixed;z-index:999;top:0px");
            audio.setAttribute("style","display:none;visibility:hidden;position:fixed;z-index:-999;left:9999px");

            audio.src = (this.config.src || dom.getAttribute("src")) + "?"+Date.now();  //音乐的路径

            let _audio = document.querySelector("audio");
            console.log(_audio,"989809809");
            if( _audio ){
                _audio.parentNode.removeChild( _audio );
            }
            document.body.appendChild(audio)  //把它添加到页面中
            this.audio = audio;
            this.Dom = dom;
            this.addEvent(audio);

            // this.touch();//启用触摸控制进度
    }
    addEvent(audio){
        var self = this;
        if(!audio) return false;
        audio.addEventListener("loadedmetadata", ()=>{
            // console.log(audio.networkState);
            console.log("audio元数据已加载，并且准备缓冲",audio.duration);
            if(self.config.currentTime)
                audio.currentTime = Number(self.config.currentTime);//设置播放初始时间

        } )
        audio.addEventListener("canplay", ()=>{
            console.log("audio能够开始播放可能因为缓冲而停止");
            if(audio.duration){
                self.Dom.querySelector("[AudioTimeStatus] span").innerHTML='';
                //设置时间格式（数组个数）
                let arr = self.format(audio.duration);
                    self.config.strDuration = arr.join(":");
                    // self.config.format = arr.fill("00");
                    // self.config.audioCurrentTime = audio.currentTime;
            }
        } )
        //联网下载数据
        audio.addEventListener("progress", ()=>{
            console.log("audio正在联网下载",audio.error,audio.readyState);
        } )


        //监测当前帧是否可用
        audio.addEventListener("loadeddata", ()=>{
            console.log("audio当前帧可用");
        } )

        //触发播放
        audio.addEventListener("play",()=>{
            //alert("908098")
            // if(self.audio.duration) {self.Dom.querySelector("[AudioTimeStatus] span").innerHTML='正在缓冲~';
            // if(t) self.audio.setAttribute("data-time",t);
            // self.Dom.querySelector("[AudioCtrl] svg").innerHTML =  self.playIcon;}
            //监听是否拖动播放条，并生效播放位置
            // if(self.percent > 1 )
            //     audio.currentTime = self.duration * (self.percent/100)

        })

        audio.addEventListener("emptied",()=>{
            console.log("emptied");
        })

        //当前播放时间发生改变
        let sstt = null;
        audio.addEventListener("timeupdate", ()=>{
            if(sstt) clearTimeout(sstt);
            sstt =  setTimeout(function(){
                let code = audio.error ? audio.error.code : ""; //1.用户终止 2.网络错误 3.解码错误 4.URL无效
                if( code==2 ){
                    self.Dom.querySelector("[AudioTimeStatus] span").innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;网络错误';
                    return false;
                }
                if( code==3 ){
                    self.Dom.querySelector("[AudioTimeStatus] span").innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;无法识别';
                    return false;
                }
                if(audio.paused === false)
                    self.Dom.querySelector("[AudioTimeStatus] span").innerHTML='正在缓冲';
            },2500)

            //判断是否设置有指定播放时间（或百分比）
            let setTime = Number(audio.getAttribute("data-time"));
            if( setTime && setTime < 1 && setTime > 0){
                audio.currentTime = audio.duration * setTime;
            }else if(setTime && setTime>=1 && setTime <= audio.duration){
                audio.currentTime = setTime;
            }
            if(setTime) audio.removeAttribute("data-time");

            let per = (audio.currentTime/audio.duration)*100;
            self.Dom.querySelector("[AudioPlayProcess]").style.width = per+"%";
            self.Dom.querySelector("[AudioTimeStatus]").innerHTML = self.config.strDuration? (self.format(audio.currentTime).join(":")) +"/"+ self.config.strDuration +"<span></span>" :"00:00<span></span>";
            //设置当前播放的时间"物理距离"到元素的data属性里（值）
            audio.setAttribute("data-currentTime",per);
            //播放完毕
            if(per >= 99.9){
                audio.currentTime = 0;
                audio.removeAttribute("data-currentTime");
                self.pause();
                // document.querySelector("[AudioCtrl] svg").innerHTML =  this.pauseIcon;
            }
            if(self.config.playing instanceof Function){
                self.config.playing(audio);
            }
        } )
    }
    //格式化时间为天，时，分，秒等，传入以秒为单位的时间戳
    format(t){

        let val = this.config.format? this.config.format.fill("00") : [];
        if( !t ) return val;

        //只能计算秒
        if(t <= 60){
            t = Math.floor(t);
            let r = ( t<10?("0"+t):t );

            val.length>0 ? val[val.length-1] = r : val.push(r);

        }else if(t < 3600){
            //多少分钟、秒数
            let m = Math.floor(t/60);
            let s = parseInt(t%60);
            if(val.length>0){
                val[val.length-2] = ( m );
                val[val.length-1] = ( s<10?("0"+s):s );
            }else{
                val.push( m );
                val.push(s<10?("0"+s):s);
            }
            // return {i:i<10?("0"+i):i, s:s<10?("0"+s):s };
        }else if(t >= 3600){
            //多少个小时、分钟、秒数
            let h = Math.floor( t/3600 );
            let m = Math.floor( (t%3600)/60 );
            let s = Math.floor( (t%3600)%60 );
            if(val.length>0){
                val[val.length-3] = ( h );
                val[val.length-2] = ( m );
                val[val.length-1] = ( s<10?("0"+s):s );
            }else{
                val.push(h);
                val.push(m);
                val.push(s<10?("0"+s):s);
            }
            //return {h, i:i<10?("0"+i):i, s:s<10?("0"+s):s};
        }
        this.config.format = val;
        return val ;
    }
}

export default class extends CreateDom {
    constructor(opt={}){
        super();
        //父类的this指向当前类this
        this.config = opt;
        super.dom();
        this.Dom.querySelector("[AudioCtrl]").addEventListener("click",()=>{
            if(this.audio.paused === true){
                this.play();
            }else{

                this.pause();
            }
        },false)


    }
    //t--指定播放时间 --- 小于 1 大于 0  表示精确到百分比   大于1表示精确到时间
    play(t=false){
        let self  = this;
        let res = self.audio.play() ;
            if(!self.audio.duration) self.Dom.querySelector("[AudioTimeStatus] span").innerHTML='正在缓冲~';
            if(t) self.audio.setAttribute("data-time",t);
            self.Dom.querySelector("[AudioCtrl] svg").innerHTML =  self.playIcon;
        // }
            res.then(msg=>{

            }).catch(msg=>{
                self.Dom.querySelector("[AudioCtrl] svg").innerHTML = self.pauseIcon;
                self.Dom.querySelector("[AudioTimeStatus]").innerHTML = "<span style='font-size:11px;'>数据或地址无效</span>"
            })

        // if(t) self.audio.setAttribute("data-time",t);
        // self.Dom.querySelector("[AudioCtrl] svg").innerHTML =  self.playIcon;

        // 所有功能必须包含在 WeixinApi.ready 中进行
        // if (window.WeixinJSBridge) {
        //     WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
        //         audio.play();
        //     }, false);
        // }else{
        //     audio.play();
        // }

    }
    pause(){
        //暂停并停止联网下载
        let audio =  this.audio;
        audio.pause();
        this.Dom.querySelector("[AudioCtrl] svg").innerHTML = this.pauseIcon;
    }
    touch(){
        var self = this;
        var moveDist = 0 , startX = 0 ,currentDist=0;
        var DrapDot = self.Dom.querySelector("[AudioDragDot]") || document.getElementById("_Audio_DragDot");

        DrapDot.addEventListener("touchstart",function(e){
            if(e.targetTouches.length > 0){
                moveDist = 0; //初始移动距离的计算
                startX = e.targetTouches[0].pageX;

                let ct = Number(self.audio.getAttribute("data-currentTime"));
                if( ct >-1 ){

                    currentDist = ct;

                    self.audio.removeAttribute("data-currentTime"); //卸载记录的当前时间物理距离（值）


                }
                //拖动的时候停止播放
                if(false === self.audio.paused){
                    self.pause();
                }
            }
        })
        DrapDot.addEventListener("touchmove",function(e){
            if(e.targetTouches.length>0){
                let w = document.querySelector("[AudioProcess]").clientWidth;
                //手指移动距离的百分比
                let mv = Math.round( (e.targetTouches[0].pageX - startX)/w *100 *1000 )/1000;

                if(moveDist >=0 && currentDist+mv >= 100){
                    currentDist = 99.5;
                    moveDist = 0;
                    mv=0;
                    return false;
                }
                if(moveDist <= 0 && currentDist+mv <= 0) {
                    currentDist = 0.5;
                    moveDist = 0;
                    mv=0;
                    return false;
                }

                self.Dom.querySelector("[AudioPlayProcess]").style.width = currentDist + mv +"%";
                moveDist = mv; //实时移动的百分比距离

            }
        })
        DrapDot.addEventListener("touchend",function(e){
            currentDist +=  moveDist;
            let t = (currentDist/100) //跳到指定播放的时间段
            //拖动结束重新播放,且拖动必须有一定距离
            if(self.audio.paused === true) self.play(t);
        })
    }

}
