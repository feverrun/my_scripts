/***
 *活动入口: 京东极速版 - 发财挖宝
 * cron "11 9,12,20 * * *" script-path=jd_fcwb.js tag=发财挖宝助力
 */
const $ = new Env('发财挖宝助力');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const axios = $.isNode() ? require('axios') : '';
const JD_API_HOST = 'https://api.m.jd.com';
let cookiesArr = [], cookie = '', message;
let inviteCode = ''
let inviter = ''
let firstInviteCode = ''
let firstInviter = ''
let breakFlag = 0;
let autoRun = false;
let linkId = "pTTvJeSTrpthgk9ASBVGsw";
let levelArr = [4, 4, 5];

//默认只助力第一个号(基本环境变量一天一变，为了方便使用者默认只助力第一个号,第一个号助力作者)
if (process.env.FCWB_AUTO_RUN) {
    autoRun = process.env.FCWB_AUTO_RUN;
}

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
}

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }

    console.log(`\n默认只助力第一个号\n`)
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        message = '';
        console.log(`\n******开始【京东账号${$.index}】${$.UserName || $.UserName}*********\n`);

        console.log('\n请先去京东极速版app手动挖宝再运行脚本助力\n');

        await home()
        await $.wait(2000)

        if (autoRun) {
            if (i === 0) {
                let flag = 0;
                switch (curRound) {
                    case 1:
                        flag = levelArr[0];
                        break;
                    case 2:
                        flag = levelArr[1];
                        break;
                    case 3:
                        flag = levelArr[2];
                        break;
                    default:
                        flag = levelArr[0];
                        break;
                }
                for (let i = 0; i < flag; i++) {
                    for (let j = 0; j < flag; j++) {
                        if (breakFlag === 1) {
                            break;
                        } else {
                            console.log('第' + curRound + '关')
                            console.log(`挖宝位置坐标(${i},${j})`)
                            await wb(curRound, i, j)
                            await $.wait(3500)
                        }
                    }
                }
            }
        } else {
            console.log(`如需自动挖宝设置环境变量FCWB_AUTO_RUN为true`)
        }

    }

    if (firstInviteCode) {
        console.log(`\n内部助力开始`);
        for (let k = 0; k < cookiesArr.length; k++) {
            cookie = cookiesArr[k];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            inviteCode = firstInviteCode;
            inviter = firstInviter;
            $.index = k + 1;
            console.log(`${$.UserName} => 帮助 ${inviter}`);
            await help()
            await $.wait(3500)
        }
    }

    console.log('\n');
    await getAuthorShareCode();
    await $.wait(1000)
    try {
        if ($.authorCode) {
            let inviteCode = $.authorCode.inviteCode;
            let inviter = $.authorCode.inviter;
            for (let i = 0; i < 1; i++) {
                cookie = cookiesArr[i] ? cookiesArr[i] : cookiesArr[0];
                inviteCode = inviteCode;
                inviter = inviter;
                $.index = i + 1;
                await help()
                await $.wait(10000)
            }
        }
    } catch (e) {}


})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

//挖宝
function wb(round, rowIdx, colIdx) {
    let body = {"round":round,"rowIdx":rowIdx,"colIdx":colIdx,"linkId":linkId}
    return axios({
        url: JD_API_HOST,
        params: {
            functionId: 'happyDigDo',
            body: body,
            t: Date.now(),
            appid: 'activities_platform',
            client: 'H5',
            clientVersion: '1.0.0',
        },
        data: {},
        headers: {
            Cookie: cookie,
            Origin: "https://api.m.jd.com",
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        },
        method: 'get',
        timeout: 10000,
    }).catch(err => {
        console.log(err)
    })
        .then(res => {
            if (res.status == 200 && res.data) {
                let data = getObject(res.data);
                if (data.success == true) {
                    console.log(`挖到${data.data.chunk.value}`)
                } else if (data.success == false) {
                    console.log(data.errMsg)
                    breakFlag = 1;
                }
            }
        }).catch(err => {
        console.log(err)
    })
}

function home() {
    let body = {"linkId": linkId}
    return axios({
        url: JD_API_HOST,
        params: {
            functionId: 'happyDigHome',
            body: body,
            t: Date.now(),
            appid: 'activities_platform',
            client: 'H5',
            clientVersion: '1.0.0',
        },
        data: {},
        headers: {
            Cookie: cookie,
            Origin: "https://api.m.jd.com",
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        },
        timeout: 10000,
    }).catch(err => {
        console.log(err)
    })
        .then((res) => {
            if (res.status == 200 && res.data) {
                let data = getObject(res.data);
                if (data.success == true) {
                    curRound = data.data.curRound
                    console.log('第' + curRound + '关')
                    console.log(`邀请码:'${data.data.inviteCode}'`)
                    console.log(`邀请者:'${data.data.markedPin}'`)
                    if ($.index === 1) {
                        firstInviteCode = `${data.data.inviteCode}`
                        firstInviter = `${data.data.markedPin}`
                    }
                } else {
                    console.log('黑号 快去买买买！')
                }
            }
        }).catch((err) => {
        console.log(err)
    })
}

function help() {
    let body = {"linkId":linkId,"inviter":inviter,"inviteCode":inviteCode}
    return axios({
        url: JD_API_HOST,
        params: {
            functionId: 'happyDigHelp',
            body: body,
            t: Date.now(),
            appid: 'activities_platform',
            client: 'H5',
            clientVersion: '1.0.0',
        },
        data: {},
        headers: {
            Cookie: cookie,
            Origin: "https://api.m.jd.com",
            'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        },
        method: 'get',
        timeout: 10000,
    }).catch(err => {
        console.log(err)
    })
        .then(res => {
            if (res.status == 200 && res.data) {
                let data = getObject(res.data)
                console.log(data)
            }
        }).catch(err => {
        console.log(err)
    })
}

function getObject(data) {
    if (typeof data == 'string') {
        return JSON.parse(data);
    }
    if (typeof data == 'object') {
        return data;
    }
}

function getAuthorShareCode() {
    return axios({
        url: `http://hz.feverrun.top:99/share/author/fcwb`,
        params: {},
        data: {},
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
        },
        method: 'get',
        timeout: 10000,
    }).catch(function (err) {
        console.log(err)
    })
        .then(function (res) {
            if (res.status == 200 && res.data) {
                $.authorCode = getObject(res.data);
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}