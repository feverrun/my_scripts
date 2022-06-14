/*
臻爱陪伴 助力成长
https://lzdz1-isv.isvjcloud.com/dingzhi/bookBaby/union/activity?activityId=dz6140806143bd8878376d7e98a1e7
cron "6 10 12-20 5 *" jd_opencard_zapb.js
*/
const $ = new Env("臻爱陪伴 助力成长");
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const notify = $.isNode() ? require("./sendNotify") : "";
let cookiesArr = [], cookie = "", message = "";
let ownCode = null;
let authorCodeList = [];
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item]);
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
    let cookiesData = $.getdata("CookiesJD") || "[]";
    cookiesData = JSON.parse(cookiesData);
    cookiesArr = cookiesData.map((item) => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata("CookieJD2"), $.getdata("CookieJD")]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter((item) => !!item);
}
!(async () => {
    $.getAuthorCodeListerr = false;
    if (!cookiesArr[0]) {
        $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    // authorCodeList = await getAuthorCodeList('https://raw.githubusercontent.com/okyyds/duck/master/code/lzdz10.json')
    // console.log(authorCodeList)
    // if ($.getAuthorCodeListerr === false) {
    //     authorCodeList = [
    //       'f7d7bcdc4d3e408ea0a584f27f617e4b',
    //       '78cd453ae0af483e8c7da5d3f8a857bd',
    //       '40619ea93a2c42c3ae46a1e37111a7ea',
    //     ]
    // }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            originCookie = cookiesArr[i];
            newCookie = "";
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = "";
            $.getFirstLZCKerr = ''
            await checkCookie();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                // if ($.isNode()) {
                //     await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                // }
                continue;
            }
            $.bean = 0;
            $.ADID = getUUID("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", 1);
            $.UUID = getUUID("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            authorCodeList = [
                '2fc888a413d1458dbaaaba4fe28975ea',
            ];
            // $.authorCode = authorCodeList[random(0, authorCodeList.length)];
            $.authorCode = ownCode ? ownCode : authorCodeList[random(0, authorCodeList.length)]
            $.authorNum = `${random(1000000, 9999999)}`;
            $.randomCode = random(1000000, 9999999);
            $.activityId = "dz6140806143bd8878376d7e98a1e7";
            $.activityShopId = "1000349111";
            $.activityUrl = `https://lzdz1-isv.isvjcloud.com/dingzhi/bookBaby/union/activity/${$.authorNum}?activityId=${$.activityId}&shareUuid=${encodeURIComponent($.authorCode)}&adsource=null&shareuserid4minipg=${encodeURIComponent($.secretPin)}&shopid=1000349111&lng=00.000000&lat=00.000000&sid=&un_area=`;
            await member();
            if ($.getFirstLZCKerr.indexOf('493') != -1) {
                break
            }
            await $.wait(1500);
            if ($.bean > 0) {
                message += `\n【京东账号${$.index}】${$.nickName || $.UserName} \n       └ 获得 ${$.bean} 京豆。`;
            }
        }
    }
    if (message !== "") {
        if ($.isNode()) {
            await notify.sendNotify($.name, message, "", `\n`);
        } else {
            $.msg($.name, "有点儿收获", message);
        }
    }
})()
    .catch((e) => {
        $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
    })
    .finally(() => {
        $.done();
    });

async function member() {
    $.token = null;
    $.secretPin = null;
    $.openCardActivityId = null;
    $.doFollowShop = false
    lz_cookie = {};
    await getFirstLZCK();
    await getToken();
    await task("dz/common/getSimpleActInfoVo", `activityId=${$.activityId}`, 1);
    if ($.token) {
        await getMyPing();
        if ($.secretPin) {
            console.log("去助力 -> " + $.authorCode);
            await taskaccessLog("common/accessLogWithAD", `venderId=${$.activityShopId}&code=99&pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}&pageUrl=${$.activityUrl}&subType=app&adSource=null`, 1);
            // await task("wxActionCommon/getUserInfo", `pin=${encodeURIComponent($.secretPin)}`, 1);
            if ($.index === 1) {
                await task("bookBaby/union/activityContent", `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&pinImg=&nick=${encodeURIComponent($.pin)}&cjyxPin=&cjhyPin=&shareUuid=${encodeURIComponent($.authorCode)}`, 0, 1);
            } else {
                await task("bookBaby/union/activityContent", `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&pinImg=&nick=${encodeURIComponent($.pin)}&cjyxPin=&cjhyPin=&shareUuid=${encodeURIComponent($.authorCode)}`);
            }
            // $.log("关注店铺");
            // await task("taskact/common/drawContent", `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await task("bookBaby/union/saveTask", `activityId=${$.activityId}&actorUuid=${encodeURIComponent($.actorUuid)}&pin=${encodeURIComponent($.secretPin)}&taskType=23&taskValue=1&shareUuid=${encodeURIComponent($.authorCode)}`);

            await task("bookBaby/union/initOpenCard", `pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}&shareUuid=${encodeURIComponent($.authorCode)}`);

            $.log("加入店铺会员");
            if ($.openCardList) {
                taskList = [];
                $.openCardList.filter((x) => { if (!x.openStatus) { taskList.push(x) } })
                for (const vo of taskList) {
                    console.log(vo.openStatus)
                    $.log(`>>> 去加入 ${vo.venderId}`);
                    if (vo.openStatus === false) {
                        $.log(`>>> 准备加入会员`);
                        await getShopOpenCardInfo({ venderId: `${vo.venderId}`, channel: "401" }, vo.venderId);
                        await bindWithVender({ venderId: `${vo.venderId}`, bindByVerifyCodeFlag: 1, registerExtend: {}, writeChildFlag: 0, activityId: $.openCardActivityId, channel: 401 }, vo.venderId);
                        await $.wait(1500);
                    } else {
                        $.log(`>>> 已经是会员`);
                    }
                }
                console.log("绑定助力");
                await task("bookBaby/union/initOpenCard", `pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}&shareUuid=${encodeURIComponent($.authorCode)}`);
                $.log("关注店铺");
                await task("bookBaby/union/saveTask", `activityId=${$.activityId}&actorUuid=${encodeURIComponent($.actorUuid)}&pin=${encodeURIComponent($.secretPin)}&taskType=23&taskValue=1&shareUuid=${encodeURIComponent($.authorCode)}`);
            } else {
                console.log("已关注店铺");
            }

            // console.log("去助力 -> " + $.authorCode);
            // await task("linkgame/assist/status", `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&shareUuid=${$.authorCode}`);
            // await task("linkgame/assist", `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&shareUuid=${$.authorCode}`);
            // await task('linkgame/help/list', `pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}`)
            // await task('bookBaby/union/startGame', `pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}`)
            // await task('bookBaby/union/endGame', `pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}&gameId=${$.gameId}&score=${$.score}`)
            // console.log('任务 -> ')
            // await $.wait(2000)
            // await task('opencard/addCart', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await $.wait(2000)
            // await task('linkgame/sendAllCoupon', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await getFirstLZCK()
            // await getToken();
            // console.log('抽奖 -> ')
            // await $.wait(2000)
            // await task('bookBaby/union/draw', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await $.wait(2000)
            // await task('bookBaby/union/draw', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await $.wait(2000)
            // await task('bookBaby/union/draw', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await $.wait(2000)
            // await task('bookBaby/union/draw', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // await $.wait(2000)
            // await task('bookBaby/union/draw', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}`);
            // console.log('100 -> ')
            // await getFirstLZCK()
            // await getToken();
            // await $.wait(2000)
            // await task('linkgame/draw/record', `activityId=${$.activityId}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.secretPin)}`);
        }
    }
}

function task(function_id, body, isCommon = 0, own = 0) {
    return new Promise((resolve) => {
        $.post(taskUrl(function_id, body, isCommon), async (err, resp, data) => {
            try {
                if (err) {
                    $.log(err);
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.result) {
                            switch (function_id) {
                                case "dz/common/getSimpleActInfoVo":
                                    $.jdActivityId = data.data.jdActivityId;
                                    $.venderId = data.data.venderId;
                                    $.activityType = data.data.activityType;
                                    // console.log($.venderId)
                                    break;
                                case "wxActionCommon/getUserInfo":
                                    break;
                                case "bookBaby/union/activityContent":
                                    if (!data.data.hasEnd) {
                                        $.log(`开启【${data.data.activityName}】活动`);
                                        $.log("-------------------");
                                        if ($.index === 1) {
                                            ownCode = data.data.actorUuid;
                                            console.log(ownCode);
                                        }
                                        $.actorUuid = data.data.actorUuid;
                                    } else {
                                        $.log("活动已经结束");
                                    }
                                    break;
                                case "bookBaby/union/initOpenCard":
                                    $.openCardList = data.data.openInfo;
                                    $.openCardStatus = data.data.allOpenCard;
                                    // console.log(data)
                                    break;
                                case "bookBaby/union/saveTask":
                                    // console.log(data);
                                    if (data) {
                                        console.log(data);
                                        $.doFollowShop = true
                                    }
                                    break;
                                case "bookBaby/union/draw":
                                    console.log(data);
                                    break;
                                case "opencard/addCart":
                                    if (data.data) {
                                        console.log(data.data);
                                    }
                                    break;
                                case "linkgame/sendAllCoupon":
                                    if (data.data) {
                                        console.log(data.data);
                                    }

                                    break;
                                case "interaction/write/writePersonInfo":
                                    console.log(data);
                                    break;
                                case "linkgame/draw":
                                    console.log(data);
                                    break;
                                case "linkgame/draw/record":
                                    console.log(data.data);
                                    break;
                                case "linkgame/assist/status":
                                    $.log(JSON.stringify(data));
                                    break;
                                case "linkgame/assist":
                                    $.log(JSON.stringify(data));
                                    break;
                                case "opencard/help/list":
                                    $.log(JSON.stringify(data));
                                    break;
                                default:
                                    // $.log(JSON.stringify(data))
                                    break;
                            }
                        } else {
                            // $.log(JSON.stringify(data))
                        }
                    } else {
                        // $.log("京东没有返回数据")
                    }
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve();
            }
        });
    });
}
function taskaccessLog(function_id, body, isCommon = 0) {
    return new Promise((resolve) => {
        $.post(taskUrl(function_id, body, isCommon), async (err, resp, data) => {
            try {
                if (err) {
                    $.log(err);
                } else {
                    // console.log(resp);
                    if (resp["headers"]["set-cookie"]) {
                        cookie = `${originCookie};`;
                        for (let sk of resp["headers"]["set-cookie"]) {
                            lz_cookie[sk.split(";")[0].substr(0, sk.split(";")[0].indexOf("="))] = sk.split(";")[0].substr(sk.split(";")[0].indexOf("=") + 1);
                        }
                        for (const vo of Object.keys(lz_cookie)) {
                            cookie += vo + "=" + lz_cookie[vo] + ";";
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                resolve();
            }
        });
    });
}

function getAuthorCodeList(url) {
    return new Promise((resolve) => {
        const options = {
            url: `${url}?${new Date()}`,
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88",
            },
        };
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    // $.log(err)
                    $.getAuthorCodeListerr = false;
                } else {
                    if (data) data = JSON.parse(data);
                    $.getAuthorCodeListerr = true;
                }
            } catch (e) {
                $.logErr(e, resp);
                data = null;
            } finally {
                resolve(data);
            }
        });
    });
}

function taskUrl(function_id, body, isCommon) {
    return {
        url: isCommon ? `https://lzdz1-isv.isvjcloud.com/${function_id}` : `https://lzdz1-isv.isvjcloud.com/dingzhi/${function_id}`,
        headers: {
            Host: "lzdz1-isv.isvjcloud.com",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://lzdz1-isv.isvjcloud.com",
            "User-Agent": `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            Connection: "keep-alive",
            Referer: $.activityUrl,
            Cookie: cookie,
        },
        body: body,
    };
}

function getMyPing() {
    let opt = {
        url: `https://lzdz1-isv.isvjcloud.com/customer/getMyPing`,
        headers: {
            Host: "lzdz1-isv.isvjcloud.com",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://lzdz1-isv.isvjcloud.com",
            "User-Agent": `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            Connection: "keep-alive",
            Referer: $.activityUrl,
            Cookie: cookie,
        },
        body: `userId=${$.activityShopId}&token=${$.token}&fromType=APP&riskType=1`,
    };
    return new Promise((resolve) => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    $.log(err);
                } else {
                    if (resp["headers"]["set-cookie"]) {
                        cookie = `${originCookie}`;
                        if ($.isNode()) {
                            for (let sk of resp["headers"]["set-cookie"]) {
                                cookie = `${cookie}${sk.split(";")[0]};`;
                            }
                        } else {
                            for (let ck of resp["headers"]["Set-Cookie"].split(",")) {
                                cookie = `${cookie}${ck.split(";")[0]};`;
                            }
                        }
                    }
                    if (resp["headers"]["Set-Cookie"]) {
                        cookie = `${originCookie}`;
                        if ($.isNode()) {
                            for (let sk of resp["headers"]["set-cookie"]) {
                                cookie = `${cookie}${sk.split(";")[0]};`;
                            }
                        } else {
                            for (let ck of resp["headers"]["Set-Cookie"].split(",")) {
                                cookie = `${cookie}${ck.split(";")[0]};`;
                            }
                        }
                    }
                    if (data) {
                        data = JSON.parse(data);
                        if (data.result) {
                            $.log(`你好：${data.data.nickname}`);
                            $.pin = data.data.nickname;
                            $.secretPin = data.data.secretPin;
                            cookie = `${cookie};AUTH_C_USER=${data.data.secretPin}`;
                        } else {
                            $.log(data.errorMessage);
                        }
                    } else {
                        $.log("京东返回了空数据");
                    }
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve();
            }
        });
    });
}
function getFirstLZCK() {
    return new Promise((resolve) => {
        $.get(
            {
                url: $.activityUrl,
                headers: {
                    "user-agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                },
            },
            (err, resp, data) => {
                try {
                    if (err) {
                        $.getFirstLZCKerr = err
                        console.log(err);
                    } else {
                        if (resp["headers"]["set-cookie"]) {
                            cookie = `${originCookie}`;
                            if ($.isNode()) {
                                for (let sk of resp["headers"]["set-cookie"]) {
                                    cookie = `${cookie}${sk.split(";")[0]};`;
                                }
                            } else {
                                for (let ck of resp["headers"]["Set-Cookie"].split(",")) {
                                    cookie = `${cookie}${ck.split(";")[0]};`;
                                }
                            }
                        }
                        if (resp["headers"]["Set-Cookie"]) {
                            cookie = `${originCookie}`;
                            if ($.isNode()) {
                                for (let sk of resp["headers"]["set-cookie"]) {
                                    cookie = `${cookie}${sk.split(";")[0]};`;
                                }
                            } else {
                                for (let ck of resp["headers"]["Set-Cookie"].split(",")) {
                                    cookie = `${cookie}${ck.split(";")[0]};`;
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    resolve();
                }
            }
        );
    });
}
function getToken() {
    let opt = {
        url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
        headers: {
            Host: "api.m.jd.com",
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
            Connection: "keep-alive",
            Cookie: cookie,
            "User-Agent": "JD4iPhone/167650 (iPhone; iOS 13.7; Scale/3.00)",
            "Accept-Language": "zh-Hans-CN;q=1",
            "Accept-Encoding": "gzip, deflate, br",
        },
        body: `body=%7B%22url%22%3A%20%22https%3A//lzkj-isv.isvjcloud.com%22%2C%20%22id%22%3A%20%22%22%7D&uuid=hjudwgohxzVu96krv&client=apple&clientVersion=9.4.0&st=1620476162000&sv=111&sign=f9d1b7e3b943b6a136d54fe4f892af05`,
    };
    return new Promise((resolve) => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    $.log(err);
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.code === "0") {
                            $.token = data.token;
                        }
                    } else {
                        $.log("京东返回了空数据");
                    }
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve();
            }
        });
    });
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getUUID(format = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", UpperCase = 0) {
    return format.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        if (UpperCase) {
            uuid = v.toString(36).toUpperCase();
        } else {
            uuid = v.toString(36);
        }
        return uuid;
    });
}
function checkCookie() {
    const options = {
        url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
        headers: {
            Host: "me-api.jd.com",
            Accept: "*/*",
            Connection: "keep-alive",
            Cookie: cookie,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
            "Accept-Language": "zh-cn",
            Referer: "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
            "Accept-Encoding": "gzip, deflate, br",
        },
    };
    return new Promise((resolve) => {
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err);
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.retcode === "1001") {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data.retcode === "0" && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        $.log("京东返回了空数据");
                    }
                }
            } catch (e) {
                $.logErr(e);
            } finally {
                resolve();
            }
        });
    });
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}