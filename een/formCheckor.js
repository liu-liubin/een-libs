var app = {};
var _link = function($scope,$element,$attrs,$c){
  console.log($scope);
}

if(window.angular){
  app = angular.module("formCheckor",[]);
  app.directive("formCheckor",function(){
      return {
          restrict:"A",
          template:"",
          replace:false,
          link:_link
      }
  });
}
export default app;
