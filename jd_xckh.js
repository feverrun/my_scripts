/*
tgchannel：https://t.me/Ariszy_Script
github：https://github.com/Ariszy/script
boxjs：https://raw.githubusercontent.com/Ariszy/Private-Script/master/Ariszy.boxjs.json

*/
const $ = new Env('新潮品牌狂欢')
const notify = $.isNode() ?require('./sendNotify') : '';
cookiesArr = []
CodeArr = []
cookie = ''
var task1Arr = [],task2Arr = [],task3Arr = [],tasktokenArr = [],task4Arr = []
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
const invite=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var hour=''
var minute=''
if ($.isNode()) {
   hour = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getHours();
   minute = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getMinutes();
}else{
   hour = (new Date()).getHours();
   minute = (new Date()).getMinutes();
}
//CK运行
if ($.isNode()) {
     Object.keys(jdCookieNode).forEach((item) => {
          cookiesArr.push(jdCookieNode[item])
     })
     if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
     cookiesArr = [
          $.getdata("CookieJD"),
          $.getdata("CookieJD2"),
          ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
    
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await control()
  for (let i =0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      message = ''
      $.isLogin = true;
      $.index = i + 1;
       console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
      await getlist()
      await reportGame()
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    

function PostRequest(uri,body) {
  const url = `https://api.m.jd.com/client.action?${uri}`;
  const method = `POST`;
  const headers = {"Accept": "application/json, text/plain, */*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-cn","Connection": "keep-alive","Content-Type": "application/x-www-form-urlencoded","Cookie": cookie,"Host": "api.m.jd.com","User-Agent": "jdapp;iPhone;9.4.6;14.4;0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849;network/4g;ADID/C6677A60-54F1-4C41-990F-F1B4088E24F5;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone12,1;addressid/2377723269;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"}
  return {url: url, method: method, headers: headers, body: body};
}

function GetRequest(uri) {
  const url = `https://api.m.jd.com/client.action?${uri}`;
  const method = `GET`;
  const headers = {"Accept": "application/json, text/plain, */*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-cn","Connection": "keep-alive","Content-Type": "application/x-www-form-urlencoded","Cookie":cookie,"Host": "api.m.jd.com","Origin": "https://h5.m.jd.com","User-Agent": "jdapp;iPhone;9.4.6;14.4;0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849;network/4g;ADID/C6677A60-54F1-4C41-990F-F1B4088E24F5;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone12,1;addressid/2377723269;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"};
  return {url: url, method: method, headers: headers};
}

async function reportGame(itemtoken){
 let score = Math.floor(Math.random()*40)+50;
 const MyRequest = GetRequest(`functionId=mcxhd_brandcity_reportGame&appid=publicUseApi&body=%7B%22token%22%3A%22jd17919499fb7031e5%22%2C%22score%22%3A${score}%7D&t=${new Date().getTime()}&client=wh5&clientVersion=1.0.0&sid=6d815a8fdbd5d7bd5bd45acb30b81c1w&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&area=13_1016_47166_57860&networkType=4g`)
 return new Promise((resolve) => {
   $.get(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result && result.retCode && result.retCode == 200){
           console.log("成功获得京豆"+result.result.gift.jbeanNum+"\n")
        }else{
           $.log(result.retMessage+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function doTask(itemtoken){
 const MyRequest = GetRequest(`functionId=mcxhd_brandcity_doTask&appid=publicUseApi&body=%7B%22itemToken%22%3A%22${itemtoken}%22%2C%22token%22%3A%22jd17919499fb7031e5%22%7D&t=${new Date().getTime()}&client=wh5&clientVersion=1.0.0&sid=7eef03e1ab21433872a1eef04777989w&uuid=62c8e3ec5aa89f3dcb2ee72c39b3041d98fc34ca&area=13_1016_47166_57860&networkType=4g`)
 return new Promise((resolve) => {
   $.get(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result && result.retCode && result.retCode == 200){
           console.log(result.retMessage+"\n")
        }else{
           $.log(result.retMessage+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function check(tasktoken){
//$.log(tasktoken)
const MyRequest = GetRequest(encodeURI`functionId=qryViewkitCallbackResult&client=wh5&body={"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${tasktoken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
 return new Promise((resolve) => {
   $.get(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result && result.toast && result.toast.subTitle == ""){
           console.log("浏览完成\n")
        }else{
           $.log(result.toast.subTitle+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function getlist(){
 const MyRequest = GetRequest(`functionId=mcxhd_brandcity_taskList&appid=publicUseApi&body=%7B%22lat%22%3A%2236.808112%22%2C%22lng%22%3A%22118.039608%22%2C%22token%22%3A%22jd17919499fb7031e5%22%7D&t=${new Date().getTime()}&client=wh5&clientVersion=1.0.0&sid=7eef03e1ab21433872a1eef04777989w&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&area=13_1016_47166_57860&networkType=4g`)
 return new Promise((resolve) => {
   $.get(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result && result.retCode && result.retCode == 200){
          let tasklist1Arr = result.result.tasks.find(item => item.taskId == "1")

if(tasklist1Arr.times < tasklist1Arr.maxTimes){
          console.log("开始任务1⃣️"+tasklist1Arr.taskName+"\n")
          for(let i = 0; i == tasklist1Arr.subItem.length; i++){
          if(tasklist1Arr.subItem[i].status == 1){
          task1Arr.push(tasklist1Arr.subItem[i].itemToken)
for(let j = 0; j < task1Arr.length; j++){
  $.log("开始"+task1Arr[j])
  await doTask(task1Arr[j])
  await $.wait(8000)
}}
          else
            console.log("任务一完成\n")
            break;
           }
          }else
            console.log("任务一完成\n")
          let tasklist2Arr = result.result.tasks.find(item => item.taskId == "2")
    if(tasklist2Arr.times < tasklist2Arr.maxTimes){
          console.log("开始任务2⃣️"+tasklist2Arr.taskName+"\n")
          for(let i = 0; i < tasklist2Arr.subItem.length; i++){
          if(tasklist2Arr.subItem[i].status == 1){
          task2Arr.push(tasklist2Arr.subItem[i].itemToken)
for(let j = 0; j < task2Arr.length; j++){
  $.log("开始"+task2Arr[j])
  await doTask(task2Arr[j])
  await $.wait(8000)
}
}
          else
            console.log("任务二完成\n")
            break;
           }
         }else
            console.log("任务二完成\n")

        let tasklist3Arr = result.result.tasks.find(item => item.taskId == "3")
      if(tasklist3Arr.times < tasklist3Arr.maxTimes){
          console.log("开始任务3⃣️"+tasklist3Arr.taskName+"\n")
          for(let i = 0; i < tasklist3Arr.subItem.length; i++){
          if(tasklist3Arr.subItem[i].status == 1){
          task3Arr.push(tasklist3Arr.subItem[i].itemToken)
tasktokenArr.push(tasklist3Arr.subItem[i].taskToken)
for(let j = 0; j < task3Arr.length; j++){
  $.log("开始"+task3Arr[j])
  await check(tasktokenArr[j])
  await doTask(task3Arr[j])
  await $.wait(8000)
}}

          else
            console.log("任务三完成\n")
            break;
           }
          }else
            console.log("任务三完成\n")
console.log("开始任务4⃣️内部助力\n")
for(let j = 0; j < task4Arr.distinct().length; j++){
  $.log("开始助力"+task4Arr[j])
  await doTask(task4Arr[j])
  await $.wait(8000)
}

        }else{
           $.log("😫"+result.msg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function control(){
for (let i =0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      await getlists()
}
}
async function getlists(){
 const MyRequest = GetRequest(`functionId=mcxhd_brandcity_taskList&appid=publicUseApi&body=%7B%22lat%22%3A%2236.808112%22%2C%22lng%22%3A%22118.039608%22%2C%22token%22%3A%22jd17919499fb7031e5%22%7D&t=${new Date().getTime()}&client=wh5&clientVersion=1.0.0&sid=7eef03e1ab21433872a1eef04777989w&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&area=13_1016_47166_57860&networkType=4g`)
 return new Promise((resolve) => {
    $.get(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result && result.retCode && result.retCode == 200){
         

let tasklist4Arr = result.result.tasks.find(item => item.taskId == "4")
          if(tasklist4Arr.times < tasklist4Arr.maxTimes){
          for(let i = 0; i < tasklist4Arr.subItem.length; i++){
          if(tasklist4Arr.status == 1){
          task4Arr.push(tasklist4Arr.subItem[i].itemToken)
}

          else
            console.log("任务四完成\n")
            break;
           }
         }else
            console.log("任务四完成\n")
        }else{
           $.log("😫"+result.msg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//showmsg
//boxjs设置tz=1，在12点<=20和23点>=40时间段通知，其余时间打印日志

async function showmsg() {
    if (tz == 1) {
      if ($.isNode()) {
        if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
          await notify.sendNotify($.name, message)
        } else {
          $.log(message)
        }
      } else {
        if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
          $.msg(zhiyi, '', message)
        } else {
          $.log(message)
        }
      }
    } else {
      $.log(message)
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
Array.prototype.distinct = function (){
 var arr = this,
  result = [],
  len = arr.length;
 arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
  var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
  if(bool === -1){
   result.push(v);
  }
 })
 return result;
};
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
