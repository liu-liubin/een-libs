//选择三角形
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
//显示文本样式，主要作用溢出隐藏~~~
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
var _controller = ["$element","$scope","$attrs","$window","$compile",function($element,$scope,$attrs,$window,$compile){
    let eleStyle = 'position:relative;display:block;';
    //判断如果不是自定义选项样式，则添加默认样式优先
    if(!$attrs.$attr.eenDropdownItself){
      if($attrs.style)
        eleStyle += $attrs.style
      $element[0].setAttribute("style",eleStyle);
    }
    //绝对拒绝
    if(!$attrs.options || !$attrs.ngModel){
      $scope.text = "参数错误";
      return false;
    }
    $scope.options = $scope.options || [];
    $scope.showList = false;
    //生成列表html
    let lsH = Math.max(document.documentElement.clientHeight,document.body.clientHeight)*0.38+"px";
    //列表盒子样式
    let listStyle ='width:100%;position:fixed;z-index:88888889;background-color:#fefefe;height:'+lsH+';overflow:auto;left:0;bottom:0;'
    //列表盒子选项条目样式
    let itemStyle = `
        padding:1.2rem 1rem;
        text-align:center;
        font-size:1.6rem;
        line-height: normal;
        border-top:solid 1px #f2f2f2;
    `;
    //遮罩
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

    //创建选项列表
    $scope.createList = data=>{
      let h = '';
      for(let v of data){
        if(v.name){
          v.name = v.name.replace(/</g,'&lt;');
          v.name = v.name.replace(/>/g,'&gt;');
        }
        h+= '<li data-json='+JSON.stringify(v)+' style="'+itemStyle+'">'+v.name+'</li>';
      }
      return h;
    }


    //生成一个列表盒子，body里
    let shadowBox = document.createElement('div');
        shadowBox.setAttribute('style',shadowStyle);
        shadowBox.setAttribute("id","eenDropdown-shadowBox");
    if( !document.getElementById("eenDropdown-shadowBox") ){
        document.body.appendChild(shadowBox);
        $scope.elebox = document.getElementById("eenDropdown-shadowBox");
    }else{
      $scope.elebox = document.getElementById("eenDropdown-shadowBox");
    }

    //监听 列表 是否发生变化---------
    $scope.$watch("options",function(n,o){
        if(n===o && typeof(n)!=="object") return false;
        //如果ngModel有值 则选中
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
    // 监听受外部影响改变值
    $scope.$watch("ngModel",function(n,o){
        if(n===o) return false;
        if(typeof($scope.options)=="object")
        {
          let is = false;
          for(let v of $scope.options){
            if(v.value == n ){
              if($attrs.ngText) $scope.ngText = v.name||v.value;  //外部关联显示名称（用于外部其他地方引用）
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

    //弹出列表
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
      for(let dom of items){
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
          // if($attrs.onChange){
          //   $scope.onChange(vs);
          // }
          $scope.$apply();
        },false)
      }
      // $element[0].querySelector(".eenDropdown-list8800").style.display = "block";
      // $element[0].querySelector(".eenDropdown-list8800-shadow").style.display = "block";
      // $scope.showList = !$scope.showList;
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
