/*
 * data  *数组* 数据
 * i     *整数* 需要置顶的数组位置
 */
export function copyPlace(data=[],i,bool=false){
  if( !data instanceof Array ) return false;
  if(data.length<=i) return false;
  let trans = data[i];
  for(i;i>0;i--){
    data[i] = data[i-1];
  }
  data[0] = trans;
  return data;
}
