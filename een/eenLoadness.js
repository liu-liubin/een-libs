/* 2016-12-22  优化修改 */
/* 示例：<een-loadness on-load="$ctrl.loadmore()"></een-loadness>
 * on-load  *函数*  滚动到底部执行的代码，一般为资源请求函数
 * 默认--------------------------
 * 样式：
 element.css({
     display:"none",
     padding:".8rem 0 1rem",
     textAlign:"center",
     color:"#666",
 })
 */

// 获取可见区域高度
// const viewH = Math.max(document.documentElement.clientHeight ,document.body.clientHeight);
// window.addEventListener("scroll", function(){
//   let eleLoad = document.querySelector("[een-loadness]");
//   if(!eleLoad){
//     return false;
//   }
//   // 获取滚动条已滚动的高度
//   let scrollTop = Math.max(document.documentElement.scrollTop ,window.pageYOffset ,document.body.scrollTop);
//   // 获取文档的高度，需在文档渲染完整后获取到正确的值
//   let eleH = Math.max(document.documentElement.scrollHeight ,window.pageYOffset ,document.body.scrollHeight);
//   // 判断是否滚动到底部
//   if(scrollTop + viewH == eleH && scrollTop>0){
//     eleLoad.style.display = "block"
//     console.log("滚动到底部",eval(eleLoad.getAttribute('on-load')));
//   }
// }, false)

let _controller =["$scope","$element","$attrs", function(scope, element, attrs){

    //提示:在PC当窗口发生改变时，以下三个变量是变的，所有将其放入滚动事件中以避免加载失败
    let Scroll = function(){
        // 检测是否存在加载更多的标识元素
        let eleLoad = document.querySelector("[een-loadness]");
        if(!eleLoad){
          return false;
        }

        //视区高度
        let viewHeight = Math.max(document.documentElement.clientHeight ,document.body.clientHeight);
        //完整文档总高度
        let htmlHeight = Math.max(document.documentElement.scrollHeight ,window.pageYOffset ,document.body.scrollHeight);
        //滚动高度
        let scrollTop = Math.max(document.documentElement.scrollTop ,window.pageYOffset ,document.body.scrollTop);

        // 2016-12-5 新增此处,删除了on-stop判断，
        // 计算因显示加载文字产生的文档最终高度，防止重复执行到达底部操作
        if(scope.lastHeight >= htmlHeight-(element[0].clientHeight/2)){
            //2016-12-10修复clientHeight出现小数位数导致判断失败
            return false;
        }

        //计算文档是否到底部
        if(scrollTop + viewHeight == htmlHeight && scrollTop>0){
            element.css({display:"block"});
            scope.lastHeight = htmlHeight+element[0].clientHeight; //2016-12-5新增,最终文档高度
            if(attrs.onLoad){
              scope.onLoad();
              scope.$apply();
            }
        }
    }
    element.css({display:"none"});
    if(!attrs.style){
        element.css({
            display:"none",
            padding:".8rem 0 1rem",
            textAlign:"center",
            color:"#666",
        })
    }
    window.removeEventListener("scroll",Scroll);
    window.addEventListener("scroll", Scroll, false)
}]
var app = {};
if(window.angular){
    // console.log("【eenLoadness】此指令由EEN开发——作者LIUBIN");
    var app = angular.module("eenLoadness",[]).directive("eenLoadness",function(){
        return {
            restrict:"EA",
            scope:{
              onLoad:"&",
            },
            replace:true,
            template:"<div ></div>",
            controller:_controller,
        }
    })
}
export default app;
