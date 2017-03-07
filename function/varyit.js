/*
  使 对象 键 或 值发生变异
  如 { a:"aa",c:"cc"} => { ab:"abb" ,cb:"cbba" }

  source 数据源 必须为数组对象 如：[{a:"a",b:"b"},{a:"a",b:"b"}]
  target  需要替换的 键  如{a:'ab'}
  结果： [{ab:"a",b:"b"},{ab:"a",b:"b"}]
*/
var varyit = function(source,target){
  if( source instanceof Array ){
    // let arr = [];
    if( !(target instanceof Object) ) return false;
    let sourceStr = JSON.stringify(source);
    for(let [tk,tv] of Object.entries(target) ){
      sourceStr = sourceStr.replace(new RegExp(tk,'gm'),tv);
      // source.map((v,k)=>{
      //   source[k]
      // })
    }
    // console.log(sourceStr);
    return JSON.parse(sourceStr);
  }
}
export {varyit}
