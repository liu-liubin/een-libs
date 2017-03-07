;(function(window,angular){
if(!angular) return false;

function _link(scope,e,a,m){
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

// var $injector = angular.injector();
angular.module("eenNumctrl",[]).directive("eenNumctrl",function(){
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
        link:_link,
    }
})

})(window,window.angular)
