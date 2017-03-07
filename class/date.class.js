let datepick = new class dt {
    constructor() {
        this.lunarInfo = new Array(
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);
        this.Animals = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
        this.Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
        this.Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
        this.cnNum = new Array("","一","二","三","四","五","六","七","八","九","十","十一","十二");

        let init = new Date();
        this.initime = {
          init,
          weekday: init.getDay(),
          YY: init.getFullYear(),
          MM: init.getMonth()+1,
          DD: init.getDate(),
          hh: init.getHours(),
          ii: init.getMinutes(),
          ss: init.getSeconds(),
          ms: init.getMilliseconds(),
          nowtime: init.getTime(),
          daytime: (new Date(init.getFullYear(),init.getMonth(),init.getDate())).getTime(),
        }
        this.now = new Date(); //当前面板的日期，用于切换月份时使用
        this.setDate();
    }

    //默认当前系统时间，当月总计多少天
    monthDays(year=this.strdate.YY,month=this.strdate.MM){

      if(month < 1){
        month = 12;year = year - 1;
      }
      let isy = false;
      if ( year % 4 == 0 ) isy = true;
      switch (month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
              return 31;
          case 4:
          case 6:
          case 9:
          case 11:
              return 30;
          case 2:
              return isy ? 29 : 28;
      }
    }

    //返回某个日期的某一周的某一天
    weekDay(y=this.strdate.YY, m=this.strdate.MM, d=1){
      if(!y || !m || !d){
        return this.strdate.weekday ;
      }else{
        let dd = new Date( y , m-1 , d );
        return dd.getDay();
      }
    }

    setDate(y,m,d){

      if(m<1) {y = y-1;m=12}
      if(m>12) {y = y+1;m=1}

      if(y && m && d)
        this.now = new Date(y,m-1,d);

      let now = this.now;
      this.strdate = {
        now,
        weekday: now.getDay(),
        YY: now.getFullYear(),
        MM: now.getMonth()+1,
        DD: now.getDate(),
        hh: now.getHours(),
        ii: now.getMinutes(),
        ss: now.getSeconds(),
        ms: now.getMilliseconds(),
      }
      return this.now;
    }

    getDate(y,m,d){
      if(m<1) {y=y-1;m=12;}
      if(m>12) {y=y+1;m=1;}
      // console.log(y,m,d,new Date(y,m-1,d).getDay());
      return new Date(y,m-1,d);
    }

    //输出日历
    calendar(fn=()=>{}){

      let self = this;
      let [yy,mm,dd] = [self.strdate.YY,self.strdate.MM,self.strdate.DD];
      // if(mm<1) {yy = yy-1;mm=12}
      // if(mm>12) {yy = yy+1;mm=1}

      if(typeof fn !== "function"){
          console.error("callback:not A function");
          return false;
      };

      /**按周分割日期 7 x 6
      * i 循环次数 、数组下标
      * 日期面板第几行、第几个数组下标
      **/
      let newval = Array(6);
      let preDays = this.monthDays(yy, mm-1); //上月总天数
      let nowDays =  this.monthDays(yy,mm);  //当月天数
      let startWeek = this.weekDay(yy,mm);  //当月起始周几？
      let nowdayTime =  self.initime.daytime;

        //let infoTries = Object.entries(infos)
        /* 共42天
         * 七列
         * 因为当月最多显示六行，故此处为 7x6 = 42天
         */
        for(let i=0,v=-1; i< 42; i++){
          //设定每天默认样式
          let _style = {};

          if(i%7===0){
              v++;
              newval[v] = [];
          }
          //上一个月
          if(i < startWeek){

            let t = self.getDate(yy, mm-1, preDays +1 - (startWeek-i) );
            newval[v].push({
              yy,
              mm,
              dd:preDays +1- (startWeek-i),
              month: -1, //上一月
              time: t.getTime(),
              isfree:(t.getDay()===0 || t.getDay()===6)?true:false, //是否为周末
            })
          }

          //当月
          if(i >= startWeek && i < nowDays+startWeek){
            let t = self.getDate(yy, mm, i-startWeek+1);
            newval[v].push({
              yy,
              mm,
              dd: i-startWeek+1,
              time: t.getTime(),
              // isnow: t.getTime()==nowdayTime?true:false,
              isfree:(t.getDay()===0 || t.getDay()===6)?true:false,
            })
          }

          // 下一个月
          if(i >= nowDays+startWeek){
            let t = self.getDate(yy,mm+1,i - startWeek - nowDays+1);
            newval[v].push({
              yy,
              mm: mm+1,
              dd: i - startWeek - nowDays+1,
              month:1, //下一月
              time: t.getTime(),
              isfree: (t.getDay()===0 || t.getDay()===6)?true:false,
            })
          }

        }
        fn(this);
        return newval;
    }

    // 上翻月
    mprev(){
      this.setDate(this.strdate.YY,this.strdate.MM-1,this.strdate.DD);
      return this.calendar();
    }
    // 下翻月
    mnext(){
      this.setDate(this.strdate.YY,this.strdate.MM+1,this.strdate.DD);
      return this.calendar();
    }
}

export default datepick;
