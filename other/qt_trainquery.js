
/**
 本脚本可查询火车余票及列车时刻查询
 1.可更改出发地、目的地及列车车次
 2.K值为列车车次所对应的序号或者车次，请不要填错，详情请看日志
 3.部分列车无法查到列车时刻信息，部分列车总计时间有误，以时刻表为准，部分座席可能无票价，第一次运行会报错，请重新运行
 4.提供所有席别余票信息，测试阶段，仅供参考

 支持boxjs远程自定义配置，增加可自定义车次，车次序号设置过大时可显示经过车次，可根据车次序号进行设置，由于苹果限制，车次可能显示不全

 如果设置出行日期若已过，则自动修改为明天，可在Boxjs内手动修改出行日期

 增加点击通知链接跳转详情页
 ～～～～～～～～～～～～～～～～
 QX 1.0.6+ :
 [task_local]
 0 * * * * trainquery.js
 # Remote 远程
 0 10 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js, tag=火车票及列车时刻
 ～～～～～～～～～～～～～～～～
 Surge 4.0 :
 [Script]
 火车票及列车时刻 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js,script-update-interval=0

 ～～～～～～～～～～～～～～～～～
 Loon 2.1.0+
 [Script]
 cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js, enabled=true, tag=火车票及列车时刻

 -----------------

 */

const $ = new Env('列车时刻查询');

//出发地
let leftstation = $.getdata('left') || '北京';

// 目的地
let tostation = $.getdata('end') || '上海';

//乘客类型，'ADULT'是成人，'0X00'是学生
let purpose = $.getdata('people') || 'ADULT';

//出发日期
let leftdate = $.getdata('leavedate')||$.time('yyyy-MM-dd')

//车次序号或者列车车次!!
let K = $.getdata('setrain') || "1";

!(async() => {
    await namecheck();
    await timecheck();
    //await $.wait(500);
    await trainscheck();
    //await $.wait(500);
    await prize();
    //await traintime()
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


//站点编码
function namecheck() {
    return new Promise((resolve, reject) => {
        const stationnocheck = {
            url: `https://kyfw.12306.cn/otn/resources/js/framework/station_name.js`,
            method: 'GET',
        };
        $.get(stationnocheck, (err, resp, data) => {
            //console.log(resp.statusCode + "\n\n" + data);
            try {
                statno = data.split(`${leftstation}`)[1].split("|")[1];
                tostat = data.split(`${tostation}`)[1].split("|")[1]
            } catch (e) {
                $.logErr(e, data);
            } finally {
                resolve()
            }
        })
    })
}

function timecheck() {
    let nowDate = $.time('yyyy-MM-dd');
    if (nowDate > leftdate) {
        leftdate = $.time("yyyy-MM-dd",new Date().setDate(new Date().getDate()+1));
        $.log("设置出行日期已过，将自动把出行日期改为明天")
    }
}

// 获取车次列表
function trainscheck() {
    return new Promise((resolve, reject) => {
        const myRequest = {
            url: `https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=${leftdate}&leftTicketDTO.from_station=${statno}&leftTicketDTO.to_station=${tostat}&purpose_codes=${purpose}`,
            headers: {
                Cookie: 'JSESSIONID=E3CCA5C6ECC49AFFE24D4FE48C8A8949;',
                'Referer': 'https://kyfw.12306.cn/otn/leftTicket/init'
            }
        };
        $.get(myRequest, (err, resp, data) => {
            //console.log('余票信息' + "\n\n" + data);
            try {
                ress = JSON.parse(data);
                let reg = /^[a-zA-Z][0-9]+$/;
                for (i = 0; i < ress.data.result.length; i++) {
                    yupiaoinfo = ress.data.result[i].split("|");
                    train = yupiaoinfo[3];
                    hours = yupiaoinfo[10].split(":")[0]
                    if (train && hours != 99) {
                        starttime = yupiaoinfo[8],
                            arrivetime = yupiaoinfo[9];
                        total = yupiaoinfo[10].split(":")[0] + '小时' + yupiaoinfo[10].split(":")[1] + '分钟',
                            yingzuo = yupiaoinfo[29] ? ' 硬座:' + yupiaoinfo[29] : "",
                            yingwo = yupiaoinfo[28] ? " 硬卧:" + yupiaoinfo[28] : "",
                            ruanwo = yupiaoinfo[23] ? " 软卧:" + yupiaoinfo[23] : "",
                            yideng = yupiaoinfo[31] ? ' 一等座:' + yupiaoinfo[31] : "",
                            erdeng = yupiaoinfo[30] ? ' 二等座:' + yupiaoinfo[30] : "",
                            wuzuo = yupiaoinfo[26] ? ' 无座:' + yupiaoinfo[26] : ""
                        dongwo = yupiaoinfo[33] ? ' 动卧:' + yupiaoinfo[33] : ""
                        ruanwopro = yupiaoinfo[21] ? ' 豪华软卧:' + yupiaoinfo[21] : ""
                    }
                    trainlist = '[' + (i + 1) + '] 车次:' + train + " " + starttime + "--" + arrivetime + " 总计时间:" + total + ' 出发站:'+ ress.data.map[`${yupiaoinfo[6]}`]+ yideng + erdeng + yingwo + ruanwo + yingzuo + wuzuo + dongwo +ruanwopro+ '\n'
                    //trainno = ress.data.result[i].split("|")[2]
                    $.log(trainlist);
                    if (reg.test(K) && K == ress.data.result[i].split("|")[3]) {
                        K = i + 1
                    }
                };
                if (K <= ress.data.result.length) {
                    info = ress.data.result[K - 1].split("|");
                    leaves = info[6];//离开车站代码
                    traincode = info[3];
                    //列车车次
                    if (info.indexOf("列车停运") > -1) {
                        $.msg($.name, traincode + "车次于" + leftdate + "已停运", "请选择其他车次")
                        $done()
                    };
                    if (info.indexOf("IS_TIME_NOT_BUY") > -1) {
                        $.log("您选的" + traincode + "车次出行日期不在购买时间段，请选择其他车次或者调整出行日期‼️\n")
                    }
                    trainno = info[2],
                        //列车编码
                        fromstationno = info[16],
                        //发车站序号
                        tostationno = info[17],
                        //目的地序号
                        fromstation = info[4],
                        //始发站编码
                        endstation = info[5],
                        //终点站编码
                        leftstationcode = info[6],
                        //出发站编码
                        tostationcode = info[7],
                        //目的地编码
                        seattypes = info[35],
                        //座席代码
                        totaltime = info[10].split(":")[0] + '小时' + info[10].split(":")[1] + '分钟';
                    //运行时间
                } else if (!reg.test(K) && K > ress.data.result.length) {
                    var trainlist = "";
                    for (y = 0; y < ress.data.result.length; y++) {
                        trainlist += (y + 1) + '. ' + ress.data.result[y].split("|")[3] + " " + ress.data.result[y].split("|")[8] + "-" + ress.data.result[y].split("|")[9] + " 历时" + ress.data.result[y].split("|")[10].split(":")[0] + '时' + ress.data.result[y].split("|")[10].split(":")[1] + '分\n'
                    }
                    $.msg(`火车查询错误❌`, "共" + ress.data.result.length + "辆列车经过,请检查后重试", trainlist);
                    return
                }
            } catch (e) {
                $.msg(`火车查询错误❌`, "无此方向列车经过,请检查后重试", e);
                return
            } finally {
                resolve()
            }
        })
    })
}

function prize() {
    return new Promise((resolve, reject) => {
        const prizeurl = {
            url: `https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?train_no=${trainno}&from_station_no=${fromstationno}&to_station_no=${tostationno}&seat_types=${seattypes}&train_date=${leftdate}`,
            headers: {
                Cookie: 'JSESSIONID=E3CCA5C6ECC49AFFE24D4FE48C8A8949;',
                'Referer': 'https://kyfw.12306.cn/otn/leftTicket/init'
            }
        }
        $.get(prizeurl, async(err, resp, data) => {
            console.log('票价信息: 响应码: ' + resp.statusCode + " \n" + data + '\n');
            try {
                if (data == -1) {
                    $.msg('列车查询失败‼️', '该' + traincode + '次列车车票暂停发售或者查询失败,请重试', err);
                    return
                }
                let obj = JSON.parse(data).data
                var seatinfo = "";
                for (arr in obj) {
                    if (obj[arr].indexOf("¥") > -1) {
                        seatinfo += mapSeat(arr)[0] + ": " + (mapSeat(arr)[1] ? mapSeat(arr)[1] : "") + "(" + obj[arr] + ")  ";
                        if (seatinfo.indexOf("[]")>-1){
                            continue
                        }
                        if ((seatinfo.split("¥").length-1) % 2 == 0 && data.split("¥").length !== seatinfo.split("¥").length) {
                            seatinfo += "\n"
                        }
                    }
                }
                await traintime(seatinfo)
            } catch (e) {
                $.logErr(e);
            } finally {
                resolve()
            }
        })
    })
}

function mapSeat(seat) {
    const map = {
        "M": ["一等座", info[31]],
        "O": ["二等座", info[30]],
        "A1": ["硬座", info[29]],
        "A2": ["软座", info[24]],
        "A3": ["硬卧", info[28]],
        "AJ": ["二等卧", info[28]],
        "A4": ["软卧", info[23]],
        "AI": ["一等卧", info[23]],
        "A6": ["豪华软卧", info[21]],
        "A9": ["商务座", info[32]],
        "P": ["特等座", info[32]],
        "F": ["动卧", info[33]],
        "WZ": ["无座", info[26]]
    }
    return map[seat]
}

function traintime(seatinfo) {
    return new Promise((resolve, reject) => {
        const myRequest = {
            url: `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${trainno}&from_station_telecode=${fromstation}&to_station_telecode=${endstation}&depart_date=${leftdate}`,
            method: 'GET',
        }
        $.get(myRequest, (err, resp, data) => {
            var detail = ""
            //console.log(resp.statusCode + "\n\n" + data);
            let result = JSON.parse(data)
            if (result.status == true) {
                const traincode = result.data.data[0].station_train_code
                const arrivetime = result.data.data[0].arrive_time,
                    starttime = result.data.data[0].start_time,
                    stationname = result.data.data[0].station_name,
                    startstation = result.data.data[0].start_station_name,
                    edstation = result.data.data[0].end_station_name;

                if (purpose == '0X00') {
                    purpose = '学生票'
                } else {
                    purpose = '成人票'
                }
                if (seatinfo) {
                    detail = seatinfo + "\n" + ress.data.map[leaves] + '到达目的地' + tostation + '历时' + totaltime + '\n' + arrivetime + '--' + starttime + '  ' + stationname
                }
                for (i = 1; i < result.data.data.length; i++) {
                    detail += '\n' + result.data.data[i].arrive_time + '--' + result.data.data[i].start_time + '  ' + result.data.data[i].station_name
                }
                const openurl = encodeURI(`https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${leftstation},${leftstationcode}&ts=${tostation},${tostationcode}&date=${leftdate}&flag=N,N,Y`)
                const title = traincode + "次列车"
                const subTitle = '始发站: ' + startstation + '--终点站: ' + edstation + ' (' + purpose + ')'
                $.msg(title + " - 出行日期: " + leftdate, subTitle, detail, {
                    "open-url": `${openurl}`
                })
                //console.log(traincode+'次列车  \n'+detail)
            }
            resolve()
        })
    })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:i,...r}=t;this.got[s](i,r).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}