/*
赚京豆-瓜分京豆脚本，一：做任务 天天领京豆(加速领京豆)
活动入口：赚京豆-瓜分京豆(微信小程序)-赚京豆-瓜分京豆-瓜分京豆
更新地址：jd_syj.js
已支持IOS双京东账号, Node.js支持N个京东账号
[Script]
cron "39 6,8,13,23 * * *" script-path=jd_zjd.js, tag=赚京豆-瓜分京豆
 */
const $ = new Env('赚京豆-瓜分京豆');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const axios = $.isNode() ? require('axios') : '';
$.CryptoJS = $.isNode() ? require('crypto-js') : '';
const {format} = $.isNode() ? require("date-fns") : '';
let jdNotify = true;    //是否关闭通知，false打开通知推送，true关闭通知推送
let cookiesArr = [], cookie = '', message;
$.tuanList = [];
$.authorTuanList = [];
inviteCodes=[];
const JD_API_HOST = 'https://api.m.jd.com/api';
$.appId = 'd8ac0';

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0);
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    await $.wait(7000);
    console.log("等待7妙开始执行...");
    await requestAlgo('d8ac0');
    await $.wait(1500);
    for (let i = 0; i < cookiesArr.slice(0,20).length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            message = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await main()
            await $.wait(900);
        }
    }

    console.log(JSON.stringify($.tuanList));
    await requestAlgo('d8ac0');
    return;
    console.log(`\n\n内部互助 【赚京豆-瓜分京豆(微信小程序)-瓜分京豆】活动(内部账号互助(需内部cookie数量大于${$.assistNum || 4}个))\n`)
    console.log(JSON.stringify($.tuanList));
    for (let i = 0; i < cookiesArr.length; i++) {
        $.canHelp = true
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            if ((cookiesArr.length >= $.assistNum)) {
                if ($.index == 1 && $.UserName != '18862988021_p') {
                    try {
                        let authorTuanInfo = await getSyj();
                        if (authorTuanInfo) {
                            console.log(`开始账号内部互助 赚京豆-瓜分京豆 活动`)
                            console.log(`账号 ${$.UserName} 开始 ${authorTuanInfo['assistedPinEncrypted']}助力`);
                            await zjdInit()
                            await $.wait(1900);
                            await helpFriendTuan(authorTuanInfo['activityIdEncrypted'], authorTuanInfo['assistStartRecordId'], authorTuanInfo['assistedPinEncrypted'])
                            // if(!$.canHelp) break
                            await $.wait(3600);
                        }
                    } catch (e) {}
                } else {
                    try {
                        if ($.index == 1) {
                            continue;
                        }
                        if ($.tuanList.length) {
                            $.log($.tuanList.length)
                        }
                        console.log(`开始账号内部互助 赚京豆-瓜分京豆-瓜分京豆 内部账号互助`);
                        await zjdInit();
                        for (let j = 0; j < $.tuanList.length; ++j) {
                            await $.wait(1500);
                            console.log(`账号 ${$.UserName} 开始给 【${$.tuanList[j]['assistedPinEncrypted']}】助力`)
                            let activityIdEncrypted = $.tuanList[j]['activityIdEncrypted'];
                            let assistStartRecordId = $.tuanList[j]['assistStartRecordId'];
                            let assistedPinEncrypted = $.tuanList[j]['assistedPinEncrypted'];
                            await $.wait(1900);
                            await helpFriendTuan(activityIdEncrypted, assistStartRecordId, assistedPinEncrypted);
                            // if (!$.canHelp) break
                            await $.wait(3600)
                        }
                    } catch (e) {
                        console.log(JSON.stringify(e));
                    }
                }
            }else{
                console.log('内部账号小于'+$.assistNum+',退出执行!!!');
                break;
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

function showMsg() {
    return new Promise(resolve => {
        if (message) $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
        resolve()
    })
}
async function main() {
    try {
        await getUA();
        await $.wait(2500);
        await distributeBeanActivity();
        await $.wait(700);
        await showMsg();
    } catch (e) {
        $.logErr(e)
    }
}

async function distributeBeanActivity() {
    try {
        $.tuan = ''
        $.hasOpen = false;
        $.assistStatus = 0;
        await getUserTuanInfo()
        // if (!$.tuan && ($.assistStatus === 3 || $.assistStatus === 2 || $.assistStatus === 0) && $.canStartNewAssist) {
        //     console.log(`准备再次开团`)
        //     await requestAlgo('dde2b');
        //     await $.wait(1500);
        //     // await openTuan()
        //     if ($.hasOpen) await getUserTuanInfo()
        // }
        // if ($.tuan && $.tuan.hasOwnProperty('assistedPinEncrypted') && $.assistStatus !== 3) {
        //     // console.log(JSON.stringify($.tuan))
        //     $.tuanList.push($.tuan);
        //     if ($.UserName === '18862988021_p') {
        //         await submitSyj(JSON.stringify($.tuan), $.UserName);
        //     }
        // }
    } catch (e) {
        $.logErr(e);
    }
}

//领取200京豆
function pg_interact_interface_invoke(floorToken) {
    const body = {floorToken, "dataSourceCode": "takeReward", "argMap": {}}
    const options = {
        url: `${JD_API_HOST}?functionId=pg_interact_interface_invoke&body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        }
    }
    return new Promise((resolve) => {
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data['success']) {
                            console.log(`【做任务 天天领京豆】${data['data']['rewardBeanAmount']}京豆领取成功`);
                            $.rewardBeanNum += data['data']['rewardBeanAmount'];
                            message += `${message ? '\n' : ''}【做任务 天天领京豆】${$.rewardBeanNum}京豆`;
                        } else {
                            console.log(`【做任务 天天领京豆】${data.message}`);
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function openRedPacket(floorToken) {
    const body = {floorToken, "dataSourceCode": "openRedPacket", "argMap": {}}
    const options = {
        url: `${JD_API_HOST}?functionId=pg_interact_interface_invoke&body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        }
    }
    return new Promise((resolve) => {
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data['success']) {
                            console.log(`活动开启成功，初始：${data.data && data.data['activityBeanInitAmount']}京豆`)
                            $.vvipFlag = true;
                        } else {
                            console.log(data.message)
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
//================赚京豆-瓜分京豆-加速领京豆===========END========
//================赚京豆-瓜分京豆开团===========
async function helpFriendTuan(activityIdEncrypted='',assistStartRecordId='',assistedPinEncrypted='') {
    return new Promise(async resolve => {
        let body ={"activityIdEncrypted":activityIdEncrypted,"assistStartRecordId":assistStartRecordId,"assistedPinEncrypted":assistedPinEncrypted,"channel":"FISSION_BEAN","launchChannel":"undefined"}
        let body1 = {"activityIdEncrypted": $.tuanActId, "channel": "FISSION_BEAN"}
        //b9790
        // let h5st = '20220416232106280%3B5656264180344527%3Bb9790%3Btk02a91111b6a18pMXgxKzFNVHB59%2B1vWVFLgVvKl1hpZGF1XruoQBZGCLLWpKvzmTIcLhJixVKIA1aB6Pfq3gSj626K%3B6a6b6fbc54ccba3d6d8875c626d60a8ba17433195a568534085d0baf6c348f99%3B3.0%3B1650122466280';
        //let hst = await getH5st('vvipclub_distributeBean_assist', body1, 'b9790');
        let fn = 'vvipclub_distributeBean_assist';
        h5st = '';
        $.post(taskTuanHelpUrl("vvipclub_distributeBean_assist", body, h5st), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    console.log(JSON.stringify(data));
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data.success) {
                            console.log('助力结果：助力成功\n')
                        } else {
                            if (data.resultCode === '9200008') console.log('助力结果：不能助力自己\n')
                            else if (data.resultCode === '9200011') console.log('助力结果：已经助力过\n')
                            else if (data.resultCode === '2400205') console.log('助力结果：团已满\n')
                            else if (data.resultCode === '2400203') {console.log('助力结果：助力次数已耗尽\n');$.canHelp = false}
                            else if (data.resultCode === '9000000') {console.log('助力结果：活动火爆，跳出\n');$.canHelp = false}
                            else if (data.resultCode === '9000013') {console.log('助力结果：活动火爆，跳出\n');$.canHelp = false}
                            else if (data.resultCode === '101') {console.log('未登录，跳出\n');$.canHelp = false}
                            else console.log(`助力结果：火爆，已经助力过\n${JSON.stringify(data)}\n\n`)
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

async function getUserTuanInfo() {
    return new Promise(async resolve => {
        let body = {"paramData": {"channel": "FISSION_BEAN"}}
        // let h5st = '
        //20220422165020596;5656264180344527;d8ac0;tk02aabe41c8b18pMngyKzNaTlh2/z0+x6cDhGSBEejmXGhv2EoKy8LgVBo0R5Pe6yxamBzg3gd5UG0UncuqGSQvRPql;dffd3c57f3b20070936a7c78f60a7e0c2e78b586c142cf954e021b714ba34ca2;3.0;1650617420596
        //20220422165020596%3B5656264180344527%3Bd8ac0%3Btk02aabe41c8b18pMngyKzNaTlh2%2Fz0%2Bx6cDhGSBEejmXGhv2EoKy8LgVBo0R5Pe6yxamBzg3gd5UG0UncuqGSQvRPql%3Bdffd3c57f3b20070936a7c78f60a7e0c2e78b586c142cf954e021b714ba34ca2%3B3.0%3B1650617420596
        //20220422180025606%3B7905356237591165%3Bd8ac0%3Btk02a77bc1ab318npeXcbBVocGhGk14VKY%2B70r1ZDn5RSrWD4f7I9lukDYVWvB0WHmOWLaK0FYp0d86q8wjd1ArE%2BJZS%3Bb5d5975ccd6b5737644e1fa6d6509310a35db84b893f56e27723b6222f371fe6%3B3.0%3B1650621625606
        // let h5st = geth5st('distributeBeanActivityInfo', body, 'd8ac0');
        // let h5st = '20220422165020596%3B5656264180344527%3Bd8ac0%3Btk02aabe41c8b18pMngyKzNaTlh2%2Fz0%2Bx6cDhGSBEejmXGhv2EoKy8LgVBo0R5Pe6yxamBzg3gd5UG0UncuqGSQvRPql%3Bdffd3c57f3b20070936a7c78f60a7e0c2e78b586c142cf954e021b714ba34ca2%3B3.0%3B1650617420596';

        let h5st =  await geth5st('distributeBeanActivityInfo', body, 'd8ac0');
        console.log(`h5st:${h5st}`);
        $.post(taskTuanUrl("distributeBeanActivityInfo", body, h5st), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data['success']) {
                            $.log(`\n\n当前【赚京豆-瓜分京豆(微信小程序)-瓜分京豆】能否再次开团: ${data.data.canStartNewAssist ? '可以' : '否'}`)
                            console.log(`assistStatus ${data.data.assistStatus}`)
                            if (data.data.assistStatus === 1 && !data.data.canStartNewAssist) {
                                console.log(`已开团(未达上限)，但团成员人未满\n\n`)
                            } else if (data.data.assistStatus === 3 && data.data.canStartNewAssist) {
                                console.log(`已开团(未达上限)，团成员人已满\n\n`)
                            } else if (data.data.assistStatus === 3 && !data.data.canStartNewAssist) {
                                console.log(`今日开团已达上限，且当前团成员人已满\n\n`)
                            }
                            if (data.data && !data.data.canStartNewAssist) {
                                $.tuan = {
                                    "activityIdEncrypted": data.data.id,
                                    "assistStartRecordId": data.data.assistStartRecordId,
                                    "assistedPinEncrypted": data.data.encPin,
                                    "channel": "FISSION_BEAN"
                                }
                                console.log($.tuan);
                            }
                            $.tuanActId = data.data.id;
                            $.assistNum = data['data']['assistNum'] || 4;
                            $.assistStatus = data['data']['assistStatus'];
                            $.canStartNewAssist = data['data']['canStartNewAssist'];
                        } else {
                            $.tuan = true;//活动火爆
                            console.log(`赚京豆-瓜分京豆(微信小程序)-瓜分京豆】获取【活动信息失败 ${JSON.stringify(data)}\n`)
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

async function openTuan() {
    return new Promise(async resolve => {
        let body = {"activityIdEncrypted": $.tuanActId, "channel": "FISSION_BEAN"}
        // let h5st = '20220416210009645%3B5656264180344527%3Bdde2b%3Btk02aa3851b9c18pMysyeDIrMWJUb1gQgwDa2ZGRw7A9VjqXUEkg9IDWCsxjIm89AIM2QWDgbfJA1MZg%2FXUr0g9gNenG%3B579cf5797a63874fb87936bb266a40ed7eaca710902a23115bdd21176fd6093c%3B3.0%3B1650114009645'
        let h5st = await geth5st();
        $.post(taskTuanUrl("vvipclub_distributeBean_startAssist", body,h5st), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    console.log(JSON.stringify(data));
                    await $.wait(2500);
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data['success']) {
                            console.log(`【赚京豆-瓜分京豆(微信小程序)-瓜分京豆】开团成功`)
                            $.hasOpen = true
                        } else {
                            console.log(`\n开团失败：${JSON.stringify(data)}\n`)
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

//======================赚京豆-瓜分京豆开团===========END=====
function taskUrl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram&h5st=${h5st}&osVersion=5.0.0&clientVersion=3.1.3&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        }
    }
}

function taskTuanUrl(function_id, body = {},h5st) {
    return {
        url: `https://api.m.jd.com/api?functionId=${function_id}&fromType=wxapp&timestamp=${Date.now()}`, //1650122466392 - ${Date.now()}`,
        body:`body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram&h5st=${h5st}&uuid=81890437126031650111868778&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; Charset=UTF-8",
            "Host": "api.m.jd.com",
            "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/182/page-frame.html",
            "Cookie": cookie,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/3211 MMWEBSDK/20220303 Mobile Safari/537.36 MMWEBID/462 MicroMessenger/8.0.21.2120(0x2800153B) Process/appbrand2 WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
        }
    }
}

function taskTuanHelpUrl(function_id, body = {},h5st) {
    // console.log(`body:${JSON.stringify(body)}`);
    // console.log(`h5st:${encodeURIComponent(h5st)}`);
    return {
        url: `https://api.m.jd.com/api?functionId=${function_id}&fromType=wxapp&timestamp=${Date.now()}`, //1650122466392 - ${Date.now()}`,
        body:`body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram&h5st=${encodeURIComponent(h5st)}&uuid=81890437126031650111868778&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; Charset=UTF-8",
            "Host": "api.m.jd.com",
            "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/182/page-frame.html",
            "Cookie": cookie,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/3211 MMWEBSDK/20220303 Mobile Safari/537.36 MMWEBID/462 MicroMessenger/8.0.21.2120(0x2800153B) Process/appbrand2 WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
        }
    }
}


function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
            headers: {
                Host: "wq.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                Cookie: cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Accept-Language": "zh-cn",
                "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
                "Accept-Encoding": "gzip, deflate, br"
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 1001) {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data['retcode'] === 0 && data.data && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        console.log('京东服务器返回空数据');
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve();
            }
        })
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

function submitSyj(code, user) {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/author?code=${code}&user=${user}&flag=syj`, timeout: 10000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {}
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function getSyj() {
    return new Promise(async resolve => {
        $.get({
            url: `http://hz.feverrun.top:99/share/get/author?flag=syj`,
            timeout: 10000
        }, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data && safeGet(data)) {
                        data = JSON.parse(data);
                    }else {
                        data = data;
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

function getUA(){
    $.UA = `jdapp;iPhone;10.4.0;14.3;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/4199175193;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
}
function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

/**
 * 获取url参数值
 * @param url
 * @param name
 * @returns {string}
 */
function getUrlData(url, name) {
    if (typeof URL !== "undefined") {
        let urls = new URL(url);
        let data = urls.searchParams.get(name);
        return data ? data : '';
    } else {
        const query = url.match(/\?.*/)[0].substring(1)
        const vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=')
            if (pair[0] === name) {
                // return pair[1];
                return vars[i].substr(vars[i].indexOf('=') + 1);
            }
        }
        return ''
    }
}

/*
修改时间戳转换函数，京喜工厂原版修改
 */
Date.prototype.Format = function (fmt) {
    var e,
        n = this, d = fmt, l = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "D+": n.getDate(),
            "h+": n.getHours(),
            "H+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "w+": n.getDay(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            "S+": n.getMilliseconds()
        };
    /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
    for (var k in l) {
        if (new RegExp("(".concat(k, ")")).test(d)) {
            var t, a = "S+" === k ? "000" : "00";
            d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
        }
    }
    return d;
}

async function requestAlgo(appId) {
    $.appId = appId ? appId : $.appId;
    $.fingerprint = await generateFp();
    const options = {
        "url": `https://cactus.jd.com/request_standby_algo`,    //https://cactus.jd.com/request_algo?g_ty=ajax
        "headers": {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            'host': 'cactus.jd.com',
            'Referer': 'https://cactus.jd.com',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/3211 MMWEBSDK/20220303 Mobile Safari/537.36 MMWEBID/462 MicroMessenger/8.0.21.2120(0x2800153B) Process/appbrand1 WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android;'
        },
        'body': JSON.stringify({
            "appId": $.appId.toString(),
            "expandParams": "",
            "fp": $.fingerprint,
            "platform": "applet",
            "timestamp": Date.now(),
            "version": "3.0",
        })
    }
    await $.wait(1500);
    return new Promise(async resolve => {
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    // console.log(`${JSON.stringify(err)}`)
                    // console.log(`request_algo 签名参数API请求失败，请检查网路重试`)
                    console.log(`签名参数API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        console.log(data);
                        data = JSON.parse(data);
                        if (data['status'] === 200) {
                            $.token = data.data.result.tk;
                            //function test(tk,fp,ts,ai,algo){var rd='Pt03xDmlYLxK';var str=`${tk}${fp}${ts}${ai}${rd}`;return algo.SHA256(str)}
                            // let enCryptMethodJDString = data.data.result.algo;
                            // if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
                            // console.log(`获取签名参数成功！`)
                            // console.log(`fp: ${$.fingerprint}`)
                            // console.log(`token: ${$.token}`)
                            // console.log(`enCryptMethodJD: ${enCryptMethodJDString}`)
                        } else {
                            // console.log(`fp: ${$.fingerprint}`)
                            // console.log('request_algo 签名参数API请求失败:')
                        }
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
        await $.wait(2500);
    })
}

function geth5st(fn, body, appId) {
    let time = Date.now();
    const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");
    //fn body t appid client clientVersion
    let st = `functionId=${fn}&body${$.CryptoJS.MD5(JSON.stringify(body).toString())}&t=${timestamp.toString()}&appid=swat_miniprogram&client=tjj_m&clientVersion=3.1.3`;

    $.appId = appId ? appId : $.appId;
    let hash1 = '';
    if ($.fingerprint && $.token && $.enCryptMethodJD) {
        //function test(tk,fp,ts,ai,algo){var rd='Pt03xDmlYLxK';var str=`${tk}${fp}${ts}${ai}${rd}`;return algo.SHA256(str)}
        hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
    } else {
        const random = 'OOo4zNFTTLW7';
        $.token = `${$.token}`;
        $.fingerprint = $.fingerprint;
        const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;
        hash1 = $.CryptoJS.MD5(str).toString($.CryptoJS.enc.Hex);
        console.log(hash1);
    }
    st = st ? st : '';
    // console.log(`st:${st}`);
    const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
    // console.log(`\nst:${st}`)
    // console.log(`h5st:${["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat($.appId.toString()), "".concat(token), "".concat(hash2)].join(";")}\n`)
    // return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"))
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2), "".concat("3.0"), "".concat(time)].join(";"))
}


/**
 * 模拟生成 fingerprint
 * @returns {string}
 */
function generateFp() {
    let e = "0123456789";
    let a = 13;
    let i = '';
    for (; a--; )
        i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0,16)
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date(new Date().getTime()+new Date().getTimezoneOffset()*60*1000+8*60*60*1000);let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
