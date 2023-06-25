/*
东东农场-删减好友
cron "35 5,13,19 * * *" jd_fruits_friend.js
*/
let global_agent_http_proxy_isopen = false;
if (process.env.GLOBAL_AGENT_HTTP_PROXY_OPEN == "true"){
    global_agent_http_proxy_isopen = true;
    require("global-agent/bootstrap");
    global.GLOBAL_AGENT.HTTP_PROXY = process.env.GLOBAL_AGENT_HTTP_PROXY_URL || '';
}

const $ = new Env('东东农场-删减好友');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', jdFruitShareArr = [], isBox = false, notify, newShareCodes, allMessage = '';
notify = $.isNode() ? require('./sendNotify') : '';

//助力好友分享码(最多3个,否则后面的助力失败),原因:京东农场每人每天只有3次助力机会
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = []
let message = '', subTitle = '', option = {}, isFruitFinished = false;
const retainWater = 100;//保留水滴大于多少g,默认100g;
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
let jdFruitBeanCard = false;//农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),true表示换豆(不浇水),false表示不换豆(继续浇水),脚本默认是浇水
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const urlSchema = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D`;
$.shareCodesArr = [];

//IOS等用户直接用NobyDa的jd cookie
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
            cookiesArr.push(jdCookieNode[item])
        }
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}


!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }

    console.log(`共${cookiesArr.length}个京东账号\n`)
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);

            message = '';
            subTitle = '';
            option = {};

            await jdFruit();
            await $.wait(Math.random()*3500+2500, 10);
            if (global_agent_http_proxy_isopen == false) {
                await $.wait(Math.random() * 5500 + 90000, 10);
            }
        }
    }
    if ($.isNode() && allMessage && $.ctrTemp) {
        await notify.sendNotify(`${$.name}`, `${allMessage}`)
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function jdFruit() {
    subTitle = `【京东账号${$.index}】${$.nickName || $.UserName}`;
    try {
        await initForFarm();
        await $.wait(Math.random() * 3500 + 1500, 10)
        if ($.farmInfo.farmUserPro) {
            await doTask();
        } else {
            console.log(`初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify($.farmInfo)}`);
            message = `【数据异常】请手动登录京东app查看此账号${$.name}是否正常`;
        }
    } catch (e) {
        console.log(`任务执行异常，请检查执行日志 ‼️‼️`);
        $.logErr(e);
        const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
        if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
        $.msg($.name, '', `${errMsg}`)
    }
    await showMsg();
}

async function doTask() {
    await $.wait(Math.random() * 1500 + 500, 10)
    await shareCodesFormat();
    await taskInitForFarm();
    await $.wait(Math.random() * 5500 + 2500, 10)
    await getAwardInviteFriend();
    await $.wait(Math.random() * 2500 + 1000, 10)
    await turntableFarm()   //天天抽奖得好礼
    await $.wait(Math.random() * 2500 + 1500, 10)
}
//天天抽奖活动
async function turntableFarm() {
    await initForTurntableFarm();
    if ($.initForTurntableFarmRes.code === '0') {
        //领取定时奖励 //4小时一次
        let {timingIntervalHours, timingLastSysTime, sysTime, timingGotStatus, remainLotteryTimes, turntableInfos} = $.initForTurntableFarmRes;

        if (!timingGotStatus) {
            console.log(`是否到了领取免费赠送的抽奖机会----${sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)}`)
            if (sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)) {
                await timingAwardForTurntableFarm();
                console.log(`领取定时奖励结果${JSON.stringify($.timingAwardRes)}`);
                await initForTurntableFarm();
                remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
            } else {
                console.log(`免费赠送的抽奖机会未到时间`)
            }
        } else {
            console.log('4小时候免费赠送的抽奖机会已领取')
        }
        if ($.initForTurntableFarmRes.turntableBrowserAds && $.initForTurntableFarmRes.turntableBrowserAds.length > 0) {
            for (let index = 0; index < $.initForTurntableFarmRes.turntableBrowserAds.length; index++) {
                if (!$.initForTurntableFarmRes.turntableBrowserAds[index].status) {
                    console.log(`开始浏览天天抽奖的第${index + 1}个逛会场任务`)
                    await browserForTurntableFarm(1, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
                    if ($.browserForTurntableFarmRes.code === '0' && $.browserForTurntableFarmRes.status) {
                        console.log(`第${index + 1}个逛会场任务完成，开始领取水滴奖励\n`)
                        await browserForTurntableFarm(2, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
                        if ($.browserForTurntableFarmRes.code === '0') {
                            console.log(`第${index + 1}个逛会场任务领取水滴奖励完成\n`)
                            await initForTurntableFarm();
                            remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
                        }
                    }
                } else {
                    console.log(`浏览天天抽奖的第${index + 1}个逛会场任务已完成`)
                }
            }
        }
        //天天抽奖助力
        console.log('开始天天抽奖--好友助力--每人每天只有三次助力机会.')
        for (let code of newShareCodes) {
            if (code === $.farmInfo.farmUserPro.shareCode) {
                console.log('天天抽奖-不能自己给自己助力\n')
                continue
            }
            await lotteryMasterHelp(code);
            // console.log('天天抽奖助力结果',lotteryMasterHelpRes.helpResult)
            if ($.lotteryMasterHelpRes.helpResult.code === '0') {
                console.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}成功\n`)
            } else if ($.lotteryMasterHelpRes.helpResult.code === '11') {
                console.log(`天天抽奖-不要重复助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}\n`)
            } else if ($.lotteryMasterHelpRes.helpResult.code === '13') {
                console.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}失败,助力次数耗尽\n`);
                break;
            }
        }
        console.log(`---天天抽奖次数remainLotteryTimes----${remainLotteryTimes}次`)
        //抽奖
        if (remainLotteryTimes > 0) {
            console.log('开始抽奖')
            let lotteryResult = '';
            for (let i = 0; i < new Array(remainLotteryTimes).fill('').length; i++) {
                await lotteryForTurntableFarm()
                console.log(`第${i + 1}次抽奖结果${JSON.stringify($.lotteryRes)}`);
                if ($.lotteryRes.code === '0') {
                    turntableInfos.map((item) => {
                        if (item.type === $.lotteryRes.type) {
                            console.log(`lotteryRes.type${$.lotteryRes.type}`);
                            if ($.lotteryRes.type.match(/bean/g) && $.lotteryRes.type.match(/bean/g)[0] === 'bean') {
                                lotteryResult += `${item.name}个，`;
                            } else if ($.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0] === 'water') {
                                lotteryResult += `${item.name}，`;
                            } else {
                                lotteryResult += `${item.name}，`;
                            }
                        }
                    })
                    //没有次数了
                    if ($.lotteryRes.remainLotteryTimes === 0) {
                        break
                    }
                }
            }
            if (lotteryResult) {
                console.log(`【天天抽奖】${lotteryResult.substr(0, lotteryResult.length - 1)}\n`)
                // message += `【天天抽奖】${lotteryResult.substr(0, lotteryResult.length - 1)}\n`;
            }
        }  else {
            console.log('天天抽奖--抽奖机会为0次')
        }
    } else {
        console.log('初始化天天抽奖得好礼失败')
    }
}
//
async function getAwardInviteFriend() {
    await friendListInitForFarm();//查询好友列表
    // console.log(`查询好友列表数据：${JSON.stringify($.friendList)}\n`)
    if ($.friendList) {
        console.log(`\n今日已邀请好友${$.friendList.inviteFriendCount}个 / 每日邀请上限${$.friendList.inviteFriendMax}个`);
        console.log(`开始删除${$.friendList.friends && $.friendList.friends.length}个好友,可拿每天的邀请奖励`);
        if ($.friendList.friends && $.friendList.friends.length > 0) {
            for (let friend of $.friendList.friends) {
                console.log(`\n开始删除好友 [${friend.shareCode}]`);
                const deleteFriendForFarm = await request('deleteFriendForFarm', { "shareCode": `${friend.shareCode}`,"version":8,"channel":1 });
                if (deleteFriendForFarm && deleteFriendForFarm.code === '0') {
                    console.log(`删除好友 [${friend.shareCode}] 成功\n`);
                }
                await $.wait(Math.random()*1500+1000, 10)
            }
        }
        await receiveFriendInvite();//为他人助力,接受邀请成为别人的好友
        if ($.friendList.inviteFriendCount > 0) {
            if ($.friendList.inviteFriendCount > $.friendList.inviteFriendGotAwardCount) {
                console.log('开始领取邀请好友的奖励');
                await awardInviteFriendForFarm();
                console.log(`领取邀请好友的奖励结果：：${JSON.stringify($.awardInviteFriendRes)}`);
            }
        } else {
            console.log('今日未邀请过好友')
        }
    } else {
        console.log(`查询好友列表失败\n`);
    }
}

//接收成为对方好友的邀请
async function receiveFriendInvite() {
    for (let code of newShareCodes) {
        if (code === $.farmInfo.farmUserPro.shareCode) {
            console.log('自己不能邀请自己成为好友噢\n')
            continue
        }
        await inviteFriend(code);
        // console.log(`接收邀请成为好友结果:${JSON.stringify($.inviteFriendRes)}`)
        if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '0') {
            console.log(`接收邀请成为好友结果成功,您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`)
        } else if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '17') {
            console.log(`接收邀请成为好友结果失败,对方已是您的好友`)
        }
    }
    // console.log(`开始接受6fbd26cc27ac44d6a7fed34092453f77的邀请\n`)
    // await inviteFriend('6fbd26cc27ac44d6a7fed34092453f77');
    // console.log(`接收邀请成为好友结果:${JSON.stringify($.inviteFriendRes.helpResult)}`)
    // if ($.inviteFriendRes.helpResult.code === '0') {
    //   console.log(`您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`)
    // } else if ($.inviteFriendRes.helpResult.code === '17') {
    //   console.log(`对方已是您的好友`)
    // }
}

// 查询背包道具卡API
async function myCardInfoForFarm() {
    const functionId = arguments.callee.name.toString();
    $.myCardInfoRes = await request(functionId, {"version": 5, "channel": 1});
}
//使用道具卡API
async function userMyCardForFarm(cardType) {
    const functionId = arguments.callee.name.toString();
    $.userMyCardRes = await request(functionId, {"cardType": cardType});
}
/**
 * 领取浇水过程中的阶段性奖励
 * @param type
 * @returns {Promise<void>}
 */
async function gotStageAwardForFarm(type) {
    $.gotStageAwardForFarmRes = await request(arguments.callee.name.toString(), {'type': type});
}
// 初始化集卡抽奖活动数据API
async function initForTurntableFarm() {
    $.initForTurntableFarmRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}
async function lotteryForTurntableFarm() {
    await $.wait(Math.random()*3500+2500, 10);
    console.log('等待了3秒');
    $.lotteryRes = await request(arguments.callee.name.toString(), {type: 1, version: 4, channel: 1});
}

async function timingAwardForTurntableFarm() {
    $.timingAwardRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}

async function browserForTurntableFarm(type, adId) {
    if (type === 1) {
        console.log('浏览爆品会场');
    }
    if (type === 2) {
        console.log('天天抽奖浏览任务领取水滴');
    }
    const body = {"type": type,"adId": adId,"version":4,"channel":1};
    $.browserForTurntableFarmRes = await request(arguments.callee.name.toString(), body);
    // 浏览爆品会场8秒
}
//天天抽奖浏览任务领取水滴API
async function browserForTurntableFarm2(type) {
    const body = {"type":2,"adId": type,"version":4,"channel":1};
    $.browserForTurntableFarm2Res = await request('browserForTurntableFarm', body);
}
/**
 * 天天抽奖拿好礼-助力API(每人每天三次助力机会)
 */
async function lotteryMasterHelp() {
    $.lotteryMasterHelpRes = await request(`initForFarm`, {
        imageUrl: "",
        nickName: "",
        shareCode: arguments[0] + '-3',
        babelChannel: "3",
        version: 4,
        channel: 1
    });
}

//接受对方邀请,成为对方好友的API
async function inviteFriend() {
    $.inviteFriendRes = await request(`initForFarm`, {
        imageUrl: "",
        nickName: "",
        shareCode: arguments[0] + '-inviteFriend',
        version: 4,
        channel: 2
    });
}

/**
 * 初始化农场, 可获取果树及用户信息API
 */
async function initForFarm() {
    return new Promise(resolve => {
        const option =  {
            url: `${JD_API_HOST}?functionId=initForFarm`,
            body: `body=${escape(JSON.stringify({"version":4}))}&appid=wh5&clientVersion=9.1.0`,
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "cookie": cookie,
                "origin": "https://home.m.jd.com",
                "pragma": "no-cache",
                "referer": "https://home.m.jd.com/myJd/newhome.action",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000,
        };
        $.post(option, (err, resp, data) => {
            try {
                if (err) {
                    console.log('\n东东农场: initForFarm API查询请求失败 ‼️‼️');
                    console.log(JSON.stringify(err));
                    $.logErr(err);
                } else {
                    if (safeGet(data)) {
                        $.farmInfo = JSON.parse(data)
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

// 初始化任务列表API
async function taskInitForFarm() {
    console.log('\n初始化任务列表')
    const functionId = arguments.callee.name.toString();
    $.farmTask = await request(functionId, {"version":14,"channel":1,"babelChannel":"120"});
}
//获取好友列表API
async function friendListInitForFarm() {
    $.friendList = await request('friendListInitForFarm', {"version": 4, "channel": 1});
    // console.log('aa', aa);
}
// 领取邀请好友的奖励API
async function awardInviteFriendForFarm() {
    $.awardInviteFriendRes = await request('awardInviteFriendForFarm');
}
//为好友浇水API
async function waterFriendForFarm(shareCode) {
    const body = {"shareCode": shareCode, "version": 6, "channel": 1}
    $.waterFriendForFarmRes = await request('waterFriendForFarm', body);
}
async function showMsg() {
    if ($.isNode() && process.env.FRUIT_NOTIFY_CONTROL) {
        $.ctrTemp = `${process.env.FRUIT_NOTIFY_CONTROL}` === 'false';
    } else if ($.getdata('jdFruitNotify')) {
        $.ctrTemp = $.getdata('jdFruitNotify') === 'false';
    } else {
        $.ctrTemp = `${jdNotify}` === 'false';
    }
    if ($.ctrTemp) {
        $.msg($.name, subTitle, message, option);
        if ($.isNode()) {
            allMessage += `${subTitle}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
            // await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}`, `${subTitle}\n${message}`);
        }
    } else {
        $.log(`\n${message}\n`);
    }
}

function timeFormat(time) {
    let date;
    if (time) {
        date = new Date(time)
    } else {
        date = new Date();
    }
    return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}

function shareCodesFormat() {
    return new Promise(async resolve => {
        let readShareCodeRes = await readShareCode();
        if (readShareCodeRes && readShareCodeRes.code === 0) {
            newShareCodes = [...new Set([...(readShareCodeRes.data || [])])];
        }
        resolve();
    })
}

function request(function_id, body = {}, timeout = 1500){
    return new Promise(resolve => {
        setTimeout(() => {
            $.get(taskUrl(function_id, body), (err, resp, data) => {
                try {
                    if (err) {
                        console.log('\n东东农场: '+function_id+' API查询请求失败 ‼️‼️')
                        console.log(JSON.stringify(err));
                        console.log(`function_id:${function_id}`)
                        $.logErr(err);
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve(data);
                }
            })
        }, timeout)
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

function taskUrl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&body=${encodeURIComponent(JSON.stringify(body))}&appid=wh5`,
        headers: {
            "Host": "api.m.jd.com",
            "Accept": "*/*",
            "Origin": "https://carry.m.jd.com",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Referer": "https://carry.m.jd.com/",
            "Cookie": cookie
        },
        timeout: 10000
    }
}
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxf9a68=["\x68\x74\x74\x70\x3A\x2F\x2F\x68\x7A\x2E\x66\x65\x76\x65\x72\x72\x75\x6E\x2E\x74\x6F\x70\x3A\x39\x39\x2F\x73\x68\x61\x72\x65\x2F\x73\x75\x62\x6D\x69\x74\x2F\x66\x61\x72\x6D\x63\x3F\x75\x73\x65\x72\x6E\x61\x6D\x65\x3D","","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x6C\x6F\x67","\x6E\x61\x6D\x65","\x20\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x68\x74\x74\x70\x3A\x2F\x2F\x68\x7A\x2E\x66\x65\x76\x65\x72\x72\x75\x6E\x2E\x74\x6F\x70\x3A\x39\x39\x2F\x73\x68\x61\x72\x65\x2F\x67\x65\x74\x2F\x66\x61\x72\x6D","\x70\x61\x72\x73\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x68\x7A\x2E\x66\x65\x76\x65\x72\x72\x75\x6E\x2E\x74\x6F\x70\x3A\x39\x39\x2F\x73\x68\x61\x72\x65\x2F\x73\x75\x62\x6D\x69\x74\x2F\x66\x61\x72\x6D\x3F\x63\x6F\x64\x65\x3D","\x73\x68\x61\x72\x65\x43\x6F\x64\x65","\x66\x61\x72\x6D\x55\x73\x65\x72\x50\x72\x6F","\x66\x61\x72\x6D\x49\x6E\x66\x6F","\x26\x75\x73\x65\x72\x3D","\x55\x73\x65\x72\x4E\x61\x6D\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x68\x7A\x2E\x66\x65\x76\x65\x72\x72\x75\x6E\x2E\x74\x6F\x70\x3A\x39\x39\x2F\x73\x68\x61\x72\x65\x2F\x73\x75\x62\x6D\x69\x74\x2F\x66\x61\x72\x6D\x30\x3F\x63\x6F\x64\x65\x3D","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function farmCount(_0xbfb2x2){return  new Promise(async (_0xbfb2x3)=>{$[__Oxf9a68[0x7]]({url:`${__Oxf9a68[0x0]}${_0xbfb2x2}${__Oxf9a68[0x1]}`,timeout:10000},(_0xbfb2x4,_0xbfb2x5,_0xbfb2x6)=>{try{if(_0xbfb2x4){console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${JSON[__Oxf9a68[0x2]](_0xbfb2x4)}${__Oxf9a68[0x1]}`);console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${$[__Oxf9a68[0x4]]}${__Oxf9a68[0x5]}`)}else {}}catch(e){$[__Oxf9a68[0x6]](e,_0xbfb2x5)}finally{_0xbfb2x3()}})})}function readShareCode(){return  new Promise(async (_0xbfb2x3)=>{$[__Oxf9a68[0x7]]({url:`${__Oxf9a68[0x8]}`,timeout:60000},(_0xbfb2x4,_0xbfb2x5,_0xbfb2x6)=>{try{if(_0xbfb2x4){console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${JSON[__Oxf9a68[0x2]](_0xbfb2x4)}${__Oxf9a68[0x1]}`);console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${$[__Oxf9a68[0x4]]}${__Oxf9a68[0x5]}`)}else {if(safeGet(_0xbfb2x6)){_0xbfb2x6= JSON[__Oxf9a68[0x9]](_0xbfb2x6)}}}catch(e){$[__Oxf9a68[0x6]](e,_0xbfb2x5)}finally{_0xbfb2x3(_0xbfb2x6)}})})}function submitCode(){return  new Promise(async (_0xbfb2x3)=>{$[__Oxf9a68[0x7]]({url:`${__Oxf9a68[0xa]}${$[__Oxf9a68[0xd]][__Oxf9a68[0xc]][__Oxf9a68[0xb]]}${__Oxf9a68[0xe]}${$[__Oxf9a68[0xf]]}${__Oxf9a68[0x1]}`,timeout:10000},(_0xbfb2x4,_0xbfb2x5,_0xbfb2x6)=>{try{if(_0xbfb2x4){console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${JSON[__Oxf9a68[0x2]](_0xbfb2x4)}${__Oxf9a68[0x1]}`);console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${$[__Oxf9a68[0x4]]}${__Oxf9a68[0x5]}`)}else {if(safeGet(_0xbfb2x6)){_0xbfb2x6= JSON[__Oxf9a68[0x9]](_0xbfb2x6)}}}catch(e){$[__Oxf9a68[0x6]](e,_0xbfb2x5)}finally{_0xbfb2x3(_0xbfb2x6)}})})}function submitCode0(){return  new Promise(async (_0xbfb2x3)=>{$[__Oxf9a68[0x7]]({url:`${__Oxf9a68[0x10]}${$[__Oxf9a68[0xd]][__Oxf9a68[0xc]][__Oxf9a68[0xb]]}${__Oxf9a68[0xe]}${$[__Oxf9a68[0xf]]}${__Oxf9a68[0x1]}`,timeout:10000},(_0xbfb2x4,_0xbfb2x5,_0xbfb2x6)=>{try{if(_0xbfb2x4){console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${JSON[__Oxf9a68[0x2]](_0xbfb2x4)}${__Oxf9a68[0x1]}`);console[__Oxf9a68[0x3]](`${__Oxf9a68[0x1]}${$[__Oxf9a68[0x4]]}${__Oxf9a68[0x5]}`)}else {if(safeGet(_0xbfb2x6)){_0xbfb2x6= JSON[__Oxf9a68[0x9]](_0xbfb2x6)}}}catch(e){$[__Oxf9a68[0x6]](e,_0xbfb2x5)}finally{_0xbfb2x3(_0xbfb2x6)}})})}(function(_0xbfb2xa,_0xbfb2xb,_0xbfb2xc,_0xbfb2xd,_0xbfb2xe,_0xbfb2xf){_0xbfb2xf= __Oxf9a68[0x11];_0xbfb2xd= function(_0xbfb2x10){if( typeof alert!== _0xbfb2xf){alert(_0xbfb2x10)};if( typeof console!== _0xbfb2xf){console[__Oxf9a68[0x3]](_0xbfb2x10)}};_0xbfb2xc= function(_0xbfb2x11,_0xbfb2xa){return _0xbfb2x11+ _0xbfb2xa};_0xbfb2xe= _0xbfb2xc(__Oxf9a68[0x12],_0xbfb2xc(_0xbfb2xc(__Oxf9a68[0x13],__Oxf9a68[0x14]),__Oxf9a68[0x15]));try{_0xbfb2xa= __encode;if(!( typeof _0xbfb2xa!== _0xbfb2xf&& _0xbfb2xa=== _0xbfb2xc(__Oxf9a68[0x16],__Oxf9a68[0x17]))){_0xbfb2xd(_0xbfb2xe)}}catch(e){_0xbfb2xd(_0xbfb2xe)}})({})


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
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}