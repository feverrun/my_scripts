/*
cron 5 1,12 10-31 12 * jd_vivo.js
* */
const $ = new Env('戏剧大赛');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [];
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let activityID = '',cookie = '',userName = '';
let token = '',LZ_TOKEN_KEY = '',LZ_TOKEN_VALUE = '',Referer = '',nickname = '';
let Host = '', venderId = ``,shopId = ``,pin =  ``,lz_jdpin_token = ``,UA;
let hotFlag = false;
let attrTouXiang = '',actorUuid = '';
let hotList =  [];
let shareList = [];
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    $.shareUuid = '';``
    let shareList = ['415e40f8d8814eeab9c6d7d5c56c312e'];
    let activityList = [{'id':'2112100008586801','endTime':'1640966400000'}];
    for (let i = 0; i < cookiesArr.length; i++) {
        if(shareList.length > 0){
            $.shareUuid = getRandomArrayElements(shareList,1)[0];
        }
        UA = `jdapp;iPhone;10.0.8;14.6;${uuidRandom()};network/wifi;JDEbook/openapp.jdreader;model/iPhone9,2;addressid/2214222493;appBuild/168841;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16E158;supportJDSHWK/1`;
        let index = i + 1;
        cookie = cookiesArr[i];
        userName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        if(hotList.indexOf(userName) !== -1){
            continue;
        }
        console.log(`\n*****开始【京东账号${index}】${userName}*****\n`);
        hotFlag = false;
        for (let j = 0; j < activityList.length && !hotFlag; j++) {
            let nowTime = Date.now();
            if(nowTime < activityList[j].endTime){
                activityID = activityList[j].id;
                console.log(`\n活动ID：`+ activityID);
                await main();
            }else{
                console.log(`\n活动ID：${activityID},已过期`)
            }
        }
    }
})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
});


async function main() {
    $.UA =  $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0");
    Host = `lzkjdz-isv.isvjcloud.com`;
    Referer = `https://lzkjdz-isv.isvjcloud.com/m/1000085868/99/${$.shareUuid}/?helpUuid=${$.shareUuid}`;
    console.log(`活动地址：${Referer}`);
    token = '',LZ_TOKEN_KEY='',LZ_TOKEN_VALUE='',lz_jdpin_token = ``,venderId = ``,shopId = ``,pin =  ``,nickname = '',actorUuid = '';
    token = await getToken();
    if(!token){console.log(`获取token失败`);return;}
    await getHtml();
    await getWxCommonInfoToken('https://lzkjdz-isv.isvjcloud.com/wxCommonInfo/token');
    if(!LZ_TOKEN_KEY || !LZ_TOKEN_VALUE){
        console.log(`初始化失败`);return;
    }
    $.venderId = '';
    await getSimpleActInfoVo(1);
    await getSimpleActInfoVo(2);
    venderId = $.venderId;
    console.log(`venderId :${venderId}`);
    await getMyPing('https://lzkjdz-isv.isvjcloud.com/customer/getMyPing');
    if (pin === ``) {hotFlag = true;console.log(`获取pin失败,该账号可能是黑号`);return;}
    await accessLogWithAD('https://lzkjdz-isv.isvjcloud.com/common/accessLogWithAD');
    $.activityData = {};
    await takePostRequest('activityContent');
    if(JSON.stringify($.activityData) === '{}'){
        console.log(`获取活动信息失败`);
        return ;
    }
    console.log(`获取活动信息成功`);
    $.cardInfo = {};
    await takePostRequest('getOpenCardStatusWithOutSelf');
    actorUuid = $.activityData.uuid;
    console.log(`助力码：${actorUuid}`)
    await $.wait(3000);
    if($.cardInfo.openCard){
        console.log(`已开卡`);
    }else if($.shareUuid){
        await join()
        await takePostRequest('activityContent');
        await $.wait(3000)
    }
    await doTask();
    await takePostRequest('activityContent');
    await $.wait(3000)
    let myValue = $.activityData.myValue;
    let time = Math.floor(myValue/100);
    console.log(`可以抽奖：${time}次`);
    for (let i = 0; i < time; i++) {
        console.log(`\n进行一次抽奖`);
        await takePostRequest('start');
        await $.wait(3000)
    }
}
function getWxCommonInfoToken (url) {
    const method = `POST`;
    const headers = {
        'X-Requested-With' : `XMLHttpRequest`,
        'Connection' : `keep-alive`,
        'Accept-Encoding' : `gzip, deflate, br`,
        'Content-Type' : `application/x-www-form-urlencoded`,
        'Origin' : `https://${Host}`,
        "User-Agent": UA,
        'Cookie' : cookie,
        'Host' : Host,
        'Referer' : Referer,
        'Accept-Language' : `zh-cn`,
        'Accept' : `application/json`
    };
    const body = ``;
    const myRequest = {url: url, method: method, headers: headers, body: body};
    return new Promise(resolve => {
        $.post(myRequest, async (err, resp, data) => {
            try {
                let res = $.toObj(data);
                if(typeof res == 'object' && res.result === true){
                    if(typeof res.data.LZ_TOKEN_KEY != 'undefined') LZ_TOKEN_KEY = res.data.LZ_TOKEN_KEY;
                    if(typeof res.data.LZ_TOKEN_VALUE != 'undefined') LZ_TOKEN_VALUE = res.data.LZ_TOKEN_VALUE;
                }else if(typeof res == 'object' && res.errorMessage){
                    console.log(`token ${res.errorMessage || ''}`)
                }else{
                    console.log(data)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

async function doTask(){
    $.barrage = {};
    await takePostRequest('getBarrage');
    await $.wait(2000);
    for (let i = 0; i < $.barrage.dayHasSendTimes; i++) {
        console.log(`发送弹幕`);
        await takePostRequest('sendBarrage');
        await $.wait(3000);
    }
    if(!$.activityData.drawContentVO.hasFollow){
        console.log(`任务:关注店铺,去完成`);
        await takePostRequest('followShop');
        await $.wait(3000);
    }else{
        console.log(`任务:关注店铺,已完成`);
    }
    if($.activityData.liveInfo.canWatch){
        console.log(`任务:爆笑直播间,去完成`);
        await takePostRequest('watchLive');
        await $.wait(3000);
    }else{
        console.log(`任务:爆笑直播间,已完成`);
    }
    for (let i = 0; i < 1; i++) {//$.activityData.videoList.length
        if($.activityData.videoList[i].canWatch){
            $.taskId = $.activityData.videoList[i].taskId;
            console.log(`任务:看视频,${$.activityData.videoList[i].name},${$.activityData.videoList[i].taskId},去完成`);
            await takePostRequest('watchVideo');
            await $.wait(3000);
        }
    }
    if($.activityData.addTaskStatus){
        console.log(`任务:一键加购,去完成`);
        await takePostRequest('addCard');
        await $.wait(3000);
    }else{
        console.log(`任务:一键加购,已完成`);
    }

    if($.activityData.canAnswer){
        console.log(`任务:回答问题,去完成`);
        $.questiont = {};
        await takePostRequest('getQuestiont');
        await $.wait(3000);
        let allquestion = $.questiont.vivoComedyAnswerInfoList;
        for (let i = 0; i < allquestion.length; i++) {
            $.oneAnswer = allquestion[i];
            if($.oneAnswer.isRightKey === '1'){
                console.log(`问题：${$.questiont.content},答案选择：${$.oneAnswer.content}`);
                await takePostRequest('answer');
            }
        }
    }else{
        console.log(`任务:回答问题,已完成`);
    }
}
function takePostRequest(type) {
    let url = '';
    let body = ``;
    switch (type) {
        case 'activityContent':
            url = 'https://lzkjdz-isv.isvjcloud.com/crm/vivo/comedy/activityContent';
            body = `activityId=${activityID}&pin=${encodeURIComponent(pin)}&uuid=${$.shareUuid}`;
            break;
        case 'getOpenCardStatusWithOutSelf':
            url = 'https://lzkjdz-isv.isvjcloud.com/crmCard/common/coupon/getOpenCardStatusWithOutSelf';
            body = `venderId=1000085868&activityId=${activityID}&pin=${encodeURIComponent(pin)}&uuid=${$.shareUuid}`;
            break;
        case 'getBarrage':
            url = 'https://lzkjdz-isv.isvjcloud.com/crm/vivo/comedy/getBarrage';
            body = `activityId=2112100008586801&pin=${encodeURIComponent(pin)}&rankSize=100`;
            break;
        case 'sendBarrage':
            let messageList = ['爱上同款手机了','看到了我的同款X70Pro+！','不错买买买','节目也太好看了吧'];
            let message = getRandomArrayElements(messageList,1)[0];
            url = 'https://lzkjdz-isv.isvjcloud.com/crm/vivo/comedy/sendBarrage';
            body = `activityId=2112100008586801&pin=${encodeURIComponent(pin)}&content=${encodeURIComponent(message)}`;
            break;
        case 'watchLive':
        case 'addCard':
        case 'getQuestiont':
        case 'followShop':
        case 'start':
            url = `https://lzkjdz-isv.isvjcloud.com/crm/vivo/comedy/${type}`;
            body = `activityId=2112100008586801&pin=${encodeURIComponent(pin)}`;
            break;
        case 'watchVideo':
            url = 'https://lzkjdz-isv.isvjcloud.com/crm/vivo/comedy/watchVideo';
            body = `activityId=2112100008586801&pin=${encodeURIComponent(pin)}&taskId=${$.taskId}`;
            break;
        case 'answer':
            url = 'https://lzkjdz-isv.isvjcloud.com/crm/vivo/comedy/answer';
            body = `activityId=2112100008586801&pin=${encodeURIComponent(pin)}&vivoUserQaVo=${encodeURIComponent(JSON.stringify({"questionId":$.oneAnswer.questionId,"answerId":$.oneAnswer.id,"isRightKey":"1"}))}`;
            break;
        default:
            console.log(`错误${type}`);
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                deakCK(resp)
                dealReturn(type, data);
            } catch (e) {
                console.log(data);
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function dealReturn(type, data) {
    if(type === 'drawContent' || type ===  'getSimpleActInfoVo'){
        return;
    }
    try {
        data = JSON.parse(data);
    } catch (e) {
        console.log(`执行任务异常`);
        console.log(data);
    }
    if (data.data && data.result && data.count === 0 ||  type ===  'getOpenCardStatusWithOutSelf') {
    } else {
        console.log(`\n${type},执行异常`);
        console.log(JSON.stringify(data));
    }
    switch (type) {
        case 'activityContent':
            $.activityData = data.data;
            break;
        case 'getOpenCardStatusWithOutSelf':
            $.cardInfo = data;
            break;
        case 'getBarrage':
            $.barrage = data.data;
            break;
        case 'sendBarrage':
        case 'watchLive':
        case 'watchVideo':
        case 'addCard':
        case 'answer':
        case 'start':
            console.log(JSON.stringify(data));
            break;
        case 'getQuestiont':
            $.questiont = data.data;
            break;
        default:
            console.log(JSON.stringify(data));
    }
}
function getHtml() {
    let config ={
        url:Referer,
        headers: {
            'Host':Host,
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Cookie': `IsvToken=${token};${cookie} LZ_TOKEN_KEY=${LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${LZ_TOKEN_VALUE}; AUTH_C_USER=${pin}; ${lz_jdpin_token}`,
            "User-Agent": $.UA,
            'Accept-Language':'zh-cn',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive'
        }
    }
    return new Promise(resolve => {
        $.get(config, (err, resp, data) => {
            deakCK(resp);
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {

                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function accessLogWithAD(url) {
    let body = `venderId=${venderId}&code=99&pin=${encodeURIComponent(pin)}&activityId=${activityID}&pageUrl=${encodeURIComponent(Referer)}&subType=app&adSource=null`
    let myRequest = getPostRequest(url, body);
    return new Promise(resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    deakCK(resp)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function getPostRequest(url, body) {
    const headers = {
        'X-Requested-With' : `XMLHttpRequest`,
        'Connection' : `keep-alive`,
        'Accept-Encoding' : `gzip, deflate, br`,
        'Content-Type' : `application/x-www-form-urlencoded`,
        'Origin' : `https://${Host}`,
        "User-Agent": $.UA,
        'Cookie': `${cookie} LZ_TOKEN_KEY=${LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${LZ_TOKEN_VALUE}; AUTH_C_USER=${pin}; ${lz_jdpin_token}`,
        'Host' : Host,
        'Referer' : Referer,
        'Accept-Language' : `zh-cn`,
        'Accept' : `application/json`
    };
    return {url: url, method: `POST`, headers: headers, body: body};
}
function getMyPing(url) {
    let body = `userId=${venderId}&token=${encodeURIComponent(token)}&fromType=APP`;
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                deakCK(resp)
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log(`执行任务异常`);
                    console.log(data);
                }
                if (data.data && data.data.secretPin) {
                    pin = data.data.secretPin
                    nickname = data.data.nickname
                } else {
                    console.log(JSON.stringify(data));
                }
            } catch (e) {
                console.log(data);
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getToken() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
        body: `body=%7B%22url%22%3A%22https%3A//lzkjdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=dacd2d8b7ceb4b909d1601b4d3b6fc1f&client=apple&clientVersion=9.4.0&st=1639109215000&sv=111&sign=25846b1c57375bba2500f0f0c243f5d9`,
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data['token'] || '');
            }
        })
    })
}
function deakCK(resp) {
    let setcookie = resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || ''
    if(setcookie){
        let lzjdpintoken = setcookie.filter(row => row.indexOf("lz_jdpin_token") !== -1)[0]
        if(lzjdpintoken && lzjdpintoken.indexOf("lz_jdpin_token=") > -1){
            lz_jdpin_token = lzjdpintoken.split(';') && (lzjdpintoken.split(';')[0] + ';') || ''
        }
        let LZTOKENKEY = setcookie.filter(row => row.indexOf("LZ_TOKEN_KEY") !== -1)[0]
        if(LZTOKENKEY && LZTOKENKEY.indexOf("LZ_TOKEN_KEY=") > -1){
            LZ_TOKEN_KEY = LZTOKENKEY.split(';') && (LZTOKENKEY.split(';')[0]) || ''
            LZ_TOKEN_KEY = LZ_TOKEN_KEY.replace('LZ_TOKEN_KEY=','')
        }

        let LZTOKENVALUE = setcookie.filter(row => row.indexOf("LZ_TOKEN_VALUE") !== -1)[0]
        if(LZTOKENVALUE && LZTOKENVALUE.indexOf("LZ_TOKEN_VALUE=") > -1){
            LZ_TOKEN_VALUE = LZTOKENVALUE.split(';') && (LZTOKENVALUE.split(';')[0]) || ''
            LZ_TOKEN_VALUE = LZ_TOKEN_VALUE.replace('LZ_TOKEN_VALUE=','')
        }
    }
}
function getSimpleActInfoVo(type) {
    let url = '';
    if(type === 1){
        url = 'https://lzkjdz-isv.isvjcloud.com/common/brand/getSimpleActInfoVo?activityId=2112100008586801';
    }else{
        url = 'https://lzkjdz-isv.isvjcloud.com/common/brand/getFullActInfoVo?activityId=2112100008586801';
    }
    let opt = {
        url: url,
        headers: {
            "Host": "lzkjdz-isv.isvjcloud.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
            "Accept": "application/json, text/plain, */*",
            "User-Agent": UA,
            "Referer": Referer,
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
            'Cookie': `${cookie} LZ_TOKEN_KEY=${LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${LZ_TOKEN_VALUE}; AUTH_C_USER=${pin}; ${lz_jdpin_token}`,
        }
    };
    return new Promise(resolve => {
        $.get(opt, (err, resp, data) => {
            try {
                if (err) {
                    console.log(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        $.venderId = data.data.venderId;
                        $.shopId = data.data.shopId;
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
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function uuidRandom() {
    return Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10);
}
async function join() {
    $.shopactivityId = ''
    await $.wait(1000)
    await getshopactivityId()
    let activityId = ``
    if($.shopactivityId) activityId = `,"activityId":${$.shopactivityId}`
    let info = {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body={"venderId":"${$.venderId}","shopId":"${$.venderId}","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0${activityId},"channel":401}&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            'Content-Type': 'text/plain; Charset=UTF-8',
            'Origin': 'https://api.m.jd.com',
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'User-Agent': UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${$.venderId}&shopId=${$.venderId}`,
            'Cookie': cookie
        }
    }
    return new Promise(async resolve => {
        $.get(info, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if(data.success == true){
                    $.log(data.message)
                    if(data.result && data.result.giftInfo){
                        for(let i of data.result.giftInfo.giftList){
                            console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
                        }
                    }
                }else if(data.success == false){
                    $.log(data.message)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
async function getshopactivityId() {
    let info =  {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22${$.venderId}%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            'Content-Type': 'text/plain; Charset=UTF-8',
            'Origin': 'https://api.m.jd.com',
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'User-Agent': UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${$.venderId}&shopId=${$.venderId}`,
            'Cookie': cookie
        }
    }
    return new Promise(resolve => {
        $.get(info, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if(data.success == true){
                    console.log(`入会:${data.result.shopMemberCardInfo.venderCardName || ''}`)
                    $.shopactivityId = data.result.interestsRuleList && data.result.interestsRuleList[0] && data.result.interestsRuleList[0].interestsInfo && data.result.interestsRuleList[0].interestsInfo.activityId || ''
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getAuthorShareCode(url) {
    return new Promise(resolve => {
        const options = {
            url: `${url}?${new Date()}`, "timeout": 10000, headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        };
        if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
            const tunnel = require("tunnel");
            const agent = {
                https: tunnel.httpsOverHttp({
                    proxy: {
                        host: process.env.TG_PROXY_HOST,
                        port: process.env.TG_PROXY_PORT * 1
                    }
                })
            }
            Object.assign(options, { agent })
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                } else {
                    if (data) data = JSON.parse(data)
                }
            } catch (e) {
                // $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}