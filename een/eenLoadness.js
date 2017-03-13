let Controller = ["$scope","$element","$attrs", function(scope, element, attrs){
    // 特别提示:
    /* 在PC当窗口发生改变时，以下三个变量是变的
     * viewHeight  、  htmlHeight 、  scrollTop
     * 所以将其放入滚动事件中以获取实际的数值
     */
    window.addEventListener("scroll", function(){
        // 检测是否存在加载更多的标识元素
        let eleLoad = document.querySelector("[ele-eenLoadness]");
        if(!eleLoad)  return false;

        // 获取视区高度
        let viewHeight = Math.max(document.documentElement.clientHeight ,document.body.clientHeight);
        // 获取整个文档总高度
        let htmlHeight = Math.max(document.documentElement.scrollHeight ,window.pageYOffset ,document.body.scrollHeight);
        // 获取滚动条已滚动的高度
        let scrollTop = Math.max(document.documentElement.scrollTop ,window.pageYOffset ,document.body.scrollTop);

        // 计算因显示加载文字产生的文档最终高度，防止重复执行到达底部操作
        if(scope.lastHeight >= htmlHeight-(element[0].clientHeight/2)){
            return false;
        }

        // 计算文档是否到底部
        if(scrollTop + viewHeight == htmlHeight && scrollTop>0){

            element.css({display:"block"});

            // 因为显示了加载盒子，所以文档会因此会被撑高
            // 以此需要重新判断文档最终高度即scope.lastHeight的结果为最终文档高度
            scope.lastHeight = htmlHeight+element[0].clientHeight;

            // 判断是否存在加载函数并执行之
            if(attrs.onLoad){
              scope.onLoad();
              scope.$apply();
            }
        }
    },false)

    // 默认样式，如果指令上有style样式，则默认样式无效
    element.css({display:"none"});
    if(!attrs.style){
        element.css({
            display:"none",
            padding:".8rem 0 1rem",
            textAlign:"center",
            color:"#666",
        })
    }
}]

var app = {};
if(window.angular){
    var app = angular.module("eenLoadness",[]).directive("eenLoadness",function(){
        return {
            restrict:"EA",
            scope:{
              onLoad:"&",
            },
            replace:true,
            template:"<div ele-eenLoadness></div>",
            controller:Controller,
        }
    })
}
export default app;
