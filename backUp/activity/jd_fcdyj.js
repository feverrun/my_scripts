/*
活动入口： 京东极速版-我的-发财大赢家
cron "7 7,9,12,18 * * *" script-path=jd_fcdyj.js tag=发财大赢家助力
 */

const $ = new Env('发财大赢家');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const axios = $.isNode() ? require('axios') : '';
const dyjCode = $.isNode() ? (process.env.dyjCode ? process.env.dyjCode : null) : null //邀请码变量，不支持多账号，格式：redEnvelopeId@markedPin
let cookiesArr = [], cookie = '';

const JD_API_HOST = `https://api.m.jd.com`;
const LINKID = "PFbUR7wtwUcQ860Sn8WRfw";

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {

    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        return;
    }
    console.log(`\n发财大赢家助力逻辑：优先助力填写的互助码环境变量,格式:redEnvelopeId@markedPin \n`)
    message = ''
    $.helptype = 1
    $.needhelp = true
    $.canDraw = false
    $.canHelp = true;

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        $.hotFlag = false;
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            $.message = `【京东账号${$.index}】${$.UserName}\n`
            console.log(`\n******开始【京东账号${$.index}】${$.UserName || $.UserName}*********\n`);
        }

        if (!dyjCode) {
            console.log(`\n环境变量中没有检测到助力码,开始获取【京东账号${$.index}】助力码\n`)
            await open()
            if ($.hotFlag) continue;
            await getid()
            await $.wait(3000)
        } else {
            dyjStr = dyjCode.split("@")
            if (dyjStr[0]) {
                $.rid = dyjStr[0]
                $.inviter = dyjStr[1]
                $.canRun = true
                console.log(`\n检测到您已填助力码${$.rid}，开始助力\n`)
                await help($.rid, $.inviter, 1)
                if (!$.canRun) {
                    continue;
                }
                await $.wait(3000)
                await help($.rid, $.inviter, 2)
            }
        }
    }

    console.log('\n');
    if (new Date().getHours() >= 9) {
        await getAuthorShareCode()
        if ($.authorCode && $.authorCode.length) {
            //只取前三个号
            for (let i = 0; i < 3; i++) {
                cookie = cookiesArr[i] ? cookiesArr[i] : cookiesArr[0];
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.canRun = true
                // console.log(`\n${$.UserName} 有剩余机会帮助我\n`)
                for (let j = 0; j < $.authorCode.length; j++) {
                    let item = $.authorCode[j];
                    await help(item.redEnvelopeId, item.inviter, 1)
                    if (!$.canRun) {
                        continue;
                    }
                    await $.wait(3000)
                    await help(item.redEnvelopeId, item.inviter, 2)
                }
            }
        }
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        $.canWx = true
        $.rewardType = 2
        if (cookie) {
            $.index = i + 1;
            console.log(`\n******查询【京东账号${$.index}】红包情况******\n`);
            await getinfo()
            if ($.canDraw) {
                await getrewardIndex()
                if ($.canWx) {
                    await exchange()
                }
                await $.wait(3000)
            }
        }
    }

})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function exchange() {
    try {
        let data = await get('exchange', `{"linkId":"${LINKID}", "rewardType":${$.rewardType}}`)

        if (data.success && data.data.chatEnvelopeVo.status == 50059) {
            console.log(`【京东账号${$.UserName}】${data.data.chatEnvelopeVo.message} ，尝试兑换红包...`)
            $.rewardType = 1
            await exchange()
        } else {
            console.log(`【京东账号${$.UserName}】提现成功`)
        }

    }catch (e) {
        console.log(e.message)
    }
}

async function open() {
    try {
        let data = await get('openRedEnvelopeInteract', `{"linkId":'${LINKID}'}`)
        if (data.code === 16020) {
            $.hotFlag = true
            console.log(data.errMsg);
        }
    } catch (e) {
        console.log(e.message)
    }
}

async function getid() {
    try {
        let data = await get('redEnvelopeInteractHome', `{"linkId":'${LINKID}',"redEnvelopeId":"","inviter":"","helpType":""}`)
        if (data.data.state !== 0) {
            if (data.success && data.data) {
                console.log(`\n【您的redEnvelopeId】：${data.data.redEnvelopeId}`)
                console.log(`\n【您的markPin】：${data.data.markedPin}`)
            } else {
                $.canHelp = false
                // console.log(data)
            }
        } else {
            $.canHelp = false
            console.log(`【京东账号${$.index}】为黑号，跳过`)
        }
    }catch (e) {
        console.log(e.message)
    }
}

async function getinfo() {
    try {
        let data = await get('redEnvelopeInteractHome', `{"linkId":"${LINKID}","redEnvelopeId":"","inviter":"","helpType":""}`);

        if (data.data.state !== 0) {
            if (data.success && data.data) {
                if (data.data.state === 3) {
                    console.log("今日已成功兑换")
                    $.needhelp = false
                    $.canDraw = false
                }
                if (data.data.state === 6 || data.data.state === 4) {
                    $.needhelp = false
                    $.canDraw = true
                }
            } else {
                console.log(`当前余额：${data.data.amount} 还需 ${data.data.needAmount} `)
            }
        } else {
            $.canDraw = false
            // console.log(data.data.state)
            console.log(`【京东账号${$.index} - ${$.UserName}】为黑号，跳过`)
        }
    }catch (e) {
        console.log(e.message)
    }
}

async function getrewardIndex() {
    try {
        let data = await get('rewardIndex', `{"linkId":"${LINKID}"}`)

        if (data.success && data.data) {
            if (data.data.haveHelpNum === 10) {
                console.log(`\n【京东账号${$.index}-${$.UserName}】已满足微信提现要求，开始提现\n`)
                $.canWx = true
            }else {
                console.log(`当前已有 ${data.data.haveHelpNum} 人助力，还需 ${data.data.diffNum} 人`)
                $.canWx = false
            }
        }else {
            console.log('黑号')
            $.canWx = false
        }
    }catch (e) {
        console.log(e.message)
    }
}

async function help(rid, inviter, type) {
    try {
        let data = await get('openRedEnvelopeInteract', `{"linkId":"${LINKID}","redEnvelopeId":"${rid}","inviter":"${inviter}","helpType":"${type}"}`);
        if (data.data && data.data.helpResult) {
            // console.log(JSON.stringify(data.data.helpResult))
            if (data.data.helpResult.code === 16005 || data.data.helpResult.code === 16007) {
                $.needhelp = false
                $.canDraw = true
            } else if (data.data.helpResult.code === 16011) {
                $.needhelp = false
            }
        } else {
            // console.log(JSON.stringify(data))
            console.log(`【京东账号${$.UserName}】为黑号，跳过助力`)
            $.canRun = false
        }
    }catch (e) {
        console.log(e.message)
    }
}

function getAuthorShareCode() {
    return new Promise(resolve => {
        $.get({
            url: "http://hz.feverrun.top:99/share/author/fcdyj",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        }, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    $.authorCode = JSON.parse(data);
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function get(function_id, body) {
    return axios({
        url: JD_API_HOST,
        params: {
            functionId: function_id,
            body: body,
            t: Date.now(),
            appid: 'activities_platform',
            client: 'H5',
            clientVersion: '1.0.0',
        },
        data: {},
        method: 'get',
        timeout: 5000,
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,en-US;q=0.9",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "origin": "https://618redpacket.jd.com",
            "Host": "api.m.jd.com",
            "Referer": `https://618redpacket.jd.com/?activityId=${LINKID}&sid=5bb462f4d59c11e6a3d1bf3761ce7adw&un_area=12_984_13989_47891`,
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdltapp;android;3.5.6;9;8363532363230343238303836333-43D2468336563316936636265356;network/wifi;model/MI 8;addressid/2688971613;aid/059b2009dc5afb88;oaid/665d225a3f96764;osVer/28;appBuild/1656;psn/gB6yf l3bIcXHm 4uTHuFZIigUClYKza5OsTPc6vgTc=|932;psq/11;adk/;ads/;pap/JA2020_3112531|3.5.6|ANDROID 9;osv/9;pv/712.12;jdv/0|direct|-|none|-|1613884468974|1613884552;ref/HomeFragment;partner/xiaomi;apprpd/Home_Main;eufv/1;Mozilla/5.0 (Linux; Android 9; MI 8 Build/PKQ1-wesley_iui-19.08.25; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36"),
        },
    }).catch(err => {
        console.log(err)
    })
        .then(res => {
            if (res.status == 200 && res.data) {
                return getObject(res.data);
            }
        }).catch(err => {
            console.log(err)
        })
}

function taskUrl(function_id, body) {
    return {
        url: `${JD_API_HOST}/?functionId=${function_id}&body=${encodeURIComponent(body)}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.2`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": `https://618redpacket.jd.com/?activityId=${LINKID}&channel=wjicon&sid=0a1ec8fa2455796af69028f8410996aw&un_area=1_2803_2829_0`,
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdltapp;android;3.5.6;9;8363532363230343238303836333-43D2468336563316936636265356;network/wifi;model/MI 8;addressid/2688971613;aid/059b2009dc5afb88;oaid/665d225a3f96764;osVer/28;appBuild/1656;psn/gB6yf l3bIcXHm 4uTHuFZIigUClYKza5OsTPc6vgTc=|932;psq/11;adk/;ads/;pap/JA2020_3112531|3.5.6|ANDROID 9;osv/9;pv/712.12;jdv/0|direct|-|none|-|1613884468974|1613884552;ref/HomeFragment;partner/xiaomi;apprpd/Home_Main;eufv/1;Mozilla/5.0 (Linux; Android 9; MI 8 Build/PKQ1-wesley_iui-19.08.25; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36"),
        }
    }
}

function getObject(data) {
    if (typeof data == 'string') {
        return JSON.parse(data);
    }
    if (typeof data == 'object') {
        return data;
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

// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }