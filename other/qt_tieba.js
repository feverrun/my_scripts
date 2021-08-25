/*
百度贴吧签到脚本

脚本修改自: https://github.com/sazs34/TaskConfig
兼容: QuantumultX, Surge4, Loon

获取Cookie说明：
打开百度贴吧App后(AppStore中国区, 非内部版)，点击"我的", 如通知成功获取cookie, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。

************************
Surge 4.2.0+ 脚本配置:
************************

[Script]
贴吧签到 = type=cron,cronexp=0 9 * * *,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js

贴吧获取Cookie = type=http-request,pattern=https?:\/\/(c\.tieba\.baidu\.com|180\.97\.\d+\.\d+)\/c\/s\/login,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js

[MITM]
hostname= c.tieba.baidu.com

************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 贴吧签到
0 9 * * * TieBa.js

[rewrite_local]
# 获取Cookie
https?:\/\/(c\.tieba\.baidu\.com|180\.97\.\d+\.\d+)\/c\/s\/login url script-request-header TieBa.js

[mitm]
hostname= c.tieba.baidu.com

************************
Loon 2.1.0+ 脚本配置:
************************

[Script]
# 贴吧签到
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js

# 获取Cookie
http-request https?:\/\/(c\.tieba\.baidu\.com|180\.97\.\d+\.\d+)\/c\/s\/login script-path=https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js

[Mitm]
hostname= c.tieba.baidu.com


*/
var $nobyda = nobyda();
var cookieVal = "BIDUPSID=0343D5498EE8D0841372C9431EF4F2E7; PSTM=1575441756; wise_device=0; st_key_id=17; bdshare_firstime=1605246866140; 2717655625_FRSVideoUploadTip=1; __yjs_duid=1_1b4d9cb4db78c6ea1ba7d48b1458f5801618925965577; mo_originid=1; USER_JUMP=-1; BAIDUID=17B6E1EDF1453C7B0EF45B90DE1C963B:FG=1; BDSFRCVID=xTKOJexroG0YRbTH3zi92MensdNbUdrTDYrEQ-mAp1wm6V8VJeC6EG0Pts1-dEu-EHtdogKK0eOTHk8F_2uxOjjg8UtVJeC6EG0Ptf8g0M5; H_BDCLCKID_SF=fn4JoC0atCvDqTrP-trf5DCShUFs0tjRB2Q-XPoO3KJZetoCbqrPMRjXXfoXb-biWKQXbxbgylRM8P3y0bb2DUA1y4vpKMPftgTxoUJ23Uo6s-Jcqt5OyU_ebPRiJPQ9QgbWVpQ7tt5W8ncFbT7l5hKpbt-q0x-jLTnhVn0MBCK0MCtCej8ajjPy5q3j2bjJHDOjQnA8Kb7Vbn09MUnkbJkXhPtjXlOeLCTT3lQRBR7rqx3LKt782JK7Qbrr0lOqWGcqhxc_Lp5MSR3O2M7pQT8r5ModJ4TP2-jrQ-Pyab3vOIJNXpO1MUtzBN5thURB2DkO-4bCWJ5TMl5jDh3Mb6ksD-FtqjKjJJKJoCKQKt8_HRjYbb__-P4DePb9BMRZ56bHWh0Mylo1Dn5k55jbXt4mKRJLtx67KDQnKUT-3l7boMJRK5bdQUIT3xJ9a6543bRTLpb4LhnlET6sKnAWhP-UyN3-Wh37227lMKoaMp78jR093JO4y4Ldj4oxJpOJ5JbMopCafDD3qbjkq45HMt00qxby26nEye79aJ5y-J7nhMT--lO1DnIFh4cyybjUfmoa-Rb-QpbZql5hqtcNK5_WhHjpqp5Z5mAqKl0MLPb5hj6gQJ_VQfk3bMnMBMPj5mOnanvn3fAKftnOM46JehL3346-35543bRTLnLy5KJYMDFlen3HhCCV-frb-C62aKDsXUbcBhcqJ-ovQT3Z04D7yabEa6FHBCTXQbbkKf5fqxbeWJ5p0DuDLq0D--uqQJbpaJ5nJq5nhMJmKTLVbML0qto7-P3y523ion5vQpnObhQ3DRoWXPIqbN7P-p5Z5mAqKl0MLPbtbb0xXj_0-nDSHH-DJ5Kf3H; BDSFRCVID_BFESS=xTKOJexroG0YRbTH3zi92MensdNbUdrTDYrEQ-mAp1wm6V8VJeC6EG0Pts1-dEu-EHtdogKK0eOTHk8F_2uxOjjg8UtVJeC6EG0Ptf8g0M5; H_BDCLCKID_SF_BFESS=fn4JoC0atCvDqTrP-trf5DCShUFs0tjRB2Q-XPoO3KJZetoCbqrPMRjXXfoXb-biWKQXbxbgylRM8P3y0bb2DUA1y4vpKMPftgTxoUJ23Uo6s-Jcqt5OyU_ebPRiJPQ9QgbWVpQ7tt5W8ncFbT7l5hKpbt-q0x-jLTnhVn0MBCK0MCtCej8ajjPy5q3j2bjJHDOjQnA8Kb7Vbn09MUnkbJkXhPtjXlOeLCTT3lQRBR7rqx3LKt782JK7Qbrr0lOqWGcqhxc_Lp5MSR3O2M7pQT8r5ModJ4TP2-jrQ-Pyab3vOIJNXpO1MUtzBN5thURB2DkO-4bCWJ5TMl5jDh3Mb6ksD-FtqjKjJJKJoCKQKt8_HRjYbb__-P4DePb9BMRZ56bHWh0Mylo1Dn5k55jbXt4mKRJLtx67KDQnKUT-3l7boMJRK5bdQUIT3xJ9a6543bRTLpb4LhnlET6sKnAWhP-UyN3-Wh37227lMKoaMp78jR093JO4y4Ldj4oxJpOJ5JbMopCafDD3qbjkq45HMt00qxby26nEye79aJ5y-J7nhMT--lO1DnIFh4cyybjUfmoa-Rb-QpbZql5hqtcNK5_WhHjpqp5Z5mAqKl0MLPb5hj6gQJ_VQfk3bMnMBMPj5mOnanvn3fAKftnOM46JehL3346-35543bRTLnLy5KJYMDFlen3HhCCV-frb-C62aKDsXUbcBhcqJ-ovQT3Z04D7yabEa6FHBCTXQbbkKf5fqxbeWJ5p0DuDLq0D--uqQJbpaJ5nJq5nhMJmKTLVbML0qto7-P3y523ion5vQpnObhQ3DRoWXPIqbN7P-p5Z5mAqKl0MLPbtbb0xXj_0-nDSHH-DJ5Kf3H; Hm_lvt_98b9d8c2fd6608d564bf2ac2ae642948=1627452378,1627540561,1628678037,1628842037; Hm_lpvt_98b9d8c2fd6608d564bf2ac2ae642948=1628842037; H_WISE_SIDS=107314_110085_127969_164326_171234_174754_175755_176677_177058_177409_177473_177953_178329_178530_178602_179350_179436_179483_180314_180407_181125_181135_181158_181400_181483_181588_181611_181712_181731_182000_182001_182026_182100_182163_182193_182273_182283_182530_182593_182683_182848_182888_183002_183035_183270_183313_183325_183330_183404_183431_183548_183584_183629_183759_183867_183975_184010_184146_184245_184351_184464_184556_184579_184716_184723_184789_184794_184810_184826_184892; H_PS_PSSID=34399_31660_33848_34092_34107_26350_34420_34319_34390; delPer=0; PSINO=5; BAIDUID_BFESS=17B6E1EDF1453C7B0EF45B90DE1C963B:FG=1; BAIDU_WISE_UID=wapp_1629858067129_241; BDUSS=ZsUFRyc0ZRMllONzh0d0RCR2IxbzlpLTlTbTJGT1MxZFBGV2w5Z0JjbGhOazFoRVFBQUFBJCQAAAAAAAAAAAEAAABJIvyhX8SqwOTErgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGpJWFhqSVhYW; BDUSS_BFESS=ZsUFRyc0ZRMllONzh0d0RCR2IxbzlpLTlTbTJGT1MxZFBGV2w5Z0JjbGhOazFoRVFBQUFBJCQAAAAAAAAAAAEAAABJIvyhX8SqwOTErgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGpJWFhqSVhYW; STOKEN=65d997402ab2d230066610af1f2218c2eb012d6897a797ea81ab2b324f4adde2; ab_sr=1.0.1_Y2Q5ZDQ0ZTAzNWIzNDFhODA1NTRhOWFiMWExZjk4MDJhMzcwMWI5MzdkYWQ2YWFmOGEwOWZhNzAxYWIxYzZhNjBlNjk4MDU3NDFkYzA5ZDlkNmJmYWVjOWYxYjliMDBkMTQ1YzU1NTVhMzY4MDkyY2QyYTY4NGZjMDY3OWIyMTVjMWJhMjI2YTJkNjU1N2M5ZmI1ZGNkZDk3ZjA0MjUyZThlZTU3Y2VhYmFkZmQ3MWNkMjZkN2M2ZWM2ZWE3NzZi; st_data=03b38cee089e82d24b47fe65d64bc4e5c23ef2c7ac589dad330311b6e5525e1233718f9e8f10c06b9bf3d82ced1723199adc51341019e87ba219e87ddcf6abb81efa15091aa21dbe2f82a411b27bfa4c0dc62560583899b5cf70fbb5e8ea05be49f89ad3a83ff214d9ce9bb3beb38867060a544369ab0282e0cf2a438c3fc8b5; st_sign=96893791";

//$nobyda.read("CookieTB");
var useParallel = 0; //0自动切换,1串行,2并行(当贴吧数量大于30个以后,并行可能会导致QX崩溃,所以您可以自动切换)
var singleNotifyCount = 5; //想签到几个汇总到一个通知里,这里就填几个(比如我有13个要签到的,这里填了5,就会分三次消息通知过去)
var process = {
    total: 0,
    result: [
        // {
        //     bar:'',
        //     level:0,
        //     exp:0,
        //     errorCode:0,
        //     errorMsg:''
        // }
    ]
};
var url_fetch_sign = {
    url: "https://tieba.baidu.com/mo/q/newmoindex",
    headers: {
        "Content-Type": "application/octet-stream",
        Referer: "https://tieba.baidu.com/index/tbwise/forum",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366"
    }
};
var url_fetch_add = {
    url: "https://tieba.baidu.com/sign/add",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.7.5.650 Mobile"
    },
    body: ""
};
if ($nobyda.isRequest) {
    GetCookie()
} else {
    signTieBa()
}


function signTieBa() {
    useParallel = $nobyda.read("BDTB_DailyBonus_Mode") || useParallel
    singleNotifyCount = $nobyda.read("BDTB_DailyBonus_notify") || singleNotifyCount
    if (!cookieVal) {
        $nobyda.notify("贴吧签到", "签到失败", "未获取到cookie");
        return $nobyda.done()
    }
    $nobyda.get(url_fetch_sign, function(error, response, data) {
        if (error) {
            $nobyda.notify("贴吧签到", "签到失败", "未获取到签到列表");
            $nobyda.done()
        } else {
            // $nobyda.notify("贴吧签到", "贴吧列表", response.body);
            var body = JSON.parse(data);
            var isSuccessResponse = body && body.no == 0 && body.error == "success" && body.data.tbs;
            if (!isSuccessResponse) {
                $nobyda.notify("贴吧签到", "签到失败", (body && body.error) ? body.error : "接口数据获取失败");
                return $nobyda.done()
            }
            process.total = body.data.like_forum.length;
            if (body.data.like_forum && body.data.like_forum.length > 0) {
                if (useParallel == 1 || (useParallel == 0 && body.data.like_forum.length >= 30)) {
                    signBars(body.data.like_forum, body.data.tbs, 0);
                } else {
                    for (const bar of body.data.like_forum) {
                        signBar(bar, body.data.tbs);
                    }
                }
            } else {
                $nobyda.notify("贴吧签到", "签到失败", "请确认您有关注的贴吧");
                return $nobyda.done()
            }
        }
    })
}

function signBar(bar, tbs) {
    if (bar.is_sign == 1) { //已签到的,直接不请求接口了
        process.result.push({
            bar: `${bar.forum_name}`,
            level: bar.user_level,
            exp: bar.user_exp,
            errorCode: 9999,
            errorMsg: "已签到"
        });
        checkIsAllProcessed();
    } else {
        url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
        $nobyda.post(url_fetch_add, function(error, response, data) {
            if (error) {
                process.result.push({
                    bar: bar.forum_name,
                    errorCode: 999,
                    errorMsg: '接口错误'
                });
                checkIsAllProcessed();
            } else {
                try {
                    var addResult = JSON.parse(data);
                    if (addResult.no == 0) {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: 0,
                            errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                        });
                    } else {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: addResult.no,
                            errorMsg: addResult.error
                        });
                    }
                } catch (e) {
                    $nobyda.notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
                    $nobyda.done()
                }
                checkIsAllProcessed();
            }
        })
    }
}

function signBars(bars, tbs, index) {
    //$nobyda.notify("贴吧签到", `进度${index}/${bars.length}`, "");
    if (index >= bars.length) {
        //$nobyda.notify("贴吧签到", "签到已满", `${process.result.length}`);
        checkIsAllProcessed();
    } else {
        var bar = bars[index];
        if (bar.is_sign == 1) { //已签到的,直接不请求接口了
            process.result.push({
                bar: `${bar.forum_name}`,
                level: bar.user_level,
                exp: bar.user_exp,
                errorCode: 9999,
                errorMsg: "已签到"
            });
            signBars(bars, tbs, ++index);
        } else {
            url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
            $nobyda.post(url_fetch_add, function(error, response, data) {
                if (error) {
                    process.result.push({
                        bar: bar.forum_name,
                        errorCode: 999,
                        errorMsg: '接口错误'
                    });
                    signBars(bars, tbs, ++index);
                } else {
                    try {
                        var addResult = JSON.parse(data);
                        if (addResult.no == 0) {
                            process.result.push({
                                bar: bar.forum_name,
                                errorCode: 0,
                                errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                            });
                        } else {
                            process.result.push({
                                bar: bar.forum_name,
                                errorCode: addResult.no,
                                errorMsg: addResult.error
                            });
                        }
                    } catch (e) {
                        $nobyda.notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
                        $nobyda.done()
                    }
                    signBars(bars, tbs, ++index)
                }
            })
        }
    }
}

function checkIsAllProcessed() {
    //$nobyda.notify("贴吧签到", `最终进度${process.result.length}/${process.total}`, "");
    if (process.result.length != process.total) return;
    for (var i = 0; i < Math.ceil(process.total / singleNotifyCount); i++) {
        var notify = "";
        var spliceArr = process.result.splice(0, singleNotifyCount);
        var notifySuccessCount = 0;
        for (const res of spliceArr) {
            if (res.errorCode == 0 || res.errorCode == 9999) {
                notifySuccessCount++;
            }
            if (res.errorCode == 9999) {
                notify += `【${res.bar}】已经签到，当前等级${res.level},经验${res.exp}
`;
            } else {
                notify += `【${res.bar}】${res.errorCode==0?'签到成功':'签到失败'}，${res.errorCode==0?res.errorMsg:('原因：'+res.errorMsg)}
`;
            }
        }
        $nobyda.notify("贴吧签到", `签到${spliceArr.length}个,成功${notifySuccessCount}个`, notify);
        $nobyda.done()
    }
}

function GetCookie() {
    var headerCookie = $request.headers["Cookie"];
    if (headerCookie) {
        if ($nobyda.read("CookieTB") != undefined) {
            if ($nobyda.read("CookieTB") != headerCookie) {
                if (headerCookie.indexOf("BDUSS") != -1) {
                    var cookie = $nobyda.write(headerCookie, "CookieTB");
                    if (!cookie) {
                        $nobyda.notify("更新贴吧Cookie失败‼️", "", "");
                    } else {
                        $nobyda.notify("更新贴吧Cookie成功 🎉", "", "");
                    }
                }
            }
        } else {
            if (headerCookie.indexOf("BDUSS") != -1) {
                var cookie = $nobyda.write(headerCookie, "CookieTB");
                if (!cookie) {
                    $nobyda.notify("首次写入贴吧Cookie失败‼️", "", "");
                } else {
                    $nobyda.notify("首次写入贴吧Cookie成功 🎉", "", "");
                }
            }
        }
    }
    $nobyda.done()
}

function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    const done = (value = {}) => {
        if (isQuanX) return $done(value)
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return {
        isRequest,
        notify,
        write,
        read,
        get,
        post,
        done
    }
};