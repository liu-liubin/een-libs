class regular{
    constructor() {
    }

    // 检测数据合法性
    checkData(name,value,ignore=false){

      // 将非数组参数转换成数组
      if(name instanceof Array === false) name = [];
      if(value instanceof Array === false) value = [value];

      //内置验证confirm，强制验证空值
      if(name[0] == "confirm") ignore = false;

      // 如果不忽略空值，则值为空返回false ------回调失败函数 failed
      if(false === ignore &&  !value[0] ) {
        this.failed(name[1]||"验证不通过！");
        return false;
      }

      // 如果忽略空值并且name[0]不等于empty，则值为空直接返回true
      if(true === ignore && !value[0] && name[0]!="empty" ) return true;

      // 判断值的合法性，内置正则表达式
      /* idcard      验证身份证号是否合法
       * mobile      验证手机号是否符合规则
       * length      验证字符串长度是否在规定范围内，value[0]为匹配值，value[1]为最小长度，value[2]为最大长度
       * confirm     验证两个值是否完全相等，value[0] 对比 value[1]
       */
      let checkPass = true;
      switch (name[0]) {
        case "idcard":
          let r =/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
          checkPass = r.test(value[0]);
          break;
        case "mobile":
          let reg = /^1[3|4|5|7|8][0-9]{9}$/;
          checkPass = reg.test(value[0]);
          break;
        case "length":
          if(value[1] && value[2] && value[1] < value[2] ){
            let reg = new RegExp("(.){"+ value[1] +","+ value[2] +"}");
            checkPass = reg.test(value[0]);
          }
          break;
        case "confirm":
          if( value[0] !== value[1] ){
            checkPass =  false;
          }
          break;
        case "empty":
          if(!value[0])
            checkPass = false;
          break;
        default:
      }

      // 返回结果 true  or  false
      if(checkPass == false){
        this.failed(name[2]||name[1]||"验证不通过");
      }
      return checkPass;
    }

    // 验证不合法回调函数
    failed(){
    }
}
let reg = new regular();

/*
 * 传入数组
 * [
 * {name:[正则名称（内置）,空值提示文字，验证失败提示文字],value:'需要验证的值',failed:function(){验证不合法执行函数}},
 * ]
 */
export default function(opt=[]){

  if(opt instanceof Array){
    let allpass = true;
    for(let i=0; i < opt.length; i++){
      let ignore = true;
      let {name,failed,value} = opt[i];
      if(name[2]) ignore = false;

      if( failed && (failed instanceof Function) ) reg.failed = failed;

      let a = reg.checkData( name, value, ignore);
      if(!a){
        allpass = false;
        break;
      }
    }

    // 数据全部验证通过执行回调函数
    if(allpass === true){
      return {success:(fn)=>{
        if(fn instanceof Function){
          fn();
        }
      }};
    }

    return {success:()=>{}};
  }

}
