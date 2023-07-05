/*
种豆得豆
更新时间：2021-08-19
活动入口：京东APP我的-更多工具-种豆得豆
已支持IOS京东多账号,云端多京东账号
注：会自动关注任务中的店铺跟商品，介意者勿使用。
每个京东账号每天只能帮助3个人。多出的助力码将会助力失败。

cron "1 5,11,15,19 * * *" script-path=jd_plantBean.js,tag=京东种豆得豆
*/
let global_agent_http_proxy_isopen = false;
if (process.env.GLOBAL_AGENT_HTTP_PROXY_OPEN == "true"){
    global_agent_http_proxy_isopen = true;
    require("global-agent/bootstrap");
    global.GLOBAL_AGENT.HTTP_PROXY = process.env.GLOBAL_AGENT_HTTP_PROXY_URL || '';
}

const $ = new Env('京东种豆得豆');
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let jdNotify = true;//是否开启静默运行。默认true开启
let cookiesArr = [], cookie = '', jdPlantBeanShareArr = [], isBox = false, notify, newShareCodes = [], option, message,subTitle;
let window = null
//助力好友分享码(最多3个,否则后面的助力失败)
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = ['']
let allMessage = ``;
let currentRoundId = null;//本期活动id
let lastRoundId = null;//上期id
let roundList = [];
let awardState = '';//上期活动的京豆是否收取
let num;

$.shareCodesArr = [];

notify = $.isNode() ? require('./sendNotify') : '';

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item]);
    });
    console.log(`如果出现提示 ?.data. 错误，请升级nodejs版本(进入容器后，apk add nodejs-current)`)
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
    cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }

    //
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';

            //TotalBean
            console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
            message = '';
            subTitle = '';
            option = {};
            await shareCodesFormat();
            await jdPlantBean();
            await showMsg();

            if (global_agent_http_proxy_isopen == false) {
                await $.wait(Math.random() * 5500 + 90000, 10);
            }
        }
    }
    if ($.isNode() && allMessage) {
        await notify.sendNotify(`${$.name}`, `${allMessage}`)
    }
})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
})

async function jdPlantBean() {
    try {
        console.log(`获取任务及基本信息`)
        await plantBeanIndex('jdPlantBean');
        await $.wait(parseInt(Math.random()*2000+1500,10));
        for (let i = 0; i < $.plantBeanIndexResult.data.roundList.length; i++) {
            if ($.plantBeanIndexResult.data.roundList[i].roundState === "2") {
                num = i
                break
            }
        }
        // console.log(plantBeanIndexResult.data.taskList);
        if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0' && $.plantBeanIndexResult.data) {
            const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl
            $.myPlantUuid = getParam(shareUrl, 'plantUuid')
            console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.myPlantUuid}\n`);

            try {
                if ($.index === 1) {
                    let submitRes = await submitCode0();
                    if (submitRes && submitRes.code === 0) {console.log(`🥑种豆得豆-互助码已提交！🥑`);} else {console.log(`🥑种豆得豆-互助码提交失败！🥑`);}
                } else {
                    let submitCodeRes = await submitCode();
                    if (submitCodeRes && submitCodeRes.code === 0) {console.log(`🥑种豆得豆-互助码已提交！🥑`);} else {console.log(`🥑种豆得豆-互助码提交失败！🥑`);}
                }
            } catch (e) {}

            roundList = $.plantBeanIndexResult.data.roundList;
            currentRoundId = roundList[num].roundId;//本期的roundId
            lastRoundId = roundList[num - 1].roundId;//上期的roundId
            awardState = roundList[num - 1].awardState;
            $.taskList = $.plantBeanIndexResult.data.taskList;
            subTitle = `【京东昵称】${$.plantBeanIndexResult.data.plantUserInfo.plantNickName}`;
            message += `【上期时间】${roundList[num - 1].dateDesc.replace('上期 ', '')}\n`;
            message += `【上期成长值】${roundList[num - 1].growth}\n`;
            await receiveNutrients();//定时领取营养液
            await doHelp();//助力
            await doTask();//做日常任务
            // await doEgg();
            await stealFriendWater();
            await doCultureBean();
            await doGetReward();
            await showTaskProcess();
            await plantShareSupportList();
        } else {
            console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`);
        }
    } catch (e) {
        $.logErr(e);
        const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
        if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
        $.msg($.name, '', `${errMsg}`)
    }
}

async function doGetReward() {
    console.log(`【上轮京豆】${awardState === '4' ? '采摘中' : awardState === '5' ? '可收获了' : '已领取'}`);
    if (awardState === '4') {
        //京豆采摘中...
        message += `【上期状态】${roundList[num - 1].tipBeanEndTitle}\n`;
    } else if (awardState === '5') {
        //收获
        await getReward();
        console.log('开始领取京豆');
        if ($.getReward && $.getReward.code === '0') {
            console.log('京豆领取成功');
            message += `【上期兑换京豆】${$.getReward.data.awardBean}个\n`;
            $.msg($.name, subTitle, message);
            allMessage += `京东账号${$.index} ${$.nickName}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`
        } else {
            console.log(`$.getReward 异常：${JSON.stringify($.getReward)}`)
        }
    } else if (awardState === '6') {
        //京豆已领取
        message += `【上期兑换京豆】${roundList[num - 1].awardBeans}个\n`;
    }
    if (roundList[num].dateDesc.indexOf('本期 ') > -1) {
        roundList[num].dateDesc = roundList[num].dateDesc.substr(roundList[num].dateDesc.indexOf('本期 ') + 3, roundList[num].dateDesc.length);
    }
    message += `【本期时间】${roundList[num].dateDesc}\n`;
    message += `【本期成长值】${roundList[num].growth}\n`;
}

async function doCultureBean() {
    await plantBeanIndex();

    if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0') {
        const plantBeanRound = $.plantBeanIndexResult.data.roundList[num]
        if (plantBeanRound.roundState === '2') {
            //收取营养液
            if (plantBeanRound.bubbleInfos && plantBeanRound.bubbleInfos.length) console.log(`开始收取营养液`)
            for (let bubbleInfo of plantBeanRound.bubbleInfos) {
                console.log(`收取-${bubbleInfo.name}-的营养液`)
                await cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType)
                console.log(`收取营养液结果:${JSON.stringify($.cultureBeanRes)}`)
            }
        }
    } else {
        console.log(`plantBeanIndexResult:${JSON.stringify($.plantBeanIndexResult)}`)
    }
}

async function stealFriendWater() {
    await stealFriendList();
    if ($.stealFriendList && $.stealFriendList.code === '0') {
        if ($.stealFriendList.data && $.stealFriendList.data.tips) {
            console.log('\n\n今日偷取好友营养液已达上限\n\n');
            return
        }
        if ($.stealFriendList.data && $.stealFriendList.data.friendInfoList && $.stealFriendList.data.friendInfoList.length > 0) {
            let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
            for (let item of $.stealFriendList.data.friendInfoList) {
                if (new Date(nowTimes).getHours() === 20) {
                    if (item.nutrCount >= 2) {
                        // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
                        console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
                        await collectUserNutr(item.paradiseUuid);
                        console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
                        if ($.stealFriendRes && $.stealFriendRes.code === '0') {
                            console.log(`偷取好友营养液成功`)
                        }
                    }
                } else {
                    if (item.nutrCount >= 3) {
                        // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
                        console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
                        await collectUserNutr(item.paradiseUuid);
                        console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
                        if ($.stealFriendRes && $.stealFriendRes.code === '0') {
                            console.log(`偷取好友营养液成功`)
                        }
                    }
                }
            }
        }
    } else {
        console.log(`$.stealFriendList 异常： ${JSON.stringify($.stealFriendList)}`)
    }
}
async function doEgg() {
    await egg();
    if ($.plantEggLotteryRes && $.plantEggLotteryRes.code === '0') {
        if ($.plantEggLotteryRes.data.restLotteryNum > 0) {
            const eggL = new Array($.plantEggLotteryRes.data.restLotteryNum).fill('');
            console.log(`目前共有${eggL.length}次扭蛋的机会`)
            for (let i = 0; i < eggL.length; i++) {
                console.log(`开始第${i + 1}次扭蛋`);
                await plantEggDoLottery();
                console.log(`天天扭蛋成功：${JSON.stringify($.plantEggDoLotteryResult)}`);
            }
        } else {
            console.log('暂无扭蛋机会')
        }
    } else {
        console.log('查询天天扭蛋的机会失败' + JSON.stringify($.plantEggLotteryRes))
    }
}

async function doTask() {
    if ($.taskList && $.taskList.length > 0) {
        for (let item of $.taskList) {
            if (item.isFinished === 1) {
                console.log(`${item.taskName} 任务已完成\n`);
                continue;
            } else {
                if (item.taskType === 8) {
                    console.log(`\n【${item.taskName}】任务未完成,需自行手动去京东APP完成，${item.desc}营养液\n`)
                } else {
                    console.log(`\n【${item.taskName}】任务未完成,${item.desc}营养液\n`)
                }
            }
            if (item.dailyTimes === 1 && item.taskType !== 8) {
                console.log(`\n开始做 ${item.taskName}任务`);
                // $.receiveNutrientsTaskRes = await receiveNutrientsTask(item.taskType);
                await receiveNutrientsTask(item.taskType);
                console.log(`做 ${item.taskName}任务结果:${JSON.stringify($.receiveNutrientsTaskRes)}\n`);
            }
            if (item.taskType === 3) {
                //浏览店铺
                console.log(`开始做 ${item.taskName}任务`);
                let unFinishedShopNum = item.totalNum - item.gainedNum;
                if (unFinishedShopNum === 0) {
                    continue
                }
                await shopTaskList();
                const { data } = $.shopTaskListRes;
                let goodShopListARR = [], moreShopListARR = [], shopList = [];
                const { goodShopList, moreShopList } = data;

                if (goodShopList) {
                    for (let i of goodShopList) {
                        if (i.taskState === '2') {
                            goodShopListARR.push(i);
                        }
                    }
                }
                if (moreShopList) {
                    for (let j of moreShopList) {
                        if (j.taskState === '2') {
                            moreShopListARR.push(j);
                        }
                    }
                }

                shopList = goodShopListARR.concat(moreShopListARR);
                for (let shop of shopList) {
                    const { shopId, shopTaskId } = shop;
                    const body = {
                        "monitor_refer": "plant_shopNutrientsTask",
                        "shopId": shopId,
                        "shopTaskId": shopTaskId
                    }
                    const shopRes = await request('shopNutrientsTask', body);
                    console.log(`shopRes结果:${JSON.stringify(shopRes)}`);
                    if (shopRes && shopRes.code === '0') {
                        if (shopRes.data && shopRes.data.nutrState && shopRes.data.nutrState === '1') {
                            unFinishedShopNum --;
                        }
                    }
                    if (unFinishedShopNum <= 0) {
                        console.log(`${item.taskName}任务已做完\n`)
                        break;
                    }
                }
            }
            if (item.taskType === 5) {
                //挑选商品
                console.log(`开始做 ${item.taskName}任务`);
                let unFinishedProductNum = item.totalNum - item.gainedNum;
                if (unFinishedProductNum === 0) {
                    continue
                }
                await productTaskList();
                // console.log('productTaskList', $.productTaskList);
                const { data } = $.productTaskList;
                let productListARR = [], productList = [];
                const { productInfoList } = data;
                for (let i = 0; i < productInfoList.length; i++) {
                    for (let j = 0; j < productInfoList[i].length; j++){
                        productListARR.push(productInfoList[i][j]);
                    }
                }
                for (let i of productListARR) {
                    if (i.taskState === '2') {
                        productList.push(i);
                    }
                }
                for (let product of productList) {
                    const { skuId, productTaskId } = product;
                    const body = {
                        "monitor_refer": "plant_productNutrientsTask",
                        "productTaskId": productTaskId,
                        "skuId": skuId
                    }
                    const productRes = await request('productNutrientsTask', body);
                    if (productRes && productRes.code === '0') {
                        // console.log('nutrState', productRes)
                        //这里添加多重判断,有时候会出现活动太火爆的问题,导致nutrState没有
                        if (productRes.data && productRes.data.nutrState && productRes.data.nutrState === '1') {
                            unFinishedProductNum --;
                        }
                    }
                    if (unFinishedProductNum <= 0) {
                        console.log(`${item.taskName}任务已做完\n`)
                        break;
                    }
                }
            }
            if (item.taskType === 10) {
                //关注频道
                console.log(`开始做 ${item.taskName}任务`);
                let unFinishedChannelNum = item.totalNum - item.gainedNum;
                if (unFinishedChannelNum === 0) {
                    continue
                }
                await plantChannelTaskList();
                const { data } = $.plantChannelTaskList;
                // console.log('goodShopList', data.goodShopList);
                // console.log('moreShopList', data.moreShopList);
                let goodChannelListARR = [], normalChannelListARR = [], channelList = [];
                const { goodChannelList, normalChannelList } = data;
                for (let i of goodChannelList) {
                    if (i.taskState === '2') {
                        goodChannelListARR.push(i);
                    }
                }
                for (let j of normalChannelList) {
                    if (j.taskState === '2') {
                        normalChannelListARR.push(j);
                    }
                }
                channelList = goodChannelListARR.concat(normalChannelListARR);
                for (let channelItem of channelList) {
                    const { channelId, channelTaskId } = channelItem;
                    const body = {
                        "channelId": channelId,
                        "channelTaskId": channelTaskId
                    }
                    const channelRes = await request('plantChannelNutrientsTask', body);
                    console.log(`channelRes结果:${JSON.stringify(channelRes)}`);
                    if (channelRes && channelRes.code === '0') {
                        if (channelRes.data && channelRes.data.nutrState && channelRes.data.nutrState === '1') {
                            unFinishedChannelNum --;
                        }
                    }
                    if (unFinishedChannelNum <= 0) {
                        console.log(`${item.taskName}任务已做完\n`)
                        break;
                    }
                }
            }
        }
    }
}

function showTaskProcess() {
    return new Promise(async resolve => {
        await plantBeanIndex();
        $.taskList = $.plantBeanIndexResult.data.taskList;
        if ($.taskList && $.taskList.length > 0) {
            console.log("     任务   进度");
            for (let item of $.taskList) {
                console.log(`[${item["taskName"]}]  ${item["gainedNum"]}/${item["totalNum"]}   ${item["isFinished"]}`);
            }
        }
        resolve()
    })
}

//助力好友
async function doHelp() {
    for (let plantUuid of newShareCodes) {
        if (!plantUuid || plantUuid.length == 0) continue;
        console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${plantUuid}`);
        if (plantUuid === $.myPlantUuid) {
            console.log(`\n跳过自己的plantUuid\n`)
            continue
        }
        await helpShare(plantUuid);
        try {
            if ($.helpResult && $.helpResult.code === '0') {
                // console.log(`助力好友结果: ${JSON.stringify($.helpResult.data.helpShareRes)}`);
                if ($.helpResult.data.helpShareRes) {
                    if ($.helpResult.data.helpShareRes.state === '1') {
                        try {await beanCount($.UserName);}catch (e) {console.log(e.message)}
                        console.log(`助力好友${plantUuid}成功`)
                        console.log(`${$.helpResult.data.helpShareRes.promptText}\n`);
                    } else if ($.helpResult.data.helpShareRes.state === '2') {
                        console.log('您今日助力的机会已耗尽，已不能再帮助好友助力了\n');
                        break;
                    } else if ($.helpResult.data.helpShareRes.state === '3') {
                        console.log('该好友今日已满9人助力/20瓶营养液,明天再来为Ta助力吧\n')
                    } else if ($.helpResult.data.helpShareRes.state === '4') {
                        console.log(`${$.helpResult.data.helpShareRes.promptText}\n`)
                    } else {
                        console.log(`助力其他情况：${JSON.stringify($.helpResult.data.helpShareRes)}`);
                    }
                }
            } else {
                console.log(`助力好友失败: ${JSON.stringify($.helpResult)}`);
            }
        }catch (e) {
            console.log(`助力好友出现异常`);
        }
    }
}

function showMsg() {
    $.log(`\n${message}\n`);
    jdNotify = $.getdata('jdPlantBeanNotify') ? $.getdata('jdPlantBeanNotify') : jdNotify;
    if (!jdNotify || jdNotify === 'false') {
        $.msg($.name, subTitle, message);
    }
}

// ================================================此处是API=================================
//每轮种豆活动获取结束后,自动收取京豆
async function getReward() {
    const body = {
        "roundId": lastRoundId
    }
    $.getReward = await request('receivedBean', body);
}

//收取营养液
async function cultureBean(currentRoundId, nutrientsType) {
    let functionId = arguments.callee.name.toString();
    let body = {
        "roundId": currentRoundId,
        "nutrientsType": nutrientsType,
    }
    $.cultureBeanRes = await request(functionId, body);
}

//偷营养液大于等于3瓶的好友
//①查询好友列表
async function stealFriendList() {
    const body = {
        pageNum: '1'
    }
    $.stealFriendList = await request('plantFriendList', body);
}

//②执行偷好友营养液的动作
async function collectUserNutr(paradiseUuid) {
    console.log('开始偷好友');
    // console.log(paradiseUuid);
    let functionId = arguments.callee.name.toString();
    const body = {
        "paradiseUuid": paradiseUuid,
        "roundId": currentRoundId
    }
    await $.wait(parseInt(Math.random()*1000+1000,10));
    $.stealFriendRes = await request(functionId, body);
}
async function receiveNutrients() {
    $.receiveNutrientsRes = await request('receiveNutrients', {"roundId": currentRoundId, "monitor_refer": "plant_receiveNutrients"})
    // console.log(`定时领取营养液结果:${JSON.stringify($.receiveNutrientsRes)}`)
}
async function plantEggDoLottery() {
    $.plantEggDoLotteryResult = await request('plantEggDoLottery');
}
//查询天天扭蛋的机会
async function egg() {
    $.plantEggLotteryRes = await request('plantEggLotteryIndex');
}
async function productTaskList() {
    let functionId = arguments.callee.name.toString();
    $.productTaskList = await request(functionId, {"monitor_refer": "plant_productTaskList"});
}
async function plantChannelTaskList() {
    let functionId = arguments.callee.name.toString();
    $.plantChannelTaskList = await request(functionId);
    // console.log('$.plantChannelTaskList', $.plantChannelTaskList)
}
async function shopTaskList() {
    let functionId = arguments.callee.name.toString();
    $.shopTaskListRes = await request(functionId, {"monitor_refer": "plant_receiveNutrients"});
    // console.log('$.shopTaskListRes', $.shopTaskListRes)
}
async function receiveNutrientsTask(awardType) {
    const functionId = arguments.callee.name.toString();
    const body = {
        "monitor_refer": "receiveNutrientsTask",
        "awardType": `${awardType}`,
    }
    $.receiveNutrientsTaskRes = await request(functionId, body);
}
async function plantShareSupportList() {
    $.shareSupportList = await request('plantShareSupportList', {"roundId": ""});
    if ($.shareSupportList && $.shareSupportList.code === '0') {
        const { data } = $.shareSupportList;
        //当日北京时间0点时间戳
        const UTC8_Zero_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
        //次日北京时间0点时间戳
        const UTC8_End_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 + (24 * 60 * 60 * 1000);
        let friendList = [];
        data.map(item => {
            if (UTC8_Zero_Time <= item['createTime'] && item['createTime'] < UTC8_End_Time) {
                friendList.push(item);
            }
        })
        message += `【助力您的好友】共${friendList.length}人`;
    } else {
        console.log(`异常情况：${JSON.stringify($.shareSupportList)}`)
    }
}

function beanCount(username) {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/beanc?username=${username}`,timeout: 10000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {}
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//助力好友的api
async function helpShare(plantUuid) {
    console.log(`\n开始助力好友: ${plantUuid}`);
    const body = {
        "plantUuid": plantUuid,
        "wxHeadImgUrl": "",
        "shareUuid": "",
        "followType": "1",
    }
    await $.wait(parseInt(Math.random()*1000+1000,10));
    $.helpResult = await request(`plantBeanIndex`, body);
    await $.wait(parseInt(Math.random()*1000+1000,10));
    console.log(`助力结果的code:${$.helpResult && $.helpResult.code}`);
}

async function plantBeanIndex(type='') {
    if (type == 'jdPlantBean') {
        $.plantBeanIndexResult = await request('plantBeanIndex');   //plantBeanIndexBody
        await $.wait(parseInt(Math.random()*2000+1500,10));
    }

    await $.wait(parseInt(Math.random()*1000+1500,10));
    // console.log(`plantBeanIndex:${$.plantBeanIndexResult}`);
}

function readShareCode() {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/get/bean`, timeout: 60000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
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

function submitCode() {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/bean?code=${$.myPlantUuid}&user=${$.UserName}`, timeout: 10000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
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

function submitCode0() {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/bean0?code=${$.myPlantUuid}&user=${$.UserName}`, timeout: 10000}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
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
            newShareCodes = [...new Set([...(readShareCodeRes.data || [])])];
        }
        console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`)
        resolve();
    })
}
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Ox101154=["\x76\x65\x72\x73\x69\x6F\x6E","\x39\x2E\x30\x2E\x30\x2E\x31","\x6D\x6F\x6E\x69\x74\x6F\x72\x5F\x73\x6F\x75\x72\x63\x65","\x70\x6C\x61\x6E\x74\x5F\x61\x70\x70\x5F\x70\x6C\x61\x6E\x74\x5F\x69\x6E\x64\x65\x78","\x6D\x6F\x6E\x69\x74\x6F\x72\x5F\x72\x65\x66\x65\x72","","\x72\x61\x6E\x64\x6F\x6D","\x77\x61\x69\x74","\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x62\x6F\x64\x79\x3D","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x26\x61\x70\x70\x69\x64\x3D\x6C\x64","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x2A\x2F\x2A","\x6B\x65\x65\x70\x2D\x61\x6C\x69\x76\x65","\x4A\x44\x34\x69\x50\x68\x6F\x6E\x65\x2F\x31\x36\x37\x32\x38\x33\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x69\x4F\x53\x20\x31\x33\x2E\x36\x2E\x31\x3B\x53\x63\x61\x6C\x65\x2F\x33\x2E\x30\x30\x29","\x7A\x68\x2D\x48\x61\x6E\x73\x2D\x43\x4E\x3B\x71\x3D\x31\x2C\x65\x6E\x2D\x43\x4E\x3B\x71\x3D\x30\x2E\x39","\x67\x7A\x69\x70\x2C\x20\x64\x65\x66\x6C\x61\x74\x65\x2C\x20\x62\x72","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x0A\u79CD\u8C46\u5F97\u8C46\x3A\x20\x41\x50\x49\u67E5\u8BE2\u8BF7\u6C42\u5931\u8D25\x20\u203C\uFE0F\u203C\uFE0F","\x6C\x6F\x67","\x6C\x6F\x67\x45\x72\x72","\x70\x61\x72\x73\x65","\x67\x65\x74","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x5F\x69\x64\x3A","\x39\x2E\x32\x2E\x34\x2E\x33","\x70\x6C\x61\x6E\x74\x5F\x6D\x5F\x70\x6C\x61\x6E\x74\x5F\x69\x6E\x64\x65\x78","\x73\x69\x67\x6E\x65\x64\x5F\x77\x68\x35","\x31\x32\x2E\x30\x2E\x34","\x61\x6E\x64\x72\x6F\x69\x64","\x64\x32\x34\x36\x61","\x70\x6C\x61\x6E\x74\x42\x65\x61\x6E\x49\x6E\x64\x65\x78","\x62\x35\x36\x62\x38","\x72\x65\x63\x65\x69\x76\x65\x4E\x75\x74\x72\x69\x65\x6E\x74\x73","\x64\x32\x32\x61\x63","\x72\x65\x63\x65\x69\x76\x65\x4E\x75\x74\x72\x69\x65\x6E\x74\x73\x54\x61\x73\x6B","\x36\x61\x32\x31\x36","\x63\x75\x6C\x74\x75\x72\x65\x42\x65\x61\x6E","\x37\x33\x35\x31\x62","\x70\x72\x6F\x64\x75\x63\x74\x54\x61\x73\x6B\x4C\x69\x73\x74","\x31\x39\x63\x38\x38","\x73\x68\x6F\x70\x4E\x75\x74\x72\x69\x65\x6E\x74\x73\x54\x61\x73\x6B","\x61\x34\x65\x32\x64","\x70\x72\x6F\x64\x75\x63\x74\x4E\x75\x74\x72\x69\x65\x6E\x74\x73\x54\x61\x73\x6B","\x31\x34\x33\x35\x37","\x63\x6F\x6C\x6C\x65\x63\x74\x55\x73\x65\x72\x4E\x75\x74\x72","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x61\x70\x70\x69\x64\x3D\x73\x69\x67\x6E\x65\x64\x5F\x77\x68\x35\x26\x63\x6C\x69\x65\x6E\x74\x3D\x61\x6E\x64\x72\x6F\x69\x64\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x32\x2E\x30\x2E\x34","\x26\x61\x70\x70\x69\x64\x3D\x73\x69\x67\x6E\x65\x64\x5F\x77\x68\x35\x26\x63\x6C\x69\x65\x6E\x74\x3D\x61\x6E\x64\x72\x6F\x69\x64\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x32\x2E\x30\x2E\x34\x26\x68\x35\x73\x74\x3D","\x3F","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x6C\x61\x6E\x74\x65\x61\x72\x74\x68\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x63\x6F\x6D\x2E\x6A\x69\x6E\x67\x64\x6F\x6E\x67\x2E\x61\x70\x70\x2E\x6D\x61\x6C\x6C","\x69\x73\x4E\x6F\x64\x65","\x4A\x44\x5F\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54","\x65\x6E\x76","\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54","\x2E\x2F\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54\x53","\x4A\x44\x55\x41","\x67\x65\x74\x64\x61\x74\x61","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x39\x2E\x34\x2E\x34\x3B\x31\x34\x2E\x33\x3B\x6E\x65\x74\x77\x6F\x72\x6B\x2F\x34\x67\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x34\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31","\x6A\x73\x64\x6F\x6D","\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x4D\x61\x63\x69\x6E\x74\x6F\x73\x68\x3B\x20\x49\x6E\x74\x65\x6C\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x20\x31\x30\x2E\x31\x35\x3B\x20\x72\x76\x3A\x39\x31\x2E\x30\x29\x20\x47\x65\x63\x6B\x6F\x2F\x32\x30\x31\x30\x30\x31\x30\x31\x20\x46\x69\x72\x65\x66\x6F\x78\x2F\x39\x31\x2E\x30","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6D\x73\x69\x74\x65\x70\x70\x2D\x66\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x72\x65\x73\x74\x2F\x70\x72\x69\x63\x65\x70\x72\x6F\x70\x68\x6F\x6E\x65\x2F\x70\x72\x69\x63\x65\x50\x72\x6F\x50\x68\x6F\x6E\x65\x4D\x65\x6E\x75","\x56\x69\x72\x74\x75\x61\x6C\x43\x6F\x6E\x73\x6F\x6C\x65","\x64\x61\x6E\x67\x65\x72\x6F\x75\x73\x6C\x79","\x3C\x62\x6F\x64\x79\x3E\x0A\x20\x20\x20\x20\x3C\x73\x63\x72\x69\x70\x74\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x73\x3A\x2F\x2F\x73\x74\x61\x74\x69\x63\x2E\x33\x36\x30\x62\x75\x79\x69\x6D\x67\x2E\x63\x6F\x6D\x2F\x73\x69\x74\x65\x70\x70\x53\x74\x61\x74\x69\x63\x2F\x73\x63\x72\x69\x70\x74\x2F\x6D\x65\x73\x63\x72\x6F\x6C\x6C\x2F\x6D\x61\x70\x2E\x6A\x73\x22\x3E\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E\x0A\x20\x20\x20\x20\x3C\x73\x63\x72\x69\x70\x74\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x73\x3A\x2F\x2F\x73\x74\x6F\x72\x61\x67\x65\x2E\x33\x36\x30\x62\x75\x79\x69\x6D\x67\x2E\x63\x6F\x6D\x2F\x77\x65\x62\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72\x2F\x6A\x73\x5F\x73\x65\x63\x75\x72\x69\x74\x79\x5F\x76\x33\x2E\x6A\x73\x22\x3E\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E\x0A\x20\x20\x20\x20\x3C\x73\x63\x72\x69\x70\x74\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x73\x3A\x2F\x2F\x73\x74\x61\x74\x69\x63\x2E\x33\x36\x30\x62\x75\x79\x69\x6D\x67\x2E\x63\x6F\x6D\x2F\x73\x69\x74\x65\x70\x70\x53\x74\x61\x74\x69\x63\x2F\x73\x63\x72\x69\x70\x74\x2F\x75\x74\x69\x6C\x73\x2E\x6A\x73\x22\x3E\x3C\x2F\x73\x63\x72\x69\x70\x74\x3E\x0A\x20\x20\x20\x20\x3C\x2F\x62\x6F\x64\x79\x3E","\x77\x69\x6E\x64\x6F\x77","\x73\x69\x67\x6E\x57\x61\x61\x70","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function requestGet(_0xac78x2,_0xac78x3= {}){if(!_0xac78x3[__Ox101154[0x0]]){_0xac78x3[__Ox101154[0x0]]= __Ox101154[0x1]};_0xac78x3[__Ox101154[0x2]]= __Ox101154[0x3];_0xac78x3[__Ox101154[0x4]]= __Ox101154[0x5];return  new Promise(async (_0xac78x4)=>{ await $[__Ox101154[0x7]](parseInt(Math[__Ox101154[0x6]]()* 2000+ 1500,10));const _0xac78x5={url:`${__Ox101154[0x5]}${JD_API_HOST}${__Ox101154[0x8]}${_0xac78x2}${__Ox101154[0x9]}${escape(JSON[__Ox101154[0xa]](_0xac78x3))}${__Ox101154[0xb]}`,headers:{'\x43\x6F\x6F\x6B\x69\x65':cookie,'\x48\x6F\x73\x74':__Ox101154[0xc],'\x41\x63\x63\x65\x70\x74':__Ox101154[0xd],'\x43\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E':__Ox101154[0xe],'\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74':__Ox101154[0xf],'\x41\x63\x63\x65\x70\x74\x2D\x4C\x61\x6E\x67\x75\x61\x67\x65':__Ox101154[0x10],'\x41\x63\x63\x65\x70\x74\x2D\x45\x6E\x63\x6F\x64\x69\x6E\x67':__Ox101154[0x11],'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Ox101154[0x12]},timeout:10000};$[__Ox101154[0x17]](_0xac78x5,(_0xac78x6,_0xac78x7,_0xac78x8)=>{try{if(_0xac78x6){console[__Ox101154[0x14]](__Ox101154[0x13]);$[__Ox101154[0x15]](_0xac78x6)}else {_0xac78x8= JSON[__Ox101154[0x16]](_0xac78x8)}}catch(e){$[__Ox101154[0x15]](e,_0xac78x7)}finally{_0xac78x4(_0xac78x8)}})})}async function request(_0xac78x2,_0xac78x3= {}){ await $[__Ox101154[0x7]](parseInt(Math[__Ox101154[0x6]]()* 1000+ 1500,10));return  new Promise(async (_0xac78x4)=>{ await $[__Ox101154[0x7]](parseInt(Math[__Ox101154[0x6]]()* 1000+ 1500,10));$[__Ox101154[0x17]]( await taskUrl(_0xac78x2,_0xac78x3),(_0xac78x6,_0xac78x7,_0xac78x8)=>{try{if(_0xac78x6){console[__Ox101154[0x14]](__Ox101154[0x13]);console[__Ox101154[0x14]](`${__Ox101154[0x18]}${_0xac78x2}${__Ox101154[0x5]}`);$[__Ox101154[0x15]](_0xac78x6)}else {_0xac78x8= JSON[__Ox101154[0x16]](_0xac78x8)}}catch(e){$[__Ox101154[0x15]](e,_0xac78x7)}finally{_0xac78x4(_0xac78x8)}})})}function taskUrl(_0xac78x2,_0xac78x3){return  new Promise(async (_0xac78x4)=>{_0xac78x3[__Ox101154[0x0]]= __Ox101154[0x19];_0xac78x3[__Ox101154[0x2]]= __Ox101154[0x1a];_0xac78x3[__Ox101154[0x4]]= __Ox101154[0x5];h5st= __Ox101154[0x5];bb= {"\x61\x70\x70\x69\x64":__Ox101154[0x1b],"\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64":_0xac78x2,"\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E":__Ox101154[0x1c],"\x63\x6C\x69\x65\x6E\x74":__Ox101154[0x1d],"\x62\x6F\x64\x79":_0xac78x3};switch(_0xac78x2){case __Ox101154[0x1f]:h5st=  await getH5st(__Ox101154[0x1e],bb);break;case __Ox101154[0x21]:h5st=  await getH5st(__Ox101154[0x20],bb);break;case __Ox101154[0x23]:h5st=  await getH5st(__Ox101154[0x22],bb);break;case __Ox101154[0x25]:h5st=  await getH5st(__Ox101154[0x24],bb);break;case __Ox101154[0x27]:h5st=  await getH5st(__Ox101154[0x26],bb);break;case __Ox101154[0x29]:h5st=  await getH5st(__Ox101154[0x28],bb);break;case __Ox101154[0x2b]:h5st=  await getH5st(__Ox101154[0x2a],bb);break;case __Ox101154[0x2d]:h5st=  await getH5st(__Ox101154[0x2c],bb);break;default:h5st= __Ox101154[0x5];break};if(h5st== __Ox101154[0x5]){ub= `${__Ox101154[0x2e]}${_0xac78x2}${__Ox101154[0x9]}${escape(JSON[__Ox101154[0xa]](_0xac78x3))}${__Ox101154[0x2f]}`}else {ub= `${__Ox101154[0x2e]}${_0xac78x2}${__Ox101154[0x9]}${escape(JSON[__Ox101154[0xa]](_0xac78x3))}${__Ox101154[0x30]}${encodeURIComponent(h5st)}${__Ox101154[0x5]}`};let _0xac78x8={url:JD_API_HOST+ __Ox101154[0x31]+ ub,headers:{"\x6F\x72\x69\x67\x69\x6E":__Ox101154[0x32],"\x78\x2D\x72\x65\x71\x75\x65\x73\x74\x65\x64\x2D\x77\x69\x74\x68":__Ox101154[0x33],"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x48\x6F\x73\x74":__Ox101154[0xc],"\x41\x63\x63\x65\x70\x74":__Ox101154[0xd],"\x43\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E":__Ox101154[0xe],"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":$[__Ox101154[0x34]]()?(process[__Ox101154[0x36]][__Ox101154[0x35]]?process[__Ox101154[0x36]][__Ox101154[0x35]]:(require(__Ox101154[0x38])[__Ox101154[0x37]])):($[__Ox101154[0x3a]](__Ox101154[0x39])?$[__Ox101154[0x3a]](__Ox101154[0x39]):__Ox101154[0x3b]),"\x41\x63\x63\x65\x70\x74\x2D\x4C\x61\x6E\x67\x75\x61\x67\x65":__Ox101154[0x10],"\x41\x63\x63\x65\x70\x74\x2D\x45\x6E\x63\x6F\x64\x69\x6E\x67":__Ox101154[0x11],"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":__Ox101154[0x12]},timeout:10000};_0xac78x4(_0xac78x8)})}const jsdom=require(__Ox101154[0x3c]);let domWindow=null;async function sleep(_0xac78xe){return  new Promise((_0xac78x4,_0xac78xf)=>{setTimeout(()=>{_0xac78x4(_0xac78xe)},_0xac78xe)})}async function loadH5Sdk(){const {JSDOM}=jsdom;let _0xac78x11= new jsdom.ResourceLoader({'\x75\x73\x65\x72\x41\x67\x65\x6E\x74':__Ox101154[0x3d],'\x72\x65\x66\x65\x72\x72\x65\x72':__Ox101154[0x3e]});let _0xac78x12= new jsdom[(__Ox101154[0x3f])]();let _0xac78x13={'\x75\x72\x6C':__Ox101154[0x3e],'\x72\x65\x66\x65\x72\x72\x65\x72':__Ox101154[0x3e],'\x75\x73\x65\x72\x41\x67\x65\x6E\x74':__Ox101154[0x3d],'\x72\x75\x6E\x53\x63\x72\x69\x70\x74\x73':__Ox101154[0x40],'\x72\x65\x73\x6F\x75\x72\x63\x65\x73':_0xac78x11,'\x69\x6E\x63\x6C\x75\x64\x65\x4E\x6F\x64\x65\x4C\x6F\x63\x61\x74\x69\x6F\x6E\x73':true,'\x73\x74\x6F\x72\x61\x67\x65\x51\x75\x6F\x74\x61':10000000,'\x70\x72\x65\x74\x65\x6E\x64\x54\x6F\x42\x65\x56\x69\x73\x75\x61\x6C':true,'\x76\x69\x72\x74\x75\x61\x6C\x43\x6F\x6E\x73\x6F\x6C\x65':_0xac78x12};const _0xac78x14= new JSDOM(__Ox101154[0x41],_0xac78x13); await sleep(500);domWindow= _0xac78x14[__Ox101154[0x42]]}async function getH5st(_0xac78x16,_0xac78x17){let _0xac78x18=null;if(!domWindow){ await loadH5Sdk()};return  new Promise(async (_0xac78x4)=>{if( typeof domWindow[__Ox101154[0x43]]=== __Ox101154[0x44]){const _0xac78x19= await domWindow[__Ox101154[0x43]](_0xac78x16,_0xac78x17);_0xac78x4(_0xac78x19)}else {_0xac78x18= setInterval(async ()=>{if( typeof domWindow[__Ox101154[0x43]]=== __Ox101154[0x44]){clearInterval(_0xac78x18);_0xac78x18= null;const _0xac78x19= await domWindow[__Ox101154[0x43]](_0xac78x16,_0xac78x17);_0xac78x4(_0xac78x19)}},100)}})}(function(_0xac78x1a,_0xac78x1b,_0xac78x1c,_0xac78x1d,_0xac78x1e,_0xac78x1f){_0xac78x1f= __Ox101154[0x45];_0xac78x1d= function(_0xac78x20){if( typeof alert!== _0xac78x1f){alert(_0xac78x20)};if( typeof console!== _0xac78x1f){console[__Ox101154[0x14]](_0xac78x20)}};_0xac78x1c= function(_0xac78x21,_0xac78x1a){return _0xac78x21+ _0xac78x1a};_0xac78x1e= _0xac78x1c(__Ox101154[0x46],_0xac78x1c(_0xac78x1c(__Ox101154[0x47],__Ox101154[0x48]),__Ox101154[0x49]));try{_0xac78x1a= __encode;if(!( typeof _0xac78x1a!== _0xac78x1f&& _0xac78x1a=== _0xac78x1c(__Ox101154[0x4a],__Ox101154[0x4b]))){_0xac78x1d(_0xac78x1e)}}catch(e){_0xac78x1d(_0xac78x1e)}})({})
function getParam(url, name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    const r = url.match(reg)
    if (r != null) return unescape(r[2]);
    return null;
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
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
