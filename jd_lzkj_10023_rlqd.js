/*
https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10023
lzkj_10023日历签到
export jd_lzkj_10023_rlqd_Ids="活动id1&活动id2&活动id3..."             #必须
export jd_lzkj_10023_rlqd_num="15"                                  #不填则默认最多跑15个号
export jd_lzkj_10023_rlqd_openCard="1"                              #设置为1则自动入会   不设置或者设置为0则不自动入会
cron "2 2 29 2 *" jd_lzkj_10023_rlqd.js
*/
const $ = new Env('lzkj_10023日历签到')


const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';



const axios = require("axios");
let cookiesArr = [], cookie = "";
let jd_lzkj_black_pin = process.env.jd_lzkj_black_pin ? process.env.jd_lzkj_black_pin : "";
let jd_lzkj_10023_rlqd_Ids = process.env.jd_lzkj_10023_rlqd_Ids ? process.env.jd_lzkj_10023_rlqd_Ids : "";
let jd_lzkj_10023_rlqd_num = process.env.jd_lzkj_10023_rlqd_num ? process.env.jd_lzkj_10023_rlqd_num : 15;
let jd_lzkj_10023_rlqd_openCard = process.env.jd_lzkj_10023_rlqd_openCard ? process.env.jd_lzkj_10023_rlqd_openCard : 1;
let activityType = "10023";
let templateId = "20210518190900rlqd011";
let nodeId = "101001";
$.shopid = "";
let ver1 = "jdapp;android;11.1.4;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36";
let ver2 = "jdapp;android;11.2.4;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36";
let url1 = "http://hz.feverrun.top:99/share/card/getToken";
let url2 = "http://hz.feverrun.top:99/share/card/getCard";
let jd_pe_waitTime = process.env.jd_pe_waitTime ? process.env.jd_pe_waitTime : '';

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach(item => {
        cookiesArr.push(jdCookieNode[item]);
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") {
        console.log = () => {};
    }
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);

}

allMessage = "";
message = "";
$.hotFlag = false;
$.outFlag = false;
$.activityEnd = false;
$.drawOne = false;
$.shareUserId = "";

!(async () => {
    if (process.env.PRO_REDIS_URL) {
        try {
            $.redis = require('redis');
            pro_redis_url = process.env.PRO_REDIS_URL;
            $.client = $.redis.createClient({
                url: pro_redis_url
            });
            if ($.client) {
                console.log(`本地Redis已检测到配置链接`);
                await $.client.connect()   // 连接
            }
        }catch (e) {
            console.log(e);
            console.log(`本地Redis连接失败, 退出执行！！！`);
            process.exit(1);
        }
    }else {}

    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            "open-url": "https://bean.m.jd.com/"
        });
        return;
    }


    if (!jd_lzkj_10023_rlqd_Ids) {
        console.log(`【加入环境频道】https://t.me/proenvc `);
        console.log(`export jd_lzkj_10023_rlqd_Ids="xxx" 未设置 退出！！！`);
        process.exit(1);
        return;
    }

    let ids = jd_lzkj_10023_rlqd_Ids.split('&')

    console.log();
    console.log('加入环境频道: https://t.me/proenvc')


    //活动1-n
    for (let ii = 0; ii < ids.length; ii++) {
        console.log();
        $.activityId = ids[ii];
        $.activityURL = `https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/?activityType=${activityType}&activityId=${$.activityId}&templateId=${templateId}&nodeId=${nodeId}&prd=`
        console.log(`入口: ${$.activityURL}`)

        $.activityEnd = false;
        //任务开始
        for (let i = 0; i < cookiesArr.length; i++) {
            cookie = cookiesArr[i];

            if (cookie) {
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                message = ""
                $.bean = 0
                $.hotFlag = false
                $.nickName = '';
                $.isLogin = true;
                $.continueFlag = false;

                //await checkCookie();
                console.log(`******开始【京东账号${$.index}】${$.nickName || $.UserName}*********`);
                if (!$.isLogin) {
                    $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                    if ($.isNode()) {}
                    continue
                }

                if (jd_lzkj_black_pin.indexOf($.UserName) > -1) {
                    console.log(`黑名单内,跳过!`);
                    continue;
                }

                await getUA()
                await run();

                if ($.index >=  jd_lzkj_10023_rlqd_num) {
                    console.log(`如需更多号需要如此设置, export jd_lzkj_10023_rlqd_num="执行多少个号"`);
                    break;
                }

                // if(i == 0 && !$.customerId) break
                if($.outFlag || $.activityEnd) break
                if (jd_pe_waitTime) {
                    await $.wait(parseInt(jd_pe_waitTime*1000, 10));
                }else {
                    await $.wait(parseInt(Math.random() * 2500 + 2500, 10))
                }
            }
        }

        //每个活动之间增加些延迟
        if (jd_pe_waitTime) {
            await $.wait(parseInt(jd_pe_waitTime*1000, 10));
        }else {
            await $.wait(parseInt(Math.random() * 1500 + 500, 10))
        }
    }

    if($.outFlag) {
        let msg = '此ip已被限制，请过10分钟后再执行脚本'
        $.msg($.name, ``, `${msg}`);
        if ($.isNode()) await notify.sendNotify(`${$.name}`, `${msg}`);
    }
    if(allMessage){
        $.msg($.name, ``, `${allMessage}`);
        // if ($.isNode()) await notify.sendNotify(`${$.name}`, `${allMessage}`);
    }

    process.exit(1);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

async function run() {
    try {

        $.hasEnd = false
        $.openFlag = false;
        $.endTime = 0
        $.Token = ''
        $.IsvToken = ''
        $.Pin = ''
        $.openCardStatus = true;
        $.followStatus = true;

        $.isvObfuscator = '';
        await isvToken();

        if (!$.IsvToken) {
            console.log('获取[token]失败！');
            return;
        }

        // console.log($.IsvToken);
        await takePostRequest('getPageShareConfig');
        await takePostRequest('login');

        if($.activityEnd === true){
            console.log('活动结束')
            return
        }
        if($.outFlag){
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            return
        }

        //open?
        if ($.openCardStatus == false) {
            if (jd_lzkj_10023_rlqd_openCard == 1) {
                $.shopactivityId = '';
                $.joinVenderId = $.venderId;
                //console.log(`去开卡: ${$.joinVenderId}`)
                await takePostRequest('getShopOpenCardInfo');
                await $.wait(parseInt(Math.random() * 500 + 500, 10))
                await takePostRequest('bindWithVender');
                await $.wait(parseInt(Math.random() * 500 + 500, 10))
                if ($.errorJoinShop.indexOf('开卡失败，请稍后重试~') > -1 || $.errorJoinShop.indexOf('活动太火爆，请稍后再试') > -1 || $.errorJoinShop.indexOf('加入店铺会员失败') > -1) {
                    console.log("第1次重试")
                    await takePostRequest('getShopOpenCardInfo');
                    await $.wait(parseInt(Math.random() * 500 + 500, 10))
                    await takePostRequest('bindWithVender');
                    await $.wait(parseInt(Math.random() * 500 + 500, 10))
                }
                if ($.index != 1) {
                    $.openFlag = true;
                }
                await $.wait(parseInt(Math.random() * 500 + 500, 10))
            } else {
                // console.log(`如需自动入会, 请设置环境变量: export jd_lzkj_10023_rlqd_openCard=\"1\"`);
                return
            }
        } else {
            console.log(`已开卡: ${$.venderId}`);
        }

        // $.followStatus
        // if ($.followStatus == false) {
        await takePostRequest('follow');
        // }

        if(!$.customerId){
            console.log('获取不到[customerId]退出执行，请重新执行')
            return
        }

        //test
        // console.log($.activityURL);
        $.activityURL = `https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=${activityType}&templateId=${templateId}&activityId=${$.activityId}&nodeId=${nodeId}&prd=${$.prd}`
        if ($.followStatus == false) {
            // await takePostRequest('getPageShareConfig');
            // await takePostRequest('login');
            // await takePostRequest('template');
            // await takePostRequest('basicInfo');
        }else {
            await takePostRequest('template');
            await takePostRequest('basicInfo');
        }

        if ($.index == 1) {
            await takePostRequest('getRule');
            await takePostRequest('myPrizeList');
            console.log(`店铺: ${$.shopName}`);
            console.log(`活动: ${$.actName}`);
            console.log(`规则: ${$.actRule}`);
            //奖励列表
            // await takePostRequest('drawPrize');
        }

        if ($.startTime && (Date.now() < $.startTime )) {
            console.log(`活动未开始`);
            $.activityEnd = true;
            return;
        }
        if($.hasEnd === true || ($.endTime && Date.now() > $.endTime)){
            $.activityEnd = true
            console.log('来迟了，活动结束了，豆子干了！！！')
            return
        }

        //  去签到
        $.sign = false
        await takePostRequest('activity')

        if ($.sign == true) {
            console.log(`去签到: `);
            await takePostRequest('getSignClick')
            await takePostRequest('activity')

            if ($.signPiize.length >= 1) {
                for (let sp of $.signPiize) {
                    console.log(`签到${sp.signNumber}天得得奖励， 还剩${sp.lestNumber} 份奖励`);
                }
            }
        }else {
            console.log(`当日已经签到过！！！`);
        }


        if ($.activityEnd === true) {
            console.log("来迟了，活动结束了，豆子干了！！！");
            return;
        }
        if ($.hasEnd === true || $.endTime && Date.now() > $.endTime) {
            $.activityEnd = true;
            console.log("来迟了，活动结束了，豆子干了！！！");
            return;
        }
        if ($.outFlag) {
            console.log("此ip已被限制，请过10分钟后再执行脚本\n");
            return;
        }

        //等待一段时间切换
        //等待一段时间切换
        if (jd_pe_waitTime) {
            await $.wait(parseInt(jd_pe_waitTime*1000, 10));
        }else {
            await $.wait(parseInt(Math.random() * 1500 + 1500, 10))
        }
        // if(openwait){
        //     if($.index != cookiesArr.length){
        //         console.log(`等待${openwait}秒`)
        //         await $.wait(parseInt(openwait, 10) * 1000)
        //     }
        // }else{
        //     if($.index % 3 == 0) console.log('休息5秒，别被黑ip了\n可持续发展')
        //     if($.index % 3 == 0) await $.wait(parseInt(Math.random() * 2000 + 5000, 10))
        // }
    } catch (e) {
        // console.log(e)
    }
}
async function takePostRequest(type) {
    if($.outFlag) return
    let domain = 'https://lzkj-isv.isvjcloud.com';
    let body = ``;
    let method = 'post'
    let admJson = ''
    switch (type) {
        case 'isvObfuscator':
            method = 'post';
            let sign = await getToken();
            url= `https://api.m.jd.com/client.action?functionId=isvObfuscator&lmt=0&${sign}`;
            body= {};
            break;
        case 'getPageShareConfig':
            method = 'post';
            url = `${domain}/prod/cc/interactsaas/api/user-info/getPageShareConfig`;
            body = {
                "activityId": $.activityId
            };
            break;
        case 'login':
            method = 'post';
            url = `${domain}/prod/cc/interactsaas/api/user-info/login`;
            body = {
                "activityId": $.activityId,
                "shareUserId": $.shareUserId,
                "source": "01",
                "status": "0",
                "tokenPin": $.IsvToken
            };
            break;
        case 'template':
            method = 'get';
            url = `${domain}/prod/cc/interactsaas/api/basic/template/${templateId}?activityId=${$.activityId}&shopId=${$.shopId}`;
            break;
        case 'follow':
            method = 'post';
            url = `${domain}/prod/cc/interactsaas/api/task/followShop/follow`
            body = {};
            break;
        case 'drawPrize':
            method = 'post';
            url = `${domain}/prod/cc/interactsaas/api/prize/drawPrize`;
            body = {};
            break;
        case 'basicInfo':
            method = 'post';
            url  = `${domain}/prod/cc/interactsaas/api/active/basicInfo`;
            body = {
                "activityId": $.activityId
            };
            break;
        case 'getRule':
            method = 'post';
            url = `${domain}/prod/cc/interactsaas/api/active/getRule`;
            body = {};
            break;

        case 'myPrizeList':
            method = 'post';
            url = `${domain}/prod/cc/interactsaas/api/my/prize/list`;
            body = {
                "current": 1,
                "size": 10000
            };
            break;
        case 'activity':
            method = 'post'
            url = `${domain}/prod/cc/interactsaas/api/task/daySign/activity`
            body = {}
            break;
        case 'getSignClick':
            method = 'post'
            url = `${domain}/prod/cc/interactsaas/api/task/daySign/getSignClick`;
            body = {}
            break;
        case 'getShopOpenCardInfo':
            method = 'post';
            if (!$.joinVenderId) {
                console.log('没有开卡id');
                break;
            }
            body = {"venderId":$.joinVenderId,"channel":102,"payUpShop":true,"queryVersion":"10.5.2","appid":"27004","needSecurity":true,"bizId":"shopmember_m_jd_com"};
            h5st = await getH5st410('27004', body);
            h5st = encodeURIComponent(h5st);
            await $.wait(parseInt(Math.random() * 250 + 150, 10));
            url = `https://api.m.jd.com/client.action?functionId=getShopOpenCardInfo&body=${encodeURIComponent(JSON.stringify(body))}&t=${Date.now()}&appid=shopmember_m_jd_com&clientVersion=9.2.0&client=H5&area=1_72_2799_0&uuid=88888&h5st=${h5st}&x-api-eid-token=`
            body = ``;
            break;
        case 'bindWithVender':
            if (!$.joinVenderId) {
                console.log('没有开卡id');
                break;
            }
            method = 'post';
            if ($.shopactivityId == '') {
                body = {"venderId":$.joinVenderId,"shopId":$.joinVenderId,"bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0,"channel":102,"appid":"27004","needSecurity":true,"bizId":"shopmember_m_jd_com"}
            }else {
                body = {"venderId":$.joinVenderId,"shopId":$.joinVenderId,"bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0,"activityId":$.shopactivityId,"channel":102,"appid":"27004","needSecurity":true,"bizId":"shopmember_m_jd_com"}
            }
            h5st = await getH5st410('27004', body);
            h5st = encodeURIComponent(h5st);
            await $.wait(parseInt(Math.random() * 250 + 150, 10));
            url = `https://api.m.jd.com/client.action?functionId=bindWithVender&body=${encodeURIComponent(JSON.stringify(body))}&t=${Date.now()}&appid=shopmember_m_jd_com&clientVersion=9.2.0&client=H5&area=1_72_2799_0&uuid=88888&h5st=${h5st}&x-api-eid-token=`
            body = ``;
            break;
        default:
            console.log(`${type}`);
    }


    //参数
    let myRequest = getPostRequest(type, url, body, method);
    if (jd_pe_waitTime) {
        await $.wait(parseInt(jd_pe_waitTime*1000, 10));
    }else {
        await $.wait(parseInt(Math.random()*500+300,10));
    }

    //请求
    if (method == 'post' || method == 'POST') {
        return axios.post(url, body,
            {
                "headers": myRequest.headers,
                "timeout": myRequest.timeout
            }).then(function (res) {
            res = getAxiosData(res);
            if (res) {
                // console.log(type+'-post-'+JSON.stringify(res));
                dealReturn(type, res);
            }

        }).catch(function (err) {
            // test
            // console.log(err);
            console.log(`错误码:${err.code}`);
        })
    }else if (method == 'get' || method == 'GET') {
        return axios.get(url,
            {
                "headers": myRequest.headers,
                "timeout": myRequest.timeout
            }).then(function (res) {
            res = getAxiosData(res);
            if (res) {
                // console.log(type+'-get-'+JSON.stringify(res));
                dealReturn(type, res);
            }

        }).catch(function (err) {
            console.log(err);
            console.log(`错误码:${err.code}`);
        })
    }
}
function dealReturn(type, data) {
    // console.log(`${type} --- ${data}`)
    let res = ''
    try {
        if(!['accessLog','attendLog','getCk','drawContent','accessLogWithAD','accessLog'].includes(type)){
            if(data){
                res = JSON.parse(data);
            }
        }
    } catch (e) {
        console.log(`${type} 执行任务异常`);
        console.log(data  + '===>' + e);
        $.runFalag = false;
    }

    try {
        switch (type) {
            case 'isvObfuscator':
                if (res && res.code == 0 && res.token) {
                    $.IsvToken = res.token || '';
                    // console.log(`token:${$.IsvToken}`);
                }else {
                    console.log(res.message);
                    $.isvObfuscator = res.message || '';
                    $.IsvToken = '';
                }
                break;
            case 'getPageShareConfig':
                break;
            case 'login':
                if (res.resp_code == 0 && res.data) {
                    $.actName = res.data.actName ? res.data.actName : '';
                    $.jdActType = res.data.jdActType ? res.data.jdActType : '';
                    $.customerId = res.data.customerId ? res.data.customerId : '';
                    $.jdActivityId = res.data.jdActivityId ? res.data.jdActivityId : '';
                    $.joinInfo = res.data.joinInfo ? res.data.joinInfo : '';
                    $.shopName = res.data.shopName ? res.data.shopName : '';
                    $.Token = res.data.token ? res.data.token : '';
                    $.userImg = res.data.userImg ? res.data.userImg : '';
                    if($.joinInfo) {
                        $.joinCodeInfo = res.data.joinInfo.joinCodeInfo ? res.data.joinInfo.joinCodeInfo : '';
                        $.openCardUrl = res.data.joinInfo.openCardUrl ? res.data.joinInfo.openCardUrl : '';
                        if($.joinCodeInfo) {
                            $.joinCode = $.joinCodeInfo.joinCode;   //1001-可以参加活动 1002-不是会员无法参加 1004-关注店铺才能参与活动哦！
                            $.joinDes = $.joinCodeInfo.joinDes;     //可以参加活动 不是会员无法参加
                            $.prd = $.joinCodeInfo.prd;             //cjwx 或者 其他类型
                            // console.log($.joinCode);
                            // console.log($.joinDes);
                            //1001 - 可以参加活动
                            if ($.joinCode == '1002') {
                                $.openCardStatus = false; // 1002-不是会员无法参加
                            }
                            if ($.joinCode == '1005') {
                                $.openCardStatus = false; // 1005-未关注店铺并且不是会员无法参加
                                $.followStatus = false;
                            }
                            if ($.joinCode == '1006') {
                                $.openCardStatus = false; //1006-您已关注店铺，还需加入会员才能参与活动哦！
                            }
                            if ($.joinCode == '1004') {
                                $.followStatus = false;  //1004 - 关注店铺才能参与活动哦！
                            }
                        }
                    }
                    if ($.index == 1) {
                        $.userPin = res.data.userPin ? res.data.userPin : '';
                        $.venderId = $.openCardUrl.match(/venderId=(.\d+)/) && $.openCardUrl.match(/venderId=(.\d+)/)[1] || '';
                        $.shopId = $.openCardUrl.match(/shopId=(.\d+)/) && $.openCardUrl.match(/shopId=(.\d+)/)[1] || '';
                    }
                }
                break;
            case 'template':
                break;
            case 'follow':
                //console.log(JSON.stringify(res));
                break;
            case 'drawPrize':
                if ($.index == 1) {
                    if (res.resp_code == 0 && res.data) {
                        console.log(`奖励列表: `);
                        for (let dp of res.data.prizeInfo) {
                            console.log(`${dp.prizeName}`);
                        }
                    }
                }
                break;
            case 'basicInfo':
                if (res.resp_code == 0 && res.data) {
                    if ($.index == 1) {
                        //活动地址
                        $.actUrl = res.data.actUrl ? res.data.actUrl : "";
                    }
                    $.startTime = res.data.startTime ? res.data.startTime : "";
                    $.endTime = res.data.endTime ? res.data.endTime : "";
                    $.memberInfo = res.data.memberInfo ? res.data.memberInfo : [];
                    $.actName = res.data.actName ? res.data.actName : "";
                }
                break;
            case 'getRule':
                if (res.resp_code == 0 && res.data) {
                    $.actRule = res.data ? res.data : "";
                    if ($.actRule.indexOf("不能同时") > -1) {
                        $.drawOne = true;
                    }
                }
                break;
            case 'myPrizeList':
                if (res.resp_code == 0 && res.data) {
                    // console.log(`我的奖励: ${JSON.stringify(res.data)}`);
                    console.log(`我的奖励: `);
                    myLists = res.data || [];
                    myStr = '';
                    try {
                        if (myLists.length >= 1) {
                            for (let ml of myLists) {
                                myStr += ml.prizeName + ',';
                                // if (ml.prizeType == 4) {
                                //     //4-积分
                                // }
                                // if (ml.prizeType == 1) {
                                //     //1-京豆
                                // }
                            }
                            console.log(myStr);
                        }else {
                            console.log(JSON.stringify(myLists));
                        }
                    }catch (e) {
                        console.log(e);
                    }
                } else {
                    console.log(`我的奖励: `);
                }
                break;
            case 'activity':
                if (res.resp_code == 0 && res.data) {
                    $.signPiize = res.data.signPiize ? res.data.signPiize : [];
                    $.sign = res.data.sign ? res.data.sign : false
                    console.log(`累计签到天数: ${res.data.signNum}`);
                    console.log(`连续签到天数: ${res.data.continuityNum}`);
                }else {
                    console.log(JSON.stringify(res));
                }
                break;
            case 'getSignClick':
                if (res.resp_code ==0) {
                    if (JSON.stringify(res).indexOf('prizeName') > -1) {
                        console.log(`获得: ${res.data.prizeName}`);
                    }else {
                        console.log(JSON.stringify(res));
                    }
                }else {
                    console.log(JSON.stringify(res));
                }
                break;
            case 'getShopOpenCardInfo':
                // console.log(`${type}: ${JSON.stringify(res)}`);
                if (data) {
                    data = data && data.match(/jsonp_.*?\((.*?)\);/) && data.match(/jsonp_.*?\((.*?)\);/)[1] || data
                    // console.log(`getShopOpenCardInfo: ${data}`)
                    res = JSON.parse(data);
                    if (res && res.success == true) {
                        // console.log($.toStr(res.result))
                        openCardStatus = res.result[0].userInfo.openCardStatus || 0;
                        venderCardName = res.result[0].shopMemberCardInfo.venderCardName || ''
                        // console.log(`入会: ${venderCardName}`)
                        if (openCardStatus === 1) {
                            console.log(`已入会: ${$.joinVenderId} - ${venderCardName}`)
                        } else if (openCardStatus == 0) {
                            console.log(`去开卡: ${$.joinVenderId} - ${venderCardName}`);
                        }
                        $.shopactivityId = res.result[0].interestsRuleList && res.result[0].interestsRuleList[0] && res.result[0].interestsRuleList[0].interestsInfo && res.result[0].interestsRuleList[0].interestsInfo.activityId || ''
                        // console.log($.shopactivityId);
                    } else {
                        if (res.busiCode == '9001') {
                            //活动太火爆，请稍后再试
                        }
                        if (res.busiCode == '1') {
                            //参数错误
                            // console.log(`【账号${i}】 ${UserName} 账号可能失效了`);
                        }
                    }
                }
                break;
            case 'bindWithVender':
                // console.log(`${type}: ${JSON.stringify(res)}`);
                if (data) {
                    data = data && data.match(/jsonp_.*?\((.*?)\);/) && data.match(/jsonp_.*?\((.*?)\);/)[1] || data
                    if (data.indexOf('加入店铺会员成功') > -1 || data.indexOf('已经是本店会员') > -1) {
                    }
                    if (data.indexOf('活动太火爆，请稍后再试') > -1) {
                    }
                    res = JSON.parse(data);
                    if (res && res.success === true) {
                        // console.log(res.message)
                        if (res.busiCode == 0) {
                            console.log(`${res.message}`);
                        }else {
                            console.log(`${res.busiCode}: ${res.message}`);
                        }
                        $.errorJoinShop = res.message || ''
                        if (res.result && res.result.giftInfo) {
                            for (let i of res.result.giftInfo.giftList) {
                                console.log(`入会获得: ${i.discountString}${i.prizeName}${i.secondLineDesc}`)
                            }
                        }
                    } else if (res && typeof res == 'object' && res.message) {
                        $.errorJoinShop = res.message || ''
                        console.log(`${res.busiCode}: ${res.message}`);
                        if (res.busiCode == "2001") {
                            //用户未登录
                        }
                        if (res.busiCode == '9002') {
                            //活动太火爆，请稍后再试
                        }
                        if (res.busiCode == '9003') {
                            //您的账户已经是本店会员
                        }
                        if (res.busiCode == '0') {
                            // 加入店铺会员成功
                        }
                    } else {
                        console.log(data)
                    }
                }
                break;
            default:
                console.log(`${type}-> ${JSON.stringify(res)}`);
        }
    } catch (e) {
        console.log(e);
    }
}

function getPostRequest(type, url, body, method="post") {
    let headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
        "Content-Type": "application/json;",
        "Origin": "https://lzkj-isv.isvjcloud.com",
        "Cookie": cookie,
        "User-Agent": $.UA,
        "X-Requested-With": "com.jingdong.app.mall"
    }
    if (url.indexOf('https://lzbk-isv.isvjcloud.com') > -1) {
        headers["Referer"] = `${$.activityURL}`
        headers["Cookie"] = `IsvToken=${$.IsvToken};APP_ABBR=;${cookie}`
    }
    if ($.Token) {
        headers['Token'] = $.Token;
    }else {
        headers['Token'] = '';
    }
    if (method == 'post' || method == 'POST') {
        headers["Content-Type"] =  "application/json;";
    }
    if (['getShopOpenCardInfo', 'bindWithVender'].includes(type)) {
        // console.log(`${type} -- --}`);
        headers = {
            'Accept': '*/*',
            'User-Agent': $.UA,
            'content-type' :'application/x-www-form-urlencoded',
            'x-rp-client': 'h5_1.0.0',
            'x-referer-page': 'https://pages.jd.com/member/shopcard',
            'origin': 'https://pages.jd.com',
            'X-Requested-With': 'com.jingdong.app.mall',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://pages.jd.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': cookie,
        }
    }

    return {url: url, headers: headers, body: body, timeout: 10 * 3000};
}

async function getUA(){
    $.UA = `jdapp;iPhone;10.4.6;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
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
/**
 * 简单处理axios请求返回的数据
 * @param res
 * @returns {string|*}
 */
function getAxiosData(res){
    if (res.status == 200 && res.data) {
        res = res.data;
        if (typeof res == 'object') {
            return JSON.stringify(res);
        }else {
            return res;
        }
    }else {
        return '';
    }
}

function getUUID(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", t = 0) {
    return x.replace(/[xy]/g, function (x) {
        var r = 16 * Math.random() | 0, n = "x" == x ? r : 3 & r | 8;
        return uuid = t ? n.toString(36).toUpperCase() : n.toString(36), uuid
    })
}

function generateFp() {
    let e = "0123456789";
    let a = 13;
    let i = '';
    for (; a--; )
        i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0,16)
}


function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


async function getH5st410(bid, body){
    return new Promise(resolve => {
        $.post({
            url: `http://hz.feverrun.top:99/share/card/getH5st410`,
            body: `bid=${bid}&body=${JSON.stringify(body)}`,
            headers: {"User-Agent": "jdapp;android;11.4.1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM0o410 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36"},
            timeout: 60000
        }, (err, resp, data) => {
            try {
                // console.log(resp);
                if (err) {
                    console.log(`请求失败，请检查网路`);
                    console.log(err);
                } else {
                    try {
                        //test
                        data = data;
                        // console.log(data)
                        //data = data.match(/\"body\":\"(.*?)\"}/) && data.match(/\"body\":\"(.*?)\"}/)[1] || '' ;
                        // console.log(data)

                    }catch (e) {
                        data = '';
                    }
                }
            } catch (e) {
                // $.logErr(e, resp);
            } finally {
                resolve(data || '');
            }
        })
    })
}
async function getToken() {
    return new Promise(resolve => {
        $.get({
            url: `${url1}?type=lzkji`,
            headers: {"User-Agent": ver1},
            timeout: 60000
        }, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`请求失败，请检查网路`);
                } else {
                    try {
                        //test
                        // console.log(data);
                        data = JSON.parse(data);
                        if (data.code == 0) {
                            data = data.data;
                        } else {
                            data = '';
                        }
                    } catch (e) {
                        data = '';
                    }
                }
            } catch (e) {
                // $.logErr(e, resp);
            } finally {
                resolve(data || '');
            }
        })
    })
}

async function subIsvToken(username, token){
    if (jd_pe_waitTime) {
        await $.wait(parseInt(jd_pe_waitTime*1000, 10));
    }else {
        await $.wait(parseInt(Math.random() * 500 + 500, 10));
    }
    return new Promise(resolve => {
        $.post({
            url: `http://hz.feverrun.top:99/share/sub/subIsvToken`,
            body: `pin=${encodeURIComponent(username)}&token=${token}`,
            headers: {"User-Agent": "jdapp;android;11.5.0;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM0o Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36"},
            timeout: 60000
        }, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`缓存token失败2`);
                    data = '';
                    // console.log(err);
                } else {
                    try {
                        data = data;
                    }catch (e) {
                        data = '';
                    }
                }
            } catch (e) {
                data = '';
            } finally {
                resolve(data || '');
            }
        })
    })
}
async function getIsvToken(username){
    if (jd_pe_waitTime) {
        await $.wait(parseInt(jd_pe_waitTime*1000, 10));
    }else {
        await $.wait(parseInt(Math.random() * 500 + 500, 10));
    }
    if ($.client) {
        return new Promise(async resolve => {
            data = await $.client.get(username);
            resolve(data || '')
        })
    }else {
        return new Promise(resolve => {
            $.post({
                url: `http://hz.feverrun.top:99/share/get/getIsvToken`,
                body: `pin=${encodeURIComponent(username)}`,
                headers: {"User-Agent": "jdapp;android;11.5.0;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM0o Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36"},
                timeout: 60000
            }, (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`缓存token失败1`);
                        data = '';
                        // console.log(err);
                    } else {
                        try {
                            //test
                            data = data;
                            // console.log(data)
                            //data = data.match(/\"body\":\"(.*?)\"}/) && data.match(/\"body\":\"(.*?)\"}/)[1] || '' ;
                            // console.log(data)

                        }catch (e) {
                            data = '';
                        }
                    }
                } catch (e) {
                    data = '';
                    // $.logErr(e, resp);
                } finally {
                    resolve(data || '');
                }
            })
        })
    }
}
async function isvToken(){
    if ($.client) {
        return new Promise(async resolve => {
            $token = await getIsvToken(encodeURIComponent($.UserName));
            if ($token != '') {
                console.log('读取缓存token成功');
                $.IsvToken = $token;
            } else {
                // 最多尝试3次读取
                for (let tt = 0; tt < 1; tt++) {
                    await takePostRequest('isvObfuscator');
                    if ($.IsvToken != '' && $.IsvToken != undefined) {
                        console.log('缓存token成功');
                        await $.client.set(encodeURIComponent($.UserName), $.IsvToken);
                        await $.client.expire(encodeURIComponent($.UserName), 1740);
                        break;
                    } else {
                        console.log('缓存token失败' + (tt + 1));
                    }
                    if ($.isvObfuscator.indexOf('参数异常') > -1) {
                        break;
                    }
                }
            }
            resolve();
        })
    }else {
        return new Promise(async resolve => {
            $token = await getIsvToken(encodeURIComponent($.UserName));
            if ($token != '') {
                console.log('读取缓存token成功');
                $.IsvToken = $token;
            } else {
                // 最多尝试3次读取
                for (let tt = 0; tt < 1; tt++) {
                    await takePostRequest('isvObfuscator');
                    if ($.IsvToken != '' && $.IsvToken != undefined) {
                        console.log('缓存token成功');
                        await subIsvToken(encodeURIComponent($.UserName), $.IsvToken);
                        break;
                    } else {
                        console.log('缓存token失败' + (tt + 1));
                    }
                    if ($.isvObfuscator.indexOf('参数异常') > -1) {
                        break;
                    }
                }
            }
            resolve();
        })
    }
}


// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
