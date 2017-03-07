import eh from "./eenher";
// require("ngResource");
var app = {};
if(window.angular){

app = angular.module("uri",["ngResource", eh.name]).provider("uri",["$httpProvider",function($httpProvider){

    //服务配置,可在uri.action前临时改变配置
    this.config = {
        host : "http://127.0.0.1",  //请求接口域名地址
        fix : "",          //请求后缀
        truehost : "",       //
        cache : false,     //是否启用缓存
        transform : false ,   //是否转换为form请求
        auth(){},      //权限认证，通常用于用户登陆或请求验证
    }
    this.wxjdk = {
        faild:false, ///判断是否注册签名失败
        initURI : window.location.href , //针对ng-ui-router在没路由前记录其地址,iphone无法识别的情况下
        url : "",       //分享签名的URL
        jsapi : [ //jsApiList 可授权列表
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            'onMenuShareQQ',//分享到QQ
        ],
        ready(share){
            if(!share instanceof Object) share = {};
            wx.onMenuShareTimeline(share);
            wx.onMenuShareAppMessage( Object.assign( share ,{type: 'link',dataUrl: ''}) );
            wx.onMenuShareQQ(share);
        },   //配置已准备
    }
    this.debug = false;
    this.$get = ["$resource","eenher","$log",function($rs,eh,$log){
        // let [self,oldconf,defconf] = [this,this.config,this.config] ;
        let self = this ;//临时变量

        let uriObj = {
            action:(url,params)=>{
                let conf = uriObj._conf;
                let [truehost,fix,host,cache] = [
                    conf.truehost?conf.truehost:self.config.truehost,
                    conf.fix?conf.fix:self.config.fix,
                    conf.host?conf.host:self.config.host,
                    conf.cache?conf.cache:self.config.cache,
                ];
                uriObj._conf = {};

                if(!url) return false; //不允许传入空值
                if( /^http(s)?:\/\//.test(url) ) truehost = url ; //判断url 是否带有http://
                else truehost = "";

                if( params === true || (typeof params === "object" && params.layer===true )  ){
                    eh.load(); //此处需要eenher服务支持
                }

                return $rs( truehost  ? truehost : (host + url + fix) ,params,{
                    'update': {method:"PUT" },
                    'get':    {method:'GET', cache: cache },
                    'save':   {method:'POST' },
                    'query':  {method:'GET', isArray:true, cache: cache },
                    'remove': {method:'DELETE' },
                    'delete': {method:'DELETE'},
                    'jsonp' : {method:'JSONP', params: {callback: 'JSON_CALLBACK'},isArray:false},
                })

            },

            _conf:{},
            //只对当前操作有效的配置（临时配置）
            options:function(c = {}){
                $log.debug("URI临时配置",c);
                if(c instanceof Object) this._conf = c;
            },

            //权限认证（登陆、分权等）
            auth(){

            },

            //注册微信自定义分享 url注册的链接   params地址参数  share分享的内容描述等
            wxjdk(params={},share={}){
                // $log.log("注册微信签名认证");
                // if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                //     params.url = iphone;
                //     //alert("iphone"+iphone);
                // }
                let  [ myself ,wx, wxjdk] = [ this ,window.wx ,self.wxjdk];

                if(!wxjdk.url || !wx) return false;
                $log.debug("微信发起签名请求",params,share);
                if(wxjdk.faild === true) params.url = wxjdk.initURI;
                if(params.url) params.url = encodeURI(params.url);
                myself.action(wxjdk.url).jsonp(
                    params
                ).$promise.then(msg=>{
                    wx.config({
                        debug: self.debug,
                        appId: msg.appId,
                        timestamp: msg.timestamp,
                        nonceStr: msg.nonceStr,
                        signature: msg.signature,
                        jsApiList: wxjdk.jsapi,
                    });
                    wx.ready(function(){
                        $log.debug("微信签名成功",params);
                        wxjdk.ready(share);
                    });
                    wx.error(function(res){
                        if(wxjdk.faild===false){
                            $log.debug("微信签名失败，限一次再次请求签名",params);
                            wxjdk.faild = true; //失败一次
                            // params.url = wxjdk.initURI;
                            myself.wxjdk(params,share);

                        }
                        // window.location.reload();
                    })
                },msg=>{
                    $log.log("error server",msg);
                })
                    //wx.onMenuShareQQ();

            }
        }

        return Object.assign(uriObj,eh);
    }] //this.$get  结束

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest = [function(data)
    {
        var param = function(obj)
        {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj)
            {
                value = obj[name];
                if(value instanceof Array)
                {
                    for(i=0; i<value.length; ++i)
                    {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object)
                {
                    for(subName in value)
                    {
                        subValue = value[subName];
                        if(subValue != null){
                            // fullSubName = name + '[' + subName + ']';
                            //user.userName = hmm & user.userPassword = 111
                            fullSubName = name + '.' + subName;
                            // fullSubName =  subName;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                }
                else if(value !== undefined ) //&& value !== null
                {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }]
    $httpProvider.defaults.useXDomain = true;
}])

}
export default app;
