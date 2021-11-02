/*
11.1~11.13 酒水会员盛典 [gua_opencard59.js]
新增开卡脚本
一次性脚本

1.邀请一人5豆 被邀请也有3豆(有可能没有豆
2.开10张卡 抽奖可能获得40京豆(有可能有抽到空气💨
3.关注10京豆 (有可能是空气💨
4.加购没有豆只有金币 (有可能是空气💨 默认不加购 如需加购请设置环境变量[guaopencard_addSku59]为"true"
5.抽奖 (默认不抽奖 如需抽奖请设置环境变量[guaopencard_draw59]为"3"
填写要抽奖的次数 不足已自身次数为准
guaopencard_draw59="3"
填非数字会全都抽奖

第一个账号助力作者 其他依次助力CK1
第一个CK失效会退出脚本

邀请上限10人
ck1满10人自动换ck2

默认脚本不执行
如需执行脚本请设置环境变量
guaopencard59="true"
每个账号之间延迟 100=延迟100秒 0=延迟0秒会使用每3个账号延迟60秒
guaopenwait_All 所有
guaopenwait59="0"


All变量适用
————————————————
入口：[11.1~11.13 酒水会员盛典 (https://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=dz2110100000358301&shareUuid=e35b30db8313460a914e35352802817c)]

============Quantumultx===============
[task_local]
#11.1~11.13 酒水会员盛典
cron "37 0,9 1-13 11 *" gua_opencard59.js, tag=11.1~11.13 酒水会员盛典, enabled=true

*/
let guaopencard_addSku = "true"
let guaopencard = "true"
let guaopenwait = "0"
let guaopencard_draw = "3"

const $ = new Env('11.1~11.13 酒水会员盛典');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cleanCart = ''
if($.isNode()){
    try{
        const fs = require('fs');
        if (fs.existsSync('./utils/cleancart_activity.js')) {
            cleanCart = require('./utils/cleancart_activity');
        }
    }catch(e){
    }
}
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
let activityCookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}


guaopencard_addSku = $.isNode() ? (process.env.guaopencard_addSku59 ? process.env.guaopencard_addSku59 : `${guaopencard_addSku}`) : ($.getdata('guaopencard_addSku59') ? $.getdata('guaopencard_addSku59') : `${guaopencard_addSku}`);
guaopencard_addSku = $.isNode() ? (process.env.guaopencard_addSku_All ? process.env.guaopencard_addSku_All : `${guaopencard_addSku}`) : ($.getdata('guaopencard_addSku_All') ? $.getdata('guaopencard_addSku_All') : `${guaopencard_addSku}`);
guaopencard = $.isNode() ? (process.env.guaopencard59 ? process.env.guaopencard59 : `${guaopencard}`) : ($.getdata('guaopencard59') ? $.getdata('guaopencard59') : `${guaopencard}`);
guaopencard = $.isNode() ? (process.env.guaopencard_All ? process.env.guaopencard_All : `${guaopencard}`) : ($.getdata('guaopencard_All') ? $.getdata('guaopencard_All') : `${guaopencard}`);
guaopenwait = $.isNode() ? (process.env.guaopenwait59 ? process.env.guaopenwait59 : `${guaopenwait}`) : ($.getdata('guaopenwait59') ? $.getdata('guaopenwait59') : `${guaopenwait}`);
guaopenwait = $.isNode() ? (process.env.guaopenwait_All ? process.env.guaopenwait_All : `${guaopenwait}`) : ($.getdata('guaopenwait_All') ? $.getdata('guaopenwait_All') : `${guaopenwait}`);
guaopenwait = parseInt(guaopenwait, 10) || 0
guaopencard_draw = $.isNode() ? (process.env.guaopencard_draw59 ? process.env.guaopencard_draw59 : guaopencard_draw) : ($.getdata('guaopencard_draw59') ? $.getdata('guaopencard_draw59') : guaopencard_draw);
guaopencard_draw = $.isNode() ? (process.env.guaopencard_draw ? process.env.guaopencard_draw : guaopencard_draw) : ($.getdata('guaopencard_draw') ? $.getdata('guaopencard_draw') : guaopencard_draw);


message = ""
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            "open-url": "https://bean.m.jd.com/"
        });
        return;
    }
    if ($.isNode()) {
        if(guaopencard+"" != "true"){
            console.log('如需执行脚本请设置环境变量[guaopencard59]为"true"')
        }
        if(guaopencard+"" != "true"){
            return
        }
    }
    $.hotFlag = false
    $.outFlag = false
    $.activityEnd = false
    $.shareUuidArr = [];
    $.shareUuid = 'b7e582ae1d164697a9a9db2a344186b9'
    $.activityId = 'dz2110100000358301'
    console.log(`入口:\nhttps://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`)
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            console.log(`\n\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
            await getUA()
            await run();
            if(i == 0 && !$.actorUuid) break
            if($.outFlag || $.activityEnd) break
            // if($.index >= 1) break
        }
    }
    if($.outFlag) {
        let msg = '此ip已被限制，请过10分钟后再执行脚本'
        $.msg($.name, ``, `${msg}`);
        if ($.isNode()) await notify.sendNotify(`${$.name}`, `${msg}`);
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

async function run(){
    try{
        if($.outFlag) return
        $.hasEnd = true
        $.endTime = 0
        $.Token = ''
        $.Pin = ''
        await getCk()
        await getToken();
        if($.Token == ''){
            console.log('获取[token]失败！')
            return
        }
        if($.activityEnd === true){
            console.log('活动结束')
            return
        }
        await getSimpleActInfoVo()
        $.nickname = '';
        await getMyPing()
        if ($.Pin ==="" || typeof $.shopId == 'undefined' || typeof $.venderId == 'undefined') {
            $.log("获取活动信息失败！")
            return
        }
        await accessLogWithAD()
        $.attrTouXiang = 'https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png'
        await getUserInfo();
        $.actorUuid = '';
        await getActorUuid();
        if($.hotFlag) return
        if(!$.actorUuid){
            console.log('获取不到[actorUuid]退出执行，请重新执行')
            return
        }
        if($.hasEnd === true || Date.now() > $.endTime){
            $.activityEnd = true
            console.log('活动结束')
            return
        }
        // console.log($.actorUuid)
        // return
        await drawContent();
        await await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
        await getInitInfo();
        let checkOpenCardData = await checkOpenCard();
        if (checkOpenCardData && !checkOpenCardData.allOpenCard) {
            let flag = true
            for (let cardList1Element of checkOpenCardData.openInfo && checkOpenCardData.openInfo || []) {
                if(cardList1Element.openStatus == false){
                    if(flag) console.log('组1')
                    if(flag) flag = false
                    // console.log(cardList1Element.name)
                    await join(cardList1Element.venderId)
                    await await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
                    await drawContent();
                }
            }
            await await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
            await drawContent();
            await checkOpenCard();
            await await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
        }
        if($.outFlag) return
        $.log(`已签到${$.info.continuousSignInDay}天 今日签到: ${$.info.signStatus}`)
        if(!$.info.signStatus) await saveTask('签到', 0, 0);
        if(!$.info.signStatus) await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        $.log(`关注店铺: ${$.info.followShop}`)
        if(!$.info.followShop) await saveTask('关注店铺', 23, 23);
        if(!$.info.followShop) await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        $.log(`逛会场: ${$.info.toMainActive}`)
        if(!$.info.toMainActive) await saveTask('逛会场', 12, 1);
        if(!$.info.toMainActive) await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        $.log(`关注频道: ${$.info.peonyFollow}`)
        if(!$.info.peonyFollow) await saveTask('关注频道', 6, 6);
        if(!$.info.peonyFollow) await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        $.log(`领优惠券: ${$.info.peonyFollow}`)
        if(!$.info.peonyFollow) await saveTask('领优惠券', 13, 1);
        if(!$.info.peonyFollow) await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        let arr =$.info.skuAllAdd.filter((x) => x.status === false)
        if(arr.length > 0){
            if(guaopencard_addSku+"" == "true"){
                let goodsArr = []
                if(cleanCart){
                    goodsArr = await cleanCart.clean(cookie,'','')
                    await $.wait(parseInt(Math.random() * 1000 + 4000, 10))
                }
                for (let s of $.info.skuAllAdd || []) {
                    if(s.status == false) await saveTask('加购', 2, s.value);
                    if(s.status == false) await $.wait(parseInt(Math.random() * 2000 + 3000, 10))
                }
                if(cleanCart && goodsArr !== false){
                    await $.wait(parseInt(Math.random() * 1000 + 4000, 10))
                    await cleanCart.clean(cookie,'',goodsArr || [ ])
                }
            }else console.log('如需加购请设置环境变量[guaopencard_addSku59]为"true"');
        }else{
            console.log('已完成加购')
        }
        await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
        await getActorUuid()
        console.log(`共${$.score}金币 剩余${$.score2}金币 ${$.assistCount}次抽奖`)
        let gameFlag = 0
        if(guaopencard_draw+"" !== "0"){
            let count = parseInt($.assistCount, 10)
            guaopencard_draw = parseInt(guaopencard_draw, 10)
            if(count > guaopencard_draw) count = guaopencard_draw
            console.log(`抽奖次数为:${count}`)
            for(j=1;count-- && true;j++){
                console.log(`第${j}次`)
                await draw()
                gameFlag = 1
                if(j >= 10) console.log('太多次了，请重新执行')
                if(j >= 10) break
                // break
                await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
                if($.assistCount <= 0) break
            }
        }else console.log('如需抽奖请设置环境变量[guaopencard_draw59]为"3" 3为次数');
        if(gameFlag == 1){
            await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
            await getActorUuid();
            console.log(`共${$.score}金币 剩余${$.score2}金币 ${$.assistCount}次抽奖`)
        }
        await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
        await getDrawRecordHasCoupon()
        await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
        $.ShareCount = 0
        await getShareRecord()
        $.log($.shareUuid)
        if($.actorUuid){
            $.shareUuidArr.push({"shareUuid":$.actorUuid,"count":$.ShareCount,'index':$.index});
        }else if($.index === 1){
            console.log('账号1获取不到[shareUuid]退出执行，请重新执行')
            return
        }
        if($.index === 1 || $.shareUuid == 'e35b30db8313460a914e35352802817c') updateShareUuid($.shareUuid,0)
        if((!$.info.followShop || !checkOpenCardData.allOpenCard) && $.index !== 1) updateShareUuid($.shareUuid,1)
        await $.wait(parseInt(Math.random() * 1000 + 10000, 10))
        if(guaopenwait){
            if($.index != cookiesArr.length){
                console.log(`等待${guaopenwait}秒`)
                await $.wait(parseInt(guaopenwait, 10) * 1000)
            }
        }else{
            if($.index % 3 == 0) console.log('休息1分钟，别被黑ip了\n可持续发展')
            if($.index % 3 == 0) await $.wait(parseInt(Math.random() * 5000 + 60000, 10))
        }
    }catch(e){
        console.log(e)
    }
}
function updateShareUuid(id,type) {
    let index = 0
    for(let i in $.shareUuidArr){
        if($.shareUuidArr[i] && $.shareUuidArr[i].shareUuid == id){
            index = i
            break
        }
    }
    if(type == 1) $.shareUuidArr[index].count++
    // if($.shareUuidArr[index].count >= 10) console.log(`已邀请${$.shareUuidArr[index].count}`)
    console.log(`助力码[${$.shareUuidArr[index].shareUuid}] 已邀请${$.shareUuidArr[index].count}`)
    if($.shareUuidArr[index].count >= 10 || type == 0){
        for(let i in $.shareUuidArr){
            if($.shareUuidArr[i] && $.shareUuidArr[i].count < 10){
                $.shareUuid = $.shareUuidArr[i].shareUuid
                console.log(`更新助力码[${$.shareUuid}] 账号${$.shareUuidArr[i].index} 已邀请${$.shareUuidArr[i].count}`)
                break
            }
        }

    }
}
function getDrawRecordHasCoupon() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.Pin)}`
        $.post(taskPostUrl('/dingzhi/taskact/common/getDrawRecordHasCoupon', body), async (err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    res = $.toObj(data);
                    if(typeof res == 'object'){
                        if(res.result === true && res.data){
                            console.log(`我的奖品：`)
                            let num = 0
                            let value = 0
                            let jsonName = {
                                "dayBeSharedBeans":"被邀请",
                                "dayShareBeans":"邀请",
                                "saveTaskBeans":"关注店铺",
                                "opencardBeans":"开卡",
                                "c6a7ac0347af4eaeaf93820cc368a163":"抽奖",
                                "OneClickCoupon":"优惠券",
                            }
                            for(let i in res.data){
                                let item = res.data[i]
                                if(item.drawId == 'dayShareBeans') num++;
                                if(item.drawId == 'dayShareBeans') value = item.infoName.replace('京豆','');
                                if(item.drawId != 'dayShareBeans') console.log(`${(jsonName[item.drawId] || item.drawId) +':' || ''}${item.infoName}`)
                            }
                            if(num > 0) console.log(`邀请好友(${num}):${num*parseInt(value, 10) || 10}京豆`)
                        }else if(typeof res == 'object' && res.errorMessage){
                            console.log(`我的奖品 ${res.errorMessage || ''}`)
                        }else{
                            console.log(data)
                        }
                    }else{
                        console.log(data)
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
function getShareRecord() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.Pin)}&num=0&sortSuatus=1`
        $.post(taskPostUrl('/dingzhi/taskact/common/getShareRecord', body), async (err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    res = $.toObj(data);
                    if(typeof res == 'object'){
                        if(res.result === true && res.data){
                            $.log(`=========== 你邀请了:${res.data.length}个`)
                            $.ShareCount = res.data.length
                        }else if(typeof res == 'object' && res.errorMessage){
                            console.log(`${res.errorMessage || ''}`)
                        }else{
                            console.log(data)
                        }
                    }else{
                        console.log(data)
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

function draw() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.Pin)}`
        const options = taskPostUrl('/dingzhi/jddrinks/grandceremony/draw', body);
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    let res = $.toObj(data);
                    if(typeof res == 'object'){
                        if(res.result === true && res.data){
                            console.log(`抽奖获得：${res.data.wdsrvo.drawOk && res.data.wdsrvo.name || '空气💨'}`)
                            if(res.data.wdsrvo.drawOk) console.log(data)
                        }else if(typeof res == 'object' && res.errorMessage){
                            console.log(`抽奖 ${res.errorMessage || ''}`)
                        }else{
                            console.log(data)
                        }
                    }else{
                        console.log(data)
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
function saveTask(title, taskType, taskValue) {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&shareUuid=${$.shareUuid}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.Pin)}&taskType=${taskType}&taskValue=${taskValue}`
        $.post(taskPostUrl('/dingzhi/jddrinks/grandceremony/saveTask', body), async (err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    let res = $.toObj(data);
                    if(typeof res == 'object'){
                        if(res.result === true && res.data){
                            let msg = ''
                            if(res.data.beans){
                                msg = ` ${res.data.beans}京豆`
                            }
                            if(res.data.addScore){
                                msg += ` ${res.data.addScore}金币`
                            }
                            if(res.data.assistCount){
                                msg += ` 当前剩余${res.data.assistCount}次抽奖`
                            }
                            console.log(`${title}获得:${ msg || '空气💨'}`)
                        }else if(typeof res == 'object' && res.errorMessage){
                            console.log(`${title} ${res.errorMessage || ''}`)
                        }else{
                            console.log(data)
                        }
                    }else{
                        console.log(data)
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

function getshopactivityId(venderId) {
    return new Promise(resolve => {
        $.get(shopactivityId(`${venderId}`), async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if(data.success == true){
                    // console.log($.toStr(data.result))
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
function shopactivityId(functionId) {
    return {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22${functionId}%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            'Content-Type': 'text/plain; Charset=UTF-8',
            'Origin': 'https://api.m.jd.com',
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'User-Agent': $.UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401&returnUrl=https://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
            'Cookie': cookie
        }
    }
}
function join(venderId) {
    return new Promise(async resolve => {
        $.shopactivityId = ''
        await $.wait(1000)
        await getshopactivityId(venderId)
        $.get(ruhui(`${venderId}`), async (err, resp, data) => {
            try {
                // console.log(data)
                res = $.toObj(data);
                if(typeof res == 'object'){
                    if(res.success === true){
                        console.log(res.message)
                        if(res.result && res.result.giftInfo){
                            for(let i of res.result.giftInfo.giftList){
                                console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
                            }
                        }
                    }else if(typeof res == 'object' && res.message){
                        console.log(`${res.message || ''}`)
                    }else{
                        console.log(data)
                    }
                }else{
                    console.log(data)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function ruhui(functionId) {
    let activityId = ``
    if($.shopactivityId) activityId = `,"activityId":${$.shopactivityId}`
    return {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body={"venderId":"${functionId}","shopId":"${functionId}","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0${activityId},"channel":401}&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            'Content-Type': 'text/plain; Charset=UTF-8',
            'Origin': 'https://api.m.jd.com',
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'User-Agent': $.UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401&returnUrl=https://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
            'Cookie': cookie
        }
    }
}

function checkOpenCard() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&shareUuid=${$.shareUuid}&pin=${encodeURIComponent($.Pin)}`
        $.post(taskPostUrl('/dingzhi/jddrinks/grandceremony/initOpenCard', body), async (err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    res = $.toObj(data);
                    if(typeof res !== 'object'){
                        console.log(data)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(res && res.data || '');
            }
        })
    })
}
function getInitInfo() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&shareUuid=${$.shareUuid}&pin=${encodeURIComponent($.Pin)}`
        $.post(taskPostUrl('/dingzhi/jddrinks/grandceremony/getInitInfo', body), async (err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    res = $.toObj(data);
                    if(typeof res == 'object' && res.result && res.result === true){
                        $.info = res.data
                    }else if(typeof res == 'object' && res.errorMessage){
                        console.log(`getInitInfo ${res.errorMessage || ''}`)
                    }else{
                        console.log(data)
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


function drawContent() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        $.post(taskPostUrl('/dingzhi/taskact/common/drawContent',body), async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {

                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getActorUuid() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${encodeURIComponent($.nickname)}&cjyxPin=&cjhyPin=&shareUuid=${$.shareUuid}`
        $.post(taskPostUrl('/dingzhi/jddrinks/grandceremony/activityContent',body), async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    res = $.toObj(data);
                    if(typeof res == 'object' && res.result && res.result === true){
                        if(typeof res.data.actorUuid != 'undefined') $.actorUuid = res.data.actorUuid
                        if(typeof res.data.assistCount != 'undefined') $.assistCount = res.data.assistCount || 0
                        if(typeof res.data.score2 != 'undefined') $.score2 = res.data.score2 || 0
                        if(typeof res.data.score != 'undefined') $.score = res.data.score || 0
                        if(typeof res.data.endTime != 'undefined') $.endTime = res.data.endTime || 0
                        if(typeof res.data.hasEnd != 'undefined') $.hasEnd = res.data.hasEnd || false
                    }else if(typeof res == 'object' && res.errorMessage){
                        if(res.errorMessage.indexOf('火爆') >-1 ){
                            $.hotFlag = true
                        }
                        console.log(`activityContent ${res.errorMessage || ''}`)
                    }else{
                        console.log(data)
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
function getUserInfo() {
    return new Promise(resolve => {
        let body = `pin=${encodeURIComponent($.Pin)}`
        $.post(taskPostUrl('/wxActionCommon/getUserInfo',body), async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} getUserInfo API请求失败，请检查网路重试`)
                } else {
                    res = $.toObj(data);
                    if(typeof res == 'object' && res.result && res.result === true){
                        if(res.data && typeof res.data.yunMidImageUrl != 'undefined') $.attrTouXiang = res.data.yunMidImageUrl || "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
                    }else if(typeof res == 'object' && res.errorMessage){
                        console.log(`getUserInfo ${res.errorMessage || ''}`)
                    }else{
                        console.log(data)
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

function accessLogWithAD() {
    return new Promise(resolve => {
        let pageurl = `https://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`
        let body = `venderId=${$.shopId || $.venderId}&code=99&pin=${encodeURIComponent($.Pin)}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(pageurl)}&subType=APP&adSource=null`
        $.post(taskPostUrl('/common/accessLogWithAD',body), async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let LZ_TOKEN_KEY = ''
                    let LZ_TOKEN_VALUE = ''
                    let setcookies = resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || ''
                    let setcookie = ''
                    if(setcookies){
                        if(typeof setcookies != 'object'){
                            setcookie = setcookies.split(',')
                        }else setcookie = setcookies
                        for (let ck of setcookie) {
                            let name = ck.split(";")[0].trim()
                            if(name.split("=")[1]){
                                if(name.indexOf('LZ_TOKEN_KEY=')>-1) LZ_TOKEN_KEY = name.replace(/ /g,'')+';'
                                if(name.indexOf('LZ_TOKEN_VALUE=')>-1) LZ_TOKEN_VALUE = name.replace(/ /g,'')+';'
                            }
                        }
                    }
                    if(LZ_TOKEN_KEY && LZ_TOKEN_VALUE) activityCookie = `${LZ_TOKEN_KEY} ${LZ_TOKEN_VALUE}`
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getMyPing() {
    return new Promise(resolve => {
        let body = `userId=${$.shopId || $.venderId}&token=${$.Token}&fromType=APP`
        $.post(taskPostUrl('/customer/getMyPing',body), async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} getMyPing API请求失败，请检查网路重试`)
                } else {
                    let res = $.toObj(data)
                    if(typeof res == 'object' && res.result && res.result === true){
                        if(res.data && typeof res.data.secretPin != 'undefined') $.Pin = res.data.secretPin
                        if(res.data && typeof res.data.nickname != 'undefined') $.nickname = res.data.nickname
                    }else if(typeof res == 'object' && res.errorMessage){
                        console.log(`getMyPing ${res.errorMessage || ''}`)
                    }else{
                        console.log(data)
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
function getSimpleActInfoVo() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}`
        $.post(taskPostUrl('/dz/common/getSimpleActInfoVo',body), async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} getSimpleActInfoVo API请求失败，请检查网路重试`)
                } else {
                    res = $.toObj(data);
                    if(typeof res == 'object' && res.result && res.result === true){
                        if(typeof res.data.shopId != 'undefined') $.shopId = res.data.shopId
                        if(typeof res.data.venderId != 'undefined') $.venderId = res.data.venderId
                    }else if(typeof res == 'object' && res.errorMessage){
                        console.log(`getSimpleActInfoVo ${res.errorMessage || ''}`)
                    }else{
                        console.log(data)
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
function getToken() {
    return new Promise(resolve => {
        $.post({
            url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
            body: 'body=%7B%22url%22%3A%22https%3A//lzdz2-isv.isvjd.com%22%2C%22id%22%3A%22%22%7D&uuid=3f18de100bceb08d44ab6843d24157674b3a754d&client=apple&clientVersion=10.1.4&st=1635818210026&sv=102&sign=a48f372db28a889036c83e8a7d72a9f1',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'Cookie': cookie,
                'Host':'api.m.jd.com',
                'User-Agent': $.UA,
            }
        }, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} isvObfuscator API请求失败，请检查网路重试`)
                } else {
                    let res = $.toObj(data)
                    if(typeof res == 'object' && res.errcode == 0){
                        if(typeof res.token != 'undefined') $.Token = res.token
                    }else if(typeof res == 'object' && res.message){
                        console.log(`isvObfuscator ${res.message || ''}`)
                    }else{
                        console.log(data)
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
function getCk() {
    return new Promise(resolve => {
        let get = {
            url:`https://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
            headers: {
                "Cookie": cookie,
                "User-Agent": $.UA,
            }
        }
        $.get(get, async(err, resp, data) => {
            try {
                if (err) {
                    if(resp && typeof resp.statusCode != 'undefined'){
                        if(resp.statusCode == 493){
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} cookie API请求失败，请检查网路重试`)
                } else {
                    let end = data.match(/(活动已经结束)/) && data.match(/(活动已经结束)/)[1] || ''
                    if(end){
                        $.activityEnd = true
                        console.log('活动已结束')
                    }
                    let LZ_TOKEN_KEY = ''
                    let LZ_TOKEN_VALUE = ''
                    let setcookies = resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || ''
                    let setcookie = ''
                    if(setcookies){
                        if(typeof setcookies != 'object'){
                            setcookie = setcookies.split(',')
                        }else setcookie = setcookies
                        for (let ck of setcookie) {
                            let name = ck.split(";")[0].trim()
                            if(name.split("=")[1]){
                                if(name.indexOf('LZ_TOKEN_KEY=')>-1) LZ_TOKEN_KEY = name.replace(/ /g,'')+';'
                                if(name.indexOf('LZ_TOKEN_VALUE=')>-1) LZ_TOKEN_VALUE = name.replace(/ /g,'')+';'
                            }
                        }
                    }
                    if(LZ_TOKEN_KEY && LZ_TOKEN_VALUE) activityCookie = `${LZ_TOKEN_KEY} ${LZ_TOKEN_VALUE}`
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function taskPostUrl(url, body) {
    return {
        url: `https://lzdz2-isv.isvjcloud.com${url}`,
        body: body,
        headers: {
            "Accept": "application/json",
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            'Cookie': `${activityCookie} ${$.Pin && "AUTH_C_USER=" + $.Pin + ";" || ""}`,
            "Host": "lzdz2-isv.isvjcloud.com",
            "Origin": "https://lzdz2-isv.isvjcloud.com",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": `https://lzdz2-isv.isvjcloud.com/dingzhi/jddrinks/grandceremony/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
            "User-Agent": $.UA ,
        }
    }
}

function getUA(){
    $.UA = `jdapp;iPhone;10.2.2;13.1.2;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
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
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

