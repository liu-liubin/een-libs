/**** 实现无限级分类 ****
 *@AUTHOR LIUBIN
 * return 返回两种格式
 *  第一种：返回对象树，有level字段关系
 *  第二种：返回列表队列，有level字段关系
 *@use   unlimit(array,boolean);
 *@note  array需要传入一个数组，并且存在有 id->parent_id（子父）关系，如果boolean为false表示不返回子父关系的数据对象，默认为true
 */
;(function(window,angular){
if(!angular) return false;

angular.module("unlimit",[])
.factory("unlimit",[()=>{
    //如果在服务里声明一个变量，则该变量的数值会存在这个生命周期内，直到浏览器刷新！！！
    //开启无限递归模式
    let forFun = (oArray,zoverArray,level)=>{
        for(let k in oArray){
            //父数组
            if(!oArray[k]["nodes"]){
                oArray[k]["nodes"] = [];
            }
            let reArray = []; //重组数组
            let overArray = []; //剩下的数组
            for(let vv of zoverArray){  // 循环匹配是否存在子数组
                if(vv.parent_id == oArray[k].id){
                    vv.level = level;;
                    if(!vv.nodes){
                        vv.nodes = [];
                    }
                    reArray.push(vv);
                }else{
                    overArray.push(vv);
                }
            }
            //如果有子数据则录入给对应的父数组
            if( reArray.length > 0){
                //如果还有未分组的下级数组则继续循环分组
                if(overArray.length > 0 ){
                    oArray[k]["nodes"] = forFun(reArray,overArray,level+1);
                }else //没有了直接加入到父数组
                {
                    oArray[k]["nodes"] = reArray;
                }
            }
            //oArray[k]["level"] = level;

        }
        return oArray;
    }

    let forPush = (topArr,overArr,level)=>{
        let newArray = [];
        let maxLevel = 10;//限制循环次数，避免无限循环
        for(let k in topArr){
            newArray.push(topArr[k]);
            for(let [kk,vv] of overArr.entries() ){  // 循环匹配是否存在子数组
                if(vv.parent_id == topArr[k].id){
                    vv.level = level;
                    newArray.push(vv);
                    //forPush(topArr,overArr,level+1);
                    overArr.splice(kk,1); ///数组出栈
                }
            }
        }
        if(overArr.length > 0 && level < maxLevel){
            newArray = forPush(newArray,overArr,level+1);
        }
        return newArray;
    }

    let funs = (data,node=true)=>{
        if(!data)  return false;
        let topArray = [];
        let overArray = [];
        for(let v of data){
            if(v.parent_id == 0){
                v.level = 0; //等级标识
                topArray.push(v);
            }else{
                overArray.push(v);
            }
        }
        // console.log(overArray);
        if(node)
            return forFun(topArray,overArray,1)
        else
            return forPush(topArray,overArray,1);

    }

    return funs;

}])

})(window,window.angular)
