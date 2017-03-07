//source源数据
//target匹配对象，支持参数：字符串|键值对象
/*
 * 示例
   var source = [
     {id:1,test:'测试',abc:'9814'},
     {id:2,test:'测试1',abc:'9814'},
     {id:3,test:'测试2',abc:'9814'},
     {id:4,test:'测试3',abc:'9814'},
   ]
   //删除id=4
   reject(source,{id:4});
   //结果
   source = [
     {id:1,test:'测试',abc:'9814'},
     {id:2,test:'测试1',abc:'9814'},
     {id:3,test:'测试2',abc:'9814'},
   ]
 */

//删除数组对象的某个键值
var reject = function(source,target){
  if( source instanceof Array ){
    let arr = [];
    source.map((v,k)=>{
      let str2 = "";
      let str1 = "";
      if(target instanceof Object && v instanceof Object){
        // str2 = JSON.stringify(target);
        let ishave = false;
        for(let [tk,tv] of Object.entries(target) ){
          if(v[tk] == tv)
            ishave = true;
          else
            ishave = false;
        }
        if(false===ishave)
          arr.push(v)
      }else{
        if(v != target)
          arr.push(v);
      }
      // if(v instanceof Object){
      //   str1 = JSON.stringify(v);
      // }else{
      //   str1 = v;
      // }
      // // console.log(str1,str2);
      // if( str1.indexOf(str2) == -1 ){
      //   arr.push( v );
      // }
    })
    return arr;
  }
}
export {reject}
