// 列表中右对齐小三角形样式
var sanJiao = `
    position:absolute;
    right:0.3rem;
    top:40%;
    width:0;
    height:0;
    border-style:solid;
    border-width:.5rem;
    border-color:#999 transparent transparent;
`;
// 文本所选值的样式，主要作用溢出隐藏~~~
var textStyle = `
    position:absolute;
    top:50%;
    left:0;
    padding:0 1.5rem 0 .2rem;
    width:100%;
    -webkit-transform:translateY(-50%);
    transform:translateY(-50%);
    white-space:nowrap;
    text-overflow: ellipsis;
    font-size:inherit;
    overflow:hidden;
`;
// 指令控制器
var _controller = ["$element","$scope","$attrs","$window","$compile",function($element,$scope,$attrs,$window,$compile){
    // 附着指令的样式（默认）,如果指令上有style样式则会覆盖默认样式
    let eleStyle = 'position:relative;display:block;';

    // 控制器作用于两个指令，即指令eenDropdown（默认样式）和指令eenDropdownItself（自定义样式）
    if(!$attrs.$attr.eenDropdownItself){
      if($attrs.style)
        eleStyle += $attrs.style
      $element[0].setAttribute("style",eleStyle);
    }

    //如果没有传入options指令属性或者指令ngModel则中止执行代码
    // $scope.text显示给用户看到的值不代表实际意义上ngModel的值
    if(!$attrs.options || !$attrs.ngModel || typeof($scope.options)!='object'){
      $scope.text = "参数错误";
      return false;
    }

    // 通过ng-show指令来控制弹出、隐藏列表选项
    $scope.showList = false;

    // 计算生成的列表层所需的高度，计算为窗体高度的38%
    let lsH = Math.max(document.documentElement.clientHeight,document.body.clientHeight)*0.38+"px";

    // 列表选项样式（ul  li）
    let listStyle ='width:100%;position:fixed;z-index:88888889;background-color:#fefefe;height:'+lsH+';overflow:auto;left:0;bottom:0;'
    let itemStyle = `
        padding:1.2rem 1rem;
        text-align:center;
        font-size:1.6rem;
        line-height: normal;
        border-top:solid 1px #f2f2f2;
    `;

    // 背景遮罩，其可作用于点击背景隐藏列表选项
    let shadowStyle =`
      position:fixed;
      left:0;
      top:0;
      z-index: 88888888;
      background-color:rgba(0,0,0,0.5);
      height: 100%;
      width: 100%;
      display:none;
    `;

    // *函数* 使用DOM创建选项列表元素
    $scope.createList = data=>{
      let h = '';
      for(let v of data){
        if(v.name){
          v.name = v.name.replace(/</g,'&lt;');
          v.name = v.name.replace(/>/g,'&gt;');
        }else{
          v.name = v.value;
        }
        h+= '<li data-json='+JSON.stringify(v)+' style="'+itemStyle+'">'+v.name+'</li>';
      }
      return h;
    }


    // 在body中创建并使用列表选项，添加id并让其可在DOM中查找
    let shadowBox = document.createElement('div');
        shadowBox.setAttribute('style',shadowStyle);
        shadowBox.setAttribute("id","eenDropdown-shadowBox");
    if( !document.getElementById("eenDropdown-shadowBox") ){
        document.body.appendChild(shadowBox);
        $scope.elebox = document.getElementById("eenDropdown-shadowBox");
    }else{
      $scope.elebox = document.getElementById("eenDropdown-shadowBox");
    }

    // 监听 列表选项集合 是否发生变化
    // $scope.ngText可用在指令外部关联引用
    // $scope.text显示给用户看到的值不代表实际意义上ngModel的值
    $scope.$watch("options",function(n,o){
        if(n===o && typeof(n)!=="object") return false;
        // 循环查询对比 ngModel的值是否在options中匹配的到
        if(n && n instanceof Object){
          for(let v of n){
            if(v.value && v.value == $scope.ngModel){
              $scope.text = v.name || v.value;
              if($attrs.ngText)
                $scope.ngText = $scope.text;
            }
          }
        }else{
          $scope.text = "请选择";
        }
        if($attrs.ngText) $scope.ngText = $scope.text;
    })

    // 监听 列表所选值 是否被外界改变并作出相应的处理
    $scope.$watch("ngModel",function(n,o){
        if(n===o) return false;
        if(typeof($scope.options)=="object")
        {
          let is = false;
          for(let v of $scope.options){
            if(v.value == n ){
              if($attrs.ngText) $scope.ngText = v.name||v.value;
              $scope.text = v.name||v.value;
              is = true;
            }
          }
          if(is === false ){
            $scope.text = '请选择';
            if($attrs.ngText) $scope.ngText = $scope.text;
          }
        }else{
          if($attrs.ngText)
            $scope.ngText = $scope.text = '请选择';
          else
            $scope.text = '请选择';
        }
        if($attrs.onChange)  $scope.onChange();//值发生改变回调函数

    })

    // *函数* 弹出选项列表
    $scope.showLayer = ()=>{
      if($attrs.disabled===true) return false;
      //无列表值可选，拒绝弹出~~
      if(!$scope.options || !$scope.options.length){ return false ;}
      $scope.elebox.style.display = "block";
      let dataList = '<ul style="'+listStyle+'" >'+$scope.createList($scope.options)+'</ul>';
      $scope.elebox.innerHTML = dataList;

      //防止选项列表事件冒泡
      $scope.elebox.querySelector("ul").addEventListener("click",function(e){
        e.stopPropagation();
        e.preventDefault();
      })
      let items = $scope.elebox.querySelectorAll("ul > li");

      // 循环列表
      for(let dom of items){
        // 获取每个列表选择子dom并添加监听事件
        dom.addEventListener("click",function(e){
          let vs = JSON.parse(this.getAttribute("data-json"));
          $scope.elebox.style.display = "none";
          $scope.text = vs.name||vs.value;
          $scope.ngModel = vs.value;
          if(!vs.value) $scope.ngModel = vs.name;
          if(vs.value==='') $scope.ngModel = '';
          if($attrs.ngText){
            $scope.ngText = vs.name||vs.value;
          }
          $scope.$apply();
        },false)
      }
    }

    //关闭弹出层-事件-函数
    angular.element($scope.elebox).bind("click",function(){
      this.style.display = "none";
    })

    for(let v of $scope.options){
        if(v.selected){
            $scope.ngModel = v.value;
        }
    }
}]

var app = {};
if( window.angular ){

app = angular.module("eenDropdown",[]);

/* 创建列表选项指令一（系统默认选项样式）
 * 支持 EA 即属性指令和元素指令
 * scope.text  显示给用户的文字信息，不代表这个的值
 * scope.options  传入的指令列表，即可选选项
 * scope.ngModel  反馈给指令的值 ，真正的需要传递到后端的值
 * scope.ngText  指令外部可引用的真，比如需要在其他位置显示这个值
 * scope.onChange  选择列表值成功之后需要调用到此函数时所要执行的回调函数
 */
app.directive("eenDropdown",function(){
    return {
      restrict:"EA",
      replace:true,
      scope:{
          text:"@",  //默认显示内容
          options:"=",  //获取选择列表
          ngModel:"=",
          ngText:"=",
          onChange:"&", //选择成功之前回调这个结果对象
      },
      template : `
      <div ng-click="showLayer()">
        <div style="${sanJiao}"></div>
        <span ng-click="changeList($event)" style="${textStyle}">{{text?text:'请选择'}}</span>
      </div>
      `,
      controller:_controller
    }
});
// 创建列表选项指令二 （开发者可自定义的样式）。其他说明同上
app.directive("eenDropdownItself",function(){
  return {
    restrict:"EA",
    replace:true,
    scope:{
        text:"@",  //默认显示内容
        options:"=",  //获取选择列表
        ngText:"=",
        ngModel:"=",
        onChange:"=", //选择成功之前回调这个结果对象
    },
    transclude : true,
    template : '<div ng-transclude ng-click="showLayer()"></div>',
    controller:_controller
  }
})

}
export default app;
