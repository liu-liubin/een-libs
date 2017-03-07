/* 移动端提示弹窗插件
 * 示例1：--------提示层
 * uri.notice({
     content:'提示信息',
     shadow:false|true ,  //是否允许点击遮罩层关闭
     end:function(){}   //层关闭回调函数
   })
 * 示例2----------按钮层
 * uri.confirm({
     content:"提示信息",
     yes:(scope)=>{
       scope.close();
     },
     no:(scope)=>{
       scope.close();
     },
     shadow,           //是否允许点击遮罩层关闭
   })
   -scope 回调参数，当前作用域
   -yes *回调* 点击确认按钮
   -no  *回调* 点击取消按钮
 */

let _service =["$rootScope","$compile","$timeout", function($rootScope,$compile,$timeout){
    let eenCss = `
        @-webkit-keyframes css-loading{
            0%,80%,100%{transform:scale(0);-webkit-transform:scale(0)}
            40%{transform:scale(1); -webkit-transform:scale(1)}
        }
        @keyframes css-loading{
            0%,80%,100%{transform:scale(0); -webkit-transform:scale(0)}
            40%{transform:scale(1); -webkit-transform:scale(1)}
        }

        #eenher-ELE-shadow{width:100%;height:100%;top:0;position:fixed;left:0;z-index:9998888;}
        #eenher-ELE-shadow .shadow-close{position:absolute;width:200%;height:200%;top:-50%;left:-50%;background-color:rgba(0,0,0,.8);z-index:9999888;}
        #eenher-ELE-shadow .eenher-layer{width:100%;position:absolute;left:50%;top:50%;-webkit-transform:translate3d(-50%,-50%,0);transform:translate3d(-50%,-50%,0);z-index:9999988;}
        #eenher-ELE-shadow .eenher-layer i.circle{width:22px; height:22px; margin-left:8px; display:inline-block;background-color:#fff;-webkit-border-radius:100%; border-radius:100%;}
        #eenher-ELE-shadow .eenher-layer i.circle{-webkit-animation: css-loading 1.4s infinite ease-in-out; animation: css-loading 1.4s infinite ease-in-out; -webkit-animation-fill-mode: both; animation-fill-mode: both;}
        #eenher-ELE-shadow .eenher-layer i.circle:first-child{margin-left:0; -webkit-animation-delay: -.32s; animation-delay: -.32s;}
        #eenher-ELE-shadow .eenher-layer i.circle.m-layerload{-webkit-animation-delay: -.16s; animation-delay: -.16s;}

        `;
    document.querySelector("style")
    ?
    angular.element(document.querySelector("style")).append(eenCss.trim())
    :
    angular.element("head").append('<style type="text/css">'+eenCss+'</style>');
    //创建一个新的作用域
    let scope = $rootScope.$new(true);
    scope.opts = {};
    //SCOPE作用域方法-----点击事件遮罩关闭层---c 是否可点击关闭--t是否强制关闭弹出层
    scope.close = t=>{
        if(scope.opts.shadow===false && t!==true) return false;
        scope.herHTML = false;
        //if(document.querySelector("[wrapper]"))
        //    document.querySelector("[wrapper]").removeAttribute("style");
        if(document.querySelector("#eenher-ELE-shadow  .shadow-close"))
            document.querySelector("#eenher-ELE-shadow  .shadow-close").removeEventListener("touchmove",noscroll,false)
        //document.removeEventListener("touchmove",noscroll,false); //卸载滑动事件
        $timeout.cancel(scope.timeId);
        // 是否有添加关闭回调函数 end
        if(scope.opts.end  && scope.opts.end instanceof Function){
            scope.opts.end();
        }
    }
    scope.confirm = x=>{
      scope.opts.shadow = true;
      if(scope.opts.yes && x=="yes") scope.opts.yes(scope);
      if(scope.opts.no && x=="no") scope.opts.no(scope);
    }

    //是否禁用滑动事件函数
    let noscroll = function(e){
        e.stopPropagation();
        e.preventDefault();
    }
    //生成并编译一段html文本（弹出层）
    // opt == "load"  =>  执行加载层
    // opt.type === 1    =>   弹出提示层
    // opt.type === 2       =>  [取消,确认]
    let herFunc = opt=>{
        scope.opts = opt;
        if( !document.querySelector("#eenher-ELE-shadow") ){
            angular.element(document.body).append('<div id="eenher-ELE-shadow" ng-show="herHTML"></div>');
        }

        let [tpl, ,myTpl,boxStyle] = ["","",""]; //可传入style属性编辑当前层级的样式

        if(opt=="load"){
            //加载层
            tpl = '<div style="text-align:center;"><i class="circle"></i><i class="m-layerload circle"></i><i class="circle"></i></div>';

        }else if( opt instanceof Object ){
            if(opt.style) boxStyle = opt.style; //剥夺默认样式
            if(opt.type === 1){
                scope.opts.shadow = false;
                // 显示提示层-----------
                tpl = '<div style="width:80%;margin:0 auto;color:#666;background:#fff;-webkit-border-radius:.65rem;border-radius:.65rem;padding:2rem 1rem;font-size:1.4rem;text-align:center;">'+opt.content+'</div>';

            }else if(opt.type === 2){
                scope.opts.shadow = false;
                let btnS = 'position:absolute;bottom:0;padding:.6rem 0;text-align:center;background-color:#1583FF;color:#fff;width:50%;';
                tpl = `
                  <div style="width:60%;margin:0 auto;color:#333;position:relative;
                            background:#fff;-webkit-border-radius:.65rem;border-radius:.65rem;
                            padding:2.6rem 1rem;font-size:1.5rem;text-align:center;">
                            ${opt.content||"确认或取消？"}
                    <div style="height:3rem;"></div>
                    <div ng-click="confirm('no',$event)" style="${btnS};left:0;-webkit-border-radius:0 0 0 .65rem;border-radius:0 0 0 .65rem">取消</div>
                    <div ng-click="confirm('yes',$event)" style="${btnS};right:0;-webkit-border-radius:0 0 .65rem 0;border-radius:0 0 .65rem 0;border-left:solid 1px #fff;background-color:#EEE;color:#1583FF;">确定</div>
                  </div>
                `
            }else if(opt.content){
                // 显示自定义层------------
                tpl = opt.content;
            }
        }
        if(!myTpl) myTpl = '<div  class="eenher-layer" style="'+boxStyle+'" >'+tpl+'</div>';
        //let compileTpl = $compile('<div class="eenher-shadow" ng-if="herHTML" ng-click="close()"><div class="eenher-layer">'+tpl+'</div></div>')(scope);
        //angular.element(document.querySelector("#eenher-ELE-shadow")).append(compileTpl);
        //生成带遮罩的层样式--遮罩可点击
        angular.element(document.querySelector("#eenher-ELE-shadow")).html(
            '<div class="shadow-close" ng-click="close()"></div>'+
            '<div '+(boxStyle?('style="z-index:9999998;position:relative;'+boxStyle+'""'):'class="eenher-layer"')+ ' >'+tpl+
            '</div>'　
        );
        //console.log(angular.element(document.querySelector("#eenher-ELE-shadow")).contents());
        //编译成ng认可的语法结构
        $compile( angular.element(document.querySelector("#eenher-ELE-shadow")) )(scope);

        document.querySelector("#eenher-ELE-shadow  .shadow-close").addEventListener("touchmove",noscroll,false)
    }
    //方法->启用加载层
    this.load = ()=>{
        scope.herHTML = true;
        herFunc("load");
        //document.querySelector("#eenher-ELE-shadow").style.display = "block";

        //scope.$apply();
    }

    this.popup = opt=>{
        scope.herHTML = true;
        //启用自定义弹出层
        herFunc(opt);
        if(typeof opt === "object"){
          if(opt.ctrl)
            opt.ctrl(scope);
        }
    }

    //确认层
    this.confirm = opt=>{
      if( !(opt instanceof Object) ) opt = {};
      scope.herHTML = true;
      opt.type = 2;
      herFunc(opt);
      if(opt.ctrl){
        opt.ctrl(scope);
      }
      // scope.cancel();
      // scope.submit();
    }

    //弹出提示层--携带自动关闭
    this.notice = opt=>{
        scope.herHTML = true;
        if(opt instanceof Object){opt.type = 1;opt.shadow=false;}
        else opt={type:1,content:"操作提示"}

        herFunc(opt);
        scope.timeId = $timeout( ()=>{scope.opts.shadow=true;scope.close();} , opt.time ? opt.time*1000 : 2600 );
    }
    //ng服务方法->关闭加载层
    this.close = scope.close;

}]
var app = {};

if(window.angular){
    app = angular.module("eenher",[]).service("eenher", _service);
}

export default app;
