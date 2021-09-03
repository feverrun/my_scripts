const version = "0.0.0.2";
const path1 = "serverConfig";
const path2 = "wareBusiness";
const path3 = "basicConfig";
const url = $request.url;
const body = $response.body;
let now = 0;
const $ = new Env("京东比价");

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

if (url.indexOf(path1) !== -1) {
    let obj = JSON.parse(body);
    delete obj.serverConfig.httpdns;
    delete obj.serverConfig.dnsvip;
    delete obj.serverConfig.dnsvip_v6;
    $.done({body: JSON.stringify(obj)});
}

if (url.indexOf(path3) !== -1) {
    let obj = JSON.parse(body);
    let JDHttpToolKit = obj.data.JDHttpToolKit;
    if (JDHttpToolKit) {
        delete obj.data.JDHttpToolKit.httpdns;
        delete obj.data.JDHttpToolKit.dnsvipV6;
    }
    $.done({body: JSON.stringify(obj)});
}

if (url.indexOf(path2) !== -1) {
    if (Math.ceil(Math.random() * 4) === 1) {
        $.get({url: "https://raw.githubusercontent.com/feverrun/jd_price/main/version.log", timeout:3000}, (err, resp, data) => {
            if(!err){
                try{
                    let latest = data.split('\n')[0]
                    let msg = data.split('\n')[1]
                    if (version !== latest) {
                        $.msg('请更新！', `最新：${latest}  feverrun`, `更新内容：${msg}`)
                        $.done({body});
                        return false
                    } else {
                        showHistory()
                    }
                }catch(e){
                    $.logErr(e, resp)
                }finally{}
            }
        })
    } else {
        showHistory()
    }
}

function showHistory() {
    let obj = JSON.parse(body);
    const floors = obj.floors;
    const commodity_info = floors[floors.length - 1];
    const shareUrl = commodity_info.data.property.shareUrl;
    // 当前价格
    if (commodity_info.data.otherUseBannerInfo)
        now = parseInt(commodity_info.data.otherUseBannerInfo.bannerPrice.replace('¥', ''));
    else
        now = parseInt(commodity_info.data.priceInfo.jprice)
    request_history_price(shareUrl, data => {
        if (data) {
            const lowerword = adword_obj();
            lowerword.data.ad.textColor = "#fe0000";
            let bestIndex = 0;
            for (let index = 0; index < floors.length; index++) {
                const element = floors[index];
                if (element.mId === lowerword.mId) {
                    bestIndex = index + 1;
                    break;
                } else {
                    if (element.sortId > lowerword.sortId) {
                        bestIndex = index;
                        break;
                    }
                }
            }

            // 成功
            if (data.ok === 1) {
                lowerword.data.ad.adword = data.text;
                floors.insert(bestIndex, lowerword);
            }

            // 失败
            if (data.ok === 0) {
                lowerword.data.ad.adword = "⚠️ " + "失败！";
                floors.insert(bestIndex, lowerword);
            }
            $.done({body: JSON.stringify(obj)});
        } else {
            $.done({body});
        }
    })
}

function request_history_price(share_url, callback) {
    let id = share_url.match(/product\/(.*)\./)[1];
    const option = {
        url: `https://browser.bijiago.com/extension/price_towards?dp_ids=undefined&dp_id=${id}-3&ver=1&format=jsonp&union=union_bijiago&version=1594190525099&from_device=bijiago&from_type=bjg_ser&crc64=1&_=${new Date().getTime()}`,
        headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            'Accept': '*/*',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Dest': 'script',
            'Referer': 'https://item.jd.com/',
            'Accept-Language': 'zh-CN,zh;q=0.9'
        },
        timeout: 3000
    };
    $.get(option, (err, resp, data) => {
        if (err) {
            console.log(err);
            $.msg("ERROR", '出错', err);
            callback(null, null);
        }

        data = JSON.parse(data)
        let Jun18 = 0, Nov11 = 0;
        let price30 = {price: 99999999, text: ""};
        let promo = data['promo'];
        let store = data['store'][1]

        let history = {
            max: Math.round(store['highest']),
            maxt: time(store['max_stamp'] * 1000),
            min: Math.round(store['lowest']),
            mint: time(parseInt(store['min_stamp']) * 1000)
        }

        for (let j of promo) {
            let stamp = j['time'] * 1000;
            let day = time(stamp).split(' ')[0];
            let price = Math.round(j['price'] / 100);
            day === '2021-06-18' ? Jun18 = price : ""
            day === '2020-11-11' ? Nov11 = price : ""
            if (dayDiff(day) < 31 && price <= price30.price) {
                price30.price = price;
                price30.text = day;
            }
        }
        // 去除99999999
        if (history.min === 99999999) history.min = '-';
        if (Jun18 === 0) Jun18 = '-'
        if (Nov11 === 0) Nov11 = '-'
        let arr = []
        arr.push({name: '当前价', price: now, date: '', diff: ''})
        arr.push({name: '最高价', price: history.max, date: history.maxt, diff: priceDiff(history.max)})
        arr.push({name: '最低价', price: history.min, date: history.mint, diff: priceDiff(history.min)})
        arr.push({name: '六一八', price: Jun18, date: "2021-06-18", diff: priceDiff(Jun18)})
        arr.push({name: '双十一', price: Nov11, date: "2020-11-11", diff: priceDiff(Nov11)})
        arr.push({name: '三十天', price: price30.price, date: price30.text, diff: priceDiff(price30.price)})
        let s = ''
        arr.forEach(item => {
            if (item.price === '-' || item.price === 0)
                s += `${item.name}${space('', 7)}-\n`
            else
                s += `${item.name}${space('', 6)}${item.price}${space(item.price, 8)}${item.date}${space(item.date, 14)}${item.diff}\n`;
        })
        callback({ok: 1, text: s});
    })
}

function adword_obj() {
    return {
        "bId": "eCustom_flo_199",
        "cf": {
            "bgc": "#ffffff",
            "spl": "empty"
        },
        "data": {
            "ad": {
                "adword": "",
                "textColor": "#8C8C8C",
                "color": "#f23030",
                "text-align": "justify",
                "word-break": "break-all",
                "newALContent": true,
                "hasFold": true,
                "class": "com.jd.app.server.warecoresoa.domain.AdWordInfo.AdWordInfo",
                "adLinkContent": "",
                "adLink": ""
            }
        },
        "mId": "bpAdword",
        "refId": "eAdword_0000000028",
        "sortId": 13
    }
}

function time(time = +new Date()) {
    let date = new Date(time + 8 * 3600 * 1000);
    return date.toJSON().substr(0, 19).replace('T', ' ').split(' ')[0].replace(/\./g, '-');
}

function dayDiff(date) {
    return parseInt((new Date() - new Date(date)) / (1000 * 60 * 60 * 24) + '')
}

function priceDiff(old) {
    if (typeof old !== 'number')
        return '-'
    let diff = old - now;
    if (diff === 0)
        return '-'
    return diff > 0 ? `↓${Math.round(diff)}` : `↑${Math.round(Math.abs(diff))}`;
}

function space(str, len) {
    let blank = "";
    for (let i = 0; i < len - (str + '').length; i++) {
        blank += " ";
    }
    return blank;
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
