// ;(function(window,angular){
// if(!angular) return false;
// })(window,window.angular)

/*
 *项目中需引入 ngResource、ngTouch   DI
 */
// import jieliu from "jieliu";
(function(window,angular){
if(!angular) return false;

angular.module("ng.een",["ngResource","ngTouch"])
/**** 实现无限级分类 ****
 *@AUTHOR LIUBIN
 *@return 返回两种格式
 *  第一种：返回对象树，有level字段关系
 *  第二种：返回列表队列，有level字段关系
 *@use   unlimit(array,boolean);
 *@note  array需要传入一个数组，并且存在有 id->parent_id（子父）关系，如果boolean为false表示不返回子父关系的数据对象，默认为true
 */
.factory("unlimit",[()=>{
    //如果在服务里声明一个变量，则该变量的数值会存在这个生命周期内，直到浏览器刷新！！！
    //开启无限递归模式
    let forFun = (oArray,zoverArray,level)=>{
        for(let k in oArray){
            //父数组
            if(!oArray[k]["nodes"]){
                oArray[k]["nodes"] = [];
            }
            let reArray = []; //重组数组
            let overArray = []; //剩下的数组
            for(let vv of zoverArray){  // 循环匹配是否存在子数组
                if(vv.parent_id == oArray[k].id){
                    vv.level = level;;
                    if(!vv.nodes){
                        vv.nodes = [];
                    }
                    reArray.push(vv);
                }else{
                    overArray.push(vv);
                }
            }
            //如果有子数据则录入给对应的父数组
            if( reArray.length > 0){
                //如果还有未分组的下级数组则继续循环分组
                if(overArray.length > 0 ){
                    oArray[k]["nodes"] = forFun(reArray,overArray,level+1);
                }else //没有了直接加入到父数组
                {
                    oArray[k]["nodes"] = reArray;
                }
            }
            //oArray[k]["level"] = level;

        }
        return oArray;
    }

    let forPush = (topArr,overArr,level)=>{
        let newArray = [];
        let maxLevel = 10;//限制循环次数，避免无限循环
        for(let k in topArr){
            newArray.push(topArr[k]);
            for(let [kk,vv] of overArr.entries() ){  // 循环匹配是否存在子数组
                if(vv.parent_id == topArr[k].id){
                    vv.level = level;
                    newArray.push(vv);
                    //forPush(topArr,overArr,level+1);
                    overArr.splice(kk,1); ///数组出栈
                }
            }
        }
        if(overArr.length > 0 && level < maxLevel){
            newArray = forPush(newArray,overArr,level+1);
        }
        return newArray;
    }

    let funs = (data,node=true)=>{
        if(!data)  return false;
        let topArray = [];
        let overArray = [];
        for(let v of data){
            if(v.parent_id == 0){
                v.level = 0; //等级标识
                topArray.push(v);
            }else{
                overArray.push(v);
            }
        }
        // console.log(overArray);
        if(node)
            return forFun(topArray,overArray,1)
        else
            return forPush(topArray,overArray,1);

    }

    return funs;

}])

/***** 友好弹出层 UI ****
 *
 */
 .service("eenher",["$rootScope","$compile","$timeout",function($rootScope,$compile,$timeout){

     let eenCss = `
         @-webkit-keyframes css-loading{
             0%,80%,100%{transform:scale(0); -webkit-transform:scale(0)}
             40%{transform:scale(1); -webkit-transform:scale(1)}
         }
         @keyframes css-loading{
             0%,80%,100%{transform:scale(0); -webkit-transform:scale(0)}
             40%{transform:scale(1); -webkit-transform:scale(1)}
         }
         #eenher-ELE-shadow{width:100%;height:100%;top:0;position:fixed;left:0;z-index:9999999;}
         #eenher-ELE-shadow .eenher-shadow{position:fixed;width:100%;height:100%;top:0;left:0;background-color:rgba(10,10,10,.6);z-index:9999990;}
         .eenher-layer {position:absolute;z-index:9999999;}
         .eenher-layer  i.circle{
             width:25px; height:25px; margin-left:8px; display:inline-block;
             background-color:#fff; border-radius:100%;
         }
         .eenher-layer i.circle{-webkit-animation: css-loading 1.4s infinite ease-in-out; animation: css-loading 1.4s infinite ease-in-out; -webkit-animation-fill-mode: both; animation-fill-mode: both;}

         .eenher-layer i.circle:first-child{margin-left:0; -webkit-animation-delay: -.32s; animation-delay: -.32s;}
         .eenher-layer i.circle.layui-m-layerload{-webkit-animation-delay: -.16s; animation-delay: -.16s;}

         `;
     document.querySelector("style")
     ?
     angular.element(document.querySelector("style")).append(eenCss.trim())
     :
     angular.element("head").append('<style type="text/css">'+eenCss+'</style>');
     //创建一个新的作用域
     let scope = $rootScope.$new(true);
     //编译一段html文本
     let herFunc = opt=>{
         if( !document.querySelector("#eenher-ELE-shadow") ){
             angular.element(document.body).append('<div id="eenher-ELE-shadow" ng-show="herHTML"></div>');
         }
         let tpl = "";
         let tplStyle = 'top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);';//垂直水平居中
         if(opt=="load"){
             //加载层
             tpl = '<i class="circle"></i><i class="layui-m-layerload circle"></i><i class="circle"></i>'
         }else if(typeof opt === "object" ){
             if(opt.type==1){
                 //提示层
                 tplStyle = 'width:80%;'+tplStyle+(opt.style||"");
                 tpl = '<div style="width:100%;color:#fff;background:#111;-webkit-border-radius:2%;border-radius:2%;padding:1.5rem 1rem;text-align:center;">'+(opt.content||"")+'</div>';
             }else if(opt.content){
                 tplStyle = opt.center!==false?tplStyle:"width:100%;";
                 tplStyle += opt.style||""; //允许修改样式
                 tpl = opt.content;
             }
         }
         //let compileTpl = $compile('<div class="eenher-shadow" ng-if="herHTML" ng-click="close()"><div class="eenher-layer">'+tpl+'</div></div>')(scope);
         //angular.element(document.querySelector("#eenher-ELE-shadow")).append(compileTpl);
         angular.element(document.querySelector("#eenher-ELE-shadow")).html( '<div class="eenher-shadow" ng-click="close()"></div><div  class="eenher-layer" style="'+tplStyle+'" >'+tpl+'</div>'　);
         //angular.element(document.querySelector("#eenher-ELE-shadow")).append(compileTpl);
         //console.log(angular.element(document.querySelector("#eenher-ELE-shadow")).contents());
         let compileTpl =  $compile( angular.element(document.querySelector("#eenher-ELE-shadow")) )(scope);
         //console.log(compileTpl);
         //angular.element(document.querySelector("#eenher-ELE-shadow")).append(compileTpl);

     }
     //方法->启用加载层
     this.load = ()=>{
         herFunc("load");
         //document.querySelector("#eenher-ELE-shadow").style.display = "block";
         scope.herHTML = true;
         //scope.$apply();
     }
     //方法->关闭加载层
     this.close = ()=>{
         scope.herHTML =  false;
         $timeout.cancel(scope.timeId);
     }
     this.popup = opt=>{
         //启用自定义弹出层
         herFunc(opt);
         scope.herHTML = true;
         if(typeof opt === "object" && opt.ctrl){
             opt.ctrl(scope);
         }
     }
     //弹出提示层
     this.notice = opt=>{
         scope.herHTML = true;
         if(typeof opt === "object"){
             opt.type = 1;
             herFunc(opt);
             scope.timeId = $timeout( ()=>{
                 scope.herHTML = false;
             } , opt.time ? opt.time*1000 : 3000 )
         }
     }
     //SCOPE作用域方法----------------
     scope.close = ()=>{
         //点击遮罩关闭层
         scope.herHTML = false;
         $timeout.cancel(scope.timeId);
     }
     // fun.$injector= ["h","m"];
 }])

/*
*
*/
.directive("weenCheckor",function(){
    return {
        restrict:"A",
        template:"",
        replace:false,
        scope:{
            opts:"=myCheckor",
            ngModel:"=ngModel",
            name:"@name",
            rule:"&rule"
        },
        require:"^novalidate",
        link:function($scope,$e,$attrs,$c){

            //值的正则验证规则
            $scope.rules = function(type){
                let bool = true;
                switch (type) {
                    case "mobile":
                        let reg = /^1(3|4|5|7|8)\d{9}$/;
                        if(!reg.test($scope.ngModel)){
                            bool = false;
                        }
                        break;
                    default:
                        //let __scope = $c.scope.$parent;
                        if( $scope.rule() != $scope.ngModel){
                            return false;
                        }
                        break;
                }
                return bool;
            }
            //初始化
            $c.ele.find("checkor-"+$attrs.name).css({"display":"none"});
            try{
                $c.ele[0].querySelector("checkor-"+$attrs.name+"["+$attrs.name+"]").style.display="inline-block";
            }catch(e){
                console.log("no ["+$attrs.name+"] dom");
            }

            $scope.checkFun = function(){

                //console.log("rule：",$scope.rule());
                $c.ele.find("checkor-"+$attrs.name).css({"display":"none"});

                //判断是否允许为空
                if(typeof($attrs.require) != "undefined"){
                    if(!$scope.ngModel){
                        try {
                            let obj = $c.ele[0].querySelector("checkor-"+$attrs.name+"[require]");
                                obj.style.display = "inline-block";
                                obj.style.color = "rgb(213, 52, 10)" ;
                        } catch (e) {}
                        return false;
                    }
                    //$c.ele[0].querySelector("checkor-"+$attrs.ngModel+"[phone]").style.display = "block";
                }
                //判断是否符合指定规则
                if($attrs.rule && $scope.ngModel){
                    if(false===$scope.rules($attrs.rule)){
                        let obj = $c.ele[0].querySelector("checkor-"+$attrs.name+"[rule]")
                            obj.style.display = "inline-block";
                            obj.style.color = "rgb(213, 52, 10)";
                        return false;
                    }
                }

                //验证通过
                try {
                    $e.attr("data-valid","true");
                    let obj = $c.ele[0].querySelector("checkor-"+$attrs.name+"[success]");
                        obj.style.display = "inline-block";
                        obj.style.color = "#4fad75";
                } catch (e) {
                    console.log("no dom");
                }


            }

            //失去焦点验证
            $e.bind("blur",$scope.checkFun)

        }
    }
})
/*
* ng指令扩展（contenteditable） wangEditor编辑器
*/
.directive('contenteditable', function() {
    return {
        restrict: 'A' ,
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            // 初始化 编辑器内容
            if (!ngModel) {
                return false;
            } // do nothing if no ng-model
            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };
            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                scope.$apply(readViewText);
            });
            // No need to initialize, AngularJS will initialize the text based on ng-model attribute
            // Write data to the model
            function readViewText() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            // 创建编辑器
            var editor = new wangEditor(element);
            // 上传图片
            editor.config.uploadImgUrl = '/upload';
            editor.config.uploadParams = {
                // token1: 'abcde',
                // token2: '12345'
            };
            editor.config.uploadHeaders = {
                // 'Accept' : 'text/x-json'
            }
            // editor.config.uploadImgFileName = 'myFileName';

            // 隐藏网络图片
            // editor.config.hideLinkImg = true;
            editor.config.zindex = 2000000;

            // 表情显示项
            editor.config.emotionsShow = 'value';
            editor.create();
        }
    };
})

/*
 * eenRadio  check-radio  UI
 * @AUTHOR LIUBIN
 * ng-name  指令值
 * name   属性值
 */
.directive("eenRadio",function(){
    return {
        restrict:"EA",
        replace:true,
        scope:{ngModel:"=ngModel",value:"=ngValue",ngName:"=",name:"@"},
        require: 'ngModel',
        template:`
        <div ng-style="ngStyle" class="radio-e{{name}}">
            <svg class="check-true" style="position:absolute;top:0;left:0;display:none;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
                <path fill="currentColor" d="M210.9952 210.9952C294.2976 127.6928 394.6496 85.9648 512 85.9648c117.2992 0 217.6512 41.6768 301.0048 124.9792C896.3072 294.3488 937.984 394.7008 937.984 512c0 117.3504-41.6768 217.7024-124.9792 301.0048C729.6512 896.3584 629.2992 937.984 512 937.984c-117.3504 0-217.7024-41.6256-301.0048-124.9792C127.6416 729.7024 86.016 629.3504 86.016 512 86.016 394.7008 127.6416 294.3488 210.9952 210.9952zM271.0016 752.9984c67.2768 67.328 147.6608 101.0176 240.9984 101.0176 93.2864 0 173.6704-33.6384 240.9984-101.0176 67.2768-67.2768 101.0176-147.6608 101.0176-240.9984 0-93.2864-33.6896-173.6704-101.0176-240.9984C685.6704 203.6736 605.2864 169.984 512 169.984c-93.3376 0-173.7216 33.6896-240.9984 101.0176C203.6736 338.3296 169.984 418.6624 169.984 512 169.984 605.3376 203.6736 685.6704 271.0016 752.9984zM361.0112 361.0112C402.9952 318.976 453.3248 297.984 512 297.984c58.6752 0 109.0048 20.992 150.9888 62.976S726.016 453.3248 726.016 512c0 58.6752-20.992 109.0048-62.976 150.9888s-92.3648 62.976-150.9888 62.976c-58.6752 0-109.0048-20.992-150.9888-62.976S297.984 570.6752 297.984 512C297.984 453.3248 318.976 402.9952 361.0112 361.0112z" ></path>
            </svg>
            <svg class="check-false" style="position:absolute;top:0;left:0;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
                <path fill="currentColor" d="M511.161912 62.442144c-247.808946 0-448.699302 200.889333-448.699302 448.698279 0 247.809969 200.890356 448.698279 448.699302 448.698279 247.807922 0 448.698279-200.887286 448.698279-448.698279C959.860191 263.331477 758.969834 62.442144 511.161912 62.442144zM511.161912 892.532783c-210.638371 0-381.394407-170.753989-381.394407-381.39236 0-210.636325 170.756035-381.393383 381.394407-381.393383 210.637348 0 381.393383 170.757059 381.393383 381.393383C892.555296 721.778794 721.79926 892.532783 511.161912 892.532783z"></path>
            </svg>
        </div>
        `.trim(),
        controller:["$scope","$attrs","$element",function($scope,$attrs,$element){
            let  {position} = document.defaultView.getComputedStyle($element[0]);
            if(position != "absolute") position = "relative";
            $scope.ngStyle = {position};
            $scope.color = "#ee732d";
            if($attrs.disabled == "disabled" || $attrs.disabled=="true"){
                return false;
            }
            if(!$attrs.ngModel) return false;
            //完全拒绝-----------end

            $element[0].querySelector(".check-true").style.color = $attrs.color || $scope.color; //默认选择赋值

            let rname = $scope.name || $scope.ngName;
                $element.attr("tag-name","erd"+rname);
            let radioDoms = document.querySelectorAll("[tag-name=erd"+rname+"]");    //默认获取同组radio元素
                if(!radioDoms || radioDoms.length < 1) return false;

            let isChecked = false;  //设定判断是否已经存在可选
            for(let i = radioDoms.length ;i > 0;i-- ){
                let cyDom = radioDoms[i-1].querySelector(".check-true");
                let cnDom = radioDoms[i-1].querySelector(".check-false");
                if( cyDom ){
                    if ( isChecked === true ){
                        cyDom.style.display =  "none";
                        cnDom.style.display = "block";
                        continue;
                    }
                    if(radioDoms[i-1].getAttribute("checked") == "checked" || radioDoms[i-1].getAttribute("checked") == "true"){
                        cyDom.style.display =  "block";
                        //radioDoms[i-1].querySelector(".check-true").style.color = $attrs.color || $scope.color;
                        cnDom.style.display = "none";
                        let cval = radioDoms[i-1].getAttribute("value") || $scope.$eval(radioDoms[i-1].getAttribute("ng-value"));
                        if(cval != $scope.ngModel){
                            $scope.ngModel =  cval;
                        }
                        isChecked = true;
                        //如果ng-value为假则使用break
                        if( !rname ) break;
                    }
                }
            }
            //
            //$scope.ngModel = $attrs.checked ? $scope.value : null;
            let ele = $element;
            // //判断在父层是否为LABEL，并为其添加事件
            if($element.parent()[0].tagName === "LABEL"){
                ele = $element.parent();
                //ele[0].style.paddingLeft = $element[0].clientWidth+"px";
                //$element[0].style.left = -$element[0].clientWidth+"px";
            }
            //单选事件
            ele.bind("click", function(e){
                //选项不可选
                if($attrs.disabled == "disabled" || $attrs.disabled=="true"){
                    return false;
                }
                // e.stopPropagation();
                let radioDoms = document.querySelectorAll("[tag-name=erd"+rname+"]");
                for(let v of  radioDoms){
                    if( v.querySelector(".check-false") ){
                        v.querySelector(".check-false").style.display = "block";
                        v.querySelector(".check-true").style.display = "none";
                    }
                }
                this.querySelector(".check-false").style.display = "none";
                this.querySelector(".check-true").style.display = "block";
                $scope.ngModel = $scope.value || $attrs.value;
                $scope.$parent.$apply();

            })
        }]

    }
})

/*
* 样式请使用ng-style
* SVG应用于图标，可通过样式（style,[class]）调节图标大小、颜色、尺寸 不建议使用类名
* 此指令主要得益于阿里icon,官方地址：http://www.iconfont.cn/plus
* 可下载阿里icon的图标为svg格式，将svg里的path写到指令的path参数里
* 多个path 请用 || 分隔传入 ; 内置有部分icon  可直接声明name参数即可
* 设置  width、height  属性为图标宽度、高度
* 设置 text（可以包含html） 属性为图标添加方案等
* viewBox 重新设定svg->view
* 例：<een-icon  path="M388.605134 900.834866m-51.726082…… || M388.605134…… 900.834866m-51.7260"></een-icon>
*/
.directive("eenIcon",function(){
    return {
        restrict:"EA",
        replace:true,
        scope:{
            name:"@name",
            path:"@path",
            text:"@text",
            width:"@width",
            height:"@height",
            box:"@viewbox",
        },
        template:`
        <div>
            <div style="width:{{width}};height:{{height||width}};{{cell}};position:relative;">
                <svg  style="position:absolute;top:0;left:0;" xmlns="http://www.w3.org/2000/svg" version="1.1" ></svg>
            </div>
            <section style="white-space:nowrap;{{cell}}"></section>
            <div style="height:0;width:100%;overflow:hidden;clear:both;"></div>
        </div>
        `.trim(),
        controller:["$scope","$element","$attrs",function($scope,$element,$attrs){
            // let  {display} = document.defaultView.getComputedStyle($element[0]);
            // let pstr = "";
            // if($attrs.style){
            //      pstr = $attrs.style.replace(/:/g,':"');
            //      pstr = pstr.replace(/;/g,'";');
            // }
            // console.log(pstr);
            let style = {} ;
            if($attrs.ngStyle)
                style =  eval('(' + $attrs.ngStyle + ')');

            if( !/display/.test($attrs.style) || /display:table/.test($attrs.style) || style.display =="table" ){
                $element[0].style.display = "table";
                $scope.cell = "display:table-cell";
            }
            //svg Path代码
            let svgpath = "";
            switch ($scope.name) {
                case "shop-car":    //购物车
                    svgpath = 'M388.605134 900.834866m-51.726082 0a50.548 50.548 0 1 0 103.452163 0 50.548 50.548 0 1 0-103.452163 0ZM821.897537 900.835889m-51.727105 0a50.549 50.549 0 1 0 103.45421 0 50.549 50.549 0 1 0-103.45421 0ZM863.097892 761.79109c-0.037862 0-0.076748 0-0.115634 0l-496.037447 1.824555-15.790638-1.700735c-5.079692-2.163269-27.458375-14.721283-35.709293-70.319555l-63.657832-478.475466c0.002047-0.76748-0.014326-1.538029-0.069585-2.315742-3.672646-51.243081-25.151843-80.298837-42.523489-95.649454-19.508309-17.240663-38.558178-21.790282-42.178635-22.528086-1.954515-0.398066-3.942799-0.603751-5.937223-0.617054l-63.24237-0.38681c-0.064468 0-0.127913 0-0.192382 0-16.866133 0-30.591739 13.621229-30.695093 30.510898-0.103354 16.954137 13.556761 30.783097 30.510898 30.886451l58.843176 0.360204c6.652514 2.557242 24.226774 12.107759 31.423687 43.074028 0.044002 0.765433 0.107447 1.532913 0.210801 2.304486l66.675562 501.158071c0.019443 0.144286 0.038886 0.287549 0.060375 0.431835 15.637142 106.007359 77.626985 120.631428 84.643796 121.95047 0.788969 0.148379 1.584078 0.265036 2.382257 0.350994l20.366863 2.193968c1.092891 0.11768 2.190899 0.177032 3.288906 0.177032 0.036839 0 0.073678 0 0.110517 0l497.742275-1.830695c16.954137-0.063445 30.648021-13.857613 30.586622-30.81175C893.731586 775.461437 879.99984 761.79109 863.097892 761.79109zM952.421266 292.251134c8.058536-35.101449 4.076852-64.312748-11.891841-86.917582-22.965038-32.509415-60.684104-36.037774-64.909335-36.33351-0.74599-0.052189-1.503237-0.079818-2.238994-0.074701l-521.552563 1.664919c-16.954137 0.054235-30.655184 13.842263-30.600949 30.797423 0.054235 16.95516 13.834076 30.68179 30.797423 30.600949l519.833409-1.659803c2.460028 0.420579 13.036921 2.662643 18.522865 10.429537 3.538593 5.009084 5.03876 12.558014 4.527107 22.01234-0.275269 1.058099-0.499373 2.140757-0.664126 3.246951l-2.176572 14.661931c-0.309038 1.25048-0.639566 2.517333-0.997724 3.804652-0.937348 3.371794-1.263783 6.767124-1.063215 10.075473l-37.120432 250.000867c-0.428765 1.575892-0.743944 3.202948-0.920976 4.879124-4.958942 46.840818-25.684986 52.697199-28.92989 53.328579l-404.592758 36.367279c-16.886599 1.517563-29.345352 16.437367-27.827789 33.323966 1.433652 15.953344 14.82566 27.952632 30.540573 27.952632 0.919952 0 1.850138-0.040932 2.783393-0.124843l405.007197-36.405141c4.903683-0.433882 22.982434-3.013637 41.557488-17.937534 10.81123-8.685823 23.471574-23.048949 32.396851-46.207391 3.054569-3.993964 5.17179-8.79327 5.962805-14.118556L952.421266 292.251134z';
                    break;
                case "arrow-left":
                    svgpath = 'M740.856291 80.585363c-14.364149-14.470573-37.731346-14.57802-52.240805-0.180102L281.024441 484.302171c-7.272637 7.198959-10.92891 16.724917-10.92891 26.216081 0 9.373485 3.583618 18.785855 10.708899 25.983791 0.147356 0.147356 0.333598 0.186242 0.478907 0.332575 0.591471 0.630357 0.738827 1.441838 1.364067 2.068102L686.547385 946.499905c14.364149 14.470573 37.7293 14.57802 52.240805 0.218988 14.470573-14.396895 14.57802-37.7293 0.218988-52.239781L358.955348 510.99716l381.674792-378.208854C755.100714 118.42825 755.174392 95.096868 740.856291 80.585363L740.856291 80.585363zM740.856291 80.585363';
                    break;
                case "arrow-right":
                    svgpath = 'M778.752 479.092364 383.511273 83.828364c-18.176-18.176-47.639273-18.176-65.815273 0-18.176 18.176-18.176 47.639273 0 65.815273L680.005818 512 317.672727 874.333091c-18.176 18.176-18.176 47.639273 0 65.815273 9.099636 9.099636 20.992 13.637818 32.907636 13.637818s23.808-4.538182 32.907636-13.637818l395.240727-395.240727C796.928 526.731636 796.928 497.268364 778.752 479.092364z';
                    break;
                case "dot-more":
                    svgpath = 'M476 410C422.980666 410 380 452.980666 380 506 380 559.019334 422.980666 602 476 602 529.019334 602 572 559.019334 572 506 572 452.980666 529.019334 410 476 410zM804 416C750.980672 416 708 458.980666 708 512 708 565.019334 750.980672 608 804 608 857.019328 608 900 565.019334 900 512 900 458.980666 857.019328 416 804 416zM160 418C106.980666 418 64 460.367878 64 512 64 563.632122 106.980666 606 160 606 213.019334 606 256 563.632122 256 512 256 460.367878 213.019334 418 160 418z';
                    break;
                default:
					svgpath = $scope.path;
                    break;
            }
            if(!svgpath) return false;

			let pathes = svgpath.split("||"); //分割path路径，存在多个path的情况
			let pathtml = "";
			pathes.map( v=>{
				pathtml += '<path d="'+v+'" fill="currentColor"></path>';
			} )
            $element.removeAttr("path");
            $element.find("section").html($scope.text||"");

            $element.find("svg").attr('viewBox',$scope.box?('0 0 '+$scope.box):"0 0 200 200");
            $element.find("svg").html('<g class="transform-group"><g transform="scale(0.1953125, 0.1953125)"> '+pathtml+' </g></g>');
        }]
    }
})

/**
* @dec 表单数据加减，有加减按钮
* @params
* --height  定义区域高度
* --width   定义区域宽度，为一般为高度的三倍
* note:针对数值要做狠多的判断，累的我都饿了（ >_< ）
**/
.directive("eenNumctrl",function(){
	return {
		restrict:"EA",
		replace:false,
		scope:{
			height:"@",  //高度，长度
			width:"@",  //高度，长度
			max:"@" ,  //最大值
			min:"@",    //最小值,
			def:"@",     //  默认值
			ngModel:"=",
            disabled:"@",
		},
		//require:"^ngModel",
		template:`
		<div style="position:relative; display:inline-block;text-align:center;">
			<div ng-click="addNum()" style="border-left:solid 1px #AAA;
				width:{{height}};height:{{height}};
				line-height:{{height}};
				position:absolute;right:0;top:0;">+</div>
			<div ng-click="reduceNum()" style="border-right:solid 1px #AAA;
						width:{{height}};height:{{height}};
						line-height:{{height}};
						position:absolute;left:0;top:0;" >-</div>
			<input type="text" ng-blur="changeNum()" ng-model="nums" style="border:solid 1px #AAA;
				padding:0 {{height}};color:#888;
				text-align:center;width:{{width}};
				height:{{height}};box-sizing:border-box;" />
		</div>
		`,
		controller:["$scope",function($scope){

		}],
		link:function(scope,e,a,m){
            if(scope.disabled) return false;
			(scope.nums = parseInt(scope.ngModel) || parseInt(scope.def) || parseInt(scope.min) || 0);
			if(a.ngModel){
				scope.ngModel = scope.nums;
			}
			//判断scope.def是否为数字，否则scope.def = 0;
			if( !/^\-?[0-9]+$/.test(scope.def) ){
				scope.def = 0;
			}
			//判断scope.max是否为数字，否则scope.max = false
			if( !/^\-?[0-9]+$/.test(scope.max) ){
				scope.max = false;
			}
			//判断scope.min是否为数字，否则scope.min = false
			if( !/^\-?[0-9]+$/.test(scope.min) ){
				scope.min = false;
			}
			console.log(scope.min,scope.max);
			//在输入框输入值并失去焦点时触发
			scope.changeNum = ()=>{
				//匹配输入的是否为数字
				if( !/^\-?[0-9]+$/.test(scope.nums) ){
					scope.nums = scope.def || scope.min || 0;
				}else{
					//判断scope.max是否为数字，匹配输入的是否大于最大限制
					if( scope.max!==false && parseInt(scope.nums) > parseInt(scope.max) ){
						console.log("比较最大");
						scope.nums = scope.max;
					}
					//判断scope.min是否为数字,匹配输入的是否小于最小限制
					if( scope.min!==false && parseInt(scope.nums) < parseInt(scope.min) ){
						console.log("比较最小");
						scope.nums = scope.min;
					}
				}
				if(a.ngModel){
					scope.ngModel = parseInt(scope.nums);
				}
			}
			//往上加 1
			scope.addNum  = ()=>{
				if(scope.max!==false　&& scope.max <= scope.nums) return false;
				scope.nums += 1
				if(a.ngModel){
					scope.ngModel = scope.nums;
				}
			}
			//住下减 1
			scope.reduceNum  = ()=>{
				if(scope.min!==false &&　scope.min >= scope.nums) return false;
				scope.nums -= 1
				if(a.ngModel){
					scope.ngModel = scope.nums;
				}
			}
		}
	}
})


/*dropdownDirective 下拉菜单选项
 *@AUTHOR LIUBIN
 *@params
 *  ng[@text]
 *  ng[=options]
 *  ng[=ngModel]
 */
.directive("eenDropdown",[function(){

    return {
        restrict:"EA",
        replace:true,
        scope:{
            text:"@",  //默认显示内容
            options:"=",  //获取选择列表
            ngModel:"=",
            onChange:"&", //选择成功之前回调这个结果对象
        },
        template:`
        <div  ng-style="eleStyle"  >
                <div ng-style="sanStyle"></div>
                <span ng-click="changeList($event)" ng-style="textStyle">{{text?text:'请选择'}}</span>

                <ul class="eenDropdown-list8800"  ng-style="listStyle">
                    <li ng-style="itemStyle" ng-click="select(v)" ng-repeat="v in options track by $index">{{v.name}}</li>
                </ul>
        </div>
        `.trim(),
        controller:["$element","$scope","$attrs","$window",function($element,$scope,$attrs,$window){
            if(!$attrs.options) return false;   //绝对拒绝
            if(!$attrs.ngModel) return false;   //绝对拒绝
            $scope.options = $scope.options || [];

            let {position,display,height,width,paddingRight} =document.defaultView.getComputedStyle($element[0]);

            $scope.eleStyle = { position:position=="static"?"relative":position,display:display||"block" }

            $scope.$watch("options",function(n,o){
                if(!n || !n.length){
                    $element[0].querySelector(".eenDropdown-list8800").style.display = "none";
                    $scope.text = "请选择";
                }
            })

            //递归获取元素距离顶部位置
            $scope.offsetTop = function( elements ){
                var top = elements.offsetTop;
                var parent = elements.offsetParent;
                while( parent != null ){
                    top += parent.offsetTop;
                    parent = parent.offsetParent;
                };
                return top;
            };

            window.rollbar ={}    //全局存储回滚变量
            //弹出列表
            $scope.changeList = (e)=>{
                e.stopPropagation();

                if(!$scope.options || !$scope.options.length){ return false ;}
                let dom = document.querySelectorAll(".eenDropdown-list8800");
                for(let vs of dom){
                    vs.style.display = "none";
                }

                e.target.nextElementSibling.style.display = "block";

                let offsetTop  = $scope.offsetTop($element[0]);
                //该元素滚动位置
                window.rollbar ={
                    top: Math.max(document.body.scrollTop , document.documentElement.scrollTop),
                    tTop: offsetTop - 60 ,
                }
                //获取该下拉距离头部的位置
                document.body.scrollTop = document.documentElement.scrollTop = offsetTop - 60;
            }

            document.documentElement.style.cursor = "pointer"; //针对Iphone，点击文档元素不成功解决方案
            angular.element(document).unbind("click") //防止多次绑定，以最后一次绑定为准
            angular.element(document).bind("click",function(e){
                //关闭弹出层sa
                let dom = document.querySelectorAll(".eenDropdown-list8800");
                for(let vs of dom){
                    vs.style.display = "none";
                }

                if(window.rollbar.top == window.rollbar.tTop) {return false;}

                e.stopPropagation();e.preventDefault();
                //document.body.scrollTop = document.documentElement.scrollTop = window.rollbar.top;
                window.rollbar.tTop = window.rollbar.top;

            })

            for(let v of $scope.options){
                if(v.selected){
                    $scope.ngModel = v.value;
                    //self.ngGet(v.value); //获取值，外层函数调用
                }
            }
            $scope.select = data=>{
                $scope.text = data.name;
                $scope.ngModel = data.value;
                $scope.listShow = !$scope.listShow;

                if($attrs.onChange){
                    $scope.onChange({data}) //选择成功后调回函数
                }
            }
            $scope.textStyle = {
                position:"relative",
                lineHeight:height||$element[0].clientHeight+"px",
                width:($element[0].clientWidth-parseInt(paddingRight)*2)+"px",
                paddingRight:paddingRight,
                whiteSpace:"nowrap",
                textOverflow: "ellipsis",
                display:"block",
                overflow:"hidden",
            }
            $scope.sanStyle = {
                position:"absolute",
                right:".7rem",
                width:"0",
                top:"50%",
                WebkitTransform:"translateY(-50%)",
                transform:"translateY(-50%)",
                height:"0",
                borderTop:"solid .4rem #666",
                borderRight:"solid .4rem transparent",
                borderLeft:"solid .4rem transparent",
            }
            $scope.listStyle = {
                position:"absolute",
                zIndex:"898989",
                backgroundColor:"#fcfcfc",
                display:"none",
                height:Math.max(document.documentElement.clientHeight,document.body.clientHeight)*0.45+"px",
                overflow:"auto",
                top:height,
                left:"0",
                minWidth:"100%",
                maxWidth:"200%",
                boxShadow:"0 0px 7px #ccc",
                marginBottom:"2rem",
            }
            $scope.itemStyle = {
                padding:".8rem 1rem",
                textAlign:"center",
                fontSize:"1.6rem",
                borderTop:"solid 1px #f5f5f5",
            }
        }]
    }
}])


/*
 * 轮播 AUTHOR - LIUBIN
 * for angular1.5.8  Directive  eenSwipe [EA]
 * @param array[=list]   播放列表
 * @time  int[@time]     循环间隔时间 单位：s
 * <een-swipe een-swipe list="$ctrl.slider" time="6"></een-swipe>
 */
.directive("eenSwipe",function(){
    return {
        restrict:"EA",
        replace:true,
        scope:{
            dataList:"=list",
            opts:"=params", //传入配置参数
            time:"@",
        },
        template:`
        <div ng-style="eleStyle" ng-swipe-left="swipeLeft()" ng-swipe-right="swipeRight()">
            <div ng-hide="wrapHide" style="-webkit-transition:all 1s ease;transition:all 1s ease;
                        width:{{wrapWidth*len}}rem;
                        height:{{wrapHeight}}rem;
                        top:0;
                        left:{{absLeft}}rem;
                        position:absolute;
                        z-index:888" >
                <div ng-repeat="v in dataList" style="float:left;width:{{wrapWidth}}rem;">
                    <a ng-href="{{v.link}}" target="{{v.target?v.target:'_self'}}" style="border:none;"><img  ng-src="{{v.url}}" /></a>
                </div>
            </div>

            <div ng-hide="loopHide" style="-webkit-transition:left 1s ease;
                        transition:left 1s ease;
                        width:{{wrapWidth*2}}rem;
                        height:{{wrapHeight}}rem;
                        overflow:hidden;
                        left:{{loopLeft}}rem;
                        z-index:888;
                        position:absolute;top:0;">
                <img ng-repeat="vv in loopList" style="float:left;width:{{wrapWidth}}rem;" ng-src="{{vv.url}}" />
            </div>

            <div ng-style="pageStyle">
                <svg ng-click="touchTaget($index)"  ng-style="v" ng-repeat="v in cStyle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
                    <path d="M530.432 517.632m-423.424 0a82.7 82.7 0 1 0 846.848 0 82.7 82.7 0 1 0-846.848 0Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>
        `.trim(),
        controller:["$interval","$scope","$element",function($interval,$scope,$element){
            $scope.interval = $interval;
            $scope.time = (parseInt($scope.time) || 6) * 1000;

            //点击圆点切换轮播
            $scope.touchTaget = i=>{
                //$scope.wrapTransition = '-webkit-transition:all 1s ease;transition:all 1s ease';
                $interval.cancel($scope.intervalId);
                $scope.imgNum = i;
                $scope.absLeft = -$scope.wrapWidth*($scope.imgNum);
                $scope.cStyle.map( k=>{
                    k.color = "rgba(30,30,30,.8)";
                } )
                $scope.cStyle[$scope.imgNum].color = "rgb(35, 111, 224)";
                $scope.intervalId=$interval( $scope.loopfun,$scope.time );
            }

            //  手指左滑
            $scope.swipeLeft = ()=>{
                if($scope.imgNum==$scope.len) return false;
                //$scope.wrapTransition = '-webkit-transition:all 1s ease;transition:all 1s ease';
                $interval.cancel($scope.intervalId);
                $scope.absLeft = -$scope.wrapWidth*($scope.imgNum);
                $scope.imgNum += 1;
                $scope.cStyle.map( k=>{
                    k.color = "rgba(30,30,30,.8)";
                } )
                $scope.cStyle[$scope.imgNum-1].color = "rgb(35, 111, 224)";
                $scope.intervalId=$interval( $scope.loopfun,$scope.time );
            }

            // 手指右滑
            $scope.swipeRight = ()=>{
                if($scope.imgNum==1) return false;
                //$scope.wrapTransition = '-webkit-transition:all 1s ease;transition:all 1s ease';
                $interval.cancel($scope.intervalId);
                $scope.absLeft += $scope.wrapWidth;
                $scope.imgNum -= 1;
                $scope.cStyle.map( k=>{
                    k.color = "rgba(30,30,30,.8)";
                } )
                $scope.cStyle[$scope.imgNum-1].color = "rgb(35, 111, 224)";
                $scope.intervalId=$interval( $scope.loopfun,$scope.time );
            }

        }],
        link:function(s,e,a){
            e.removeAttr("style");
            e.css({
                "position":"relative",
                "overflow":"hidden",
            });
            let fontSize = document.documentElement.style.fontSize ||　"100%";
            let baseNum = fontSize.replace("%","")/100*16; //计算根目录字体大小，将实际像素宽度转换为rem单位
            s.wrapWidth = e[0].clientWidth/baseNum;
            s.wrapHeight = e[0].clientHeight/baseNum;
            s.wrapZindex = 10;
            s.len = 0;

            //默认轮播位置， 以正整数计算
            s.imgNum = 1;
            s.$watch("dataList",function(nv,ov){
                s.dataList = nv;
                if(typeof nv == "object" && nv.length>0){
                    s.len = nv.length;
                    if(s.len < 2 ) return false;   //如果轮播图片等于一张，则不进入自动轮播
                    s.absLeft = 0;
                    s.wrapTransition = '-webkit-transition:all 1s ease;transition:all 1s ease';
                    s.intervalId = s.interval( s.loopfun, s.time);
                    //用于无平滑重复轮播
                    s.loopList = []

                    s.cStyle = [];
                    for(let v in s.dataList){
                        s.cStyle[v] = {
                            width:"1rem",
                            height:"1rem",
                            margin:"0 .5rem",
                            //display:"inline-block",
                            color:(v>0?"rgba(30,30,30,.8)":"rgb(35, 111, 224)"),
                            //border:"solid 1px #111",
                        }
                    }
                }
            })

            s.loopfun = ()=>{
                let i=s.imgNum;
                    i++;

                if(i > s.len){
                    s.absLeft=0;
                    s.wrapTransition = '-webkit-transition:all .2s ease;transition:all .2s ease'
                    i=1;
                }else{
                    s.wrapTransition = '-webkit-transition:all 1s ease;transition:all 1s ease';
                    s.absLeft = -s.wrapWidth*s.imgNum;
                }
                s.cStyle.map( k=>{
                    k.color = "rgba(30,30,30,.8)";
                } )
                try {
                    s.cStyle[i-1].color = "rgb(35, 111, 224)";
                } catch (e) {

                }
                s.imgNum = i; //当前轮播位置
                //console.log(s.absLeft,s.imgNum);
            }

            s.pageStyle = {
                position:"absolute",
                bottom:"1rem",
                left:"50%",
                transform:"translateX(-50%)",
                zIndex:"899",
            }

        }
    }
})

/*
 * 文档到达底部加载更多数据 AUTHOR - LIUBIN
 * on-load 调用外部函数
 * on-stop  是否停止加载数据 true  false
 */
.directive("eenLoadness",["$window",function($window){
    return function(scope, element, attrs){
        element.css({
            display:"none",
            padding:"1.2rem 0",
            textAlign:"center",
            color:"#666",
        })
        let html = "正在加载，请骚等~";//2016-12-5新增
        if(attrs.html)  html = attrs.html; //2016-12-5新增
        //element.html(html);//2016-12-5新增
        //提示:在PC当窗口发生改变时，以下三个变量是变的，所有将其放入滚动事件中以避免加载失败
        window.onscroll = function(){
            //查找是否存在een-loadness文档元素，以判定是否执行请求更多操作
            if(!document.body.querySelector("[een-loadness]") && !document.body.querySelector("een-loadness")){
                console.log("没有找到插件引擎");
                window.onscroll = function(){}
                return false;
            }

            //视区高度
            let viewHeight = Math.max(document.documentElement.clientHeight ,document.body.clientHeight);
            //完整文档总高度
            let htmlHeight = Math.max(document.documentElement.scrollHeight ,window.pageYOffset ,document.body.scrollHeight);
            //滚动高度
            let scrollTop = Math.max(document.documentElement.scrollTop ,window.pageYOffset ,document.body.scrollTop);

            //2016-12-5 新增此处,删除了on-stop判断
            if(scope.lastHeight >= htmlHeight-(element[0].clientHeight/2)){
                //2016-12-10修复clientHeight出现小数位数导致判断失败
                if(attrs.endHtml)
                    element.html(attrs.endHtml);
                return false;
            }

            //计算文档是否到底部
            if(scrollTop + viewHeight == htmlHeight && scrollTop>0){
                //element.html(htmlHeight+";ch:"+element[0].clientHeight+"croptop:"+scrollTop);
                element.css({
                    display:"block"
                })
                scope.lastHeight = htmlHeight+element[0].clientHeight; //2016-12-5新增,最终文档高度
                console.log("到达文档底部",htmlHeight,scope.lastHeight);
                let a = scope.$eval(attrs.onLoad);
                ///scope.$apply();
            }
        }
    }
}])

/* uriProvider for $resource
 * @AUTHOR   LIUBIN
 * @params
 *  --action(url,params);
 *       url=>传入api地址 （String）
 *       params => 传入query参数字符串（object[boolean]） 如果传入true或者params.layer=true表示弹出ui-layer层
 *  --close();  //关闭 ui-layer层
 *  --auth()    //认证服务
 */
.provider("uri",["$httpProvider",function($hp){
    this.config = {
        host : "http://127.0.0.1",
        fix : "",
    }

    //配置auth认证方法
    this.auth = ()=>{

    }

    this.$get = ["$resource","eenher",function($rs,eh){
        let {host,fix} = this.config;
        let conf = {
            host:this.config.host,
            fix:this.config.fix,
            cache:true,  //是否请求缓存
            transform:false,  //转换post请求为form格式
        };
        return {
            action:(url,params)=>{
                console.log(conf,"98989");
                if(!url) return false; //不允许传入空值
                if( /^http(s)?:\/\//.test(url) ) conf.host = "" ; //判断url 是否带有http://
                if( params === true || (typeof params === "object" && params.layer===true )  ){
                    eh.load(); //此处需要eenher服务支持
                }
                return $rs( (conf.host + url + conf.fix) ,params,{
                    'update': {method:"PUT" },
                    'get':    {method:'GET',cache:conf.cache },
                    'save':   {method:'POST',cache:conf.cache },
                    'query':  {method:'GET', isArray:true,cache:conf.cache},
                    'remove': {method:'DELETE' },
                    'delete': {method:'DELETE'},
                    'jsonp' : {method:'JSONP',format: 'json',id:'1',callback : "JSON_CALLBACK",isArray:false},
                })
            },
            close(){
                eh.close();
            },
            //只对当前操作有效的配置（临时配置）
            config(c = {}){
                Object.assign(conf,c);
            },
            auth(){

            }
        }
    }];


}])


/*
 * @params
 *    .link：被签名地址， 以get方式传入后台
 *    .url : 获取签名的api地址
 *@sdata  分享什么的的信息自定义
 */
.provider("wxjdk",["$httpProvider",function($h){
    this.signUrl = 'http://wechat.qiyoon.com/public/index.php/index/jdk' ;  //获取签名的api地址
    this.jsApiList = [
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        'onMenuShareQQ'
    ];  //授权列表
    this.debug = false;
    //this.backName = "JSON_CALLBACK";
    this.$get = ["$resource",function($rs){
        //http://res.wx.qq.com/open/js/jweixin-1.1.0.js
        if(!wx) return false; //如果没有引入微信js则返回fals
        let self = this;
        return {
            config(params,sdata={},target){
                console.log("参数22",params);
                let url = self.signUrl;
                $rs(url,{ }, {

                    'jsonp' : {method:'JSONP', params: {callback: 'JSON_CALLBACK'},isArray:false},

                } ).jsonp(params||"").$promise.then(data=>{
                    //console.log(jsonpReturn());
                    wx.config({
                        debug: self.debug,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList:self.jsApiList,
                    });

                    console.log("微信",wx);
                },msg=>{
                    console.log("获取微信签名失败，网络错误");
                });

                wx.ready(function(){
                    wx.onMenuShareTimeline({
                        title: sdata.title,
                        link: sdata.link,
                        imgUrl: sdata.imgUrl,
                        success: function () {
                            // alert('分享成功');
                        },
                        cancel: function () {
                            // alert('分享失败');
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: sdata.title,
                        desc: sdata.desc,
                        link: sdata.link,
                        imgUrl: sdata.imgUrl,
                        type: 'link',
                        dataUrl: '',
                        success: function () {
                            // alert('分享成功');
                        },
                        cancel: function () {
                            // alert('分享失败');
                        }
                    });

                    wx.onMenuShareQQ({
                        title: sdata.title,
                        desc: sdata.desc,
                        link: sdata.link,
                        imgUrl: sdata.imgUrl,
                        success: function () {
                           // alert('分享成功');
                        },
                        cancel: function () {
                           // alert('分享失败');
                        }
                    });


                })

            }
        }
    }]
}])

})(window,window.angular)
