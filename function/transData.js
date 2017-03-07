/*
 * 转换数据类型
 * 当type==='Array'表示将data1转换为数组数据，data1必须为对象数据
 */
export function transData(data1,type){
  if(type === "Array"){
    let arr = []
    if(true === (data1 instanceof Object)){
      for(let k in data1){
        if(data1[k])
          arr.push(data1[k]);
      }
    }
    return arr;
  }
}
