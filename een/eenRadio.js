var _controller = ["$scope","$attrs","$element",function($scope,$attrs,$element){
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
        // console.log(this.querySelector(".check-false").style.display,"999");
        if($attrs.checkbox){
            if(this.querySelector(".check-false").style.display == "block" || this.querySelector(".check-false").style.display==false){
                this.querySelector(".check-false").style.display = "none";
                this.querySelector(".check-true").style.display = "block";
                $scope.ngModel = $scope.value || $attrs.value;
            }else{
                this.querySelector(".check-false").style.display = "block";
                this.querySelector(".check-true").style.display = "none";
                $scope.ngModel = "";
            }
            $scope.$parent.$apply();

            return false;
        }

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

var app = {};

if(window.angular){

app = angular.module("eenRadio",[]).directive("eenRadio",function(){
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
        controller:_controller,
    }
})

}

export default app;
