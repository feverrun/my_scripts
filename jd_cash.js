/*
签到领现金，每日2毛～5毛
动物园版本的sign
活动入口：京东APP搜索领现金进入
更新时间：2021-06-07
#签到领现金
无需指定定时，每天运行一次即可
 */
const $ = new Env('签到领现金');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', message, allMessage = '';

const JD_API_HOST = 'https://api.m.jd.com/client.action';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
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

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }

      await jdCash()
      await $.wait(parseInt(Math.random()*10000, 10));
    }
  }
  if (allMessage) {
    if ($.isNode() && (process.env.CASH_NOTIFY_CONTROL ? process.env.CASH_NOTIFY_CONTROL === 'false' : !!1)) await notify.sendNotify($.name, allMessage);
    $.msg($.name, '', allMessage);
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function jdCash() {
  $.signMoney = 0;

  // await cash_mob_sign();
  // await cash_mob_home();

  await cash_homePage()
  await $.wait(parseInt(Math.random()*1000+1000, 10));
  $.exchangeBeanNum = 0;
  await cash_homePage(true)
  await $.wait(parseInt(Math.random()*1000+1000, 10));
}

//签到
function cash_mob_sign() {
  return new Promise((resolve) => {
    $.get(taskUrl("cash_mob_sign", { "breakReward": 1 }), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`cash_mob_sign API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            //调试
            // console.log(`mob_sign:${data}`);
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              console.log(`签到${data.data.bizMsg}`)
            } else {
              console.log(data.data.bizMsg)
            }
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
function cash_mob_home() {
  return new Promise((resolve) => {
    $.get(taskUrl("cash_mob_home"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
          await $.wait(5000)
        } else {
          if (safeGet(data)) {
            //调试
            // console.log(`cash_mob_home:${data}`);
            data = JSON.parse(data);
            if (data.code === 0 && data.data.result) {
              for (let task of data.data.result.taskInfos) {
                if (task.type === 4) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i+1}/${task.times}`)
                    await doTask(task.type, task.jump.params.skuId)
                    await $.wait(5000)
                  }
                } else if (task.type === 2) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i+1}/${task.times}`)
                    await doTask(task.type, task.jump.params.shopId)
                    await $.wait(5000)
                  }
                } else if (task.type === 31) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i+1}/${task.times}`)
                    await doTask(task.type, task.jump.params.path)
                    await $.wait(5000)
                  }
                } else if (task.type === 16 || task.type===3 || task.type===5 || task.type===17 || task.type===21) {
                  for (let i = task.doTimes; i < task.times; ++i) {
                    console.log(`去做${task.name}任务 ${i+1}/${task.times}`)
                    await doTask(task.type, task.jump.params.url)
                    await $.wait(5000)
                  }
                }
              }
            }
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

//
//
//

function apptaskUrl(functionId = "", body = "") {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}`,
    body,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': '',
      'User-Agent': 'JD4iPhone/167774 (iPhone; iOS 14.7.1; Scale/3.00)',
      'Accept-Language': 'zh-Hans-CN;q=1',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
function taskUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}&body=${encodeURIComponent(JSON.stringify(body))}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
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

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxe313c=["\x63\x61\x73\x68\x5F\x68\x6F\x6D\x65\x50\x61\x67\x65","\x77\x61\x69\x74","","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x6C\x6F\x67","\x6E\x61\x6D\x65","\x20\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x72\x65\x73\x75\x6C\x74","\x64\x61\x74\x61","\u5F53\u524D\u73B0\u91D1\uFF1A","\x74\x6F\x74\x61\x6C\x4D\x6F\x6E\x65\x79","\u5143","\u4EAC\u4E1C\u8D26\u53F7","\x69\x6E\x64\x65\x78","\x6E\x69\x63\x6B\x4E\x61\x6D\x65","\x5C\x6E","\x6C\x65\x6E\x67\x74\x68","\x0A\x0A","\x73\x69\x67\x6E\x4D\x6F\x6E\x65\x79","\u3010\u4EAC\u4E1C\u8D26\u53F7","\uFF08","\x55\x73\x65\x72\x4E\x61\x6D\x65","\uFF09\u7684","\u597D\u53CB\u4E92\u52A9\u7801\u3011","\x69\x6E\x76\x69\x74\x65\x64\x43\x6F\x64\x65","\x73\x68\x61\x72\x65\x44\x61\x74\x65","\x74\x61\x73\x6B\x49\x6E\x66\x6F\x73","\x74\x79\x70\x65","\x64\x6F\x54\x69\x6D\x65\x73","\x74\x69\x6D\x65\x73","\u53BB\u505A","\u4EFB\u52A1\x20","\x2F","\x73\x6B\x75\x49\x64","\x70\x61\x72\x61\x6D\x73","\x6A\x75\x6D\x70","\x73\x68\x6F\x70\x49\x64","\x70\x61\x74\x68","\x75\x72\x6C","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x63\x61\x73\x68\x5F\x64\x6F\x54\x61\x73\x6B","\u4EFB\u52A1\u5B8C\u6210\u6210\u529F","\x67\x65\x74","\x68\x74\x74\x70\x3A\x2F\x2F\x68\x7A\x2E\x66\x65\x76\x65\x72\x72\x75\x6E\x2E\x74\x6F\x70\x3A\x39\x39\x2F\x73\x68\x61\x72\x65\x2F\x73\x69\x67\x6E\x2F\x67\x65\x74\x53\x69\x67\x6E","\x66\x6E\x3D","\x26\x62\x6F\x64\x79\x3D","\x26\x74\x79\x70\x65\x3D","\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x33\x5F\x32\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x56\x65\x72\x73\x69\x6F\x6E\x2F\x31\x33\x2E\x30\x2E\x33\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x20\x53\x61\x66\x61\x72\x69\x2F\x36\x30\x34\x2E\x31\x20\x45\x64\x67\x2F\x38\x37\x2E\x30\x2E\x34\x32\x38\x30\x2E\x38\x38","\x20\x67\x65\x74\x53\x69\x67\x6E\x20\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];async function cash_homePage(_0x3e7dx2= false){let _0x3e7dx3=__Oxe313c[0x0];let _0x3e7dx4={}; await $[__Oxe313c[0x1]](500);let _0x3e7dx5= await getSign(_0x3e7dx3,_0x3e7dx4,111);return  new Promise((_0x3e7dx6)=>{$[__Oxe313c[0x2a]](apptaskUrl(_0x3e7dx3,_0x3e7dx5),async (_0x3e7dx7,_0x3e7dx8,_0x3e7dx9)=>{try{if(_0x3e7dx7){console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${JSON[__Oxe313c[0x3]](_0x3e7dx7)}${__Oxe313c[0x2]}`);console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${$[__Oxe313c[0x5]]}${__Oxe313c[0x6]}`); await $[__Oxe313c[0x1]](5000)}else {if(safeGet(_0x3e7dx9)){_0x3e7dx9= JSON[__Oxe313c[0x7]](_0x3e7dx9);if(_0x3e7dx9[__Oxe313c[0x8]]=== 0&& _0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]]){if(_0x3e7dx2){if(message){message+= `${__Oxe313c[0xb]}${_0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0xc]]}${__Oxe313c[0xd]}`;allMessage+= `${__Oxe313c[0xe]}${$[__Oxe313c[0xf]]}${__Oxe313c[0x2]}${$[__Oxe313c[0x10]]}${__Oxe313c[0x11]}${message}${__Oxe313c[0x2]}${$[__Oxe313c[0xf]]!== cookiesArr[__Oxe313c[0x12]]?__Oxe313c[0x13]:__Oxe313c[0x2]}${__Oxe313c[0x2]}`};console[__Oxe313c[0x4]](`${__Oxe313c[0xb]}${_0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0xc]]}${__Oxe313c[0xd]}`);return};$[__Oxe313c[0x14]]= _0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0xc]];console[__Oxe313c[0x4]](`${__Oxe313c[0x15]}${$[__Oxe313c[0xf]]}${__Oxe313c[0x16]}${$[__Oxe313c[0x17]]}${__Oxe313c[0x18]}${$[__Oxe313c[0x5]]}${__Oxe313c[0x19]}${_0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0x1a]]}${__Oxe313c[0x2]}`);let _0x3e7dxa={'\x69\x6E\x76\x69\x74\x65\x43\x6F\x64\x65':_0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0x1a]],'\x73\x68\x61\x72\x65\x44\x61\x74\x65':_0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0x1b]]};$[__Oxe313c[0x1b]]= _0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0x1b]];for(let _0x3e7dxb of _0x3e7dx9[__Oxe313c[0xa]][__Oxe313c[0x9]][__Oxe313c[0x1c]]){if(_0x3e7dxb[__Oxe313c[0x1d]]=== 4){for(let _0x3e7dxc=_0x3e7dxb[__Oxe313c[0x1e]];_0x3e7dxc< _0x3e7dxb[__Oxe313c[0x1f]];++_0x3e7dxc){console[__Oxe313c[0x4]](`${__Oxe313c[0x20]}${_0x3e7dxb[__Oxe313c[0x5]]}${__Oxe313c[0x21]}${_0x3e7dxc+ 1}${__Oxe313c[0x22]}${_0x3e7dxb[__Oxe313c[0x1f]]}${__Oxe313c[0x2]}`); await appdoTask(_0x3e7dxb[__Oxe313c[0x1d]],_0x3e7dxb[__Oxe313c[0x25]][__Oxe313c[0x24]][__Oxe313c[0x23]]); await $[__Oxe313c[0x1]](5000)}}else {if(_0x3e7dxb[__Oxe313c[0x1d]]=== 2){for(let _0x3e7dxc=_0x3e7dxb[__Oxe313c[0x1e]];_0x3e7dxc< _0x3e7dxb[__Oxe313c[0x1f]];++_0x3e7dxc){console[__Oxe313c[0x4]](`${__Oxe313c[0x20]}${_0x3e7dxb[__Oxe313c[0x5]]}${__Oxe313c[0x21]}${_0x3e7dxc+ 1}${__Oxe313c[0x22]}${_0x3e7dxb[__Oxe313c[0x1f]]}${__Oxe313c[0x2]}`); await appdoTask(_0x3e7dxb[__Oxe313c[0x1d]],_0x3e7dxb[__Oxe313c[0x25]][__Oxe313c[0x24]][__Oxe313c[0x26]]); await $[__Oxe313c[0x1]](5000)}}else {if(_0x3e7dxb[__Oxe313c[0x1d]]=== 30){for(let _0x3e7dxc=_0x3e7dxb[__Oxe313c[0x1e]];_0x3e7dxc< _0x3e7dxb[__Oxe313c[0x1f]];++_0x3e7dxc){console[__Oxe313c[0x4]](`${__Oxe313c[0x20]}${_0x3e7dxb[__Oxe313c[0x5]]}${__Oxe313c[0x21]}${_0x3e7dxc+ 1}${__Oxe313c[0x22]}${_0x3e7dxb[__Oxe313c[0x1f]]}${__Oxe313c[0x2]}`); await appdoTask(_0x3e7dxb[__Oxe313c[0x1d]],_0x3e7dxb[__Oxe313c[0x25]][__Oxe313c[0x24]][__Oxe313c[0x27]]); await $[__Oxe313c[0x1]](5000)}}else {if(_0x3e7dxb[__Oxe313c[0x1d]]=== 16|| _0x3e7dxb[__Oxe313c[0x1d]]=== 3|| _0x3e7dxb[__Oxe313c[0x1d]]=== 5|| _0x3e7dxb[__Oxe313c[0x1d]]=== 17|| _0x3e7dxb[__Oxe313c[0x1d]]=== 21){for(let _0x3e7dxc=_0x3e7dxb[__Oxe313c[0x1e]];_0x3e7dxc< _0x3e7dxb[__Oxe313c[0x1f]];++_0x3e7dxc){console[__Oxe313c[0x4]](`${__Oxe313c[0x20]}${_0x3e7dxb[__Oxe313c[0x5]]}${__Oxe313c[0x21]}${_0x3e7dxc+ 1}${__Oxe313c[0x22]}${_0x3e7dxb[__Oxe313c[0x1f]]}${__Oxe313c[0x2]}`); await appdoTask(_0x3e7dxb[__Oxe313c[0x1d]],_0x3e7dxb[__Oxe313c[0x25]][__Oxe313c[0x24]][__Oxe313c[0x28]]); await $[__Oxe313c[0x1]](5000)}}}}}}}}}}catch(e){$[__Oxe313c[0x29]](e,_0x3e7dx8)}finally{_0x3e7dx6(_0x3e7dx9)}})})}async function appdoTask(_0x3e7dxe,_0x3e7dxf){let _0x3e7dx3=__Oxe313c[0x2b];let _0x3e7dx4={"\x74\x79\x70\x65":_0x3e7dxe,"\x74\x61\x73\x6B\x49\x6E\x66\x6F":_0x3e7dxf}; await $[__Oxe313c[0x1]](500);let _0x3e7dx5= await getSign(_0x3e7dx3,_0x3e7dx4,_0x3e7dxe);return  new Promise((_0x3e7dx6)=>{$[__Oxe313c[0x2a]](apptaskUrl(_0x3e7dx3,_0x3e7dx5),(_0x3e7dx7,_0x3e7dx8,_0x3e7dx9)=>{try{if(_0x3e7dx7){console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${JSON[__Oxe313c[0x3]](_0x3e7dx7)}${__Oxe313c[0x2]}`);console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${$[__Oxe313c[0x5]]}${__Oxe313c[0x6]}`)}else {if(safeGet(_0x3e7dx9)){_0x3e7dx9= JSON[__Oxe313c[0x7]](_0x3e7dx9);if(_0x3e7dx9[__Oxe313c[0x8]]=== 0){console[__Oxe313c[0x4]](`${__Oxe313c[0x2c]}`)}else {console[__Oxe313c[0x4]](JSON[__Oxe313c[0x3]](_0x3e7dx9))}}}}catch(e){$[__Oxe313c[0x29]](e,_0x3e7dx8)}finally{_0x3e7dx6(_0x3e7dx9)}})})}function doTask(_0x3e7dxe,_0x3e7dxf){return  new Promise((_0x3e7dx6)=>{$[__Oxe313c[0x2d]](taskUrl(__Oxe313c[0x2b],{"\x74\x79\x70\x65":_0x3e7dxe,"\x74\x61\x73\x6B\x49\x6E\x66\x6F":_0x3e7dxf}),(_0x3e7dx7,_0x3e7dx8,_0x3e7dx9)=>{try{if(_0x3e7dx7){console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${JSON[__Oxe313c[0x3]](_0x3e7dx7)}${__Oxe313c[0x2]}`);console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${$[__Oxe313c[0x5]]}${__Oxe313c[0x6]}`)}else {if(safeGet(_0x3e7dx9)){_0x3e7dx9= JSON[__Oxe313c[0x7]](_0x3e7dx9);if(_0x3e7dx9[__Oxe313c[0x8]]=== 0){console[__Oxe313c[0x4]](`${__Oxe313c[0x2c]}`)}else {console[__Oxe313c[0x4]](_0x3e7dx9)}}}}catch(e){$[__Oxe313c[0x29]](e,_0x3e7dx8)}finally{_0x3e7dx6(_0x3e7dx9)}})})}function getSign(_0x3e7dx3,_0x3e7dx4,_0x3e7dxe){return  new Promise(async (_0x3e7dx6)=>{let _0x3e7dx12={url:`${__Oxe313c[0x2e]}`,body:`${__Oxe313c[0x2f]}${_0x3e7dx3}${__Oxe313c[0x30]}${JSON[__Oxe313c[0x3]](_0x3e7dx4)}${__Oxe313c[0x31]}${_0x3e7dxe}${__Oxe313c[0x2]}`,headers:{"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":__Oxe313c[0x32]},timeout:30* 1000};$[__Oxe313c[0x2a]](_0x3e7dx12,(_0x3e7dx7,_0x3e7dx8,_0x3e7dx9)=>{try{if(_0x3e7dx7){console[__Oxe313c[0x4]](JSON[__Oxe313c[0x3]](_0x3e7dx7));console[__Oxe313c[0x4]](`${__Oxe313c[0x2]}${$[__Oxe313c[0x5]]}${__Oxe313c[0x33]}`)}else {_0x3e7dx9= JSON[__Oxe313c[0x7]](_0x3e7dx9);if(_0x3e7dx9[__Oxe313c[0x8]]== 0){_0x3e7dx9= _0x3e7dx9[__Oxe313c[0xa]]}}}catch(e){$[__Oxe313c[0x29]](e,_0x3e7dx8)}finally{_0x3e7dx6(_0x3e7dx9)}})})}(function(_0x3e7dx13,_0x3e7dx14,_0x3e7dx15,_0x3e7dx16,_0x3e7dx17,_0x3e7dx18){_0x3e7dx18= __Oxe313c[0x34];_0x3e7dx16= function(_0x3e7dx19){if( typeof alert!== _0x3e7dx18){alert(_0x3e7dx19)};if( typeof console!== _0x3e7dx18){console[__Oxe313c[0x4]](_0x3e7dx19)}};_0x3e7dx15= function(_0x3e7dx1a,_0x3e7dx13){return _0x3e7dx1a+ _0x3e7dx13};_0x3e7dx17= _0x3e7dx15(__Oxe313c[0x35],_0x3e7dx15(_0x3e7dx15(__Oxe313c[0x36],__Oxe313c[0x37]),__Oxe313c[0x38]));try{_0x3e7dx13= __encode;if(!( typeof _0x3e7dx13!== _0x3e7dx18&& _0x3e7dx13=== _0x3e7dx15(__Oxe313c[0x39],__Oxe313c[0x3a]))){_0x3e7dx16(_0x3e7dx17)}}catch(e){_0x3e7dx16(_0x3e7dx17)}})({})
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}