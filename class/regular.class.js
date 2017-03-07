export default new class{
    constructor() {
        this.form = "";     //form表单对象
    }
    // valid(form){
    //     if(form) this.form = form;
    // }
    // _valid(){
    //
    // }
    idcard(v){
      /*
       * 身份证15位编码规则：dddddd yymmdd xx p
       * dddddd：6位地区编码
       * yymmdd: 出生年(两位年)月日，如：910215
       * xx: 顺序编码，系统产生，无法确定
       * p: 性别，奇数为男，偶数为女
       *
       * 身份证18位编码规则：dddddd yyyymmdd xxx y
       * dddddd：6位地区编码
       * yyyymmdd: 出生年(四位年)月日，如：19910215
       * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
       * y: 校验码，该位数值可通过前17位计算获得
       *
       * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
       * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
       * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
       * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
       * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
       */
       if(!v) return false;
       //15位和18位身份证号码的正则表达式
       let r =/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
       return r.test(v);
    }
    //t 是否忽略空值
    mobile(v,t=false){
      if(!v && t!==true) return false;

      let r = /^1[3|4|5|7|8][0-9]{9}$/;
      return r.test(v);
    }
}
///!(/^1[34578]\d{9}$/.test(phone)
