/*
锦鲤红包互助
入口：[京东App领券频道]
先内部互助，再互助池
JD_KOI_OPENRED 默认自动开红包如果想手动开红包环境变量设置为false
cron "1 0,8,12,20 * * *" script-path=jd_koi_help.js, tag=锦鲤红包互助
*/
const $ = new Env("锦鲤红包互助")
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

let openRed = process.env.JD_KOI_OPENRED ? true : false;
let cookiesArr = [], cookie = '';
let authorCode = ''
let shareCodes = [];
let shareCodesLength = 0;
$.newShareCodes = [];

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
            cookiesArr.push(jdCookieNode[item])
        }
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    if (process.env.JD_KOI_OPENRED === false) {
        openRed = false;
    }else {
        openRed = true;
    }
}

console.log(`共${cookiesArr.length}个京东账号\n`)
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.nickName = '';
        let data = await requestApi('h5launch', cookie,{"followShop":1,"random":random(000000, 999999),"log":"4817e3a2~8,~1wsv3ig","sceneid":"JLHBhPageh5"});
        if (data?.data?.result?.status == 1) {
            console.log(`账号${$.index}`, '火爆')
            continue;
        }
        console.log(`\n账号【${$.index}】${$.UserName}`);
        data = await requestApi('h5activityIndex',cookie, {"isjdapp":1});
        if (data?.data?.code == 20002) {
            console.log(`账号${$.index}`, '已达拆红包数量限制')
        }else if (data?.data?.code == 10002) {
            console.log(`账号${$.index}`, '火爆')
        }else if (data?.data?.code == 20001) {  //红包活动正在进行，可拆
            console.log(`互助码: ${data.data.result.redpacketInfo.id}`);
            shareCodes.push(data.data.result.redpacketInfo.id);

            try {
                if (i === 0) {
                    let code = data.data.result.redpacketInfo.id;
                    let user = $.UserName;
                    await submitCode(code, user);
                }
            }catch (e) {
                console.log(e.message)
            }

        }
        await $.wait(2000)
    }

    //只助力靠前的
    if (shareCodes.length >= 3) {shareCodesLength = 3;} else {shareCodesLength = shareCodes.length;}
    try {await shareCodesFormat();} catch (e) {console.log(e.message)}

    try {
        console.log(`\n内部互助\n`)
        for (let k in cookiesArr) {
            cookie = cookiesArr[k]
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.nickName = '';
            if (k == 0) {
                let result = await requestApi('jinli_h5assist',cookie, {
                    "redPacketId": authorCode,
                    "followShop": 0,
                    "random": random(000000, 999999),
                    "log": "42588613~8,~0iuxyee",
                    "sceneid": "JLHBhPageh5"
                })
                // console.log(`账号【${$.UserName}】 助力: ${authorCode}\n${result.data.result.statusDesc}\n`);
                await $.wait(3000);
                if (result.data.result.status == 3) {
                    break;
                }
            }

            for (let j = 0; j < shareCodesLength; j++) {
                let result = await requestApi('jinli_h5assist',cookie, {
                    "redPacketId": shareCodes[j],
                    "followShop": 0,
                    "random": random(000000, 999999),
                    "log": "42588613~8,~0iuxyee",
                    "sceneid": "JLHBhPageh5"
                })
                console.log(`账号【${$.UserName}】 助力: ${shareCodes[j]}\n${result.data.result.statusDesc}\n`);
                await $.wait(3000);
                if (result.data.result.status == 3) {
                    break;
                }
            }
        }

        await $.wait(2000)

        console.log(`\n助力池互助\n`)

        // console.log($.newShareCodes)
        for (let key in cookiesArr) {
            cookie = cookiesArr[key]
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.nickName = '';
            for (let jj = 0; jj < $.newShareCodes.length; jj++) {
                let result = await requestApi('jinli_h5assist', cookie, {
                    "redPacketId": $.newShareCodes[jj],
                    "followShop": 0,
                    "random": random(000000, 999999),
                    "log": "42588613~8,~0iuxyee",
                    "sceneid": "JLHBhPageh5"
                })
                console.log(`账号【${$.UserName}】 助力: ${$.newShareCodes[jj]}\n${result.data.result.statusDesc}\n`);
                await $.wait(3000);
                if (result.data.result.status == 3) {
                    break;
                }
            }
        }
    } catch (e) {
        console.log(e.message)
    }

    try {
        if(openRed) {
            //统一开红包
            console.log('拆红包\n')
            for (let ii = 0; ii < shareCodesLength; ii++) {
                cookie = cookiesArr[ii]
                await openRedPacket(cookie);
                await $.wait(1200)
            }
        }else {
            console.log('去京东商城->我的->更多游戏->锦鲤红包手动开红包')
        }
    }catch (e) {
        console.log(e.message)
    }

})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
    .finally(() => {
        $.done();
    })

async function openRedPacket(cookie) {
    var num = "";
    for (var g = 0; g < 6; g++) {
        num += Math.floor(Math.random() * 10);
    }
    let resp = await requestApi('h5receiveRedpacketAll', cookie, {
        "random": num,
        "log": "42588613~8,~0iuxyee",
        "sceneid": "JLHBhPageh5"
    });
    if (resp?.data?.biz_code == 0) {
        console.info(`领取到 ${resp.data.result?.discount} 元红包`)
    } else {
        console.error(`领取红包失败，结果为 ${JSON.stringify(resp)}`)
    }
}

async function requestApi(functionId, cookie, body = {}) {
    return new Promise(resolve => {
        $.post({
            url: `${JD_API_HOST}/api?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=AndroidOS&d_brand=Xiaomi&d_model=Xiaomi`,
            headers: {
                "Cookie": cookie,
                "origin": "https://h5.m.jd.com",
                "referer": "https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html",
                'Content-Type': 'application/x-www-form-urlencoded',
                "X-Requested-With": "com.jingdong.app.mall",
                "User-Agent": ua,
            },
            body: `body=${encodeURIComponent(JSON.stringify(body))}`,
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                $.logErr('Error: ', e, resp)
                console.warn(`请求${functionId}失败，resp=${JSON.stringify(resp)}，data=${JSON.stringify(data)}, e=${JSON.stringify(e)}`)
            } finally {
                resolve(data)
            }
        })
    })
}

function submitCode(code, user) {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/koi?code=${code}&user=${user}`, timeout: 10000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} 提交助力码 API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.code === 0) {
                            console.log("互助码已提交");
                        }else {
                            console.log("互助码提交失败");
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function readShareCode() {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/get/koi`, timeout: 10000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`助力池 API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function shareCodesFormat() {
    return new Promise(async resolve => {
        let readShareCodeRes = await readShareCode();
        if (readShareCodeRes && readShareCodeRes.code === 0) {
            authorCode = readShareCodeRes.data[0] ? readShareCodeRes.data[0] : '';
            $.newShareCodes = [...new Set([...(readShareCodeRes.data || [])])];
        }
        // console.log(`将要助力的好友${JSON.stringify($.newShareCodes)}`)
        resolve();
    })
}

function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}

function gettimestamp() {
    let time = new Date().getTime();
    return `${time}`;
}

function random(min, max) {
    let num = Math.floor(Math.random() * (max - min)) + min;
    return `${num}`;
}

function randomString(e) {
    e = e || 32;
    let t = "abcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}