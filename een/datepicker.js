angular.module("ngDatepick",[])
.component("datePicker",{
    template:`
    <table id="ween-datetime-wrap" style="background-color:#161d24;color:#fff;width:100%;position:relative;padding:.35rem .25rem .3rem;">
        <svg style="display:none;visibility:hidden;">
           <symbol id="ixsanjiao" viewBox="0 0 100 100">
           <path transform="scale(0.0925, 0.0925)" d="M231.621377 8.160126l606.776838 470.422492c20.453152 13.635435 20.453152 47.724021 0 61.359455l-606.776838 470.422492c-27.270869 20.453152-61.359455 0-61.359455-27.270869L170.261922 42.248712C170.261922 8.160126 204.350508-12.293026 231.621377 8.160126z" fill="currentColor"></path>
           </symbol>
        </svg>
        <tr>
            <td>
            <div style="cursor:pointer;text-align:left;padding-left:.8rem;" ng-click="$ctrl.previous()" >
                <svg style="-webkit-transform:rotateY(180deg);transform:rotateY(180deg);
                width:1.2rem;height:1.2rem;color:#fff;
                display:flex;display:table;"  ><use xlink:href="#ixsanjiao" /></svg>
            </div>
            </td><td style="text-align:center;font-size:1.4rem;">
                {{$ctrl.year}}年 {{$ctrl.cnMonth}}月
            </td>
            <td style="text-align:center;">
            <div style="cursor:pointer;text-align:right;padding-right:.8rem" ng-click="$ctrl.thenext()">
                <svg style="width:1.2rem;height:1.2rem;color:#fff;display:initial;"  ><use xlink:href="#ixsanjiao" /></svg>
            </div>
            </td>
        </tr>
    </table>
    <table style="font-size:1.4rem;background-color:#000;color:#fff;width:100%;position:relative;padding:.25rem .15rem;text-align:center;">
        <tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>
    </table>
    <table style="width:100%;padding:.6rem 0;text-align:center;font-size:1.4rem;">
        <tr ng-repeat="(k,x) in $ctrl.monthday track by $index">
            <td ng-repeat="v in x ">
                <a href="javascript:void(0);" ng-class="v.class" ng-style="v.style" data-json="{{v}}" ng-click="$ctrl.pickdate(v)" >
                {{v.D}}
                <span ng-if="v.tehui" style='position: absolute;top: 0;left: 0;width: 0;height: 0;
                border-left: solid 1.3rem #f9ee30;border-right: none;border-top: none;
                border-bottom: solid 1.3rem transparent;'></span>
                </a>
            </td>
        </tr>
        <tr>
            <td colspan="7">
                <div  style="margin:1.3rem 0;">
                    <button ng-click="$ctrl.pickall()" style="line-height:3rem;color:#fff;width:36%;
                    border:none;background:#111;
                    -webkit-border-radius:.5rem;border-radius:.5rem;">全选</button>
                    <button ng-click="$ctrl.pickdel()" style="line-height:3rem;margin-left:1.5rem;border:none;width:36%;
                    background:#CCC;-webkit-border-radius:.5rem;border-radius:.5rem;">清空</button>
                    </div>
                </div>
            </td>
        </tr>
    </table>
    `.trim(),
    bindings:{
        onList:"&",
        pickList:"<", //可被选择的日期数组列表
    },
    controller:function(){
        let self = this;
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
                this.Now = new Date();
                this.YY = this.nowY = this.Now.getFullYear();
                this.MM = this.nowM = this.Now.getMonth();
                this.DD = this.nowD = this.Now.getDate();
                this.defaultList =  {}; //初始化传入的日期事件列表，用于恢复默认状态
                this.eventList = {} ; //（针对当月）某日期事件列表或某个日期发生事件改变结果
                this.selectList = {} //（针对所有月份）所有已选列表

            }

            init(){

            }

            //默认当前系统时间，当月总计多少天
            monthDays(year=this.YY,month=this.MM){
                let isy = false;
                if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) isy = true;
                switch (month+1) {
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
                        return isy ? 28 : 29;
                }
            }

            //默认当前系统时间，当月第一天是星期几
            startWeek(y=this.YY, m=this.MM, d=1){
                let dd = new Date( y , m , d );
                return dd.getDay();
            }

            //输出日历   note：请保证pickList中key或者key.date中有当天日期如2016-11-11酱紫
            outcome(fn=()=>{}){
                let infos ;
                if(typeof fn !== "function"){
                    console.log("callback:not A function");
                    return false;
                };
                let eventListLen = Object.keys(datepick.eventList).length;
                //infos = eventListLen ? datepick.eventList : datepick.defaultList;

                //当前年、月、日参数
                let [_y,_m,_d] = [
                    datepick.nowY,
                    (datepick.nowM+1)<10?"0"+datepick.nowM+1:datepick.nowM+1,
                    datepick.nowD<10?"0"+datepick.nowD:datepick.nowD
                ]

                //判断是否通过事件改变了初始值及状态
                if(!eventListLen) {
                    let newObjs = {};
                    infos = datepick.defaultList;
                    for(let k in infos){
                        if( !infos.length && Number(k.replace(/\-/g,"")) <= Number(_y+String(_m)+_d) ){
                            continue;
                        }else if( infos[k].date &&  Number(infos[k].date.replace(/\-/g,"")) <= Number(_y+String(_m)+_d) ){
                            continue;
                        }
                        if(!infos[k].date){
                            infos[k]["date"] = k;
                            newObjs[k] = infos[k];
                        }else{
                            newObjs[infos[k].date] = infos[k];
                        }
                    }
                    datepick.defaultList = newObjs
                    //console.log("3323",datepick.defaultList);
                };

                datepick.eventList = {}
                /**按周分割日期 7 x 6
                * i 循环次数 、数组下标
                * 日期面板第几行、第几个数组下标
                **/
                let newval = Array(6);
                let preDays = this.monthDays("",datepick.MM-1); //上月总天数
                let nowDays =  this.monthDays();  //当月天数
                let startWeek = this.startWeek();  //当月起始周几？

                //let infoTries = Object.entries(infos)
                /* 共42天
                 * 七列
                 * 因为当月最多显示六行，故此处为 7x6 = 42天
                 */
                for(let i=0,v=-1; i< 42; i++){
                    let addDaylist = {};
                    //默认显示样式
                    let _style = {
                        "margin":".25rem 0",
                        "width":"3rem",
                        "height":"3rem",
                        "line-height":"3rem",
                        "position":"relative",
                        "backgroundColor":"#ccc9c9",
                        "display":"inline-block",
                        "color":"#fff",
                        "text-align":"center",
                    };
                    if(i%7===0){
                        v++;
                        newval[v] = [];
                    }

                    //上一个月
                    if(i < startWeek){
                        _style.backgroundColor = "rgba(0,0,0,0)";
                        addDaylist = {
                            "Y":datepick.YY,
                            "M":datepick.MM, //当前系统时间月份 ，显示需+1
                            "D":preDays-startWeek+i+1,
                            "style":_style,
                        }

                        //console.log(dateval[i]);
                    }

                    //当月
                    if(i >= startWeek){
                        _style.backgroundColor = "#ccc9c9";
                        if( datepick.DD == i-startWeek+1 ){  //判断是否为当天
                            let kd = new Date();
                            if(datepick.YY==kd.getFullYear() && datepick.MM == kd.getMonth()){
                                _style.backgroundColor = "rgb(59, 124, 233)"; //今日颜色
                            }
                        }
                        addDaylist = {
                            "Y":datepick.YY,
                            "M":datepick.MM+1,
                            "D":i-startWeek+1,
                            "style":_style,
                        }
                    }

                    // 下一个月
                    if(i >= nowDays+startWeek){
                        _style.backgroundColor = "rgba(0,0,0,0)";
                        addDaylist ={
                                "Y":datepick.YY,
                                "M":datepick.MM+2,
                                "D":i-nowDays-startWeek+1,
                                style:_style,
                        }
                    }

                    //判断是否在日期上新增点击事件，由datepick.eventList传参决定
                    let [strY,strM,strD] = [
                        addDaylist.Y,
                        addDaylist.M<10?"0"+addDaylist.M:addDaylist.M,
                        addDaylist.D<10?"0"+addDaylist.D:addDaylist.D
                    ]

                    //使当天之后的日期默认为可选
                    if( !datepick.defaultList[strY+"-"+strM+"-"+strD] &&  Number(strY+String(strM)+strD) >  Number(_y+String(_m)+_d) ){
                        datepick.defaultList[strY+"-"+strM+"-"+strD] = {
                            picker:true,
                            date:strY+"-"+strM+"-"+strD,
                            style:{
                                backgroundColor:"#27b44a"
                            }
                        }
                    }

                    //只显示当月的日期，上月或下月的隐藏
                    if(i >= startWeek && i < nowDays+startWeek){
                        //let a = Object.keys(datepick.selectList);
                        let c= strY+"-"+strM+"-"+strD;

                        //开始设置样式
                        for(let k in datepick.defaultList){
                            let v = datepick.defaultList[k];
                            //如果存在可选列表
                            if(k == strY+"-"+strM+"-"+strD ){
                                addDaylist.picker = true;
                                Object.assign(addDaylist ,v);
                                Object.assign(_style,v.style);
                                addDaylist.style = _style;

                                if(datepick.selectList[k]){
                                    Object.assign(addDaylist ,datepick.selectList[k]);
                                    Object.assign(_style,datepick.selectList[k].style);
                                    addDaylist.style = _style;
                                }

                                datepick.eventList[k] = addDaylist;
                                break;
                            }
                        }
                    }
                    //日期入列
                    newval[v].push(addDaylist);
                }
                this.queue = newval;
                fn(this);
                return Array.from(newval);
            }
        }

        this.$onChanges = function(pickList){
            self.pickList = {
                // "2016-11-15":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-05":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-03":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-11":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-22":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-04":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-06":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-10":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-09":{style:{"backgroundColor":"#27b44a"}},
                // "2016-11-25":{style:{"backgroundColor":"#27b44a"}},
                // "2016-12-17":{style:{"backgroundColor":"#27b44a"}},
                // "2016-12-27":{style:{"backgroundColor":"#27b44a"}},
                // "2017-01-17":{style:{"backgroundColor":"#27b44a"}},
                // "2017-01-07":{style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-15",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-05",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-03",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-11",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-22",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-04",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-06",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-10",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-09",style:{"backgroundColor":"#27b44a"}},
                // {date:"2016-11-17",style:{"backgroundColor":"#27b44a"}},
            }
            //初始化日期插件
            datepick.defaultList = self.pickList ;
            this.monthday = datepick.outcome((r)=>{
                this.year = r.YY;
                this.month = r.MM;
                this.cnMonth = r.cnNum[r.MM+1];
            });
        }
        // {
        //     "2016-10-15":{style:{"backgroundColor":"#27b44a"}},
        //     "2016-10-05":{style:{"backgroundColor":"#27b44a"}},
        //     "2016-10-03":{style:{"backgroundColor":"#27b44a"},tehui:true},
        //     "2016-10-11":{style:{"backgroundColor":"#27b44a"}},
        //     "2016-10-22":{style:{"backgroundColor":"#27b44a"}},
        //     "2016-11-01":{style:{"backgroundColor":"#27b44a"}},
        // };


        //存储已选列表
        self.dataList = {};

        //全选
        this.pickall = function(){

            for(let k in datepick.eventList){
                datepick.eventList[k].style.backgroundColor = "rgb(39, 180, 74)";
                datepick.eventList[k].picker = true;
                datepick.eventList[k].tehui = false;
                datepick.selectList[k] = datepick.eventList[k];
            }
            self.dataList = datepick.eventList;
            this.onList({list:self.dataList});
        }
        //清空全选
        this.pickdel = function(){
            for(let k in datepick.eventList){
                datepick.eventList[k].style.backgroundColor = "rgb(54, 132, 182)";
                datepick.eventList[k].tehui = false;
                datepick.eventList[k].picker = 2;
            }
            datepick.selectList = self.dataList = {};
            this.onList({list:""});
        }
        //点击某一天事件
        this.pickdate = function(v){
            let dv = datepick.defaultList[v.date]; //恢复默认数据用
            if(!v.picker) return false;  ///不可选状态
            let newData = {};
            //重组已经选择的数据
            for(let k in self.dataList){
                newData[k] = self.dataList[k];
            }
            if(v.picker === true){ //切换为便民日
                v.tehui = true;
                v.picker = 1;
                newData[v.date] = v;
            }else if(v.picker === 1){ //切换为不可选项
                v.style.backgroundColor = "rgb(54, 132, 182)"; //蓝
                v.tehui = false;
                v.picker = 2;
                //newData = self.dataList;
                newData[v.date] = v;
            }else {
                v.style.backgroundColor = "#27b44a"; //绿色
                v.tehui = false;
                v.picker =  true;
                //newData = self.dataList;
                newData[v.date] = v;
            }
            datepick.selectList = self.dataList = newData;
            //self.dataList[v.date] = v; //事件发生后存储变化
            //console.log(self.dataList);
            //this.listData[v.date] = v;
            //console.log(datepick.eventList);
            this.onList({list:self.dataList});

        }
        //翻向后一月
        this.previous = function(){
            datepick.MM = datepick.MM-1;
            if(datepick.MM < 0){
                datepick.MM = 11;
                datepick.YY = datepick.YY - 1;
            }
            this.monthday = datepick.outcome((r)=>{
                this.year = r.YY;
                this.month = r.MM;
                this.cnMonth = r.cnNum[r.MM+1];
            });
        }
        //翻向前一月
        this.thenext =function(){
            datepick.MM = datepick.MM + 1;
            if(datepick.MM > 11){
                datepick.MM = 0;
                datepick.YY = datepick.YY + 1;
            }
            this.monthday = datepick.outcome((r)=>{
                this.year = r.YY;
                this.month = r.MM;
                this.cnMonth = r.cnNum[r.MM+1];
            });
        }
    }
})
