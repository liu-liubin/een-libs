var _controller = ["$scope","$attrs","$element",function($scope,$attrs,$element){

    // radio的样式-----------
    let itrue = 'M896 0 128 0C57.6 0 0 57.6 0 128l0 768c0 70.4 57.6 128 128 128l768 0c70.4 0 128-57.6 128-128L1024 128C1024 57.6 966.4 0 896 0zM844.8 396.8l-345.6 345.6c-12.8 12.8-25.6 19.2-44.8 19.2-19.2 0-32-6.4-44.8-19.2L243.2 569.6C230.4 556.8 224 537.6 224 524.8c0-19.2 6.4-32 19.2-44.8 25.6-25.6 64-25.6 89.6 0l128 128 300.8-300.8c25.6-25.6 64-25.6 89.6 0 12.8 12.8 19.2 25.6 19.2 44.8C864 364.8 857.6 384 844.8 396.8z';
    let ifalse = 'M890.4 8 133.6 8C64.4 8 8 64.2 8 133.6l0 756.7C8 959.6 64.2 1016 133.6 1016l756.7 0c69.3 0 125.6-56.2 125.6-125.6L1015.9 133.6C1016 64.4 959.8 8 890.4 8zM953 889.6c0 35-28.3 63.4-63.4 63.4L134.4 953c-35 0-63.4-28.3-63.4-63.4L71 134.4c0-35 28.3-63.4 63.4-63.4l755.1 0c35 0 63.4 28.3 63.4 63.4L952.9 889.6z';
    // checkbox的样式--------------
    if(typeof $attrs.checkbox === "undefined"){
      itrue = 'M512 512m-292.571429 0a4 4 0 1 0 585.142857 0 4 4 0 1 0-585.142857 0ZM512 1024c-285.257143 0-512-226.742857-512-512 0-285.257143 226.742857-512 512-512s512 226.742857 512 512C1024 797.257143 797.257143 1024 512 1024zM512 73.142857C270.628571 73.142857 73.142857 270.628571 73.142857 512c0 241.371429 197.485714 438.857143 438.857143 438.857143s438.857143-197.485714 438.857143-438.857143C950.857143 270.628571 753.371429 73.142857 512 73.142857z';
      ifalse = 'M512 0C229.2 0 0 229.2 0 512c0 282.8 229.2 512 512 512 282.8 0 512-229.2 512-512C1024 229.2 794.8 0 512 0zM512 960C264.6 960 64 759.4 64 512 64 264.6 264.6 64 512 64c247.4 0 448 200.6 448 448C960 759.4 759.4 960 512 960z';
    }

    $element.html(`
    <svg check-true style="display:none;float:left;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
        <path fill="currentColor" d="${itrue}" ></path>
    </svg>
    <svg check-false style="float:left;"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
        <path fill="currentColor" d="${ifalse}"></path>
    </svg>
    `);

    // 选中及非选中的状态样式
    $element[0].querySelector("[check-false]").style.color = $scope.blur || "";
    $element[0].querySelector("[check-true]").style.color = $scope.focus || $scope.blur;

    // 判断指令上是否设置选项为不可选
    if($attrs.disabled == "disabled" || $attrs.disabled=="true"){
        return false;
    }

    // 设置同组选项，以name方式分组
    let rname = $attrs.name || $scope.ngName || ( $element[0].hasAttribute("checkbox")?"checkbox" : "radio" );
        $element.attr("name","erd"+rname);
    let radioDoms = document.querySelectorAll("[name=erd"+rname+"][checked]"); //默认获取同组radio元素


    // 指令编译时，确认是否为选中状态 ，并判断之且赋值
    $attrs.$observe('checked', function(newValue){
      // 判断是否默认被选中
      if(newValue === "true" || newValue==="checked"){
        $element[0].querySelector("[check-false]").style.display = "none";
        $element[0].querySelector("[check-true]").style.display = "block";
        $element[0].setAttribute("checked","checked");
        let tval = $scope.$eval($attrs.value) || $attrs.value || true;
        if( $attrs.checkbox ){
          $scope.ngModel[$attrs.checkbox] = tval;
          let alltrue = true;
          $scope.ngModel.map( v=>{
            if(!v) alltrue = false;
          } )
          if(alltrue===true) {
            document.querySelector("#allctrl_erd"+rname).setAttribute("checked","checked");
            document.querySelector("#allctrl_erd"+rname).querySelector("[check-false]").style.display = "none";
            document.querySelector("#allctrl_erd"+rname).querySelector("[check-true]").style.display = "block";
          }
        }else{
          $scope.ngModel = tval;
        }
      }
    });


    let ele = $element;
    // 判断在父层是否为LABEL，并为其添加事件
    if($element.parent()[0].tagName === "LABEL"){
        ele = $element.parent();
        ele.css({
          "display":"flex",
          "align-items":"center",
        })
    }
    // 判断是否存在全选指令属性
    if( $element[0].hasAttribute("allctrl") ){
      ele[0].setAttribute("id","allctrl_erd"+rname);
      ele[0].setAttribute("allctrl","");
    }


    // 如果没有绑定指令值则不执行以下代码
    if(!$attrs.ngModel) return false;

    ele.bind("click", function(e){
      //选项不可选
      if($attrs.disabled == "disabled" || $attrs.disabled=="true"){
          return false;
      }

      // 复选--- 且checkbox属性值必须有数值，作为复选框数组下标
      if(typeof $attrs.checkbox !== "undefined"){
        let self = this;

        $scope.$parent.$apply(function(){
          if( $scope.ngModel instanceof Array ===false ) $scope.ngModel = [];


          if( self.getAttribute("checked") == "checked" ){
            self.setAttribute("checked","");
            // 全选控制按钮 --- 全不选操作
            if( self.hasAttribute("allctrl") ){
              Array.from(document.querySelectorAll("[name=erd"+rname+"]"),(ele,k)=>{
                ele.querySelector("[check-false]").style.display = "block";
                ele.querySelector("[check-true]").style.display = "none";
                ele.setAttribute("checked","")
                if(!ele.hasAttribute("allctrl")){
                  let ckey = parseInt(ele.getAttribute("checkbox"));
                  $scope.ngModel[ckey] = $scope.ngModel[ckey]===true?false:"";
                }
              })
            }else{
              let ckey = parseInt($element[0].getAttribute("checkbox"));
              let value = "" ;
              if($scope.ngModel[ckey]===true) value = false;

              self.querySelector("[check-false]").style.display = "block";
              self.querySelector("[check-true]").style.display = "none";

              $scope.ngModel[ckey] = value;

              document.querySelector("#allctrl_erd"+rname).removeAttribute("checked");
              document.querySelector("#allctrl_erd"+rname).querySelector("[check-false]").style.display = "block";
              document.querySelector("#allctrl_erd"+rname).querySelector("[check-true]").style.display = "none";
            }

          }else{
            self.setAttribute("checked","checked");

            // 全选控制按钮 --- 全选操作--------
            if( self.hasAttribute("allctrl") ){
              Array.from(document.querySelectorAll("[name=erd"+rname+"]"),(ele,k)=>{
                ele.querySelector("[check-false]").style.display = "none";
                ele.querySelector("[check-true]").style.display = "block";
                ele.setAttribute("checked","checked");
                // 过 滤allctrl全选按钮
                if(!ele.hasAttribute("allctrl")){
                  let ckey = parseInt(ele.getAttribute("checkbox"));
                  $scope.ngModel[ckey] = $scope.$eval(ele.getAttribute("value")) || ele.getAttribute("value") || true;
                }
              })
            }else{

              let value = $scope.$eval($attrs.value) || $attrs.value || true;
              // if(!value) $scope.value = value = true;
              self.querySelector("[check-false]").style.display = "none";
              self.querySelector("[check-true]").style.display = "block";


              let ckey = parseInt($element[0].getAttribute("checkbox"));
              $scope.ngModel[ckey] = value;
              let alltrue = true;
              $scope.ngModel.map( v=>{
                if(!v) alltrue = false;
              } )
              if(alltrue===true){
                document.querySelector("#allctrl_erd"+rname).setAttribute("checked","checked");
                document.querySelector("#allctrl_erd"+rname).querySelector("[check-false]").style.display = "none";
                document.querySelector("#allctrl_erd"+rname).querySelector("[check-true]").style.display = "block";
              }
            }


          }

        })
        return false;
      }

      // 单选
      Array.from(document.querySelectorAll("[name=erd"+rname+"]"), (v,k)=>{
        v.querySelector("[check-false]").style.display = "block";
        v.querySelector("[check-true]").style.display = "none";
      })
      this.querySelector("[check-false]").style.display = "none";
      this.querySelector("[check-true]").style.display = "block";
      // 主动更新
      $scope.$parent.$apply(function(){
        $scope.ngModel = ($scope.value || $attrs.value) || !$scope.ngModel ;
      })
    })
}]

var app = {};

/*
 * 特别注意：
 *   如果是复选项，value是ng变量，需要使用value={{val}},而非ng-value=val
 */

if(window.angular){

  app = angular.module("eenRadio",[])
  .directive("eenRadio",["$parse",function($parse){
      return {
          restrict:"EA",
          replace:true,
          scope:{
            ngModel:"=",
            value:"=ngValue", //如果是ng变量请用ng-value
            ngName:"=", //如是是ng变量请用ng-name
            focus:"@focusColor",
            blur:"@blurColor",
          },
          require: 'ngModel',
          template:'<div></div>',
          controller:_controller,
          link:function(scope,ele,attr){
            // 判断解析checkbox属性值是否为NaN
            if( typeof(attr.checkbox) !== 'undefined' ){
              if( scope.ngModel instanceof Array ===false ) scope.ngModel = [];
              if( isNaN( parseInt(attr.checkbox) ) !==true ){
                scope.ngModel[parseInt(attr.checkbox)] = attr.value || true;
              }
            }

          }
      }
  }])

}

export default app;
