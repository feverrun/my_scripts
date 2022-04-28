/*
东东水果:脚本更新地址 jd_fruit.js
更新时间：2021-11-7
活动入口：京东APP我的-更多工具-东东农场
东东农场活动链接：https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html
一天只能帮助3个人。多出的助力码无效
cron "5 4,7,14,20 * * *" script-path=jd_fruits.js,tag=东东农场
export DO_TEN_WATER_AGAIN="" 默认再次浇水
*/

const $ = new Env('东东农场');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', jdFruitShareArr = [], isBox = false, notify, newShareCodes, allMessage = '';
notify = $.isNode() ? require('./sendNotify') : '';

CryptoScripts()
$.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;

//助力好友分享码(最多3个,否则后面的助力失败),原因:京东农场每人每天只有3次助力机会
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = []
let message = '', subTitle = '', option = {}, isFruitFinished = false;
const retainWater = 100;//保留水滴大于多少g,默认100g;
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
let jdFruitBeanCard = false;//农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),true表示换豆(不浇水),false表示不换豆(继续浇水),脚本默认是浇水
let randomCount = $.isNode() ? 20 : 5;
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

            $.ADID = getUUID('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 1);
            $.UUID = getUUID('xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx');

            await shareCodesFormat();
            await jdFruit();
            break;
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
        await $.wait(1500);
        await requestAlgo('8a2af');
        await $.wait(1500);

        await initForFarm();

        if ($.farmInfo.farmUserPro) {
            // option['media-url'] = $.farmInfo.farmUserPro.goodsImage;
            message = `【水果名称】${$.farmInfo.farmUserPro.name}\n`;
            console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.farmInfo.farmUserPro.shareCode}\n`);

            try {
                if ($.index === 1) {
                    let submitRes = await submitCode0();
                    if (submitRes && submitRes.code === 0) {console.log(`🐔东东农场-互助码已提交！🐔`);} else {console.log(`🐔东东农场-互助码提交失败！🐔`);}
                } else {
                    let submitCodeRes = await submitCode();
                    if (submitCodeRes && submitCodeRes.code === 0) {console.log(`🐔东东农场-互助码已提交！🐔`);} else {console.log(`🐔东东农场-互助码提交失败！🐔`);}
                }
            } catch (e) {}

            console.log(`\n【已成功兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`);
            message += `【已兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`;
            await masterHelpShare();//助力好友
            if ($.farmInfo.treeState === 2 || $.farmInfo.treeState === 3) {
                option['open-url'] = urlSchema;
                $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}水果已可领取`, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看`);
                }
                return
            } else if ($.farmInfo.treeState === 1) {
                console.log(`\n${$.farmInfo.farmUserPro.name}种植中...\n`)
            } else if ($.farmInfo.treeState === 0) {
                //已下单购买, 但未开始种植新的水果
                option['open-url'] = urlSchema;
                $.msg($.name, ``, `【京东账号${$.index}】 ${$.nickName || $.UserName}\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果\n点击弹窗即达`, option);
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name} - 您忘了种植新的水果`, `京东账号${$.index} ${$.nickName || $.UserName}\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果`);
                }
                return
            }
            await doDailyTask();
            await doTenWater();//浇水十次
            await getFirstWaterAward();//领取首次浇水奖励
            await getTenWaterAward();//领取10浇水奖励
            await getWaterFriendGotAward();//领取为2好友浇水奖励
            await duck();
            if(!process.env.DO_TEN_WATER_AGAIN){
                console.log('执行再次浇水')
                await doTenWaterAgain();//再次浇水
            } else {
                console.log('不执行再次浇水，攒水滴')
            }
            await predictionFruit();//预测水果成熟时间
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
async function doDailyTask() {
    await requestAlgo('fcb5a');
    await $.wait(1500);
    await taskInitForFarm();
    console.log(`开始签到`);
    if (!$.farmTask.signInit.todaySigned) {
        await signForFarm(); //签到
        if ($.signResult.code === "0") {
            console.log(`【签到成功】获得${$.signResult.amount}g💧\\n`)
            //message += `【签到成功】获得${$.signResult.amount}g💧\n`//连续签到${signResult.signDay}天
        } else {
            // message += `签到失败,详询日志\n`;
            console.log(`签到结果:  ${JSON.stringify($.signResult)}`);
        }
    } else {
        console.log(`今天已签到,连续签到${$.farmTask.signInit.totalSigned},下次签到可得${$.farmTask.signInit.signEnergyEachAmount}g\n`);
    }
    // 被水滴砸中
    console.log(`被水滴砸中： ${$.farmInfo.todayGotWaterGoalTask.canPop ? '是' : '否'}`);
    if ($.farmInfo.todayGotWaterGoalTask.canPop) {
        await gotWaterGoalTaskForFarm();
        if ($.goalResult.code === '0') {
            console.log(`【被水滴砸中】获得${$.goalResult.addEnergy}g💧\\n`);
            // message += `【被水滴砸中】获得${$.goalResult.addEnergy}g💧\n`
        }
    }
    console.log(`签到结束,开始广告浏览任务`);
    if (!$.farmTask.gotBrowseTaskAdInit.f) {
        let adverts = $.farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
        let browseReward = 0
        let browseSuccess = 0
        let browseFail = 0
        for (let advert of adverts) { //开始浏览广告
            if (advert.limit <= advert.hadFinishedTimes) {
                // browseReward+=advert.reward
                console.log(`${advert.mainTitle}+ ' 已完成`);//,获得${advert.reward}g
                continue;
            }
            console.log('正在进行广告浏览任务: ' + advert.mainTitle);
            await browseAdTaskForFarm(advert.advertId, 0);
            if ($.browseResult.code === '0') {
                console.log(`${advert.mainTitle}浏览任务完成`);
                //领取奖励
                await browseAdTaskForFarm(advert.advertId, 1);
                if ($.browseRwardResult.code === '0') {
                    console.log(`领取浏览${advert.mainTitle}广告奖励成功,获得${$.browseRwardResult.amount}g`)
                    browseReward += $.browseRwardResult.amount
                    browseSuccess++
                } else {
                    browseFail++
                    console.log(`领取浏览广告奖励结果:  ${JSON.stringify($.browseRwardResult)}`)
                }
            } else {
                browseFail++
                console.log(`广告浏览任务结果:   ${JSON.stringify($.browseResult)}`);
            }
        }
        if (browseFail > 0) {
            console.log(`【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\\n`);
            // message += `【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\n`;
        } else {
            console.log(`【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`);
            // message += `【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`;
        }
    } else {
        console.log(`今天已经做过浏览广告任务\n`);
    }
    //定时领水
    if (!$.farmTask.gotThreeMealInit.f) {
        //
        await gotThreeMealForFarm();
        if ($.threeMeal.code === "0") {
            console.log(`【定时领水】获得${$.threeMeal.amount}g💧\n`);
            // message += `【定时领水】获得${$.threeMeal.amount}g💧\n`;
        } else {
            // message += `【定时领水】失败,详询日志\n`;
            console.log(`定时领水成功结果:  ${JSON.stringify($.threeMeal)}`);
        }
    } else {
        console.log('当前不在定时领水时间断或者已经领过\n')
    }
    //给好友浇水
    if (!$.farmTask.waterFriendTaskInit.f) {
        if ($.farmTask.waterFriendTaskInit.waterFriendCountKey < $.farmTask.waterFriendTaskInit.waterFriendMax) {
            await doFriendsWater();
        }
    } else {
        console.log(`给${$.farmTask.waterFriendTaskInit.waterFriendMax}个好友浇水任务已完成\n`)
    }
    // await Promise.all([
    //   clockInIn(),//打卡领水
    //   executeWaterRains(),//水滴雨
    //   masterHelpShare(),//助力好友
    //   getExtraAward(),//领取额外水滴奖励
    //   turntableFarm()//天天抽奖得好礼
    // ])
    await getAwardInviteFriend();
    await clockInIn();//打卡领水
    await executeWaterRains();//水滴雨
    await getExtraAward();//领取额外水滴奖励
    await turntableFarm()//天天抽奖得好礼
}
async function predictionFruit() {
    console.log('开始预测水果成熟时间\n');
    await initForFarm();
    await requestAlgo('fcb5a');
    await $.wait(1500);
    await taskInitForFarm();
    let waterEveryDayT = $.farmTask.totalWaterTaskInit.totalWaterTaskTimes;//今天到到目前为止，浇了多少次水
    message += `【今日共浇水】${waterEveryDayT}次\n`;
    message += `【剩余 水滴】${$.farmInfo.farmUserPro.totalEnergy}g💧\n`;
    message += `【水果🍉进度】${(($.farmInfo.farmUserPro.treeEnergy / $.farmInfo.farmUserPro.treeTotalEnergy) * 100).toFixed(2)}%，已浇水${$.farmInfo.farmUserPro.treeEnergy / 10}次,还需${($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10}次\n`
    if ($.farmInfo.toFlowTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
        message += `【开花进度】再浇水${$.farmInfo.toFlowTimes - $.farmInfo.farmUserPro.treeEnergy / 10}次开花\n`
    } else if ($.farmInfo.toFruitTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
        message += `【结果进度】再浇水${$.farmInfo.toFruitTimes - $.farmInfo.farmUserPro.treeEnergy / 10}次结果\n`
    }
    // 预测n天后水果课可兑换功能
    let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10;//一共还需浇多少次水

    let waterD = Math.ceil(waterTotalT / waterEveryDayT);

    message += `【预测】${waterD === 1 ? '明天' : waterD === 2 ? '后天' : waterD + '天之后'}(${timeFormat(24 * 60 * 60 * 1000 * waterD + Date.now())}日)可兑换水果🍉`
}
//浇水十次
async function doTenWater() {
    jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
    if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
        jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
    }
    await myCardInfoForFarm();
    const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
    if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match(`限时翻倍`) && beanCard > 0) {
        console.log(`您设置的是使用水滴换豆卡，且背包有水滴换豆卡${beanCard}张, 跳过10次浇水任务`)
        return
    }

    await requestAlgo('0c010');
    if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
        console.log(`\n准备浇水十次`);
        let waterCount = 0;
        isFruitFinished = false;
        for (; waterCount < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit - $.farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
            console.log(`第${waterCount + 1}次浇水`);
            await waterGoodForFarm();
            console.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`);
            if ($.waterResult.code === '0') {
                console.log(`剩余水滴${$.waterResult.totalEnergy}g`);
                if ($.waterResult.finished) {
                    // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
                    isFruitFinished = true;
                    break
                } else {
                    if ($.waterResult.totalEnergy < 10) {
                        console.log(`水滴不够，结束浇水`)
                        break
                    }
                    await gotStageAward();//领取阶段性水滴奖励
                }
            } else {
                console.log('浇水出现失败异常,跳出不在继续浇水')
                break;
            }
        }
        if (isFruitFinished) {
            option['open-url'] = urlSchema;
            $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
            $.done();
            if ($.isNode()) {
                await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}水果已可领取`, `京东账号${$.index} ${$.nickName || $.UserName}\n${$.farmInfo.farmUserPro.name}已可领取`);
            }
        }
    } else {
        console.log('\n今日已完成10次浇水任务\n');
    }
}
//领取首次浇水奖励
async function getFirstWaterAward() {
    await requestAlgo('fcb5a');
    await $.wait(1500);
    await taskInitForFarm();
    //领取首次浇水奖励
    if (!$.farmTask.firstWaterInit.f && $.farmTask.firstWaterInit.totalWaterTimes > 0) {
        await requestAlgo('0cf1e');
        await firstWaterTaskForFarm();
        if ($.firstWaterReward.code === '0') {
            console.log(`【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`);
            // message += `【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`;
        } else {
            // message += '【首次浇水奖励】领取奖励失败,详询日志\n';
            console.log(`领取首次浇水奖励结果:  ${JSON.stringify($.firstWaterReward)}`);
        }
    } else {
        console.log('首次浇水奖励已领取\n')
    }
}
//领取十次浇水奖励
async function getTenWaterAward() {
    //领取10次浇水奖励
    if (!$.farmTask.totalWaterTaskInit.f && $.farmTask.totalWaterTaskInit.totalWaterTaskTimes >= $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
        await totalWaterTaskForFarm();
        if ($.totalWaterReward.code === '0') {
            console.log(`【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`);
            // message += `【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`;
        } else {
            // message += '【十次浇水奖励】领取奖励失败,详询日志\n';
            console.log(`领取10次浇水奖励结果:  ${JSON.stringify($.totalWaterReward)}`);
        }
    } else if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
        // message += `【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`;
        console.log(`【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`);
    }
    console.log('finished 水果任务完成!');
}
//再次浇水
async function doTenWaterAgain() {
    console.log('开始检查剩余水滴能否再次浇水再次浇水\n');
    await initForFarm();
    await $.wait(700)
    let totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
    console.log(`剩余水滴${totalEnergy}g\n`);
    await myCardInfoForFarm();
    const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
    console.log(`背包已有道具:\n快速浇水卡:${fastCard === -1 ? '未解锁': fastCard + '张'}\n水滴翻倍卡:${doubleCard === -1 ? '未解锁': doubleCard + '张'}\n水滴换京豆卡:${beanCard === -1 ? '未解锁' : beanCard + '张'}\n加签卡:${signCard === -1 ? '未解锁' : signCard + '张'}\n`)
    if (totalEnergy >= 100 && doubleCard > 0) {
        //使用翻倍水滴卡
        for (let i = 0; i < new Array(doubleCard).fill('').length; i++) {
            await userMyCardForFarm('doubleCard');
            console.log(`使用翻倍水滴卡结果:${JSON.stringify($.userMyCardRes)}`);
        }
        await initForFarm();
        await $.wait(800)
        totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
    }
    if (signCard > 0) {
        //使用加签卡
        for (let i = 0; i < new Array(signCard).fill('').length; i++) {
            await userMyCardForFarm('signCard');
            console.log(`使用加签卡结果:${JSON.stringify($.userMyCardRes)}`);
        }
        await initForFarm();
        await $.wait(900)
        totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
    }
    jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
    if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
        jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
    }
    if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match('限时翻倍')) {
        console.log(`\n您设置的是水滴换豆功能,现在为您换豆`);
        if (totalEnergy >= 100 && $.myCardInfoRes.beanCard > 0) {
            //使用水滴换豆卡
            await userMyCardForFarm('beanCard');
            console.log(`使用水滴换豆卡结果:${JSON.stringify($.userMyCardRes)}`);
            if ($.userMyCardRes.code === '0') {
                message += `【水滴换豆卡】获得${$.userMyCardRes.beanCount}个京豆\n`;
                return
            }
        } else {
            console.log(`您目前水滴:${totalEnergy}g,水滴换豆卡${$.myCardInfoRes.beanCard}张,暂不满足水滴换豆的条件,为您继续浇水`)
        }
    }
    // if (totalEnergy > 100 && $.myCardInfoRes.fastCard > 0) {
    //   //使用快速浇水卡
    //   await userMyCardForFarm('fastCard');
    //   console.log(`使用快速浇水卡结果:${JSON.stringify($.userMyCardRes)}`);
    //   if ($.userMyCardRes.code === '0') {
    //     console.log(`已使用快速浇水卡浇水${$.userMyCardRes.waterEnergy}g`);
    //   }
    //   await initForFarm();
    //   totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
    // }
    // 所有的浇水(10次浇水)任务，获取水滴任务完成后，如果剩余水滴大于等于60g,则继续浇水(保留部分水滴是用于完成第二天的浇水10次的任务)
    let overageEnergy = totalEnergy - retainWater;
    await requestAlgo('0c010');
    if (totalEnergy >= ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy)) {
        //如果现有的水滴，大于水果可兑换所需的对滴(也就是把水滴浇完，水果就能兑换了)
        isFruitFinished = false;
        for (let i = 0; i < ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; i++) {
            await waterGoodForFarm();
            console.log(`本次浇水结果(水果马上就可兑换了):   ${JSON.stringify($.waterResult)}`);
            if ($.waterResult.code === '0') {
                console.log('\n浇水10g成功\n');
                if ($.waterResult.finished) {
                    // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
                    isFruitFinished = true;
                    break
                } else {
                    console.log(`目前水滴【${$.waterResult.totalEnergy}】g,继续浇水，水果马上就可以兑换了`)
                }
            } else {
                console.log('浇水出现失败异常,跳出不在继续浇水')
                break;
            }
        }
        if (isFruitFinished) {
            option['open-url'] = urlSchema;
            $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
            $.done();
            if ($.isNode()) {
                await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}水果已可领取`, `京东账号${$.index} ${$.nickName || $.UserName}\n${$.farmInfo.farmUserPro.name}已可领取`);
            }
        }
    } else if (overageEnergy >= 10) {
        console.log("目前剩余水滴：【" + totalEnergy + "】g，可继续浇水");
        isFruitFinished = false;
        for (let i = 0; i < parseInt(overageEnergy / 10); i++) {
            await waterGoodForFarm();
            console.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`);
            if ($.waterResult.code === '0') {
                console.log(`\n浇水10g成功,剩余${$.waterResult.totalEnergy}\n`)
                if ($.waterResult.finished) {
                    // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
                    isFruitFinished = true;
                    break
                } else {
                    await gotStageAward()
                }
            } else {
                console.log('浇水出现失败异常,跳出不在继续浇水')
                break;
            }
        }
        if (isFruitFinished) {
            option['open-url'] = urlSchema;
            $.msg($.name, ``, `【京东账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option);
            $.done();
            if ($.isNode()) {
                await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}水果已可领取`, `京东账号${$.index} ${$.nickName || $.UserName}\n${$.farmInfo.farmUserPro.name}已可领取`);
            }
        }
    } else {
        console.log("目前剩余水滴：【" + totalEnergy + "】g,不再继续浇水,保留部分水滴用于完成第二天【十次浇水得水滴】任务")
    }
}
//领取阶段性水滴奖励
function gotStageAward() {
    return new Promise(async resolve => {
        if ($.waterResult.waterStatus === 0 && $.waterResult.treeEnergy === 10) {
            console.log('果树发芽了,奖励30g水滴');
            await gotStageAwardForFarm('1');
            console.log(`浇水阶段奖励1领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
            if ($.gotStageAwardForFarmRes.code === '0') {
                // message += `【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`;
                console.log(`【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`);
            }
        } else if ($.waterResult.waterStatus === 1) {
            console.log('果树开花了,奖励40g水滴');
            await gotStageAwardForFarm('2');
            console.log(`浇水阶段奖励2领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
            if ($.gotStageAwardForFarmRes.code === '0') {
                // message += `【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`;
                console.log(`【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`);
            }
        } else if ($.waterResult.waterStatus === 2) {
            console.log('果树长出小果子啦, 奖励50g水滴');
            await gotStageAwardForFarm('3');
            console.log(`浇水阶段奖励3领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`)
            if ($.gotStageAwardForFarmRes.code === '0') {
                // message += `【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`;
                console.log(`【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`);
            }
        }
        resolve()
    })
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
//领取额外奖励水滴
async function getExtraAward() {
    await farmAssistInit();
    if ($.farmAssistResult.code === "0") {
        if ($.farmAssistResult.assistFriendList && $.farmAssistResult.assistFriendList.length >= 2) {
            if ($.farmAssistResult.status === 2) {
                let num = 0;
                for (let key of Object.keys($.farmAssistResult.assistStageList)) {
                    let vo = $.farmAssistResult.assistStageList[key]
                    if (vo.stageStaus === 2) {
                        await receiveStageEnergy()
                        if ($.receiveStageEnergy.code === "0") {
                            console.log(`已成功领取第${key + 1}阶段好友助力奖励：【${$.receiveStageEnergy.amount}】g水`)
                            num += $.receiveStageEnergy.amount
                        }
                    }
                }
                message += `【额外奖励】${num}g水领取成功\n`;
            } else if ($.farmAssistResult.status === 3) {
                console.log("已经领取过8好友助力额外奖励");
                message += `【额外奖励】已被领取过\n`;
            }
        } else {
            console.log("助力好友未达到2个");
            message += `【额外奖励】领取失败,原因：给您助力的人未达2个\n`;
        }
        if ($.farmAssistResult.assistFriendList && $.farmAssistResult.assistFriendList.length > 0) {
            let str = '';
            $.farmAssistResult.assistFriendList.map((item, index) => {
                if (index === ($.farmAssistResult.assistFriendList.length - 1)) {
                    str += item.nickName || "匿名用户";
                } else {
                    str += (item.nickName || "匿名用户") + ',';
                }
                let date = new Date(item.time);
                let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
                console.log(`\n京东昵称【${item.nickName || "匿名用户"}】 在 ${time} 给您助过力\n`);
            })
            message += `【助力您的好友】${str}\n`;
        }
        console.log('领取额外奖励水滴结束\n');
    } else {
        await masterHelpTaskInitForFarm();
        if ($.masterHelpResult.code === '0') {
            if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length >= 5) {
                // 已有五人助力。领取助力后的奖励
                if (!$.masterHelpResult.masterGotFinal) {
                    await masterGotFinishedTaskForFarm();
                    if ($.masterGotFinished.code === '0') {
                        console.log(`已成功领取好友助力奖励：【${$.masterGotFinished.amount}】g水`);
                        message += `【额外奖励】${$.masterGotFinished.amount}g水领取成功\n`;
                    }
                } else {
                    console.log("已经领取过5好友助力额外奖励");
                    message += `【额外奖励】已被领取过\n`;
                }
            } else {
                console.log("助力好友未达到5个");
                message += `【额外奖励】领取失败,原因：给您助力的人未达5个\n`;
            }
            if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length > 0) {
                let str = '';
                $.masterHelpResult.masterHelpPeoples.map((item, index) => {
                    if (index === ($.masterHelpResult.masterHelpPeoples.length - 1)) {
                        str += item.nickName || "匿名用户";
                    } else {
                        str += (item.nickName || "匿名用户") + ',';
                    }
                    let date = new Date(item.time);
                    let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
                    console.log(`\n京东昵称【${item.nickName || "匿名用户"}】 在 ${time} 给您助过力\n`);
                })
                message += `【助力您的好友】${str}\n`;
            }
            console.log('领取额外奖励水滴结束\n');
        }
    }
}
//助力好友
async function masterHelpShare() {
    console.log('开始助力好友')
    let salveHelpAddWater = 0;
    let remainTimes = 3;//今日剩余助力次数,默认3次（京东农场每人每天3次助力机会）。
    let helpSuccessPeoples = '';//成功助力好友
    console.log(`格式化后的助力码::${JSON.stringify(newShareCodes)}\n`);

    for (let code of newShareCodes) {
        console.log(`开始助力京东账号${$.index} - ${$.nickName || $.UserName}的好友: ${code}`);
        if (!code) continue;
        if (code === $.farmInfo.farmUserPro.shareCode) {
            console.log('不能为自己助力哦，跳过自己的shareCode\n')
            continue
        }
        await masterHelp(code);
        try {
            if ($.helpResult.code === '0') {
                if ($.helpResult.helpResult.code === '0') {
                    try {await farmCount($.UserName);}catch (e) {console.log(e.message)}
                    salveHelpAddWater += $.helpResult.helpResult.salveHelpAddWater;
                    console.log(`【助力好友结果】: 已成功给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力`);
                    console.log(`给好友【${$.helpResult.helpResult.masterUserInfo.nickName}】助力获得${$.helpResult.helpResult.salveHelpAddWater}g水滴`)
                    helpSuccessPeoples += ($.helpResult.helpResult.masterUserInfo.nickName || '匿名用户') + ',';
                } else if ($.helpResult.helpResult.code === '8') {
                    console.log(`【助力好友结果】: 助力【${$.helpResult.helpResult.masterUserInfo.nickName}】失败，您今天助力次数已耗尽`);
                } else if ($.helpResult.helpResult.code === '9') {
                    console.log(`【助力好友结果】: 之前给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力过了`);
                } else if ($.helpResult.helpResult.code === '10') {
                    console.log(`【助力好友结果】: 好友【${$.helpResult.helpResult.masterUserInfo.nickName}】已满八人助力`);
                } else {
                    console.log(`助力其他情况：${JSON.stringify($.helpResult.helpResult)}`);
                }
                console.log(`【今日助力次数还剩】${$.helpResult.helpResult.remainTimes}次\n`);
                remainTimes = $.helpResult.helpResult.remainTimes;
                if ($.helpResult.helpResult.remainTimes === 0) {
                    console.log(`您当前助力次数已耗尽，跳出助力`);
                    break
                }
            } else {
                console.log(`助力失败::${JSON.stringify($.helpResult)}`);
            }
        }catch (e) {
            console.log(`助力好友出现异常`);
        }
    }
    if ($.isLoon() || $.isQuanX() || $.isSurge()) {
        let helpSuccessPeoplesKey = timeFormat() + $.farmInfo.farmUserPro.shareCode;
        if (!$.getdata(helpSuccessPeoplesKey)) {
            //把前一天的清除
            $.setdata('', timeFormat(Date.now() - 24 * 60 * 60 * 1000) + $.farmInfo.farmUserPro.shareCode);
            $.setdata('', helpSuccessPeoplesKey);
        }
        if (helpSuccessPeoples) {
            if ($.getdata(helpSuccessPeoplesKey)) {
                $.setdata($.getdata(helpSuccessPeoplesKey) + ',' + helpSuccessPeoples, helpSuccessPeoplesKey);
            } else {
                $.setdata(helpSuccessPeoples, helpSuccessPeoplesKey);
            }
        }
        helpSuccessPeoples = $.getdata(helpSuccessPeoplesKey);
    }
    if (helpSuccessPeoples && helpSuccessPeoples.length > 0) {
        message += `【您助力的好友👬】${helpSuccessPeoples.substr(0, helpSuccessPeoples.length - 1)}\n`;
    }
    if (salveHelpAddWater > 0) {
        // message += `【助力好友👬】获得${salveHelpAddWater}g💧\n`;
        console.log(`【助力好友👬】获得${salveHelpAddWater}g💧\n`);
    }
    message += `【今日剩余助力👬】${remainTimes}次\n`;
    console.log('助力好友结束，即将开始领取额外水滴奖励\n');
}
//水滴雨
async function executeWaterRains() {
    let executeWaterRain = !$.farmTask.waterRainInit.f;
    if (executeWaterRain) {
        console.log(`水滴雨任务，每天两次，最多可得10g水滴`);
        console.log(`两次水滴雨任务是否全部完成：${$.farmTask.waterRainInit.f ? '是' : '否'}`);
        if ($.farmTask.waterRainInit.lastTime) {
            if (Date.now() < ($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000)) {
                executeWaterRain = false;
                // message += `【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}再试\n`;
                console.log(`\`【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}再试\n`);
            }
        }
        if (executeWaterRain) {
            console.log(`开始水滴雨任务,这是第${$.farmTask.waterRainInit.winTimes + 1}次，剩余${2 - ($.farmTask.waterRainInit.winTimes + 1)}次`);
            await waterRainForFarm();
            console.log('水滴雨waterRain');
            if ($.waterRain.code === '0') {
                console.log('水滴雨任务执行成功，获得水滴：' + $.waterRain.addEnergy + 'g');
                console.log(`【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`);
                // message += `【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`;
            }
        }
    } else {
        // message += `【水滴雨】已全部完成，获得20g💧\n`;
    }
}
//打卡领水活动
async function clockInIn() {
    console.log('开始打卡领水活动（签到，关注，领券）');
    await clockInInitForFarm();
    if ($.clockInInit.code === '0') {
        // 签到得水滴
        if (!$.clockInInit.todaySigned) {
            console.log('开始今日签到');
            await requestAlgo('32b94');
            await clockInForFarm();
            console.log(`打卡结果${JSON.stringify($.clockInForFarmRes)}`);
            if ($.clockInForFarmRes.code === '0') {
                // message += `【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`;
                console.log(`【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`)
                if ($.clockInForFarmRes.signDay === 7) {
                    //可以领取惊喜礼包
                    console.log('开始领取--惊喜礼包38g水滴');
                    await gotClockInGift();
                    if ($.gotClockInGiftRes.code === '0') {
                        // message += `【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`;
                        console.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`);
                    }
                }
            }
        }
        if ($.clockInInit.todaySigned && $.clockInInit.totalSigned === 7) {
            console.log('开始领取--惊喜礼包38g水滴');
            await gotClockInGift();
            if ($.gotClockInGiftRes.code === '0') {
                // message += `【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`;
                console.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`);
            }
        }
        // 限时关注得水滴
        if ($.clockInInit.themes && $.clockInInit.themes.length > 0) {
            for (let item of $.clockInInit.themes) {
                if (!item.hadGot) {
                    console.log(`关注ID${item.id}`);
                    await clockInFollowForFarm(item.id, "theme", "1");
                    console.log(`themeStep1--结果${JSON.stringify($.themeStep1)}`);
                    if ($.themeStep1.code === '0') {
                        await clockInFollowForFarm(item.id, "theme", "2");
                        console.log(`themeStep2--结果${JSON.stringify($.themeStep2)}`);
                        if ($.themeStep2.code === '0') {
                            console.log(`关注${item.name}，获得水滴${$.themeStep2.amount}g`);
                        }
                    }
                }
            }
        }
        // 限时领券得水滴
        if ($.clockInInit.venderCoupons && $.clockInInit.venderCoupons.length > 0) {
            for (let item of $.clockInInit.venderCoupons) {
                if (!item.hadGot) {
                    console.log(`领券的ID${item.id}`);
                    await clockInFollowForFarm(item.id, "venderCoupon", "1");
                    console.log(`venderCouponStep1--结果${JSON.stringify($.venderCouponStep1)}`);
                    if ($.venderCouponStep1.code === '0') {
                        await clockInFollowForFarm(item.id, "venderCoupon", "2");
                        if ($.venderCouponStep2.code === '0') {
                            console.log(`venderCouponStep2--结果${JSON.stringify($.venderCouponStep2)}`);
                            console.log(`从${item.name}领券，获得水滴${$.venderCouponStep2.amount}g`);
                        }
                    }
                }
            }
        }
    }
    console.log('开始打卡领水活动（签到，关注，领券）结束\n');
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

function farmCount(username) {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/farmc?username=${username}`,timeout: 10000}, (err, resp, data) => {
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

//给好友浇水
async function doFriendsWater() {
    await friendListInitForFarm();
    console.log('开始给好友浇水...');
    await requestAlgo('fcb5a');
    await $.wait(1500);
    await taskInitForFarm();
    const { waterFriendCountKey, waterFriendMax } = $.farmTask.waterFriendTaskInit;
    console.log(`今日已给${waterFriendCountKey}个好友浇水`);
    if (waterFriendCountKey < waterFriendMax) {
        let needWaterFriends = [];
        if ($.friendList.friends && $.friendList.friends.length > 0) {
            $.friendList.friends.map((item, index) => {
                if (item.friendState === 1) {
                    if (needWaterFriends.length < (waterFriendMax - waterFriendCountKey)) {
                        needWaterFriends.push(item.shareCode);
                    }
                }
            });
            console.log(`需要浇水的好友列表shareCodes:${JSON.stringify(needWaterFriends)}`);
            let waterFriendsCount = 0, cardInfoStr = '';
            await requestAlgo('673a0');
            for (let index = 0; index < needWaterFriends.length; index ++) {
                await waterFriendForFarm(needWaterFriends[index]);
                console.log(`为第${index+1}个好友浇水结果:${JSON.stringify($.waterFriendForFarmRes)}\n`)
                if ($.waterFriendForFarmRes.code === '0') {
                    waterFriendsCount ++;
                    if ($.waterFriendForFarmRes.cardInfo) {
                        console.log('为好友浇水获得道具了');
                        if ($.waterFriendForFarmRes.cardInfo.type === 'beanCard') {
                            console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                            cardInfoStr += `水滴换豆卡,`;
                        } else if ($.waterFriendForFarmRes.cardInfo.type === 'fastCard') {
                            console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                            cardInfoStr += `快速浇水卡,`;
                        } else if ($.waterFriendForFarmRes.cardInfo.type === 'doubleCard') {
                            console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                            cardInfoStr += `水滴翻倍卡,`;
                        } else if ($.waterFriendForFarmRes.cardInfo.type === 'signCard') {
                            console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                            cardInfoStr += `加签卡,`;
                        }
                    }
                } else if ($.waterFriendForFarmRes.code === '11') {
                    console.log('水滴不够,跳出浇水')
                }
            }
            // message += `【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${waterFriendsCount * 10}g水\n`;
            console.log(`【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${waterFriendsCount * 10}g水\n`);
            if (cardInfoStr && cardInfoStr.length > 0) {
                // message += `【好友浇水奖励】${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`;
                console.log(`【好友浇水奖励】${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`);
            }
        } else {
            console.log('您的好友列表暂无好友,快去邀请您的好友吧!')
        }
    } else {
        console.log(`今日已为好友浇水量已达${waterFriendMax}个`)
    }
}
//领取给3个好友浇水后的奖励水滴
async function getWaterFriendGotAward() {
    await requestAlgo('fcb5a');
    await $.wait(1500);
    await taskInitForFarm();
    const { waterFriendCountKey, waterFriendMax, waterFriendSendWater, waterFriendGotAward } = $.farmTask.waterFriendTaskInit
    if (waterFriendCountKey >= waterFriendMax) {
        if (!waterFriendGotAward) {
            await waterFriendGotAwardForFarm();
            console.log(`领取给${waterFriendMax}个好友浇水后的奖励水滴::${JSON.stringify($.waterFriendGotAwardRes)}`)
            if ($.waterFriendGotAwardRes.code === '0') {
                // message += `【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`;
                console.log(`【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`);
            }
        } else {
            console.log(`给好友浇水的${waterFriendSendWater}g水滴奖励已领取\n`);
            // message += `【给${waterFriendMax}好友浇水】奖励${waterFriendSendWater}g水滴已领取\n`;
        }
    } else {
        console.log(`暂未给${waterFriendMax}个好友浇水\n`);
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
async function duck() {
    for (let i = 0; i < 10; i++) {
        //这里循环十次
        await getFullCollectionReward();
        if ($.duckRes.code === '0') {
            if (!$.duckRes.hasLimit) {
                console.log(`小鸭子游戏:${$.duckRes.title}`);
                // if ($.duckRes.type !== 3) {
                //   console.log(`${$.duckRes.title}`);
                //   if ($.duckRes.type === 1) {
                //     message += `【小鸭子】为你带回了水滴\n`;
                //   } else if ($.duckRes.type === 2) {
                //     message += `【小鸭子】为你带回快速浇水卡\n`
                //   }
                // }
            } else {
                console.log(`${$.duckRes.title}`)
                break;
            }
        } else if ($.duckRes.code === '10') {
            console.log(`小鸭子游戏达到上限`)
            break;
        }
    }
}
// ========================API调用接口========================
//鸭子，点我有惊喜
async function getFullCollectionReward() {
    return new Promise(resolve => {
        const body = {"type": 2, "version": 6, "channel": 2};
        $.post(taskUrl("getFullCollectionReward", body), (err, resp, data) => {
            try {
                if (err) {
                    console.log('\n东东农场: getFullCollectionReward API查询请求失败 ‼️‼️');
                    console.log(JSON.stringify(err));
                    $.logErr(err);
                } else {
                    if (safeGet(data)) {
                        $.duckRes = JSON.parse(data);
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

/**
 * 领取10次浇水奖励API
 */
async function totalWaterTaskForFarm() {
    const functionId = arguments.callee.name.toString();
    $.totalWaterReward = await request(functionId);
}
//领取首次浇水奖励API
async function firstWaterTaskForFarm() {
    const functionId = arguments.callee.name.toString();
    let body =  {"version":16,"channel":1,"babelChannel":"45"};
    $.firstWaterReward = await requestNew(functionId, body);
}
//领取给3个好友浇水后的奖励水滴API
async function waterFriendGotAwardForFarm() {
    const functionId = arguments.callee.name.toString();
    $.waterFriendGotAwardRes = await request(functionId, {"version": 4, "channel": 1});
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
//浇水API
async function waterGoodForFarm() {
    await $.wait(2000);
    console.log('等待了2秒');

    const functionId = arguments.callee.name.toString();
    let body= {"type":"","version":16,"channel":1,"babelChannel":"45"};
    $.waterResult = await requestNew(functionId, body);
}
// 初始化集卡抽奖活动数据API
async function initForTurntableFarm() {
    $.initForTurntableFarmRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}
async function lotteryForTurntableFarm() {
    await $.wait(3000);
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

//领取5人助力后的额外奖励API
async function masterGotFinishedTaskForFarm() {
    const functionId = arguments.callee.name.toString();
    $.masterGotFinished = await request(functionId);
}
//助力好友信息API
async function masterHelpTaskInitForFarm() {
    const functionId = arguments.callee.name.toString();
    $.masterHelpResult = await request(functionId);
}
//新版助力好友信息API
async function farmAssistInit() {
    const functionId = arguments.callee.name.toString();
    $.farmAssistResult = await request(functionId, {"version":14,"channel":1,"babelChannel":"120"});
}
//新版领取助力奖励API
async function receiveStageEnergy() {
    const functionId = arguments.callee.name.toString();
    $.receiveStageEnergy = await request(functionId, {"version":14,"channel":1,"babelChannel":"120"});
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
// 助力好友API
async function masterHelp() {
    $.helpResult = await request(`initForFarm`, {
        imageUrl: "",
        nickName: "",
        shareCode: arguments[0],
        babelChannel: "3",
        version: 2,
        channel: 1
    });
    await $.wait(2000);
}
/**
 * 水滴雨API
 */
async function waterRainForFarm() {
    const functionId = arguments.callee.name.toString();
    const body = {"type": 1, "hongBaoTimes": 100, "version": 3};
    $.waterRain = await request(functionId, body);
}
/**
 * 打卡领水API
 */
async function clockInInitForFarm() {
    const functionId = arguments.callee.name.toString();
    $.clockInInit = await request(functionId);
}

// 连续签到API
async function clockInForFarm() {
    const functionId = arguments.callee.name.toString();
    let body =  {"type":1,"version":16,"channel":1,"babelChannel":0};
    $.clockInForFarmRes = await requestNew(functionId, body);
}

//关注，领券等API
async function clockInFollowForFarm(id, type, step) {
    const functionId = arguments.callee.name.toString();
    let body = {
        id,
        type,
        step
    }
    if (type === 'theme') {
        if (step === '1') {
            $.themeStep1 = await request(functionId, body);
        } else if (step === '2') {
            $.themeStep2 = await request(functionId, body);
        }
    } else if (type === 'venderCoupon') {
        if (step === '1') {
            $.venderCouponStep1 = await request(functionId, body);
        } else if (step === '2') {
            $.venderCouponStep2 = await request(functionId, body);
        }
    }
}

// 领取连续签到7天的惊喜礼包API
async function gotClockInGift() {
    $.gotClockInGiftRes = await request('clockInForFarm', {"type": 2})
}

//定时领水API
async function gotThreeMealForFarm() {
    const functionId = arguments.callee.name.toString();
    $.threeMeal = await request(functionId);
}
/**
 * 浏览广告任务API
 * type为0时, 完成浏览任务
 * type为1时, 领取浏览任务奖励
 */
async function browseAdTaskForFarm(advertId, type) {
    const functionId = arguments.callee.name.toString();
    if (type === 0) {
        $.browseResult = await request(functionId, {advertId, type});
    } else if (type === 1) {
        $.browseRwardResult = await request(functionId, {advertId, type});
    }
}
// 被水滴砸中API
async function gotWaterGoalTaskForFarm() {
    $.goalResult = await request(arguments.callee.name.toString(), {type: 3});
}
//签到API
async function signForFarm() {
    const functionId = arguments.callee.name.toString();
    $.signResult = await request(functionId);
}
/**
 * 初始化农场, 可获取果树及用户信息API
 */
async function initForFarm() {
    //h5st:20220427203539021;4488829356140938;8a2af;tk02wc6ae1c9818nYy8Rtg5aqVmCjDcvMfdU6LE3lVOdnf8Hpx7kySfDTX+yakLg0QEEfZaCllWMgx8dOimcP4LCEbc4;a629486fbab172bd929ac83f19b2e5e7e04a7b21d0049ec09c4b376f837cb69f;3.0;1651062939021
    let body = {"ver":"750","babelChannel":"45","collectionId":"519","sid":"17a7eb1013e5e4b56d8a28568562ed1w","un_area":"2_2824_51911_0","version":16,"channel":1};
    $.h5st = geth5st('initForFarm', body, '8a2af');
    return new Promise(resolve => {
        const option =  {
            url: `${JD_API_HOST}?functionId=initForFarm&appid=signed_wh5&osVersion=&screen=&networkType=wifi&timestamp=${Date.now()}&d_brand=&d_model&wqDefault=false&client=&clientVersion=10.5.4&partner=&build=&uuid=9366134603335346-2356564626532336&h5st=${$.h5st}`,
            body: `body=${encodeURIComponent(JSON.stringify({"ver":"750","babelChannel":"45","collectionId":"519","sid":"17a7eb1013e5e4b56d8a28568562ed1w","un_area":"2_2824_51911_0","version":16,"channel":1}))}&appid=wh5&clientVersion=10.4.0`,
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
                    // console.log(data);
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
    //taskInitForFarm
    //h5st:20220427203539037;1126247198056949;fcb5a;tk02wbd5c1bed18nYy8Rtg5aqVmCL1LMDWkm2ulctw4TjrASRZMyiwfgGLmDY1fM02bTmleErNg2Q0ANBGCQ86zCuKCH;7a9177db8d7495d5f058490218800c0705efe589d9d23b78d1fb6ad11ba2534b;3.0;1651062939037
    let body = {"version":16,"channel":1,"babelChannel":"0"};
    $.farmTask = await requestNew(functionId, body);   //{"version":14,"channel":1,"babelChannel":"120"});
}
//获取好友列表API
async function friendListInitForFarm() {
    $.friendList = await request('friendListInitForFarm', {"version":16,"channel":1,"babelChannel":0});
    // console.log('aa', aa);
}
// 领取邀请好友的奖励API
async function awardInviteFriendForFarm() {
    $.awardInviteFriendRes = await request('awardInviteFriendForFarm');
}
//为好友浇水API
async function waterFriendForFarm(shareCode) {
    const body = {"shareCode": shareCode, "version":16,"channel":1,"babelChannel":"45"}
    $.waterFriendForFarmRes = await requestNew('waterFriendForFarm', body);
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
                        // console.log(`function_id:${function_id}`)
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

async function requestNew(function_id, body = {}, timeout = 5500){
    return new Promise(resolve => {
        setTimeout(() => {
            $.get(taskUrlNew(function_id, body), (err, resp, data) => {
                try {
                    if (err) {
                        console.log('\n东东农场: '+function_id+' API查询请求失败 ‼️‼️')
                        console.log(JSON.stringify(err));
                        console.log(`function_id:${function_id}`)
                        $.logErr(err);
                    } else {
                        // console.log(`${function_id}:${data}`);
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
            "Referer": "https://h5.m.jd.com/",
            "Cookie": cookie
        },
        timeout: 10000
    }
}
function taskUrlNew(function_id, body = {}) {
    let appId = '';
    switch (function_id) {
        case 'taskInitForFarm':
            appId = 'fcb5a';
            break;
        case 'waterFriendForFarm':
             appId = '673a0';
            break;
        case 'firstWaterTaskForFarm':
            appId = '0cf1e';
            break;
        case 'waterGoodForFarm':
             appId = '0c010';
            break;
        case 'clockInForFarm':
            appid = '32b94';
            break;
        default :
            appId = '0c010';
            break;
    }
    $.h5st = geth5st(function_id, body, appId);
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&body=${encodeURIComponent(JSON.stringify(body))}&appid=signed_wh5&osVersion=&screen=&networkType=&timestamp=${Date.now()}&d_brand=&d_model=&wqDefault=false&client=&clientVersion=10.5.4&partner=&build=&uuid=&h5st=${$.h5st}`,
        headers: {
            "Host": "api.m.jd.com",
            "Accept": "*/*",
            "Origin": "https://h5.m.jd.com",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Referer": "https://h5.m.jd.com/",
            "Cookie": cookie
        },
        timeout: 10000
    }
}

function readShareCode() {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/get/farm`, timeout: 60000,}, (err, resp, data) => {
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
        $.get({url: `http://hz.feverrun.top:99/share/submit/farm?code=${$.farmInfo.farmUserPro.shareCode}&user=${$.UserName}`, timeout: 10000}, (err, resp, data) => {
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

function submitCode0() {
    return new Promise(async resolve => {
        $.get({url: `http://hz.feverrun.top:99/share/submit/farm0?code=${$.farmInfo.farmUserPro.shareCode}&user=${$.UserName}`, timeout: 10000}, (err, resp, data) => {
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

function getUUID(format = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', UpperCase = 0) {
    return format.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        if (UpperCase) {
            uuid = v.toString(36).toUpperCase();
        } else {
            uuid = v.toString(36)
        }
        return uuid;
    });
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

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdf153=["\x61\x70\x70\x49\x64","\x66\x69\x6E\x67\x65\x72\x70\x72\x69\x6E\x74","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x63\x61\x63\x74\x75\x73\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x72\x65\x71\x75\x65\x73\x74\x5F\x61\x6C\x67\x6F\x3F\x67\x5F\x74\x79\x3D\x61\x6A\x61\x78","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x31\x30\x2E\x35\x2E\x34\x3B\x31\x33\x2E\x36\x3B","\x55\x55\x49\x44","\x3B\x6E\x65\x74\x77\x6F\x72\x6B\x2F\x77\x69\x66\x69\x3B\x41\x44\x49\x44\x2F","\x41\x44\x49\x44","\x3B\x6D\x6F\x64\x65\x6C\x2F\x69\x50\x68\x6F\x6E\x65\x31\x30\x2C\x33\x3B\x61\x64\x64\x72\x65\x73\x73\x69\x64\x2F\x30\x3B\x61\x70\x70\x42\x75\x69\x6C\x64\x2F\x31\x36\x37\x36\x36\x38\x3B\x6A\x64\x53\x75\x70\x70\x6F\x72\x74\x44\x61\x72\x6B\x4D\x6F\x64\x65\x2F\x30\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x33\x5F\x36\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F","\x67\x7A\x69\x70\x2C\x20\x64\x65\x66\x6C\x61\x74\x65\x2C\x20\x62\x72","\x7A\x68\x2D\x43\x4E\x2C\x7A\x68\x3B\x71\x3D\x30\x2E\x39\x2C\x65\x6E\x2D\x55\x53\x3B\x71\x3D\x30\x2E\x38\x2C\x65\x6E\x3B\x71\x3D\x30\x2E\x37","","\x77\x65\x62","\x6E\x6F\x77","\x33\x2E\x30","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x77\x61\x69\x74","\x6C\x6F\x67","\u7B7E\u540D\u53C2\u6570\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\x70\x61\x72\x73\x65","\x73\x74\x61\x74\x75\x73","\x74\x6F\x6B\x65\x6E","\x74\x6B","\x72\x65\x73\x75\x6C\x74","\x64\x61\x74\x61","\x61\x6C\x67\x6F","\x65\x6E\x43\x72\x79\x70\x74\x4D\x65\x74\x68\x6F\x64\x4A\x44","\x72\x65\x74\x75\x72\x6E\x20","\u4EAC\u4E1C\u670D\u52A1\u5668\u8FD4\u56DE\u7A7A\u6570\u636E","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x79\x79\x79\x79\x4D\x4D\x64\x64\x68\x68\x6D\x6D\x73\x73\x53\x53\x53","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x62\x6F\x64\x79\x3D","\x43\x72\x79\x70\x74\x6F\x4A\x53","\x26\x74\x3D","\x26\x61\x70\x70\x69\x64\x3D\x61\x63\x74\x69\x76\x69\x74\x69\x65\x73\x5F\x70\x6C\x61\x74\x66\x6F\x72\x6D\x26\x63\x6C\x69\x65\x6E\x74\x3D\x48\x35\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x2E\x30\x2E\x30","\x65\x6E\x63","\x50\x74\x30\x33\x78\x44\x6D\x6C\x59\x4C\x78\x4B","\x74\x6B\x30\x32\x77\x36\x39\x32\x65\x31\x61\x33\x35\x31\x38\x6E\x4C\x50\x74\x30\x33\x78\x44\x6D\x6C\x59\x4C\x78\x32\x51\x68\x43\x39\x46\x42\x33\x31\x75\x62\x70\x38\x47\x4B\x30\x64\x75\x70\x33\x43\x39\x47\x41\x50\x34\x6C\x2F\x51\x64\x7A\x70\x57\x4B\x43\x2B\x37\x7A\x2B\x68\x73\x6D\x53\x65\x47\x54\x31\x54\x39\x39\x58\x44\x34\x68\x56\x54\x51\x64\x39\x2F\x38\x2F\x79\x51","\x3B","\x6A\x6F\x69\x6E","\x63\x6F\x6E\x63\x61\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];async function requestAlgo(_0xdde7x2){$[__Oxdf153[0x0]]= _0xdde7x2?_0xdde7x2:$[__Oxdf153[0x0]];$[__Oxdf153[0x1]]=  await generateFp();const _0xdde7x3={url:`${__Oxdf153[0x2]}`,headers:{'\x41\x63\x63\x65\x70\x74':__Oxdf153[0x3],'\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74':`${__Oxdf153[0x4]}${$[__Oxdf153[0x5]]}${__Oxdf153[0x6]}${$[__Oxdf153[0x7]]}${__Oxdf153[0x8]}`,'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Oxdf153[0x3],'\x4F\x72\x69\x67\x69\x6E':__Oxdf153[0x9],'\x52\x65\x66\x65\x72\x65\x72':__Oxdf153[0xa],'\x41\x63\x63\x65\x70\x74\x2D\x45\x6E\x63\x6F\x64\x69\x6E\x67':__Oxdf153[0xb],'\x41\x63\x63\x65\x70\x74\x2D\x4C\x61\x6E\x67\x75\x61\x67\x65':__Oxdf153[0xc]},body:JSON[__Oxdf153[0x11]]({"\x61\x70\x70\x49\x64":$[__Oxdf153[0x0]],"\x65\x78\x70\x61\x6E\x64\x50\x61\x72\x61\x6D\x73":__Oxdf153[0xd],"\x66\x70":$[__Oxdf153[0x1]],"\x70\x6C\x61\x74\x66\x6F\x72\x6D":__Oxdf153[0xe],"\x74\x69\x6D\x65\x73\x74\x61\x6D\x70":Date[__Oxdf153[0xf]](),"\x76\x65\x72\x73\x69\x6F\x6E":__Oxdf153[0x10]})}; await $[__Oxdf153[0x12]](1500);return  new Promise(async (_0xdde7x4)=>{$[__Oxdf153[0x20]](_0xdde7x3,(_0xdde7x5,_0xdde7x6,_0xdde7x7)=>{try{if(_0xdde7x5){console[__Oxdf153[0x13]](`${__Oxdf153[0xd]}${JSON[__Oxdf153[0x11]](_0xdde7x5)}${__Oxdf153[0xd]}`);console[__Oxdf153[0x13]](`${__Oxdf153[0x14]}`)}else {if(_0xdde7x7){_0xdde7x7= JSON[__Oxdf153[0x15]](_0xdde7x7);if(_0xdde7x7[__Oxdf153[0x16]]=== 200){$[__Oxdf153[0x17]]= _0xdde7x7[__Oxdf153[0x1a]][__Oxdf153[0x19]][__Oxdf153[0x18]];let _0xdde7x8=_0xdde7x7[__Oxdf153[0x1a]][__Oxdf153[0x19]][__Oxdf153[0x1b]];if(_0xdde7x8){$[__Oxdf153[0x1c]]=  new Function(`${__Oxdf153[0x1d]}${_0xdde7x8}${__Oxdf153[0xd]}`)()}}else {}}else {console[__Oxdf153[0x13]](`${__Oxdf153[0x1e]}`)}}}catch(e){$[__Oxdf153[0x1f]](e,_0xdde7x6)}finally{_0xdde7x4()}}); await $[__Oxdf153[0x12]](2500)})}function geth5st(_0xdde7xa,_0xdde7xb,_0xdde7x2){let _0xdde7xc=Date[__Oxdf153[0xf]]();const _0xdde7xd= new Date(_0xdde7xc).Format(__Oxdf153[0x21]);let _0xdde7xe=`${__Oxdf153[0x22]}${_0xdde7xa}${__Oxdf153[0x23]}${$[__Oxdf153[0x24]].SHA256(JSON[__Oxdf153[0x11]](_0xdde7xb)).toString()}${__Oxdf153[0x25]}${_0xdde7xd.toString()}${__Oxdf153[0x26]}`;$[__Oxdf153[0x0]]= _0xdde7x2?_0xdde7x2:$[__Oxdf153[0x0]];let _0xdde7xf=__Oxdf153[0xd];if($[__Oxdf153[0x1]]&& $[__Oxdf153[0x17]]&& $[__Oxdf153[0x1c]]){_0xdde7xf= $[__Oxdf153[0x1c]]($[__Oxdf153[0x17]],$[__Oxdf153[0x1]].toString(),_0xdde7xd.toString(),$[__Oxdf153[0x0]].toString(),$.CryptoJS).toString($[__Oxdf153[0x24]][__Oxdf153[0x27]].Hex)}else {const _0xdde7x10=__Oxdf153[0x28];$[__Oxdf153[0x17]]= `${__Oxdf153[0x29]}`;$[__Oxdf153[0x1]]= 8513257587454592;const _0xdde7x11=`${__Oxdf153[0xd]}${$[__Oxdf153[0x17]]}${__Oxdf153[0xd]}${$[__Oxdf153[0x1]]}${__Oxdf153[0xd]}${_0xdde7xd}${__Oxdf153[0xd]}${$[__Oxdf153[0x0]]}${__Oxdf153[0xd]}${_0xdde7x10}${__Oxdf153[0xd]}`;_0xdde7xf= $[__Oxdf153[0x24]].HmacSHA256(_0xdde7x11,$[__Oxdf153[0x17]]).toString($[__Oxdf153[0x24]][__Oxdf153[0x27]].Hex)};_0xdde7xe= _0xdde7xe?_0xdde7xe:__Oxdf153[0xd];const _0xdde7x12=$[__Oxdf153[0x24]].HmacSHA256(_0xdde7xe,_0xdde7xf.toString()).toString($[__Oxdf153[0x24]][__Oxdf153[0x27]].Hex);return encodeURIComponent([__Oxdf153[0xd][__Oxdf153[0x2c]](_0xdde7xd.toString()),__Oxdf153[0xd][__Oxdf153[0x2c]]($[__Oxdf153[0x1]].toString()),__Oxdf153[0xd][__Oxdf153[0x2c]]($[__Oxdf153[0x0]].toString()),__Oxdf153[0xd][__Oxdf153[0x2c]]($[__Oxdf153[0x17]]),__Oxdf153[0xd][__Oxdf153[0x2c]](_0xdde7x12),__Oxdf153[0xd][__Oxdf153[0x2c]](__Oxdf153[0x10]),__Oxdf153[0xd][__Oxdf153[0x2c]](_0xdde7xc)][__Oxdf153[0x2b]](__Oxdf153[0x2a]))}(function(_0xdde7x13,_0xdde7x14,_0xdde7x15,_0xdde7x16,_0xdde7x17,_0xdde7x18){_0xdde7x18= __Oxdf153[0x2d];_0xdde7x16= function(_0xdde7x19){if( typeof alert!== _0xdde7x18){alert(_0xdde7x19)};if( typeof console!== _0xdde7x18){console[__Oxdf153[0x13]](_0xdde7x19)}};_0xdde7x15= function(_0xdde7x1a,_0xdde7x13){return _0xdde7x1a+ _0xdde7x13};_0xdde7x17= _0xdde7x15(__Oxdf153[0x2e],_0xdde7x15(_0xdde7x15(__Oxdf153[0x2f],__Oxdf153[0x30]),__Oxdf153[0x31]));try{_0xdde7x13= __encode;if(!( typeof _0xdde7x13!== _0xdde7x18&& _0xdde7x13=== _0xdde7x15(__Oxdf153[0x32],__Oxdf153[0x33]))){_0xdde7x16(_0xdde7x17)}}catch(e){_0xdde7x16(_0xdde7x17)}})({})
function CryptoScripts() {
    // prettier-ignore
    !function(t,e){"object"==typeof exports?module.exports=exports=e():"function"==typeof define&&define.amd?define([],e):t.CryptoJS=e()}(this,function(){var t,e,r,i,n,o,s,c,a,h,l,f,d,u,p,_,v,y,g,B,w,k,S,m,x,b,H,z,A,C,D,E,R,M,F,P,W,O,I,U,K,X,L,j,N,T,q,Z,V,G,J,$,Q,Y,tt,et,rt,it,nt,ot,st,ct,at,ht,lt,ft,dt,ut,pt,_t,vt,yt,gt,Bt,wt,kt,St,mt=mt||function(t){var e;if("undefined"!=typeof window&&window.crypto&&(e=window.crypto),!e&&"undefined"!=typeof window&&window.msCrypto&&(e=window.msCrypto),!e&&"undefined"!=typeof global&&global.crypto&&(e=global.crypto),!e&&"function"==typeof require)try{e=require("crypto")}catch(e){}function r(){if(e){if("function"==typeof e.getRandomValues)try{return e.getRandomValues(new Uint32Array(1))[0]}catch(t){}if("function"==typeof e.randomBytes)try{return e.randomBytes(4).readInt32LE()}catch(t){}}throw new Error("Native crypto module could not be used to get secure random number.")}var i=Object.create||function(t){var e;return n.prototype=t,e=new n,n.prototype=null,e};function n(){}var o={},s=o.lib={},c=s.Base={extend:function(t){var e=i(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),(e.init.prototype=e).$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},a=s.WordArray=c.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||l).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++){var s=r[o>>>2]>>>24-o%4*8&255;e[i+o>>>2]|=s<<24-(i+o)%4*8}else for(o=0;o<n;o+=4)e[i+o>>>2]=r[o>>>2];return this.sigBytes+=n,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e=[],i=0;i<t;i+=4)e.push(r());return new a.init(e,t)}}),h=o.enc={},l=h.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new a.init(r,e/2)}},f=h.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new a.init(r,e)}},d=h.Utf8={stringify:function(t){try{return decodeURIComponent(escape(f.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return f.parse(unescape(encodeURIComponent(t)))}},u=s.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new a.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=d.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r,i=this._data,n=i.words,o=i.sigBytes,s=this.blockSize,c=o/(4*s),h=(c=e?t.ceil(c):t.max((0|c)-this._minBufferSize,0))*s,l=t.min(4*h,o);if(h){for(var f=0;f<h;f+=s)this._doProcessBlock(n,f);r=n.splice(0,h),i.sigBytes-=l}return new a.init(r,l)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(s.Hasher=u.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){u.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new p.HMAC.init(t,r).finalize(e)}}}),o.algo={});return o}(Math);function xt(t,e,r){return t^e^r}function bt(t,e,r){return t&e|~t&r}function Ht(t,e,r){return(t|~e)^r}function zt(t,e,r){return t&r|e&~r}function At(t,e,r){return t^(e|~r)}function Ct(t,e){return t<<e|t>>>32-e}function Dt(t,e,r,i){var n,o=this._iv;o?(n=o.slice(0),this._iv=void 0):n=this._prevBlock,i.encryptBlock(n,0);for(var s=0;s<r;s++)t[e+s]^=n[s]}function Et(t){if(255==(t>>24&255)){var e=t>>16&255,r=t>>8&255,i=255&t;255===e?(e=0,255===r?(r=0,255===i?i=0:++i):++r):++e,t=0,t+=e<<16,t+=r<<8,t+=i}else t+=1<<24;return t}function Rt(){for(var t=this._X,e=this._C,r=0;r<8;r++)ft[r]=e[r];for(e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<ft[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<ft[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<ft[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<ft[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<ft[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<ft[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<ft[6]>>>0?1:0)|0,this._b=e[7]>>>0<ft[7]>>>0?1:0,r=0;r<8;r++){var i=t[r]+e[r],n=65535&i,o=i>>>16,s=((n*n>>>17)+n*o>>>15)+o*o,c=((4294901760&i)*i|0)+((65535&i)*i|0);dt[r]=s^c}t[0]=dt[0]+(dt[7]<<16|dt[7]>>>16)+(dt[6]<<16|dt[6]>>>16)|0,t[1]=dt[1]+(dt[0]<<8|dt[0]>>>24)+dt[7]|0,t[2]=dt[2]+(dt[1]<<16|dt[1]>>>16)+(dt[0]<<16|dt[0]>>>16)|0,t[3]=dt[3]+(dt[2]<<8|dt[2]>>>24)+dt[1]|0,t[4]=dt[4]+(dt[3]<<16|dt[3]>>>16)+(dt[2]<<16|dt[2]>>>16)|0,t[5]=dt[5]+(dt[4]<<8|dt[4]>>>24)+dt[3]|0,t[6]=dt[6]+(dt[5]<<16|dt[5]>>>16)+(dt[4]<<16|dt[4]>>>16)|0,t[7]=dt[7]+(dt[6]<<8|dt[6]>>>24)+dt[5]|0}function Mt(){for(var t=this._X,e=this._C,r=0;r<8;r++)wt[r]=e[r];for(e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<wt[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<wt[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<wt[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<wt[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<wt[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<wt[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<wt[6]>>>0?1:0)|0,this._b=e[7]>>>0<wt[7]>>>0?1:0,r=0;r<8;r++){var i=t[r]+e[r],n=65535&i,o=i>>>16,s=((n*n>>>17)+n*o>>>15)+o*o,c=((4294901760&i)*i|0)+((65535&i)*i|0);kt[r]=s^c}t[0]=kt[0]+(kt[7]<<16|kt[7]>>>16)+(kt[6]<<16|kt[6]>>>16)|0,t[1]=kt[1]+(kt[0]<<8|kt[0]>>>24)+kt[7]|0,t[2]=kt[2]+(kt[1]<<16|kt[1]>>>16)+(kt[0]<<16|kt[0]>>>16)|0,t[3]=kt[3]+(kt[2]<<8|kt[2]>>>24)+kt[1]|0,t[4]=kt[4]+(kt[3]<<16|kt[3]>>>16)+(kt[2]<<16|kt[2]>>>16)|0,t[5]=kt[5]+(kt[4]<<8|kt[4]>>>24)+kt[3]|0,t[6]=kt[6]+(kt[5]<<16|kt[5]>>>16)+(kt[4]<<16|kt[4]>>>16)|0,t[7]=kt[7]+(kt[6]<<8|kt[6]>>>24)+kt[5]|0}return t=mt.lib.WordArray,mt.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,i=this._map;t.clamp();for(var n=[],o=0;o<r;o+=3)for(var s=(e[o>>>2]>>>24-o%4*8&255)<<16|(e[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|e[o+2>>>2]>>>24-(o+2)%4*8&255,c=0;c<4&&o+.75*c<r;c++)n.push(i.charAt(s>>>6*(3-c)&63));var a=i.charAt(64);if(a)for(;n.length%4;)n.push(a);return n.join("")},parse:function(e){var r=e.length,i=this._map,n=this._reverseMap;if(!n){n=this._reverseMap=[];for(var o=0;o<i.length;o++)n[i.charCodeAt(o)]=o}var s=i.charAt(64);if(s){var c=e.indexOf(s);-1!==c&&(r=c)}return function(e,r,i){for(var n=[],o=0,s=0;s<r;s++)if(s%4){var c=i[e.charCodeAt(s-1)]<<s%4*2|i[e.charCodeAt(s)]>>>6-s%4*2;n[o>>>2]|=c<<24-o%4*8,o++}return t.create(n,o)}(e,r,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},function(t){var e=mt,r=e.lib,i=r.WordArray,n=r.Hasher,o=e.algo,s=[];!function(){for(var e=0;e<64;e++)s[e]=4294967296*t.abs(t.sin(e+1))|0}();var c=o.MD5=n.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,n=t[i];t[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}var o=this._hash.words,c=t[e+0],d=t[e+1],u=t[e+2],p=t[e+3],_=t[e+4],v=t[e+5],y=t[e+6],g=t[e+7],B=t[e+8],w=t[e+9],k=t[e+10],S=t[e+11],m=t[e+12],x=t[e+13],b=t[e+14],H=t[e+15],z=o[0],A=o[1],C=o[2],D=o[3];z=f(z=l(z=l(z=l(z=l(z=h(z=h(z=h(z=h(z=a(z=a(z=a(z=a(z,A,C,D,c,7,s[0]),A=a(A,C=a(C,D=a(D,z,A,C,d,12,s[1]),z,A,u,17,s[2]),D,z,p,22,s[3]),C,D,_,7,s[4]),A=a(A,C=a(C,D=a(D,z,A,C,v,12,s[5]),z,A,y,17,s[6]),D,z,g,22,s[7]),C,D,B,7,s[8]),A=a(A,C=a(C,D=a(D,z,A,C,w,12,s[9]),z,A,k,17,s[10]),D,z,S,22,s[11]),C,D,m,7,s[12]),A=a(A,C=a(C,D=a(D,z,A,C,x,12,s[13]),z,A,b,17,s[14]),D,z,H,22,s[15]),C,D,d,5,s[16]),A=h(A,C=h(C,D=h(D,z,A,C,y,9,s[17]),z,A,S,14,s[18]),D,z,c,20,s[19]),C,D,v,5,s[20]),A=h(A,C=h(C,D=h(D,z,A,C,k,9,s[21]),z,A,H,14,s[22]),D,z,_,20,s[23]),C,D,w,5,s[24]),A=h(A,C=h(C,D=h(D,z,A,C,b,9,s[25]),z,A,p,14,s[26]),D,z,B,20,s[27]),C,D,x,5,s[28]),A=h(A,C=h(C,D=h(D,z,A,C,u,9,s[29]),z,A,g,14,s[30]),D,z,m,20,s[31]),C,D,v,4,s[32]),A=l(A,C=l(C,D=l(D,z,A,C,B,11,s[33]),z,A,S,16,s[34]),D,z,b,23,s[35]),C,D,d,4,s[36]),A=l(A,C=l(C,D=l(D,z,A,C,_,11,s[37]),z,A,g,16,s[38]),D,z,k,23,s[39]),C,D,x,4,s[40]),A=l(A,C=l(C,D=l(D,z,A,C,c,11,s[41]),z,A,p,16,s[42]),D,z,y,23,s[43]),C,D,w,4,s[44]),A=l(A,C=l(C,D=l(D,z,A,C,m,11,s[45]),z,A,H,16,s[46]),D,z,u,23,s[47]),C,D,c,6,s[48]),A=f(A=f(A=f(A=f(A,C=f(C,D=f(D,z,A,C,g,10,s[49]),z,A,b,15,s[50]),D,z,v,21,s[51]),C=f(C,D=f(D,z=f(z,A,C,D,m,6,s[52]),A,C,p,10,s[53]),z,A,k,15,s[54]),D,z,d,21,s[55]),C=f(C,D=f(D,z=f(z,A,C,D,B,6,s[56]),A,C,H,10,s[57]),z,A,y,15,s[58]),D,z,x,21,s[59]),C=f(C,D=f(D,z=f(z,A,C,D,_,6,s[60]),A,C,S,10,s[61]),z,A,u,15,s[62]),D,z,w,21,s[63]),o[0]=o[0]+z|0,o[1]=o[1]+A|0,o[2]=o[2]+C|0,o[3]=o[3]+D|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;r[n>>>5]|=128<<24-n%32;var o=t.floor(i/4294967296),s=i;r[15+(64+n>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),r[14+(64+n>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),e.sigBytes=4*(r.length+1),this._process();for(var c=this._hash,a=c.words,h=0;h<4;h++){var l=a[h];a[h]=16711935&(l<<8|l>>>24)|4278255360&(l<<24|l>>>8)}return c},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});function a(t,e,r,i,n,o,s){var c=t+(e&r|~e&i)+n+s;return(c<<o|c>>>32-o)+e}function h(t,e,r,i,n,o,s){var c=t+(e&i|r&~i)+n+s;return(c<<o|c>>>32-o)+e}function l(t,e,r,i,n,o,s){var c=t+(e^r^i)+n+s;return(c<<o|c>>>32-o)+e}function f(t,e,r,i,n,o,s){var c=t+(r^(e|~i))+n+s;return(c<<o|c>>>32-o)+e}e.MD5=n._createHelper(c),e.HmacMD5=n._createHmacHelper(c)}(Math),r=(e=mt).lib,i=r.WordArray,n=r.Hasher,o=e.algo,s=[],c=o.SHA1=n.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],c=r[3],a=r[4],h=0;h<80;h++){if(h<16)s[h]=0|t[e+h];else{var l=s[h-3]^s[h-8]^s[h-14]^s[h-16];s[h]=l<<1|l>>>31}var f=(i<<5|i>>>27)+a+s[h];f+=h<20?1518500249+(n&o|~n&c):h<40?1859775393+(n^o^c):h<60?(n&o|n&c|o&c)-1894007588:(n^o^c)-899497514,a=c,c=o,o=n<<30|n>>>2,n=i,i=f}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+c|0,r[4]=r[4]+a|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=Math.floor(r/4294967296),e[15+(64+i>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}}),e.SHA1=n._createHelper(c),e.HmacSHA1=n._createHmacHelper(c),function(t){var e=mt,r=e.lib,i=r.WordArray,n=r.Hasher,o=e.algo,s=[],c=[];!function(){function e(e){for(var r=t.sqrt(e),i=2;i<=r;i++)if(!(e%i))return;return 1}function r(t){return 4294967296*(t-(0|t))|0}for(var i=2,n=0;n<64;)e(i)&&(n<8&&(s[n]=r(t.pow(i,.5))),c[n]=r(t.pow(i,1/3)),n++),i++}();var a=[],h=o.SHA256=n.extend({_doReset:function(){this._hash=new i.init(s.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],h=r[4],l=r[5],f=r[6],d=r[7],u=0;u<64;u++){if(u<16)a[u]=0|t[e+u];else{var p=a[u-15],_=(p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3,v=a[u-2],y=(v<<15|v>>>17)^(v<<13|v>>>19)^v>>>10;a[u]=_+a[u-7]+y+a[u-16]}var g=i&n^i&o^n&o,B=(i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22),w=d+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&l^~h&f)+c[u]+a[u];d=f,f=l,l=h,h=s+w|0,s=o,o=n,n=i,i=w+(B+g)|0}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+s|0,r[4]=r[4]+h|0,r[5]=r[5]+l|0,r[6]=r[6]+f|0,r[7]=r[7]+d|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[14+(64+n>>>9<<4)]=t.floor(i/4294967296),r[15+(64+n>>>9<<4)]=i,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA256=n._createHelper(h),e.HmacSHA256=n._createHmacHelper(h)}(Math),function(){var t=mt.lib.WordArray,e=mt.enc;function r(t){return t<<8&4278255360|t>>>8&16711935}e.Utf16=e.Utf16BE={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n+=2){var o=e[n>>>2]>>>16-n%4*8&65535;i.push(String.fromCharCode(o))}return i.join("")},parse:function(e){for(var r=e.length,i=[],n=0;n<r;n++)i[n>>>1]|=e.charCodeAt(n)<<16-n%2*16;return t.create(i,2*r)}},e.Utf16LE={stringify:function(t){for(var e=t.words,i=t.sigBytes,n=[],o=0;o<i;o+=2){var s=r(e[o>>>2]>>>16-o%4*8&65535);n.push(String.fromCharCode(s))}return n.join("")},parse:function(e){for(var i=e.length,n=[],o=0;o<i;o++)n[o>>>1]|=r(e.charCodeAt(o)<<16-o%2*16);return t.create(n,2*i)}}}(),function(){if("function"==typeof ArrayBuffer){var t=mt.lib.WordArray,e=t.init;(t.init=function(t){if(t instanceof ArrayBuffer&&(t=new Uint8Array(t)),(t instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array)&&(t=new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),t instanceof Uint8Array){for(var r=t.byteLength,i=[],n=0;n<r;n++)i[n>>>2]|=t[n]<<24-n%4*8;e.call(this,i,r)}else e.apply(this,arguments)}).prototype=t}}(),Math,h=(a=mt).lib,l=h.WordArray,f=h.Hasher,d=a.algo,u=l.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),p=l.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),_=l.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),v=l.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),y=l.create([0,1518500249,1859775393,2400959708,2840853838]),g=l.create([1352829926,1548603684,1836072691,2053994217,0]),B=d.RIPEMD160=f.extend({_doReset:function(){this._hash=l.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,n=t[i];t[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}var o,s,c,a,h,l,f,d,B,w,k,S=this._hash.words,m=y.words,x=g.words,b=u.words,H=p.words,z=_.words,A=v.words;for(l=o=S[0],f=s=S[1],d=c=S[2],B=a=S[3],w=h=S[4],r=0;r<80;r+=1)k=o+t[e+b[r]]|0,k+=r<16?xt(s,c,a)+m[0]:r<32?bt(s,c,a)+m[1]:r<48?Ht(s,c,a)+m[2]:r<64?zt(s,c,a)+m[3]:At(s,c,a)+m[4],k=(k=Ct(k|=0,z[r]))+h|0,o=h,h=a,a=Ct(c,10),c=s,s=k,k=l+t[e+H[r]]|0,k+=r<16?At(f,d,B)+x[0]:r<32?zt(f,d,B)+x[1]:r<48?Ht(f,d,B)+x[2]:r<64?bt(f,d,B)+x[3]:xt(f,d,B)+x[4],k=(k=Ct(k|=0,A[r]))+w|0,l=w,w=B,B=Ct(d,10),d=f,f=k;k=S[1]+c+B|0,S[1]=S[2]+a+w|0,S[2]=S[3]+h+l|0,S[3]=S[4]+o+f|0,S[4]=S[0]+s+d|0,S[0]=k},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(e.length+1),this._process();for(var n=this._hash,o=n.words,s=0;s<5;s++){var c=o[s];o[s]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}return n},clone:function(){var t=f.clone.call(this);return t._hash=this._hash.clone(),t}}),a.RIPEMD160=f._createHelper(B),a.HmacRIPEMD160=f._createHmacHelper(B),w=mt.lib.Base,k=mt.enc.Utf8,mt.algo.HMAC=w.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=k.parse(e));var r=t.blockSize,i=4*r;e.sigBytes>i&&(e=t.finalize(e)),e.clamp();for(var n=this._oKey=e.clone(),o=this._iKey=e.clone(),s=n.words,c=o.words,a=0;a<r;a++)s[a]^=1549556828,c[a]^=909522486;n.sigBytes=o.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,r=e.finalize(t);return e.reset(),e.finalize(this._oKey.clone().concat(r))}}),x=(m=(S=mt).lib).Base,b=m.WordArray,z=(H=S.algo).SHA1,A=H.HMAC,C=H.PBKDF2=x.extend({cfg:x.extend({keySize:4,hasher:z,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=this.cfg,i=A.create(r.hasher,t),n=b.create(),o=b.create([1]),s=n.words,c=o.words,a=r.keySize,h=r.iterations;s.length<a;){var l=i.update(e).finalize(o);i.reset();for(var f=l.words,d=f.length,u=l,p=1;p<h;p++){u=i.finalize(u),i.reset();for(var _=u.words,v=0;v<d;v++)f[v]^=_[v]}n.concat(l),c[0]++}return n.sigBytes=4*a,n}}),S.PBKDF2=function(t,e,r){return C.create(r).compute(t,e)},R=(E=(D=mt).lib).Base,M=E.WordArray,P=(F=D.algo).MD5,W=F.EvpKDF=R.extend({cfg:R.extend({keySize:4,hasher:P,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r,i=this.cfg,n=i.hasher.create(),o=M.create(),s=o.words,c=i.keySize,a=i.iterations;s.length<c;){r&&n.update(r),r=n.update(t).finalize(e),n.reset();for(var h=1;h<a;h++)r=n.finalize(r),n.reset();o.concat(r)}return o.sigBytes=4*c,o}}),D.EvpKDF=function(t,e,r){return W.create(r).compute(t,e)},I=(O=mt).lib.WordArray,U=O.algo,K=U.SHA256,X=U.SHA224=K.extend({_doReset:function(){this._hash=new I.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=K._doFinalize.call(this);return t.sigBytes-=4,t}}),O.SHA224=K._createHelper(X),O.HmacSHA224=K._createHmacHelper(X),L=mt.lib,j=L.Base,N=L.WordArray,(T=mt.x64={}).Word=j.extend({init:function(t,e){this.high=t,this.low=e}}),T.WordArray=j.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:8*t.length},toX32:function(){for(var t=this.words,e=t.length,r=[],i=0;i<e;i++){var n=t[i];r.push(n.high),r.push(n.low)}return N.create(r,this.sigBytes)},clone:function(){for(var t=j.clone.call(this),e=t.words=this.words.slice(0),r=e.length,i=0;i<r;i++)e[i]=e[i].clone();return t}}),function(t){var e=mt,r=e.lib,i=r.WordArray,n=r.Hasher,o=e.x64.Word,s=e.algo,c=[],a=[],h=[];!function(){for(var t=1,e=0,r=0;r<24;r++){c[t+5*e]=(r+1)*(r+2)/2%64;var i=(2*t+3*e)%5;t=e%5,e=i}for(t=0;t<5;t++)for(e=0;e<5;e++)a[t+5*e]=e+(2*t+3*e)%5*5;for(var n=1,s=0;s<24;s++){for(var l=0,f=0,d=0;d<7;d++){if(1&n){var u=(1<<d)-1;u<32?f^=1<<u:l^=1<<u-32}128&n?n=n<<1^113:n<<=1}h[s]=o.create(l,f)}}();var l=[];!function(){for(var t=0;t<25;t++)l[t]=o.create()}();var f=s.SHA3=n.extend({cfg:n.cfg.extend({outputLength:512}),_doReset:function(){for(var t=this._state=[],e=0;e<25;e++)t[e]=new o.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(t,e){for(var r=this._state,i=this.blockSize/2,n=0;n<i;n++){var o=t[e+2*n],s=t[e+2*n+1];o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),s=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),(A=r[n]).high^=s,A.low^=o}for(var f=0;f<24;f++){for(var d=0;d<5;d++){for(var u=0,p=0,_=0;_<5;_++)u^=(A=r[d+5*_]).high,p^=A.low;var v=l[d];v.high=u,v.low=p}for(d=0;d<5;d++){var y=l[(d+4)%5],g=l[(d+1)%5],B=g.high,w=g.low;for(u=y.high^(B<<1|w>>>31),p=y.low^(w<<1|B>>>31),_=0;_<5;_++)(A=r[d+5*_]).high^=u,A.low^=p}for(var k=1;k<25;k++){var S=(A=r[k]).high,m=A.low,x=c[k];p=x<32?(u=S<<x|m>>>32-x,m<<x|S>>>32-x):(u=m<<x-32|S>>>64-x,S<<x-32|m>>>64-x);var b=l[a[k]];b.high=u,b.low=p}var H=l[0],z=r[0];for(H.high=z.high,H.low=z.low,d=0;d<5;d++)for(_=0;_<5;_++){var A=r[k=d+5*_],C=l[k],D=l[(d+1)%5+5*_],E=l[(d+2)%5+5*_];A.high=C.high^~D.high&E.high,A.low=C.low^~D.low&E.low}A=r[0];var R=h[f];A.high^=R.high,A.low^=R.low}},_doFinalize:function(){var e=this._data,r=e.words,n=(this._nDataBytes,8*e.sigBytes),o=32*this.blockSize;r[n>>>5]|=1<<24-n%32,r[(t.ceil((1+n)/o)*o>>>5)-1]|=128,e.sigBytes=4*r.length,this._process();for(var s=this._state,c=this.cfg.outputLength/8,a=c/8,h=[],l=0;l<a;l++){var f=s[l],d=f.high,u=f.low;d=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8),u=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8),h.push(u),h.push(d)}return new i.init(h,c)},clone:function(){for(var t=n.clone.call(this),e=t._state=this._state.slice(0),r=0;r<25;r++)e[r]=e[r].clone();return t}});e.SHA3=n._createHelper(f),e.HmacSHA3=n._createHmacHelper(f)}(Math),function(){var t=mt,e=t.lib.Hasher,r=t.x64,i=r.Word,n=r.WordArray,o=t.algo;function s(){return i.create.apply(i,arguments)}var c=[s(1116352408,3609767458),s(1899447441,602891725),s(3049323471,3964484399),s(3921009573,2173295548),s(961987163,4081628472),s(1508970993,3053834265),s(2453635748,2937671579),s(2870763221,3664609560),s(3624381080,2734883394),s(310598401,1164996542),s(607225278,1323610764),s(1426881987,3590304994),s(1925078388,4068182383),s(2162078206,991336113),s(2614888103,633803317),s(3248222580,3479774868),s(3835390401,2666613458),s(4022224774,944711139),s(264347078,2341262773),s(604807628,2007800933),s(770255983,1495990901),s(1249150122,1856431235),s(1555081692,3175218132),s(1996064986,2198950837),s(2554220882,3999719339),s(2821834349,766784016),s(2952996808,2566594879),s(3210313671,3203337956),s(3336571891,1034457026),s(3584528711,2466948901),s(113926993,3758326383),s(338241895,168717936),s(666307205,1188179964),s(773529912,1546045734),s(1294757372,1522805485),s(1396182291,2643833823),s(1695183700,2343527390),s(1986661051,1014477480),s(2177026350,1206759142),s(2456956037,344077627),s(2730485921,1290863460),s(2820302411,3158454273),s(3259730800,3505952657),s(3345764771,106217008),s(3516065817,3606008344),s(3600352804,1432725776),s(4094571909,1467031594),s(275423344,851169720),s(430227734,3100823752),s(506948616,1363258195),s(659060556,3750685593),s(883997877,3785050280),s(958139571,3318307427),s(1322822218,3812723403),s(1537002063,2003034995),s(1747873779,3602036899),s(1955562222,1575990012),s(2024104815,1125592928),s(2227730452,2716904306),s(2361852424,442776044),s(2428436474,593698344),s(2756734187,3733110249),s(3204031479,2999351573),s(3329325298,3815920427),s(3391569614,3928383900),s(3515267271,566280711),s(3940187606,3454069534),s(4118630271,4000239992),s(116418474,1914138554),s(174292421,2731055270),s(289380356,3203993006),s(460393269,320620315),s(685471733,587496836),s(852142971,1086792851),s(1017036298,365543100),s(1126000580,2618297676),s(1288033470,3409855158),s(1501505948,4234509866),s(1607167915,987167468),s(1816402316,1246189591)],a=[];!function(){for(var t=0;t<80;t++)a[t]=s()}();var h=o.SHA512=e.extend({_doReset:function(){this._hash=new n.init([new i.init(1779033703,4089235720),new i.init(3144134277,2227873595),new i.init(1013904242,4271175723),new i.init(2773480762,1595750129),new i.init(1359893119,2917565137),new i.init(2600822924,725511199),new i.init(528734635,4215389547),new i.init(1541459225,327033209)])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],h=r[4],l=r[5],f=r[6],d=r[7],u=i.high,p=i.low,_=n.high,v=n.low,y=o.high,g=o.low,B=s.high,w=s.low,k=h.high,S=h.low,m=l.high,x=l.low,b=f.high,H=f.low,z=d.high,A=d.low,C=u,D=p,E=_,R=v,M=y,F=g,P=B,W=w,O=k,I=S,U=m,K=x,X=b,L=H,j=z,N=A,T=0;T<80;T++){var q,Z,V=a[T];if(T<16)Z=V.high=0|t[e+2*T],q=V.low=0|t[e+2*T+1];else{var G=a[T-15],J=G.high,$=G.low,Q=(J>>>1|$<<31)^(J>>>8|$<<24)^J>>>7,Y=($>>>1|J<<31)^($>>>8|J<<24)^($>>>7|J<<25),tt=a[T-2],et=tt.high,rt=tt.low,it=(et>>>19|rt<<13)^(et<<3|rt>>>29)^et>>>6,nt=(rt>>>19|et<<13)^(rt<<3|et>>>29)^(rt>>>6|et<<26),ot=a[T-7],st=ot.high,ct=ot.low,at=a[T-16],ht=at.high,lt=at.low;Z=(Z=(Z=Q+st+((q=Y+ct)>>>0<Y>>>0?1:0))+it+((q+=nt)>>>0<nt>>>0?1:0))+ht+((q+=lt)>>>0<lt>>>0?1:0),V.high=Z,V.low=q}var ft,dt=O&U^~O&X,ut=I&K^~I&L,pt=C&E^C&M^E&M,_t=D&R^D&F^R&F,vt=(C>>>28|D<<4)^(C<<30|D>>>2)^(C<<25|D>>>7),yt=(D>>>28|C<<4)^(D<<30|C>>>2)^(D<<25|C>>>7),gt=(O>>>14|I<<18)^(O>>>18|I<<14)^(O<<23|I>>>9),Bt=(I>>>14|O<<18)^(I>>>18|O<<14)^(I<<23|O>>>9),wt=c[T],kt=wt.high,St=wt.low,mt=j+gt+((ft=N+Bt)>>>0<N>>>0?1:0),xt=yt+_t;j=X,N=L,X=U,L=K,U=O,K=I,O=P+(mt=(mt=(mt=mt+dt+((ft+=ut)>>>0<ut>>>0?1:0))+kt+((ft+=St)>>>0<St>>>0?1:0))+Z+((ft+=q)>>>0<q>>>0?1:0))+((I=W+ft|0)>>>0<W>>>0?1:0)|0,P=M,W=F,M=E,F=R,E=C,R=D,C=mt+(vt+pt+(xt>>>0<yt>>>0?1:0))+((D=ft+xt|0)>>>0<ft>>>0?1:0)|0}p=i.low=p+D,i.high=u+C+(p>>>0<D>>>0?1:0),v=n.low=v+R,n.high=_+E+(v>>>0<R>>>0?1:0),g=o.low=g+F,o.high=y+M+(g>>>0<F>>>0?1:0),w=s.low=w+W,s.high=B+P+(w>>>0<W>>>0?1:0),S=h.low=S+I,h.high=k+O+(S>>>0<I>>>0?1:0),x=l.low=x+K,l.high=m+U+(x>>>0<K>>>0?1:0),H=f.low=H+L,f.high=b+X+(H>>>0<L>>>0?1:0),A=d.low=A+N,d.high=z+j+(A>>>0<N>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[30+(128+i>>>10<<5)]=Math.floor(r/4294967296),e[31+(128+i>>>10<<5)]=r,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=e.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32});t.SHA512=e._createHelper(h),t.HmacSHA512=e._createHmacHelper(h)}(),Z=(q=mt).x64,V=Z.Word,G=Z.WordArray,J=q.algo,$=J.SHA512,Q=J.SHA384=$.extend({_doReset:function(){this._hash=new G.init([new V.init(3418070365,3238371032),new V.init(1654270250,914150663),new V.init(2438529370,812702999),new V.init(355462360,4144912697),new V.init(1731405415,4290775857),new V.init(2394180231,1750603025),new V.init(3675008525,1694076839),new V.init(1203062813,3204075428)])},_doFinalize:function(){var t=$._doFinalize.call(this);return t.sigBytes-=16,t}}),q.SHA384=$._createHelper(Q),q.HmacSHA384=$._createHmacHelper(Q),mt.lib.Cipher||function(){var t=mt,e=t.lib,r=e.Base,i=e.WordArray,n=e.BufferedBlockAlgorithm,o=t.enc,s=(o.Utf8,o.Base64),c=t.algo.EvpKDF,a=e.Cipher=n.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){n.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(t){return{encrypt:function(e,r,i){return h(r).encrypt(t,e,r,i)},decrypt:function(e,r,i){return h(r).decrypt(t,e,r,i)}}}});function h(t){return"string"==typeof t?w:g}e.StreamCipher=a.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var l,f=t.mode={},d=e.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),u=f.CBC=((l=d.extend()).Encryptor=l.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;p.call(this,t,e,i),r.encryptBlock(t,e),this._prevBlock=t.slice(e,e+i)}}),l.Decryptor=l.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);r.decryptBlock(t,e),p.call(this,t,e,i),this._prevBlock=n}}),l);function p(t,e,r){var i,n=this._iv;n?(i=n,this._iv=void 0):i=this._prevBlock;for(var o=0;o<r;o++)t[e+o]^=i[o]}var _=(t.pad={}).Pkcs7={pad:function(t,e){for(var r=4*e,n=r-t.sigBytes%r,o=n<<24|n<<16|n<<8|n,s=[],c=0;c<n;c+=4)s.push(o);var a=i.create(s,n);t.concat(a)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},v=(e.BlockCipher=a.extend({cfg:a.cfg.extend({mode:u,padding:_}),reset:function(){var t;a.reset.call(this);var e=this.cfg,r=e.iv,i=e.mode;this._xformMode==this._ENC_XFORM_MODE?t=i.createEncryptor:(t=i.createDecryptor,this._minBufferSize=1),this._mode&&this._mode.__creator==t?this._mode.init(this,r&&r.words):(this._mode=t.call(i,this,r&&r.words),this._mode.__creator=t)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t,e=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(e.pad(this._data,this.blockSize),t=this._process(!0)):(t=this._process(!0),e.unpad(t)),t},blockSize:4}),e.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),y=(t.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext,r=t.salt;return(r?i.create([1398893684,1701076831]).concat(r).concat(e):e).toString(s)},parse:function(t){var e,r=s.parse(t),n=r.words;return 1398893684==n[0]&&1701076831==n[1]&&(e=i.create(n.slice(2,4)),n.splice(0,4),r.sigBytes-=16),v.create({ciphertext:r,salt:e})}},g=e.SerializableCipher=r.extend({cfg:r.extend({format:y}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var n=t.createEncryptor(r,i),o=n.finalize(e),s=n.cfg;return v.create({ciphertext:o,key:r,iv:s.iv,algorithm:t,mode:s.mode,padding:s.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,e,r,i){return i=this.cfg.extend(i),e=this._parse(e,i.format),t.createDecryptor(r,i).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),B=(t.kdf={}).OpenSSL={execute:function(t,e,r,n){n=n||i.random(8);var o=c.create({keySize:e+r}).compute(t,n),s=i.create(o.words.slice(e),4*r);return o.sigBytes=4*e,v.create({key:o,iv:s,salt:n})}},w=e.PasswordBasedCipher=g.extend({cfg:g.cfg.extend({kdf:B}),encrypt:function(t,e,r,i){var n=(i=this.cfg.extend(i)).kdf.execute(r,t.keySize,t.ivSize);i.iv=n.iv;var o=g.encrypt.call(this,t,e,n.key,i);return o.mixIn(n),o},decrypt:function(t,e,r,i){i=this.cfg.extend(i),e=this._parse(e,i.format);var n=i.kdf.execute(r,t.keySize,t.ivSize,e.salt);return i.iv=n.iv,g.decrypt.call(this,t,e,n.key,i)}})}(),mt.mode.CFB=((Y=mt.lib.BlockCipherMode.extend()).Encryptor=Y.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;Dt.call(this,t,e,i,r),this._prevBlock=t.slice(e,e+i)}}),Y.Decryptor=Y.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);Dt.call(this,t,e,i,r),this._prevBlock=n}}),Y),mt.mode.ECB=((tt=mt.lib.BlockCipherMode.extend()).Encryptor=tt.extend({processBlock:function(t,e){this._cipher.encryptBlock(t,e)}}),tt.Decryptor=tt.extend({processBlock:function(t,e){this._cipher.decryptBlock(t,e)}}),tt),mt.pad.AnsiX923={pad:function(t,e){var r=t.sigBytes,i=4*e,n=i-r%i,o=r+n-1;t.clamp(),t.words[o>>>2]|=n<<24-o%4*8,t.sigBytes+=n},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},mt.pad.Iso10126={pad:function(t,e){var r=4*e,i=r-t.sigBytes%r;t.concat(mt.lib.WordArray.random(i-1)).concat(mt.lib.WordArray.create([i<<24],1))},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},mt.pad.Iso97971={pad:function(t,e){t.concat(mt.lib.WordArray.create([2147483648],1)),mt.pad.ZeroPadding.pad(t,e)},unpad:function(t){mt.pad.ZeroPadding.unpad(t),t.sigBytes--}},mt.mode.OFB=(rt=(et=mt.lib.BlockCipherMode.extend()).Encryptor=et.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._keystream;n&&(o=this._keystream=n.slice(0),this._iv=void 0),r.encryptBlock(o,0);for(var s=0;s<i;s++)t[e+s]^=o[s]}}),et.Decryptor=rt,et),mt.pad.NoPadding={pad:function(){},unpad:function(){}},it=mt.lib.CipherParams,nt=mt.enc.Hex,mt.format.Hex={stringify:function(t){return t.ciphertext.toString(nt)},parse:function(t){var e=nt.parse(t);return it.create({ciphertext:e})}},function(){var t=mt,e=t.lib.BlockCipher,r=t.algo,i=[],n=[],o=[],s=[],c=[],a=[],h=[],l=[],f=[],d=[];!function(){for(var t=[],e=0;e<256;e++)t[e]=e<128?e<<1:e<<1^283;var r=0,u=0;for(e=0;e<256;e++){var p=u^u<<1^u<<2^u<<3^u<<4;p=p>>>8^255&p^99,i[r]=p;var _=t[n[p]=r],v=t[_],y=t[v],g=257*t[p]^16843008*p;o[r]=g<<24|g>>>8,s[r]=g<<16|g>>>16,c[r]=g<<8|g>>>24,a[r]=g,g=16843009*y^65537*v^257*_^16843008*r,h[p]=g<<24|g>>>8,l[p]=g<<16|g>>>16,f[p]=g<<8|g>>>24,d[p]=g,r?(r=_^t[t[t[y^_]]],u^=t[t[u]]):r=u=1}}();var u=[0,1,2,4,8,16,32,64,128,27,54],p=r.AES=e.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,r=t.sigBytes/4,n=4*(1+(this._nRounds=6+r)),o=this._keySchedule=[],s=0;s<n;s++)s<r?o[s]=e[s]:(p=o[s-1],s%r?6<r&&s%r==4&&(p=i[p>>>24]<<24|i[p>>>16&255]<<16|i[p>>>8&255]<<8|i[255&p]):(p=i[(p=p<<8|p>>>24)>>>24]<<24|i[p>>>16&255]<<16|i[p>>>8&255]<<8|i[255&p],p^=u[s/r|0]<<24),o[s]=o[s-r]^p);for(var c=this._invKeySchedule=[],a=0;a<n;a++){if(s=n-a,a%4)var p=o[s];else p=o[s-4];c[a]=a<4||s<=4?p:h[i[p>>>24]]^l[i[p>>>16&255]]^f[i[p>>>8&255]]^d[i[255&p]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,o,s,c,a,i)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,h,l,f,d,n),r=t[e+1],t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,i,n,o,s,c){for(var a=this._nRounds,h=t[e]^r[0],l=t[e+1]^r[1],f=t[e+2]^r[2],d=t[e+3]^r[3],u=4,p=1;p<a;p++){var _=i[h>>>24]^n[l>>>16&255]^o[f>>>8&255]^s[255&d]^r[u++],v=i[l>>>24]^n[f>>>16&255]^o[d>>>8&255]^s[255&h]^r[u++],y=i[f>>>24]^n[d>>>16&255]^o[h>>>8&255]^s[255&l]^r[u++],g=i[d>>>24]^n[h>>>16&255]^o[l>>>8&255]^s[255&f]^r[u++];h=_,l=v,f=y,d=g}_=(c[h>>>24]<<24|c[l>>>16&255]<<16|c[f>>>8&255]<<8|c[255&d])^r[u++],v=(c[l>>>24]<<24|c[f>>>16&255]<<16|c[d>>>8&255]<<8|c[255&h])^r[u++],y=(c[f>>>24]<<24|c[d>>>16&255]<<16|c[h>>>8&255]<<8|c[255&l])^r[u++],g=(c[d>>>24]<<24|c[h>>>16&255]<<16|c[l>>>8&255]<<8|c[255&f])^r[u++],t[e]=_,t[e+1]=v,t[e+2]=y,t[e+3]=g},keySize:8});t.AES=e._createHelper(p)}(),function(){var t=mt,e=t.lib,r=e.WordArray,i=e.BlockCipher,n=t.algo,o=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],s=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],c=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],a=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],h=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],l=n.DES=i.extend({_doReset:function(){for(var t=this._key.words,e=[],r=0;r<56;r++){var i=o[r]-1;e[r]=t[i>>>5]>>>31-i%32&1}for(var n=this._subKeys=[],a=0;a<16;a++){var h=n[a]=[],l=c[a];for(r=0;r<24;r++)h[r/6|0]|=e[(s[r]-1+l)%28]<<31-r%6,h[4+(r/6|0)]|=e[28+(s[r+24]-1+l)%28]<<31-r%6;for(h[0]=h[0]<<1|h[0]>>>31,r=1;r<7;r++)h[r]=h[r]>>>4*(r-1)+3;h[7]=h[7]<<5|h[7]>>>27}var f=this._invSubKeys=[];for(r=0;r<16;r++)f[r]=n[15-r]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._subKeys)},decryptBlock:function(t,e){this._doCryptBlock(t,e,this._invSubKeys)},_doCryptBlock:function(t,e,r){this._lBlock=t[e],this._rBlock=t[e+1],f.call(this,4,252645135),f.call(this,16,65535),d.call(this,2,858993459),d.call(this,8,16711935),f.call(this,1,1431655765);for(var i=0;i<16;i++){for(var n=r[i],o=this._lBlock,s=this._rBlock,c=0,l=0;l<8;l++)c|=a[l][((s^n[l])&h[l])>>>0];this._lBlock=s,this._rBlock=o^c}var u=this._lBlock;this._lBlock=this._rBlock,this._rBlock=u,f.call(this,1,1431655765),d.call(this,8,16711935),d.call(this,2,858993459),f.call(this,16,65535),f.call(this,4,252645135),t[e]=this._lBlock,t[e+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});function f(t,e){var r=(this._lBlock>>>t^this._rBlock)&e;this._rBlock^=r,this._lBlock^=r<<t}function d(t,e){var r=(this._rBlock>>>t^this._lBlock)&e;this._lBlock^=r,this._rBlock^=r<<t}t.DES=i._createHelper(l);var u=n.TripleDES=i.extend({_doReset:function(){var t=this._key.words;if(2!==t.length&&4!==t.length&&t.length<6)throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");var e=t.slice(0,2),i=t.length<4?t.slice(0,2):t.slice(2,4),n=t.length<6?t.slice(0,2):t.slice(4,6);this._des1=l.createEncryptor(r.create(e)),this._des2=l.createEncryptor(r.create(i)),this._des3=l.createEncryptor(r.create(n))},encryptBlock:function(t,e){this._des1.encryptBlock(t,e),this._des2.decryptBlock(t,e),this._des3.encryptBlock(t,e)},decryptBlock:function(t,e){this._des3.decryptBlock(t,e),this._des2.encryptBlock(t,e),this._des1.decryptBlock(t,e)},keySize:6,ivSize:2,blockSize:2});t.TripleDES=i._createHelper(u)}(),function(){var t=mt,e=t.lib.StreamCipher,r=t.algo,i=r.RC4=e.extend({_doReset:function(){for(var t=this._key,e=t.words,r=t.sigBytes,i=this._S=[],n=0;n<256;n++)i[n]=n;n=0;for(var o=0;n<256;n++){var s=n%r,c=e[s>>>2]>>>24-s%4*8&255;o=(o+i[n]+c)%256;var a=i[n];i[n]=i[o],i[o]=a}this._i=this._j=0},_doProcessBlock:function(t,e){t[e]^=n.call(this)},keySize:8,ivSize:0});function n(){for(var t=this._S,e=this._i,r=this._j,i=0,n=0;n<4;n++){r=(r+t[e=(e+1)%256])%256;var o=t[e];t[e]=t[r],t[r]=o,i|=t[(t[e]+t[r])%256]<<24-8*n}return this._i=e,this._j=r,i}t.RC4=e._createHelper(i);var o=r.RC4Drop=i.extend({cfg:i.cfg.extend({drop:192}),_doReset:function(){i._doReset.call(this);for(var t=this.cfg.drop;0<t;t--)n.call(this)}});t.RC4Drop=e._createHelper(o)}(),mt.mode.CTRGladman=(st=(ot=mt.lib.BlockCipherMode.extend()).Encryptor=ot.extend({processBlock:function(t,e){var r,i=this._cipher,n=i.blockSize,o=this._iv,s=this._counter;o&&(s=this._counter=o.slice(0),this._iv=void 0),0===((r=s)[0]=Et(r[0]))&&(r[1]=Et(r[1]));var c=s.slice(0);i.encryptBlock(c,0);for(var a=0;a<n;a++)t[e+a]^=c[a]}}),ot.Decryptor=st,ot),at=(ct=mt).lib.StreamCipher,ht=ct.algo,lt=[],ft=[],dt=[],ut=ht.Rabbit=at.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=0;r<4;r++)t[r]=16711935&(t[r]<<8|t[r]>>>24)|4278255360&(t[r]<<24|t[r]>>>8);var i=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],n=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]];for(r=this._b=0;r<4;r++)Rt.call(this);for(r=0;r<8;r++)n[r]^=i[r+4&7];if(e){var o=e.words,s=o[0],c=o[1],a=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),h=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),l=a>>>16|4294901760&h,f=h<<16|65535&a;for(n[0]^=a,n[1]^=l,n[2]^=h,n[3]^=f,n[4]^=a,n[5]^=l,n[6]^=h,n[7]^=f,r=0;r<4;r++)Rt.call(this)}},_doProcessBlock:function(t,e){var r=this._X;Rt.call(this),lt[0]=r[0]^r[5]>>>16^r[3]<<16,lt[1]=r[2]^r[7]>>>16^r[5]<<16,lt[2]=r[4]^r[1]>>>16^r[7]<<16,lt[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)lt[i]=16711935&(lt[i]<<8|lt[i]>>>24)|4278255360&(lt[i]<<24|lt[i]>>>8),t[e+i]^=lt[i]},blockSize:4,ivSize:2}),ct.Rabbit=at._createHelper(ut),mt.mode.CTR=(_t=(pt=mt.lib.BlockCipherMode.extend()).Encryptor=pt.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._counter;n&&(o=this._counter=n.slice(0),this._iv=void 0);var s=o.slice(0);r.encryptBlock(s,0),o[i-1]=o[i-1]+1|0;for(var c=0;c<i;c++)t[e+c]^=s[c]}}),pt.Decryptor=_t,pt),yt=(vt=mt).lib.StreamCipher,gt=vt.algo,Bt=[],wt=[],kt=[],St=gt.RabbitLegacy=yt.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],i=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]],n=this._b=0;n<4;n++)Mt.call(this);for(n=0;n<8;n++)i[n]^=r[n+4&7];if(e){var o=e.words,s=o[0],c=o[1],a=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),h=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),l=a>>>16|4294901760&h,f=h<<16|65535&a;for(i[0]^=a,i[1]^=l,i[2]^=h,i[3]^=f,i[4]^=a,i[5]^=l,i[6]^=h,i[7]^=f,n=0;n<4;n++)Mt.call(this)}},_doProcessBlock:function(t,e){var r=this._X;Mt.call(this),Bt[0]=r[0]^r[5]>>>16^r[3]<<16,Bt[1]=r[2]^r[7]>>>16^r[5]<<16,Bt[2]=r[4]^r[1]>>>16^r[7]<<16,Bt[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)Bt[i]=16711935&(Bt[i]<<8|Bt[i]>>>24)|4278255360&(Bt[i]<<24|Bt[i]>>>8),t[e+i]^=Bt[i]},blockSize:4,ivSize:2}),vt.RabbitLegacy=yt._createHelper(St),mt.pad.ZeroPadding={pad:function(t,e){var r=4*e;t.clamp(),t.sigBytes+=r-(t.sigBytes%r||r)},unpad:function(t){var e=t.words,r=t.sigBytes-1;for(r=t.sigBytes-1;0<=r;r--)if(e[r>>>2]>>>24-r%4*8&255){t.sigBytes=r+1;break}}},mt});
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}