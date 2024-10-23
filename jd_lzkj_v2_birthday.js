/*
https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/20002/1001/?shopId=xxx&activityId=xxx #生日礼包
https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/20003/1001/?shopId=xxx&activityId=xxx #入会礼包
支持以上类型
export jd_lzkj_v2_birthday_urls="活动url1@活动url2@活动url3..."          #必须，多个链接@隔开, 或者换行隔开
export jd_lzkj_v2_birthday_num="100";                                  #不填则默认最多跑100个号
export jd_lzkj_v2_openCard="0"                                         #不设置默认会自动入会， 设置为0则不入会
cron "2 2 29 2 *" jd_lzkj_v2_birthday.js
*/
const $ = new Env('lzkj v2 生日礼包')



console.log(`配置代理池: OPENCARD_GLOBAL_AGENT_HTTP_PROXY_URL`);
console.log(`配置api代理: OPENCARD_API_PROXY_URL`);
//全局代理池变量 export OPENCARD_GLOBAL_AGENT_HTTP_PROXY_URL=""
global_agent_http_proxy_isopen = false;
if (process.env.OPENCARD_API_PROXY_URL) {
} else {
    if (process.env.OPENCARD_GLOBAL_AGENT_HTTP_PROXY_URL) {
        global_agent_http_proxy_isopen = true;
        require("global-agent/bootstrap");
        global.GLOBAL_AGENT.HTTP_PROXY = process.env.OPENCARD_GLOBAL_AGENT_HTTP_PROXY_URL || '';
    }
}
api_proxy_open = false;
if (process.env.OPENCARD_API_PROXY_URL) {
    api_proxy_open = true;
    your_proxy_url = process.env.OPENCARD_API_PROXY_URL;
} else {
}
console.log(`配置代理池: ${global_agent_http_proxy_isopen == true ? '已配置' : '未配置'} `);
console.log(`配置api代理: ${api_proxy_open == true ? '已配置' : '未配置'}`);
// console.log(`全局代理: ${global_agent_http_proxy_isopen}`);
// console.log(`api代理: ${api_proxy_open}`);

const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const proenvcard = require('./utils/proenv/proenvcard.js')
const https = require("https");


const notify = $.isNode() ? require('./sendNotify') : '';


const CryptoJS = require("crypto-js");
const axios = require("axios");
if (api_proxy_open == true) {
    // tunnel = require('tunnel');
    HttpsProxyAgent = require('https-proxy-agent')
}
const proenv = require('./utils/proenv/proenv.js')
const proecy = require('./utils/proenv/proecy.js')
let cookiesArr = [], cookie = "";
let jd_lzkj_v2_black_pin = process.env.jd_lzkj_v2_black_pin ? process.env.jd_lzkj_v2_black_pin : "";
let jd_lzkj_v2_birthday_urls = process.env.jd_lzkj_v2_birthday_urls ? process.env.jd_lzkj_v2_birthday_urls : "";
let jd_lzkj_v2_birthday_num = process.env.jd_lzkj_v2_birthday_num ? process.env.jd_lzkj_v2_birthday_num : 100;
let jd_lzkj_v2_openCard = process.env.jd_lzkj_v2_openCard ? process.env.jd_lzkj_v2_openCard : 1;
$.shopid = "";
let ver1 = "jdapp;android;11.1.4;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36";
let ver2 = "jdapp;android;11.2.4;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCCM00 Build/QKQ1.191021.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36";


if ($.isNode()) {
    Object.keys(jdCookieNode).forEach(item => {
        cookiesArr.push(jdCookieNode[item]);
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") {
        console.log = () => {
        };
    }
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);

}

allMessage = "";
message = "";
$.hotFlag = false;
$.outFlag = false;
$.activityEnd = false;
$.interfaceNameList = [];
$.drawOne = false;
$.shareUserId = "";
let lz_jdpin_token_cookie = '';
let activityCookie = '';
let lz_cookie = {};

!(async () => {
    if (process.env.PRO_REDIS_URL) {
        $.client = await proenvcard.redis_connect()
    } else {
    }
    $.client = $.client || ''
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东生日礼包获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        process.exit(1)
        return;
    }


    if (!jd_lzkj_v2_birthday_urls) {
        console.log(`【问题反馈】https://t.me/proenvc `);
        console.log(`export jd_lzkj_v2_birthday_urls="xxx" 未设置 退出！！！`);
        process.exit(1);
        return;
    }

    let urls = [];
    if (jd_lzkj_v2_birthday_urls.indexOf('\n') > -1) {
        urls = jd_lzkj_v2_birthday_urls.split('\n')
    } else if (jd_lzkj_v2_birthday_urls.indexOf('@') > -1) {
        urls = jd_lzkj_v2_birthday_urls.split('@')
    } else {
        urls = jd_lzkj_v2_birthday_urls.split('@')
    }

    await proenv.needAl(true)
    await proenv.getTG()
    //活动1-n
    for (let ii = 0; ii < urls.length; ii++) {
        allMessage = ''
        message = ''
        console.log();
        $.activityUrl = urls[ii]
        try {
            $.activityId = await proecy.getUrlKeyValue('activityId', $.activityUrl)
            $.shopId = await proecy.getUrlKeyValue('shopId', $.activityUrl)
            actTypeTempCode = $.activityUrl.match(/v2\/(.\d+)\/(.\d+)\//)
            $.activityType = actTypeTempCode[1] || ''
            $.templateCode = actTypeTempCode[2] || ''
        } catch (e) {
        }
        // console.log($.activityType, $.templateCode)
        if (!$.activityType || !$.templateCode) {
            console.log(`活动链接填写的有问题`);
            continue
        }
        console.log(`活动id: ${$.activityId}`);
        console.log(`店铺id: ${$.shopId}`);
        console.log(`活动地址: ${$.activityUrl}`)

        $.activityEnd = false;
        //任务开始
        for (let i = 0; i < cookiesArr.length; i++) {
            message = ''
            cookie = cookiesArr[i];
            originCookie = cookiesArr[i];
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


                if (jd_lzkj_v2_black_pin.indexOf($.UserName) > -1) {
                    console.log(`黑名单内,跳过!`);
                    continue;
                }

                $.UA = await proenv.getUA($.UserName);
                $.uuid = getUUID('xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx');
                await run();
                await showMsg()

                if ($.index >= jd_lzkj_v2_birthday_num) {
                    console.log(`如需更多号需要如此设置, export jd_lzkj_v2_birthday_num="执行多少个号"`);
                    break;
                }

                // if(i == 0 && !$.customerId) break
                if ($.outFlag || $.activityEnd) break
                //延迟
                if (api_proxy_open == true || global_agent_http_proxy_isopen == true) {
                    await $.wait(parseInt(Math.random() * 500 + 500, 10));
                } else {
                    await $.wait(parseInt(Math.random() * 1500 + 1500, 10))
                }
            }
        }

        //每个活动之间增加些延迟
        if (api_proxy_open == true || global_agent_http_proxy_isopen == true) {
            await $.wait(parseInt(Math.random() * 500 + 500, 10));
        } else {
            await $.wait(parseInt(Math.random() * 1500 + 1500, 10))
        }

        if ($.isNode() && allMessage) {
            allMessage += '\n活动地址:' + $.activityUrl + '\n'
            $.msg($.name, ``, `${allMessage}`);
            if ($.isNode()) await notify.sendNotify(`${$.name}`, `${allMessage}`);
            allMessage = ''
        }
    }

    if ($.outFlag) {
        let msg = '此ip已被限制，请过10分钟后再执行脚本'
        $.msg($.name, ``, `${msg}`);
        if ($.isNode()) await notify.sendNotify(`${$.name}`, `${msg}`);
    }
    if (allMessage) {
        // $.msg($.name, ``, `${allMessage}`);
        // if ($.isNode()) await notify.sendNotify(`${$.name}`, `${allMessage}`);
    }

    process.exit(1);
})().catch((e) => $.logErr(e)).finally(() => $.done())

async function run() {
    try {
        $.ERR_BAD_REQUEST = 0;
        $.ECONNRESET = 0;
        $.hasEnd = false
        $.openFlag = false;
        $.endTime = 0
        $.Token = '';
        $.IsvToken = '';
        $.Pin = ''
        $.openCardStatus = true;
        $.followStatus = true;
        $.levelQualify = false;
        $.followQualify = false;
        $.activityEnd = false;
        activityCookie = '';
        $.pinToken = '';
        $.getActivityInfo = ''

        //获取代理
        //api代理一个号获取一次新的
        if (api_proxy_open == true) {
            let pList = await proenvcard.setIp(your_proxy_url);
            if (pList != '') {
                $.ip = pList[0]
                $.ipo = pList[1]
            } else {
                return
            }
        }

        // f = proecy.v2_dec_res('cdV7+Er8MK/8nCen+pOKXFf+8K5fY31Qw2mqkkOJW/hVoBKdZJ4wVgnA567cyijR6052VCo/9kJTCVZmG/+o9f9+oqKQrbse1OMtDtOU4gwU29GHcTs9Anx5GyFbSnpMlvuLS/hMVSrajD3ZykpPc5u5Im3K1ZeEgJzwV9km6DFa9VozaTdNpI3BulsIrsalcd5GFXViSeZ98Tq9qu9AX2s+gul1yYs38vKJUJYo9VnjpfbjFgGZNC5BmYEdT/e7L/zXc955sbL3LYG1tls85iB5eJ+PPJYgy4xQCriKNJujjVscGrIG12NWJC1124gK9RCaRsUQiFSQLIaCdooXANdz0RweQjCYgwc1bQ6QjuHKeW/4Zv8MGxWeqmQpmqdbejflYDDzh2WWLxFPmg0hCZ54hRH3KOy1qqtVmKePZyFJaQx1s9IAKjTVzTBA0rvsoxzhpYQIAt4EfqZAnBuYRXJQAkzL8w/U4C38RUxi5JjJw57vBVFedbbXYS9FkLAH+vjM8I264018+T7mAKBltafIPjmXe5jjh5e/bJK5C+VzccnoVeDIYjJ15aqiaz1YCUv7qIoJofXbvV86LsdmGuMa6X7XvBoWJZGT9mv/CkODSPsVPnWyrI5ZwpiL3Fi3F3s6RuX4FOcWRSxwvZELt65hV3qR02dWTZkx3uv+GozgIbbRrbR16jVBESdO/BT3d1US8GlfdEEMzltjabNqPCa4x4se6r3Ewl5FEVCIfnf81TnXxazx1CaMT+Ju7kJ62u/ReKKPlqsrPTf6R+gR1/fzNUgvJaV+lfTa2tC0ENgkv3DaFVL8wWSKH5jwnHf1PDyAj0pWaTsHPK5zAKqtjBRXR+HQUFRjerRjxPBrMb9nIiWlEIrssqhJYL+EcnBY7L6gnGGSpwRMZwD7wDzQWXi846r7fyO9xPer89eouKysZZpO8SMZLMRrTWDqVTvxIGKVB3ugL+5V7vZrs5MbcJe7KVeL+RASCHnl3BrWSoc7d6MwzPXB4M5kN5DJc4DvpILyuHEmNYXZUg+oddokzTMQihExwGfDIxpwNEb1l2t17h9gSQ6m0x5hlc/vk4HIdKzkH0rmrIBOPqoPtwmE+LgUZHpX83fCQiQIWsejrN4ymlhc3Tdo/L/7fYTPPapE/ptfY7k9Jt/C0b3p9RsNYrMV3x987gErILfwZjOJrPl8La21jgmytAkeOaZ24A6ui0NPdPq3JqcPt2RlBzAtYANjgndwjEh20BEPOVmF5GiXUPXMV5Vx2MEYhaRzvS7VYrkyKSIeyP3R1d+Gr5v2vzw18nyClL+RMdKYIxalmhX14efFAJk7HB9fPtFr0JGwVwUEWlH9XAP6atXq/Psmkv6YJNwEgm6uzkj5uFOJK79OaRufmz366P6KTQYGeZZt79fN0Q+k7Bas5sQw8HhTmJ+mQ8mPx51h0mXhrYmMbu6XuClXqZIR6mMXcYuGPsFdPhIgxJiSy4qNdBtgt6UOh3JTGEr+FSr3H2kpICE9Yr+4IJ36H+7BLVXotNGlhXE4kcQjrNyg0Rr5XBqYClTvciMIcnW0sQgJCwBF8JDFZN9DO+JoW1w58upTFLhM3LQvdgtW8QmEaY3gEqP1YQ+XUlsXpODVs1Z0NFgk/4y7D0RTeg597LJgiWYB8YY4C3l32d6e00TXVfPmwUJQOqT3PXO+V5pCQnz6w7Qrw3hFDdHizIJB5nq8YfGAopD1wEtPJl7VIBBsWQvPE5CsRqDvdbGFAicOD7nO7IUU7HM/JoA3Y9LytdarFHxX9u9O05Sg97HXS8lNGaQUhzwZnjgZxyrqz0D82RzNVY5+hMnWa9GF2hecSbVitCJDSYDmDq3AlEIlSI7tS+8yxG/8fC7RhTtIi/V4ebdd+2D5unqzxIsp3MaX0jyD3S2xleCf0snmidHgqHJKG+c5tdaBO2f7lPb1gFI+NDM+WpZb+p7aDumRGfDvUZD/99Tq6QVdD33ba+rgzXJXo5b2Wyv3d199iUOfE2c2X0PPpa2tq5JTb5JMvsAEUDvOesIpdVFqoT7TNhv3ZOv7PRpNeVuE067YYMo0LThe5H5C1MQ3637Gijh3lGORAYNg++QwGKbA3p0qsmh+JzaKq9G3UBAPjm5ZphAyztrGAdCSQLYzxNqZQDOxioC2Hx7cwTGm82k3cGhftuOiSD9BKJZPbTaQ3i93iufji7Exspj/MKZw56Nv0s4S4PaNDTpgxrTXGCq9rkqc5sAKhTyWAvri3oe/SHdLjHhPQM+NriziLssXaWmbxA5FcjFdYcaJFXaDY2GdtWBPEKGX5BOyb01IB/uK3fJl1YcE4mi6B0QBxuc454tSh3saSPpPNrkORhJgBhc5jZbi6G7Zo8LMBTKHWATCaa7zPjguF9nHuqMYctL+C01l4ELzHbKLO0viMxrCNeVemqq5FgNwp/mu63GSisDIBfDOJ/WDuMLu0jPqa0WNTb4+oeL6MtS8+mhdA8WdzaByNEaUeJTH1Ow+2v3n/QxHMFet4SevNNz8zUTyWBkKHAtLO+1OBqiYzG3PvuuhQhdXwBdKHCtBAAMnIkKB90kh5AdkZpADoCvWgih5AqWLG8Q+RdJM4Y/YqyT+SRtp2CIZtkJXRuNmpEHng40b9BiB8OpO8JmyZ/5IzuuJEytDACbqEMCPhtLoJT0RNNgFonMr/WeLM2KgPjvQy8JcdEe9a+m3ZuB+5H0UBvkQanhfo4xHuMSl5TzjZSmN4oe6tpf+4096sodKIxo+FB7N6xqWdDOdNMa2p/tBfryYZun8upcI81ocesg7PCq/oEU807c5zY7QAoPkTwemYQhh/JjtQOULdrWwsoXv8Gml1WIfTpcLaf5gULu50zRaRkigetqm5D5G52P4THfF/pQLoSr+tkCBHA==')
        // console.log(f)
        // process.exit(1)

        $.isvObfuscator = '';
        await isvToken();
        if (!$.IsvToken) {
            console.log('获取[token]失败！');
            return;
        }

        // console.log($.IsvToken);
        await takePostRequest('login');
        await takePostRequest('getActivityBase')
        if (!$.pinToken) {
            console.log(`获取异常, 退出执行！！！`);
            return;
        }
        if ($.startTime && (Date.now() < $.startTime)) {
            console.log(`活动未开始`);
            $.activityEnd = true;
            message += '活动未开始'
            return;
        }
        if ($.hasEnd === true || ($.endTime && Date.now() > $.endTime)) {
            $.activityEnd = true
            console.log('活动已结束')
            message += '活动已结束'
            return
        }

        if ($.index == 1) {
            await takePostRequest('getShareConfig');
            await takePostRequest('getRule');
            console.log(`开始时间: ${proenv.timeFormat($.startTime)}`);
            console.log(`结束时间: ${proenv.timeFormat($.endTime)}`);
            console.log(`活动规则： ${$.actRule}`);
        }

        if ($.outFlag) {
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            return
        }
        //open?
        if ($.levelQualify == false) {
            if (jd_lzkj_v2_openCard == 1) {
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
                    //火爆账号退出执行
                    return;
                }
                if ($.index != 1) {
                    $.openFlag = true;
                }
            } else {
                // console.log(`如需自动入会, 请设置环境变量: export jd_lzkj_v2_openCard=\"1\"`);
                return
            }
        } else {
            console.log(`已开卡: ${$.venderId}`);
        }

        // $.followStatus
        if ($.followQualify == false) {
            await takePostRequest('followShop');
        }

        // if(!$.customerId){
        //     console.log('获取不到[customerId]退出执行，请重新执行')
        //     return
        // }

        await takePostRequest('getActivityInfo')
        if ($.getActivityInfo != '') {
            if ($.activityType == '20002') {
                if ($.getActivityInfo.status == 4) {
                    await takePostRequest('myPrizes')
                    console.log(`您今年已经领取过生日礼包`);
                    return
                } else if ($.getActivityInfo.status == 2) {
                    //2 - 请填写生日信息
                    await takePostRequest('birthday')
                    await takePostRequest('receivePrize')
                }
            } else if ($.activityType == '20003') {
                if ($.getActivityInfo.status == 4) {
                    await takePostRequest('myPrizes')
                    console.log(`您并非在活动期间入会，无法领取礼包哦`);
                    return
                } else if ($.getActivityInfo.status == 2) {
                    await takePostRequest('receivePrize')
                }
            }
        }
        await takePostRequest('myPrizes')

        if ($.activityEnd === true) {
            console.log("来迟了");
            return;
        }
        if ($.outFlag) {
            console.log("此ip已被限制，请过10分钟后再执行脚本\n");
            return;
        }
    } catch (e) {
        console.log(e.message)
    }
}

async function takePostRequest(type) {
    if ($.outFlag || $.continueFlag) return
    let domain = 'https://lzkj-isv.isvjcloud.com';
    let body = ``;
    let method = 'post'
    let admJson = ''
    switch (type) {
        case 'isvObfuscator':
            let sign = await proenvcard.getToken('lzkj');
            url = `https://api.m.jd.com/client.action?functionId=isvObfuscator&lmt=0&${sign}`;
            body = {};
            break;
        case 'login':
            url = `${domain}/prod/cc/interaction/v2/api/user/login`;
            body = {
                "token": $.IsvToken,
                "source": "01",
                "activityType": $.activityType,
                "templateCode": $.templateCode,
                "activityId": $.activityId,
                "shopId": $.shopId,
                "uuid": $.uuid,
                "timestamp": Date.now()
            }
            // console.log(body)
            body = proecy.v2_enc_req(JSON.stringify(body))
            break;
        case 'getActivityBase':
            url = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/api/common/getActivityBase`
            body = {"x": proecy.v2_x(32)}
            break;
        case 'getShareConfig':
            url = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/api/common/getShareConfig`
            body = {"url": $.activityUrl, "extra": {}}
            body = proecy.v2_enc_req(JSON.stringify(body))
            break;
        case 'followShop':
            url = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/api/common/followShop`
            body = {"x": proecy.v2_x(32)}
            break;
        case 'getActivityInfo':
            url = `https://lzkj-isv.isvjd.com/prod/cc/interaction/v2/api/${$.activityType}/getActivityInfo`
            body = {"x": proecy.v2_x(32)}
            break;
        case 'myPrizes':
            url = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/api/${$.activityType}/myPrizes`
            body = {"x": proecy.v2_x(32)}
            break;
        case 'getRule':
            method = 'get'
            url = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/api/common/getRule`
            // body = {"x": proecy.v2_x(32)}
            break;
        case 'birthday':
            url = `https://lzkj-isv.isvjd.com/prod/cc/interaction/v2/api/${$.activityType}/birthday`;
            bd = await proenv.timeFormat(Date.now())
            bd = bd.substring(0, 10)
            bd = bd.replaceAll('.', '/')
            bd = bd.replaceAll('-', '/')
            body = {"birthday": bd}
            body = proecy.v2_enc_req(JSON.stringify(body))
            break;
        case 'receivePrize':
            url = `https://lzkj-isv.isvjd.com/prod/cc/interaction/v2/api/${$.activityType}/receivePrize`;
            body = {"x": proecy.v2_x(32)}
            break;
        case 'getShopOpenCardInfo':
            method = 'post';
            if (!$.joinVenderId) {
                console.log('没有开卡id');
                break;
            }
            url = await proenvcard.getShopOpenCardInfo($.joinVenderId, $.UA, $.UserName)

            body = ``;
            break;
        case 'bindWithVender':
            if (!$.joinVenderId) {
                console.log('没有开卡id');
                break;
            }
            method = 'post';
            url = await proenvcard.bindWithVender($.joinVenderId, $.shopactivityId, $.UA, $.UserName)

            body = ``;
            break;
        default:
            console.log(`${type}`);
    }


    //参数
    let myRequest = getPostRequest(type, url, body, method);
    if (api_proxy_open == true || global_agent_http_proxy_isopen == true) {
        await $.wait(parseInt(Math.random() * 500 + 500, 10));
    } else {
        await $.wait(parseInt(Math.random() * 500 + 500, 10))
    }

    options = {}
    if (api_proxy_open == true) {
        let ip = `http://${$.ip}:${$.ipo}`
        let httpsAgent = new HttpsProxyAgent.HttpsProxyAgent(ip)
        let httpAgent = httpsAgent
        // httpAgent = tunnel.httpOverHttp({proxy: {host: $.ip, port: $.ipo}});
        // httpsAgent = tunnel.httpsOverHttp({proxy: {host: $.ip, port: $.ipo}});
        httpAgent.options = proenvcard.httpsOptions
        httpsAgent.options = proenvcard.httpsOptions
        options = {
            headers: myRequest.headers,
            timeout: myRequest.timeout,
            proxy: false,
            httpAgent: httpAgent,
            httpsAgent: httpsAgent,
        }
    } else {
        axios.defaults.httpsAgent = new https.Agent(proenvcard.httpsOptions)
        options = {
            headers: myRequest.headers,
            timeout: myRequest.timeout,
        }
    }
    //请求
    if (method.toLowerCase().includes('post')) {
        return axios.post(url, body, options).then(function (res) {
            res = getAxiosData(res);
            if (res) {
                // console.log(type+'-post-'+JSON.stringify(res));
                dealReturn(type, res);
            }

        }).catch(async function (err) {
            // console.log(err);
            if (err.response) {
                console.log(err.response.status);
                // console.log(err.response.data);
                if (api_proxy_open == true || global_agent_http_proxy_isopen == true) {

                } else {
                    if (err.response.status == '493') {
                        console.log(`ip可能已经被限制， 过十分钟再来！！！`);
                        $.outFlag = true
                        process.exit(1);
                    }
                }
                if (err.response.status == '403') {
                    // console.log('账号被限制或ip被限制, 先退出此号\n')
                    // $.continueFlag = true
                }
            }
            console.log(`错误码1: ${type} - ${err.code}`);

            if (api_proxy_open == true && (err.code == "ECONNRESET" || err.code == 'ECONNREFUSED' || err.code == 'ETIMEDOUT' || (err.response && (err.response.status == '407' || err.response.status == '436')))) {
                await $.wait(parseInt(Math.random() * 500 + 350, 10))
                if ($.ECONNRESET >= proenvcard.maxSet) {
                    console.log(`代理失败太多(可能代理失效了，请检查代理白名单是否掉出，额度是否超了), 强制退出`)
                    process.exit(1)
                    // $.ECONNRESET = 0;
                } else {
                    $.ECONNRESET += 1
                    if (api_proxy_open == true) {
                        let pList = await proenvcard.setIp(your_proxy_url);
                        if (pList != '') {
                            $.ip = pList[0]
                            $.ipo = pList[1]
                        }
                    }
                    await takePostRequest(type);
                }
            }
            if (err.code == "ECONNABORTED" || (err.code == "ERR_BAD_REQUEST" && !['isvObfuscator', 'getCk'].includes(type)) || err.code == 'ERR_BAD_RESPONSE' || err.code == 'EAI_AGAIN' || err.code == 'ETIMEDOUT' || err.code == 'SELF_SIGNED_CERT_IN_CHAIN') {
                if ($.ERR_BAD_REQUEST >= proenvcard.maxReq) {
                    $.ERR_BAD_REQUEST = 0
                } else {
                    $.ERR_BAD_REQUEST += 1
                    await $.wait(parseInt(Math.random() * 500 + 500, 10))
                    await takePostRequest(type);
                }
            }
        })
    } else if (method.toLowerCase().includes('get')) {
        return axios.get(url, options).then(function (res) {
            res = getAxiosData(res);
            if (res) {
                // console.log(type+'-get-'+JSON.stringify(res));
                dealReturn(type, res);
            }

        }).catch(async function (err) {
            // console.log(err)
            if (err.response) {
                console.log(err.response.status);
                // console.log(err.response.data);
                if (api_proxy_open == true || global_agent_http_proxy_isopen == true) {

                } else {
                    if (err.response.status == '493') {
                        console.log(`ip可能已经被限制， 过十分钟再来！！！`);
                        $.outFlag = true
                        process.exit(1);
                    }
                }
                if (err.response.status == '403') {
                    // console.log('账号被限制或ip被限制, 先退出此号\n')
                    // $.continueFlag = true
                }
            }
            console.log(`错误码1: ${type} - ${err.code}`);

            if (api_proxy_open == true && (err.code == "ECONNRESET" || err.code == 'ECONNREFUSED' || err.code == 'ETIMEDOUT' || (err.response && (err.response.status == '407' || err.response.status == '436')))) {
                await $.wait(parseInt(Math.random() * 500 + 350, 10))
                if ($.ECONNRESET >= proenvcard.maxSet) {
                    console.log(`代理失败太多(可能代理失效了，请检查代理白名单是否掉出，额度是否超了), 强制退出`)
                    process.exit(1)
                    // $.ECONNRESET = 0;
                } else {
                    $.ECONNRESET += 1
                    if (api_proxy_open == true) {
                        let pList = await proenvcard.setIp(your_proxy_url);
                        if (pList != '') {
                            $.ip = pList[0]
                            $.ipo = pList[1]
                        }
                    }
                    await takePostRequest(type);
                }
            }
            if (err.code == "ECONNABORTED" || (err.code == "ERR_BAD_REQUEST" && !['isvObfuscator', 'getCk'].includes(type)) || err.code == 'ERR_BAD_RESPONSE' || err.code == 'EAI_AGAIN' || err.code == 'ETIMEDOUT' || err.code == 'SELF_SIGNED_CERT_IN_CHAIN') {
                if ($.ERR_BAD_REQUEST >= proenvcard.maxReq) {
                    $.ERR_BAD_REQUEST = 0
                } else {
                    $.ERR_BAD_REQUEST += 1
                    await $.wait(parseInt(Math.random() * 500 + 500, 10))
                    await takePostRequest(type);
                }
            }
        })
    }
}

function dealReturn(type, data) {
    // console.log(`${type} --- ${data}`)
    let res = ''
    try {
        if (!['accessLog', 'attendLog', 'getCk', 'drawContent', 'accessLogWithAD', 'accessLog'].includes(type)) {
            if (data) {
                res = JSON.parse(data);
            }
        }
    } catch (e) {
        console.log(`${type} 执行任务异常`);
        // console.log(data  + '===>' + e);
        $.runFalag = false;
    }

    try {
        // console.log(`${type} -- ${data}`);
        switch (type) {
            case 'isvObfuscator':
                if (res && res.code == 0 && res.token) {
                    $.IsvToken = res.token || '';
                    // console.log(`token:${$.IsvToken}`);
                } else {
                    console.log(res.message);
                    $.isvObfuscator = res.message || '';
                    $.IsvToken = '';
                }
                break;
            case 'login':
                if (res.code == 200 && res.data) {
                    data = proecy.v2_dec_res(res.data)
                    res = JSON.parse(data)
                    $.avatar = res.avatar || '';
                    $.cid = res.cid || ''
                    $.encryptPin = res.encryptPin || ''
                    $.nickname = res.nickname || ''
                    $.pinToken = res.pinToken || ''
                }
                break;
            case 'getActivityBase':
                if (res.code == 200 && res.data) {
                    res = res.data

                    $.activityName = res.activityName || ''
                    $.endTime = res.endTime || 0
                    $.startTime = res.startTime || 0
                    $.followQualify = res.followQualify || false
                    $.levelQualify = res.levelQualify || false
                    $.thresholdLevelsStatus = res.thresholdLevelsStatus || 0
                    //5 - 您不是关注店铺用户且为非会员
                    //6 - 您不是关注店铺
                    //1 - 活动未开始
                    //3 - 活动已结束
                    openCardLink = res.openCardLink || ''
                    $.venderId = proecy.getUrlKeyValue('venderId', openCardLink)
                }
                break;
            case 'getShareConfig':
                if (res.code == 200 && res.data) {
                    res = res.data

                    $.shareId = res.shareId || ''
                    $.shareTitle = res.shareTitle || ''
                    console.log($.shareTitle);
                }
                break;
            case 'followShop':
                if (res.code == 200 && res.data) {
                    console.log(`关注店铺成功`);
                    // data = proecy.v2_dec_res(res.data)
                }
                break;
            case 'getActivityInfo':
                if (res.code == 200 && res.data) {
                    res = res.data

                    $.getActivityInfo = res || ''
                    // status 4 - 您今年已经领取过生日礼包
                    // status 2 - 请填写生日信息
                }
                break;
            case 'myPrizes':
                if (res.code == 200 && res.data) {
                    res = res.data

                    if (res.length >= 1) {
                        for (let r of res) {
                            console.log(`我的奖品: ${r.prizeName} ${proenv.timeFormat(r.createTime)}`)
                        }
                    }
                }
                break;
            case 'getRule':
                if (res.code == 200 && res.data) {
                    data = res.data
                    $.actRule = data
                }
                break;
            case 'birthday':
                if (res.code == 200 && res.data) {
                } else {
                    console.log(`${res.code} - ${res.message}`)
                }
                break;
            case 'receivePrize':
                if (res.code == 200 && res.data) {
                    // data = proecy.v2_dec_res(res.data)
                    res = res.data
                    // console.log(data)
                } else {
                    console.log(`${res.code} - ${res.message}`)
                }
                if (data.indexOf('奖品已发放完') > -1) {
                    $.activityEnd = true
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
                        } else {
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

function getPostRequest(type, url, body, method = "post") {
    let headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
        "Content-Type": "application/json;",
        "Origin": "https://lzkj-isv.isvjcloud.com",
        "Cookie": cookie,
        "User-Agent": $.UA,
        "X-Requested-With": "com.jingdong.app.mall",
    }
    if (url.indexOf('https://lzkj-isv.isvjcloud.com') > -1) {
        headers["Referer"] = `${$.activityUrl}`
        headers["Cookie"] = `${$.IsvToken && 'IsvToken=' + $.IsvToken || ''}${activityCookie && activityCookie || ''}`
        // headers['Token'] = `${$.Token && $.Token || ''}`;
    }

    if ($.pinToken) {
        headers["Pin-Token"] = $.pinToken;
    }
    if ($.shopId) {
        headers["Shop-Id"] = $.shopId;
    }
    if ($.templateCode) {
        headers["Template-Code"] = $.templateCode;
    }
    if ($.activityId) {
        headers["Activity-Id"] = $.activityId;
    }
    if ($.activityType) {
        headers["Activity-Type"] = $.activityType;
    }


    // "application/json, text/plain, */*"
    // Activity-Id
    // Activity-Type
    // Content-Type
    // Pin-Token
    // Shop-Id
    // Template-Code

    if (method.toLowerCase().includes('post')) {
        headers["Content-Type"] = "application/json;";
    }
    if (['getShopOpenCardInfo', 'bindWithVender'].includes(type)) {
        // console.log(`${type} -- --}`);
        headers = {
            'Accept': '*/*',
            'User-Agent': $.UA,
            'content-type': 'application/x-www-form-urlencoded',
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

    return {url: url, headers: headers, body: body, timeout: proenvcard.requestTimeout}
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
function getAxiosData(res) {
    setActivityCookie(res);
    if (res.status == 200 && res.data) {
        res = res.data;
        if (typeof res == 'object') {
            return JSON.stringify(res);
        } else {
            return res;
        }
    } else {
        return '';
    }
}

function setActivityCookie(resp) {
    if (resp.headers['set-cookie']) {
        cookie = originCookie + ';';
        for (let ck of resp.headers['set-cookie']) {
            lz_cookie[ck.split(';')[0].substr(0, ck.split(';')[0].indexOf('='))] = ck.split(';')[0].substr(ck.split(';')[0].indexOf('=') + 1);
        }
        for (const it of Object.keys(lz_cookie)) {
            cookie += (it + '=' + lz_cookie[it] + ';');
        }
        activityCookie = cookie;
    }
}

function getUUID(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", t = 0) {
    return x.replace(/[xy]/g, function (x) {
        var r = 16 * Math.random() | 0, n = "x" == x ? r : 3 & r | 8;
        return uuid = t ? n.toString(36).toUpperCase() : n.toString(36), uuid
    })
}


function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


const variables = ["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"];

/**
 * Generates a new variable based on the given string.
 * @param {string} str - The input string.
 * @returns {string} - The generated variable.
 */
function generateVariable(data) {

    let nowTime = Date.now() + parseInt(getCookie('te'));
    if (typeof data != 'object') {
        data = JSON.parse(data);
    }
    data.nowTime = nowTime;
    let para = getCookie('pToken') + (nowTime);

    const str = para.substring(0, (para.length - 5));
    let key = '';
    for (let i = 0; i < str.length; i++) {
        let index = str.charCodeAt(i);
        let variableIndex = index % 10;
        let ar = variables[variableIndex][i];
        key += ar;
    }

    // 转换为24个字节构成的字符串
    var keyLen = key.length;
    var seg = Math.floor(keyLen / 24);
    var encodeBytes = '';
    for (var i = 0; i < 24; i++) {
        var endIndex = (i + 1) * seg;
        if (i === 23) {
            endIndex = keyLen;
        }
        // 每seg个字符对应的bytes加和求平均值，得到一个平均值字节
        var subStr = key.substring(i * seg, endIndex);
        var bytes = [];
        for (var j = 0; j < subStr.length; j++) {
            bytes.push(subStr.charCodeAt(j));
        }
        var sum = bytes.reduce(function (acc, val) {
            return acc + val;
        }, 0);
        // 求一组子串中的平均值字节
        var b = Math.floor(sum / bytes.length);
        encodeBytes += String.fromCharCode(b);
    }
    key = encodeBytes

    const tokenKey = genTokenKey(key)
    const keyBytes = CryptoJS.enc.Utf8.parse(tokenKey);
    const ivBytes = CryptoJS.enc.Utf8.parse('');
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function genTokenKey(specialStr) {
    // 字符串反转
    specialStr = specialStr.split('').reverse().join('');
    // Base64使用12个字节即可生成16个字节
    const encodeBytes = new Uint8Array(12);
    // bytes中包含24个字节，每两个字节处理一次
    const bytes = new TextEncoder().encode(specialStr);
    // 每两个字节做一次处理，尽量保证第二个字节小幅度改动能影响以后的处理
    for (let i = 0; i < bytes.length; i += 2) {
        let val = (bytes[i] << 5) | (bytes[i + 1] & 0xFF);
        val %= 63;
        encodeBytes[i >> 1] = val;
    }
    // 二进制拼串
    let binaryStr = '';
    for (let i = 0; i < encodeBytes.length; i++) {
        binaryStr += (encodeBytes[i] + 0x100).toString(2).slice(1);
    }
    let processedStr = '';
    let prevVal = '';
    // 每6位对应一个Base64编码，根据上一次处理结果循环左移本次结果，尽量保证第一个字节小幅度改动能影响以后的处理
    for (let i = 0; i < 16; i++) {
        if (i !== 0) {
            const index = i * 6;
            const currVal = binaryStr.substring(index, index + 6);
            let curr = parseInt(currVal, 2);
            const chars = prevVal.split('');
            for (let j = 0; j < chars.length; j++) {
                if (chars[j] === '1') {
                    curr = ((curr >> (6 - j) | (curr << j)) & 0x3F);
                }
            }
            prevVal = (curr & 0x3F).toString(2).padStart(6, '0');
        } else {
            prevVal = binaryStr.substring(0, 6);
        }
        processedStr += prevVal;
    }
    // 二进制串转回字节数组
    for (let i = 0; i < 12; i++) {
        const index = i * 8;
        encodeBytes[i] = parseInt(processedStr.substring(index, index + 8), 2);
    }
    const key = btoa(String.fromCharCode.apply(null, encodeBytes));
    return key;
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = activityCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function isvToken() {
    try {
        if ($.client) {
            return new Promise(async resolve => {
                $token = await proenvcard.getIsvToken($.client, encodeURIComponent($.UserName));
                if ($token != '') {
                    console.log('读取缓存token成功');
                    $.IsvToken = $token;
                    resolve($.IsvToken)
                } else {
                    // 最多尝试3次读取
                    for (let tt = 0; tt < proenvcard.isvCount; tt++) {
                        await takePostRequest('isvObfuscator');
                        if ($.IsvToken != '' && $.IsvToken != undefined) {
                            await $.client.set(encodeURIComponent($.UserName), $.IsvToken);
                            await $.client.expire(encodeURIComponent($.UserName), proenvcard.redisExire);
                            console.log('缓存token成功');
                            resolve($.IsvToken)
                            break;
                        } else {
                            console.log('缓存token失败' + (tt + 1));
                            if (tt == (proenvcard.isvCount - 1)) {
                                resolve('')
                            }
                        }
                        if ($.isvObfuscator.indexOf('参数异常') > -1) {
                            break;
                        }
                    }
                }
                // resolve($.IsvToken);
            })
        } else {
            return new Promise(async resolve => {
                $token = await proenvcard.getIsvToken($.client, encodeURIComponent($.UserName));
                if ($token != '') {
                    console.log('读取缓存token成功');
                    $.IsvToken = $token;
                    resolve($.IsvToken)
                } else {
                    // 最多尝试3次读取
                    for (let tt = 0; tt < proenvcard.isvCount; tt++) {
                        await takePostRequest('isvObfuscator');
                        if ($.IsvToken != '' && $.IsvToken != undefined) {
                            await proenvcard.subIsvToken(encodeURIComponent($.UserName), $.IsvToken);
                            console.log('缓存token成功');
                            resolve($.IsvToken)
                            break;
                        } else {
                            console.log('缓存token失败' + (tt + 1));
                            if (tt == (proenvcard.isvCount - 1)) {
                                resolve('')
                            }
                        }
                        if ($.isvObfuscator.indexOf('参数异常') > -1) {
                            break;
                        }
                    }
                }
                // resolve($.IsvToken);
            })
        }
    } catch (e) {
        console.log(e.message)
    }
}


//获取代理Ip


async function showMsg() {
    if ($.isNode()) {
        if (message) {
            $.msg($.name, '', `【京东账号${$.index}】${$.UserName} ${message} \n`);
            allMessage += `【京东账号${$.index}】${$.UserName} ${message}${$.index !== cookiesArr.length ? '\n' : ''}`;
        } else {
            allMessage += ''
        }
    }
}

// function timeFormat(time = +new Date()) {
//     var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
//     return date.toJSON().substr(0, 19).replace('T', ' ');
// }
//transformRequest
//transformResponsefunction Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
