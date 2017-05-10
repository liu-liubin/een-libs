// 重新组合键值对，并设置到dom元素上，排除键值为false
var attrDom = (dom,attrs={})=>{
  for(let [key,val] of Object.entries(attrs)){
    if(false!==val)
      dom.setAttribute(key,val)
  }
}
// 定义一组函数，控制函数、监听文件进程的回调函数
const ctrls = Symbol("ctrls");
// 设置内置的进入队列的文件列表
const fileItems = Symbol("fileItems");
// 创建XMLHttpRequest标识（文件多传或单传）
const xhrQueue = Symbol("xhrQueue");


// 处理异常等
class throw_handle {
  constructor() {
    this.FileReader();
  }

  //判断浏览器是否支持FileReader接口
  FileReader() {
    if(typeof FileReader == 'undefined'){
        console.error('您的浏览器不支持FileReader接口！');
    }
  }

  // 允许上传的文件类型
}

export default class extends throw_handle{

  constructor(dom) {
    super();
    this.Dom = dom;
    // Function 文件入列时触发
    // this[queue] = ()=>{}
    // Function 文件正在上传触发的回调函数
    // this[uploading] = ()=>{}
    // Function 文件上传完成触发的回调函数
    // this[uploaded] = ()=>{}
    // Object 表单多选文件列表队列数量()
    this[fileItems] = {names:[],files:[],base64:[],promise:[]};
    // Array  创建发起服务端请求的个数(数组对象)
    this[xhrQueue] = [];
    // Object
    this[ctrls] = {
      queue:()=>{},                  //当文件入列时触发、即选择文件后触发
      uploading:()=>{},              //当文件开始上传时触发
      uploaded:()=>{}                //当与服务器端交互完成后触发
    }
    // Object  默认配置参数
    this.arg = {
      multiple:false,            // 是否启用文件多选多传，默认只能单选单传
      upType:"form",             // 上传类型：form->表单方式提交(默认)，base64->base64方式提交
      formData:{},               // 上传表单键值
      auto:false,                // 选择文件后是否自动上传，默认为false不自动上传
    }
    // 当前正在上传文件队列索引位置 , false表示未触发过上传动作
    this.num = false;
  }

  // 制定元素默认样式
  elestyle(_dom){
    if(!_dom.getAttribute("style")) _dom.setAttribute("style","position:relative;"+(_dom.getAttribute("style")||"") );
    let self = this;
    let cfrag = document.createDocumentFragment();
    let fileinput = document.createElement('input');
        fileinput.style.width = "100%";
        fileinput.style.height = "100%";
        fileinput.style.position = "absolute";
        fileinput.style.left = "0";
        fileinput.style.top = "0";
        fileinput.style.opacity = 0;
        fileinput.style.backgroundColor = "rgba(0,0,0, 0)";

        cfrag.appendChild(fileinput);
        attrDom(fileinput,{type:'file',multiple:self.arg.multiple?'multiple':false});

    // 监听上传表单  event@change
    fileinput.addEventListener("change",function(){
      let f_this = this;

      // 如果没有选择上传的文件，则退出程序
      if(this.files.length < 1) return false;

      // 获取/设置 上传文件表单名称
      let inputName = self.Dom.getAttribute("name") || "file";

      // 遍历表单files对象数组
      for(let i = 0 ; i < this.files.length ; i++){

        // 获取单个文件名称-----------------------------------------------------------
        let fileName = this.files[i].name;
        // 判断队列名称数组中是否存在该文件名称，如果 isfind !== undefined 执行跳出循环
        let isfind = self[fileItems].names.find( v=>v==fileName );
        if(isfind !== undefined){ continue;}

        let PROMISE = new Promise(function(resolve, reject) {
          // 执行文件入列回调函数
          let reader = new FileReader();

          reader.onload = (function(files){
            return function(e){

              // 仅单张上传
              // if(self.arg.multiple === false){
              //   self[fileItems].base64[0] = reader.result;
              //
              // }else{
              //   self[fileItems].base64.push(reader.result);
              // }
              // self[ctrls].queue(files, self[fileItems].base64); //执行回调方法

              resolve(reader.result);

            }
          })(f_this.files[i]);

          reader.onerror = function(){
            reject(new Error('Could not load FileReader'));
          }
          reader.readAsDataURL(f_this.files[i]);

        })

        // 仅单张上传
        // if(self.arg.multiple === false){
        //   self[fileItems].names[0] = fileName;
        //   _promise[0] = PROMISE;
        // }else{
        //   self[fileItems].names.push(fileName);
        //   _promise.push(PROMISE);
        // }


        // 文件多传与文件单传的情况
        self.arg.multiple===false? (
          self[fileItems].promise[0] = PROMISE
        ) : (
          self[fileItems].promise.push(PROMISE)
        );

        console.log(self[fileItems]);

        // 判断upType 选择上传文件传输类型
        if(self.arg.upType == "base64"){

        }else{
          // 不是base64传输方式
          let fd = new FormData();
              fd.append( inputName , f_this.files[i] );
          let queue = {
            xhr:new XMLHttpRequest(),
            formData:fd,
          }
          self.arg.multiple===false? (self[xhrQueue][0]=queue) : (self[xhrQueue].push(queue));
        }

      }
      // 遍历files-------end

      // 如果auto===true则自动上传队列中的文件
      if(self.arg.auto===true){
        if(self.arg.upType == "base64"){
          Promise.all(self[fileItems].promise).then((res)=>{
            res.map( (v,z)=>{
              // 上传提交所需的表单参数
              let newform = Object.assign(self.arg.formData,{[inputName]:v});

              // 整理归并参数
              let items = [];
              for(let k in newform){
                items.push(k+"="+newform[k]);
              }
              let queue = {
                xhr:new XMLHttpRequest(),
                formData:items.join("&"),
              }
              self[xhrQueue][z]=queue;

              self[fileItems].base64[z] = v;
              self[ctrls].queue("", self[fileItems].base64); //执行回调方法
              self.xhrUpload();
            } )
          })
        }else{
          // 加入队列时可预览base64位图片，预览执行 on("queue",function(){})
          Promise.all(self[fileItems].promise).then((res)=>{
            res.map( (v,k)=>{
              // 按照上传队列存储预览文件
              self[fileItems].base64[k] = v;
              self[ctrls].queue( self[fileItems].base64 ); //执行回调方法
            } )
          })
          self.xhrUpload();
        }
      }
    },false)

    _dom.appendChild(cfrag)
  }

  /*
   * type  指定事件进程
   * 当 type = 'init' 时  arg = {
      server:'',                       //服务器端上传处理接口
      chunk:false,                     //是否分片上传
      chunkSize:1024*1024*4            //大文件上传分片大小
      exi:                            //允许上传的文件大小
      auto:false                       // 是否开启自动上传
      multiple:false
    }
   */
  on(type, arg){
    switch (type) {
      // 初始化传入值，传入配置参数
      case 'init':
        this.arg = Object.assign(this.arg, arg);
        // 调用执行元素方法
        this.elestyle(this.Dom);

        break;
      // 当有文件添加进来时触发
      case 'queue':
        // 这时  arg 必须为回调的函数
        if( arg instanceof Function !== true) return false;
        this[ctrls].queue = arg;
        break;
      case 'uploading':
        if( arg instanceof Function !== true) return false
        this[ctrls].uploading = arg;
        break;
      case 'uploaded':
        if( arg instanceof Function !== true) return false
        this[ctrls].uploaded = arg;
        break;
      default:

    }
  }

  // 开始上传文件，index为文件队列中上传的索引位置
  xhrUpload(){
    let self = this;

    // 仅单张上传
    if(self.arg.multiple === false) self.num = false;

    // 如果 self.num不完全等于false则，每当执行此函数时索引值self.num应自增1
    if(self.num !== false) self.num++;
    //如果未触发过上传事件，即self.num === false ，并且有文件上传的需求则使self.num = 0;此时会执行上传第一个文件
    if(self.num === false) self.num = 0;

    // 判断索引所在队列中的文件是否存在，不存在则不往下执行
    if( !this[xhrQueue][self.num] ) return false;

    let index  = this.num;
    let {server} = this.arg;
    let {xhr,formData} = this[xhrQueue][index];
    let {queue,uploading,uploaded} = this[ctrls];
        xhr.open("POST",server);
        xhr.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
        // 侦查当前文件上传情况---正在上传中
        xhr.upload.onprogress = function(evt) {
          // 回调参数  arg[0]已上传的百分比   arg[1]当前文件队列所在索引位置
          uploading( Math.floor(100 * evt.loaded / evt.total) , index)
        };
        // 侦查当前文件上传状态----成功或失败
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            try {
              uploaded(JSON.parse(xhr.responseText), index);
            } catch (e) {
              uploaded(xhr.responseText, index);
            }

            if(self[xhrQueue][self.num+1])
              self.xhrUpload();
          }
        }
        xhr.send(formData);
      // 可同时发起文件上传请求数量，默认小于3，即可同时上传3个
      if(this.num < 3){
        if(self[xhrQueue][self.num+1])
          this.xhrUpload();
      }
  }


}
