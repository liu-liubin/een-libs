
var app = {};
if(window.angular){
app = angular.module("attrStyle",[])
//属性设置元素位置
.directive("eCoordinate",function(){
    return {
        link:function(scope,ele,attr){
            let [position,_s,_c] = ["relative",{},attr.eCoordinate];
            if(!_c) return false;
            if(/abs/.test(_c)) position = "absolute";
            if(/x/.test(_c) )
                _s = {
                    left:"50%",
                    WebkitTransform:"translate3d(-50%,0,0)",
                    position,
                }
            if(/y/.test(_c) )
                _s = {
                        top:"50%",
                        WebkitTransform:"translate3d(0,-50%,0)",
                        position,
                    }
            if(/xy/.test(_c) )
                _s = {
                        top:"50%",
                        left:"50%",
                        WebkitTransform:"translate3d(-50%,-50%,0)",
                        position,
                    }
            ele.css(_s);
            // {
            //     ele.css({
            //         left:"50%",
            //         WebkitTransform:"translate3d(-50%,0,0)",
            //         position,
            //     })
            // }else if (/y/.test(attr.coordinate)) {
            //     ele.css({
            //         top:"50%",
            //         WebkitTransform:"translate3d(-50%,0,0)",
            //         position,
            //     })
            // }
        }
    }
})
// <div e-radius="[宽度,高度,]半径"></div>
// 升级指令
// <div e-radius="r1,r2,r3,r4,width,height" ></div>分别设定4个角，有宽高
// <div e-radius="r1,width,height" ></div> 设定所有角，有宽高
// <div e-radius="r1,r2,r3,r4" ></div> 分别设置4个角  无宽高
// <div e-radius="r1" ></div>  设置所有角  无宽高
.directive("eRadius",function(){
    return {
        link:function(scope,ele,attr){
            if(!attr.eRadius) return false;
            let [r,d] = [attr.eRadius, attr.eRadius.split(",")];
            if(d.length == 1)
              ele.css({WebkitBorderRadius:d[0]});
            else if(d.length == 4)
              ele.css({
                WebkitBorderTopLeftRadius:d[0],
                WebkitBorderTopRightRadius:d[1],
                WebkitBorderBottomRightRadius:d[2],
                WebkitBorderBottomLeftRadius:d[3],
              });
            else if(d.length == 6)
              ele.css({
                width:d[4],
                height:d[5],
                WebkitBorderTopLeftRadius:d[0],
                WebkitBorderTopRightRadius:d[1],
                WebkitBorderBottomRightRadius:d[2],
                WebkitBorderBottomLeftRadius:d[3],
              })
            else
                ele.css({width:d[1],height:d[2],WebkitBorderRadius:d[0]});
        }
    }
})

// 兼容方法——字体居中
.directive('eTxtMid',function(){
  return {
    replace:false,
    template:'<div style="-webkit-transform:translateY(-50%);transform:translateY(-50%);top:50%;position:relative;" ng-transclude><div>',
    transclude: true,
    link:function(scope,ele,attr){}
  }
})

// 设置元素外边距或内边距 e-spacing="内,外"  ;
.directive('eSpacing',function(){
  return {
    link:function(scope,ele,attr){
      if(!attr.eSpacing) return false;
      let v = attr.eSpacing.split(",");
      if(v[0]){
        ele.css({padding:v[0]})
      }
      if(v[1]) ele.css({margin:v[1]});
    }
  }
})

//  表单弹出选择
.directive('eDatalist',["$compile",function($compile){
  return {
    restrict:"A",
    scope:{
      data:"=eDatalist",
      onChange:'&',
      ngModel:"=ngModel",
    },
    link:function(scope,ele,attr){
      if(!attr.eDatalist) return false;
      let tpl = `
      <ul ng-mouseenter="mouseOver()" ng-show="disShow" style="max-height:20rem;overflow:auto;position:absolute;background-color:#fff;border:solid 1px #eee;z-index:9898;padding:0 1rem;">
        <li style="padding:.35rem 0;max-width:16rem;" ng-click='setVal(v)' ng-repeat="v in data track by $index" ng-bind="v"></li>
      <ul>
      `
      ele.after($compile(tpl)(scope));

      let watches = scope.$watch("data",function(n,o){
        if(typeof(n) == 'object' && n.length>0){
          scope.disShow = true;
        }else{
          scope.disShow = false;
        }
      })
      // 点击列表项并赋值
      scope.setVal = v=>{
        if(!v) return false;
        watches = null;
        scope.ngModel = v;
        scope.disShow = false;
        setTimeout(function(){if(attr.onChange) scope.onChange();})
      }
      // 输入框获取焦点弹出已有列表
      ele.bind("focus",function(){
        scope.disShow =  true;
        scope.$apply();
      })
      // 输入框失去焦点隐藏弹窗列表
      ele.bind("blur",function(){
        // 事件延时处理！
        setTimeout(function(){
          scope.disShow = false;
          scope.$apply();
        })
      })
    }
  }
}])

.directive('freeLayout',[function(){
  return {
    restrict:'A',
    // controller:["$scope","$element","$attrs",function($scope,$element,$attrs){
    //   console.log($scope.$last);
    //   if ($scope.$last === true) {
    //     console.log("999");
    //   }
    //   // let items = $element[0].querySelectorAll('.item')
    //   // // console.log(items);
    //   // for(let v of items){
    //   //   console.log(v);
    //   // }
    // }],
    link: function (scope, element, attr) {
      // if(scope.$last === true){
      let eleWidth = element[0].clientWidth;
      scope.$on("itemFinished",function(){
        let items = element[0].querySelectorAll('['+attr.freeLayout+']')
        let i = 0;
        let itemTW = 0;
        for(let k in items){
          setTimeout(function(){
            itemTW += items[k].clientWidth;
            // console.log(itemTW);
            if(itemTW > eleWidth)
              items[k].style.margin = 0;
          })
        }
        // let times = setInterval(function(){
        //   if(!items[i]){
        //     clearInterval(times);
        //     return false;
        //   }else{
        //     itemTW += items[i].clientWidth;
        //     console.log(itemTW);
        //     if(itemTW > eleWidth)
        //       items[i].style.margin = 0;
        //   }
        //   i++;
        //   console.log(items[i]);
        // })
      })
    }
  }
}])
.directive('freeItem',[function(){
  return {
    restrict:'A',
    link: function (scope, element, attr) {
      if(scope.$last === true){
        scope.$emit("itemFinished")
      }
    }
  }
}])

}

export default app;
