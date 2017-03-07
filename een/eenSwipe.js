
// function _controller($interval,$scope,$element){

var _controller = ['$interval','$scope','$element', function($interval,$scope,$element){
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
}]

function _link(s,e,a){
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

var app = {};

if(window.angular){


app = angular.module("eenSwipe",[]).directive("eenSwipe",function(){
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
                    <a   ng-href="{{v.link}}" target="{{v.target?v.target:'_self'}}" style="border:none;">
                    <img  ng-src="{{v.url}}" />
                      </a>
                </div>

            </div>

            <div ng-hide="loopHide" style="-webkit-transition:left 1s ease;
                        transition:left 1s ease;
                        width:{{wrapWidth*2}}rem;
                        height:{{wrapHeight}}rem;
                        overflow:hidden;
                        left:{{loopLeft}}rem;
                        z-index:886;
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
        controller:_controller,
        link:_link,
    }
})

}

export default app;
