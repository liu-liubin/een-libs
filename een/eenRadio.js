var _controller = ["$scope","$attrs","$element",function($scope,$attrs,$element){
    let itrue = 'M896 0 128 0C57.6 0 0 57.6 0 128l0 768c0 70.4 57.6 128 128 128l768 0c70.4 0 128-57.6 128-128L1024 128C1024 57.6 966.4 0 896 0zM844.8 396.8l-345.6 345.6c-12.8 12.8-25.6 19.2-44.8 19.2-19.2 0-32-6.4-44.8-19.2L243.2 569.6C230.4 556.8 224 537.6 224 524.8c0-19.2 6.4-32 19.2-44.8 25.6-25.6 64-25.6 89.6 0l128 128 300.8-300.8c25.6-25.6 64-25.6 89.6 0 12.8 12.8 19.2 25.6 19.2 44.8C864 364.8 857.6 384 844.8 396.8z';
    let ifalse = 'M890.4 8 133.6 8C64.4 8 8 64.2 8 133.6l0 756.7C8 959.6 64.2 1016 133.6 1016l756.7 0c69.3 0 125.6-56.2 125.6-125.6L1015.9 133.6C1016 64.4 959.8 8 890.4 8zM953 889.6c0 35-28.3 63.4-63.4 63.4L134.4 953c-35 0-63.4-28.3-63.4-63.4L71 134.4c0-35 28.3-63.4 63.4-63.4l755.1 0c35 0 63.4 28.3 63.4 63.4L952.9 889.6z';
    if(typeof $attrs.checkbox === "undefined"){
      itrue = 'M512 512m-292.571429 0a4 4 0 1 0 585.142857 0 4 4 0 1 0-585.142857 0ZM512 1024c-285.257143 0-512-226.742857-512-512 0-285.257143 226.742857-512 512-512s512 226.742857 512 512C1024 797.257143 797.257143 1024 512 1024zM512 73.142857C270.628571 73.142857 73.142857 270.628571 73.142857 512c0 241.371429 197.485714 438.857143 438.857143 438.857143s438.857143-197.485714 438.857143-438.857143C950.857143 270.628571 753.371429 73.142857 512 73.142857z';
      //'M512 0C229.2 0 0 229.2 0 512c0 282.8 229.2 512 512 512 282.8 0 512-229.2 512-512C1024 229.2 794.8 0 512 0zM512 960C264.6 960 64 759.4 64 512 64 264.6 264.6 64 512 64c247.4 0 448 200.6 448 448C960 759.4 759.4 960 512 960z';
      //'M210.9952 210.9952C294.2976 127.6928 394.6496 85.9648 512 85.9648c117.2992 0 217.6512 41.6768 301.0048 124.9792C896.3072 294.3488 937.984 394.7008 937.984 512c0 117.3504-41.6768 217.7024-124.9792 301.0048C729.6512 896.3584 629.2992 937.984 512 937.984c-117.3504 0-217.7024-41.6256-301.0048-124.9792C127.6416 729.7024 86.016 629.3504 86.016 512 86.016 394.7008 127.6416 294.3488 210.9952 210.9952zM271.0016 752.9984c67.2768 67.328 147.6608 101.0176 240.9984 101.0176 93.2864 0 173.6704-33.6384 240.9984-101.0176 67.2768-67.2768 101.0176-147.6608 101.0176-240.9984 0-93.2864-33.6896-173.6704-101.0176-240.9984C685.6704 203.6736 605.2864 169.984 512 169.984c-93.3376 0-173.7216 33.6896-240.9984 101.0176C203.6736 338.3296 169.984 418.6624 169.984 512 169.984 605.3376 203.6736 685.6704 271.0016 752.9984zM361.0112 361.0112C402.9952 318.976 453.3248 297.984 512 297.984c58.6752 0 109.0048 20.992 150.9888 62.976S726.016 453.3248 726.016 512c0 58.6752-20.992 109.0048-62.976 150.9888s-92.3648 62.976-150.9888 62.976c-58.6752 0-109.0048-20.992-150.9888-62.976S297.984 570.6752 297.984 512C297.984 453.3248 318.976 402.9952 361.0112 361.0112z';
      ifalse = 'M512 0C229.2 0 0 229.2 0 512c0 282.8 229.2 512 512 512 282.8 0 512-229.2 512-512C1024 229.2 794.8 0 512 0zM512 960C264.6 960 64 759.4 64 512 64 264.6 264.6 64 512 64c247.4 0 448 200.6 448 448C960 759.4 759.4 960 512 960z';
      //'M512 946.905134c-58.700937 0-115.659183-11.501962-169.292708-34.187637-51.791573-21.905916-98.299817-53.261041-138.231271-93.192495-39.932478-39.932478-71.287603-86.441744-93.193519-138.232295-22.685675-53.633524-34.187637-110.591771-34.187637-169.292708 0-58.700937 11.501962-115.659183 34.187637-169.292708 21.905916-51.791573 53.260018-98.299817 93.193519-138.231271 39.932478-39.932478 86.440721-71.287603 138.231271-93.193519 53.633524-22.685675 110.591771-34.187637 169.292708-34.187637 58.699913 0 115.65816 11.501962 169.292708 34.187637 51.79055 21.905916 98.299817 53.260018 138.232295 93.193519 39.931454 39.932478 71.28658 86.440721 93.192495 138.231271 22.685675 53.633524 34.187637 110.591771 34.187637 169.292708 0 58.699913-11.501962 115.65816-34.187637 169.292708-21.905916 51.79055-53.261041 98.299817-93.192495 138.232295-39.932478 39.931454-86.441744 71.28658-138.232295 93.192495C627.65816 935.403173 570.699913 946.905134 512 946.905134zM512 128.260176c-102.500489 0-198.866257 39.916105-271.346011 112.394836-72.478731 72.479755-112.394836 168.845523-112.394836 271.346011s39.916105 198.866257 112.394836 271.344988c72.479755 72.478731 168.844499 112.394836 271.346011 112.394836s198.865233-39.916105 271.344988-112.394836c72.478731-72.479755 112.394836-168.844499 112.394836-271.344988S855.82372 313.133743 783.344988 240.655012C710.866257 168.175257 614.500489 128.260176 512 128.260176z M512 512m-204.66124 0a200 200 0 1 0 409.322479 0 200 200 0 1 0-409.322479 0Z';
      //'M511.161912 62.442144c-247.808946 0-448.699302 200.889333-448.699302 448.698279 0 247.809969 200.890356 448.698279 448.699302 448.698279 247.807922 0 448.698279-200.887286 448.698279-448.698279C959.860191 263.331477 758.969834 62.442144 511.161912 62.442144zM511.161912 892.532783c-210.638371 0-381.394407-170.753989-381.394407-381.39236 0-210.636325 170.756035-381.393383 381.394407-381.393383 210.637348 0 381.393383 170.757059 381.393383 381.393383C892.555296 721.778794 721.79926 892.532783 511.161912 892.532783z';
    }
    $element.html(`
    <svg check-true style="display:none;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
        <path fill="currentColor" d="${itrue}" ></path>
    </svg>
    <svg check-false  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
        <path fill="currentColor" d="${ifalse}"></path>
    </svg>
    `);

    // let  {position} = document.defaultView.getComputedStyle($element[0]);
    // if(position != "absolute") position = "relative";
    // $scope.ngStyle = {position};
    $element[0].querySelector("[check-false]").style.color = $scope.blur || "";
    $element[0].querySelector("[check-true]").style.color = $scope.focus || $scope.blur;

    if($attrs.disabled == "disabled" || $attrs.disabled=="true"){
        return false;
    }

    if(!$attrs.ngModel) return false;
    //完全拒绝-----------end

    let rname = $attrs.name || $scope.ngName || "radio";   //设置同组元素，以name方式分组
        $element.attr("name","erd"+rname);
    let radioDoms = document.querySelectorAll("[name=erd"+rname+"][checked]"); //默认获取同组radio元素
    let ccval = "";
    // console.log(radioDoms);
    if(radioDoms && radioDoms.length>0){
      $scope.ngModel = $scope.value || radioDoms[0].getAttribute("value");
    }

//     let isChecked = false;  //设定判断是否已经存在可选
//     for(let i = radioDoms.length ;i > 0;i-- ){
//     // for(let i = 1 ;i < radioDoms.length+1;i++ ){
//         let cyDom = radioDoms[i-1].querySelector("[check-true]");
//         let cnDom = radioDoms[i-1].querySelector("[check-false]");
//
//           if ( isChecked === true ){
//               cyDom.style.display =  "none";
//               cnDom.style.display = "block";
//               console.log(isChecked,"tur",radioDoms[i-1].getAttribute("value"));
//           }else{
//             //获取元素属性，判断是否有被选择的选项
//             let cattr = radioDoms[i-1].getAttribute("checked");
//             if(cattr == "checked" || cattr == "true"){
//                 cyDom.style.display =  "block";
//                 cnDom.style.display = "none";
//                 let cval = $scope.value || radioDoms[i-1].getAttribute("value") ;
//
//                 $scope.ngModel =  cval;
//                 // $scope.$parent.$apply();
//
// console.log(isChecked,cval,$scope.ngModel);
//
//                 isChecked = true;
//                 //如果ng-value为假则使用break
//             }
//           }
//
//     }
    //
    //$scope.ngModel = $attrs.checked ? $scope.value : null;
    let ele = $element;
    // //判断在父层是否为LABEL，并为其添加事件
    if($element.parent()[0].tagName === "LABEL"){
        ele = $element.parent();
    }
    //单选事件
    ele.bind("click", function(e){
      //选项不可选
      if($attrs.disabled == "disabled" || $attrs.disabled=="true"){
          return false;
      }
        // console.log(this.querySelector(".check-false").style.display,"999");
        if(typeof $attrs.checkbox !== "undefined"){
          console.log("复选");
            if(this.querySelector("[check-false]").style.display == "block" || this.querySelector(".check-false").style.display==false){
                this.querySelector("[check-false]").style.display = "none";
                this.querySelector("[check-true]").style.display = "block";
                $scope.ngModel = $scope.value || $attrs.value;
            }else{
                this.querySelector("[check-false]").style.display = "block";
                this.querySelector("[check-true]").style.display = "none";
                $scope.ngModel = "";
            }
            $scope.$parent.$apply();

            return false;
        }

        // e.stopPropagation();
        for(let v of  document.querySelectorAll("[name=erd"+rname+"]") ){
                v.querySelector("[check-false]").style.display = "block";
                v.querySelector("[check-true]").style.display = "none";
        }
        this.querySelector("[check-false]").style.display = "none";
        this.querySelector("[check-true]").style.display = "block";
        $scope.ngModel = $scope.value || $attrs.value;
        $scope.$parent.$apply();
    })
}]

var app = {};

if(window.angular){
//  属性name ， value仅支持普通字符串，变量请加前缀ng-
app = angular.module("eenRadio",[]).directive("eenRadio",function(){
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
        template:'<div>  </div>',
        controller:_controller,
    }
})

}

export default app;
