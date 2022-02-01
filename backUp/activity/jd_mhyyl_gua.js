/*
京东手机狂欢城活动
活动时间: 2022-1-15至2022-2-6
活动入口：暂无 [活动地址](https://yearfestival.jd.com)

[task_local]
#京东手机狂欢城
12 21 31,1 1,2 * jd_mhyyl_gua.js, tag=京东手机狂欢城, enabled=true

*/
const $ = new Env('萌虎摇摇乐');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', message = '', allMessage = '';

let gua_carnivalcity_draw = "true"
gua_carnivalcity_draw = $.isNode() ? (process.env.gua_carnivalcity_draw ? process.env.gua_carnivalcity_draw : `${gua_carnivalcity_draw}`) : ($.getdata('gua_carnivalcity_draw') ? $.getdata('gua_carnivalcity_draw') : `${gua_carnivalcity_draw}`);
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
  if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0)
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let inviteCodes = [];
$.shareCodesArr = [];
const JD_API_HOST = 'https://api.m.jd.com/api';
const cardEndTime = '2022/01/31 08:00:00+08:00';//集卡结束时间
const activeEndTime = '2022/02/07 00:00:00+08:00';//活动结束时间
let nowTime = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  $.temp = [];
  if (nowTime > new Date(activeEndTime).getTime()) {
    //活动结束后弹窗提醒
    $.msg($.name, '活动已结束', `请删除此脚本\n咱江湖再见`);
    if ($.isNode()) await notify.sendNotify($.name + '活动已结束', `请删除此脚本\n咱江湖再见`);
    return
  }
  // await updateShareCodesCDN();
  // await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.beans = 0;//本次运行获得京豆数量
      $.blockAccount = false;//黑号
      message = '';
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      getUA()
      await run();
      // break
    }
  }
  if($.temp.length > 0 && true){
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        getUA()
        cookie = cookiesArr[i];
        $.index = i + 1;
        $.canHelp = true;//能否助力
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        if ((cookiesArr && cookiesArr.length >= 1) && $.canHelp) {
          console.log(`\n先自己账号内部相互邀请助力\n`);
          for (let item of $.temp) {
            console.log(`\n${$.UserName} 去参助力 ${item}`);
            const helpRes = await toHelp(item.trim(),0);
            if (helpRes.data.status === 5) {
              console.log(`助力机会已耗尽，跳出助力`);
              $.canHelp = false;
              break;
            }
          }
        }
        if ($.canHelp) {
          await shareCodesFormat();
          console.log(`\n\n如果有剩余助力机会，则给作者以及随机码助力`)
          await doHelp();
        }
      }
    }
  }
  if (allMessage) {
    if ($.isNode()) {
      await notify.sendNotify($.name, allMessage+"\n\n活动地址：https://yearfestival.jd.com");
      $.msg($.name, '', allMessage+"\n\n活动地址：https://yearfestival.jd.com", { url: "https://yearfestival.jd.com" });
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function run() {
  try {
    $.hotProductList = [];
    $.brandList = [];
    $.browseshopList = [];
    await indexInfo();
    // https://yearfestival.jd.com/#/?shareId=87f0464973334c0cb0921268e8d8c5a9
    await supportList();//助力情况
    await getHelp();//获取邀请码
    if ($.blockAccount) return
    if (nowTime <= new Date(cardEndTime).getTime()) {
      await getBrandTask();//做品牌手机任务
      await doBrandTask();//做品牌手机任务
      await indexInfo();
    }
    console.log(`剩余抽奖次数：${$.lotteryNum}\n`)
    $.headInfoFlag = true
    let s = 0
    do{
      await lottery();
      s++
      await $.wait(parseInt(Math.random() * 500 + 1000, 10))
    }while ($.headInfoFlag && s<$.lotteryNum)
    await cradList();
    if (nowTime >= new Date("2022/01/31 20:00:00+08:00").getTime()) {
      console.log('瓜分奖励')
      await receivePrize();
    }
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}

//做任务 API
function doBrowse(id = "", brandId = "", taskItemId = "") {
  $.browseId = ''
  return new Promise(resolve => {
    const body = {"taskGroupId":`${brandId}`,"taskId":`${id}`,"taskItemId":`${taskItemId}`};
    const options = taskPostUrl('/api/task/brand/doTask', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              $.browseId = res['data']['timeStamp'] || "";
            } else {
              console.log(`doTask异常：${data}`)
            }
          }else{
            console.log(`doTask异常：${data}`)
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
//领取奖励
function getBrowsePrize(id = "", brandId = "", taskItemId = "", timestamp = '') {
  return new Promise(resolve => {
    const body = {"taskGroupId":`${brandId}`,"taskId":`${id}`,"taskItemId":`${taskItemId}`,"timestamp": timestamp};
    const options = taskPostUrl('/api/task/brand/getReward', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`getReward 领取奖励 结果:${data}`);
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              if (res['data']['jbean']) $.beans += res['data']['jbean'];
            } else {
              console.log(`getReward异常：${data}`)
            }
          }else{
            console.log(`getReward异常：${data}`)
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

function getBrandTask() {
  const options = taskPostUrl(`/api/task/brand/tabs`, {})
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              $.brandList = res.data || []
            } else {
              console.log(`异常：${data}`)
            }
          }else{
            console.log(`异常：${data}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
async function doBrandTask() {
  for (let brand of $.brandList) {
    await brandTaskInfo(brand['taskGroupId']);
    let flag = true
    for (let sku of $.task.filter(vo => !!vo && vo['totalNum'] > vo['finishNum'])){
      if(flag) console.log(`\n开始做 品牌手机 【${brand['brandName']}】 任务`)
      if(flag) flag = false
      for(let i=0;i<sku['totalNum']-sku['finishNum'];i++){
        await brandTaskInfo(brand['taskGroupId']);
        for (let sku1 of $.task.filter(vo1 => !!vo1 && vo1['totalNum'] > vo1['finishNum'])){
          if(sku1['taskId'] == sku['taskId']){
            console.log(`开始浏览 ${sku1['taskItemName']}`);
            await doBrowse(sku1['taskId'], brand['taskGroupId'], sku1['taskItemId']);
            await $.wait(1000 * Number(sku['browseTime']) + parseInt(Math.random() * 1000 + 200, 10));
            await getBrowsePrize(sku1['taskId'], brand['taskGroupId'], sku1['taskItemId'],$.browseId);
          }
        }

      }
    }
  }
}
function brandTaskInfo(brandId) {
  const body = {"taskGroupId":`${brandId}`};
  const options = taskPostUrl('/api/task/brand/getTaskList', body)
  $.task = [];
  $.skuTask = [];
  $.shopTask = [];
  $.meetingTask = [];
  $.questionTask = {};
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = $.toObj(data,data);
          if (data.code === 200) {
            $.task = data['data'] || [];
          } else {
            console.log(`失败：${JSON.stringify(data)}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  });
}
function indexInfo(flag = false) {
  const options = taskPostUrl(`/api/index/indexInfo`, {})
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              $.lotteryNum = res.data.lotteryNum || 0 // 抽奖次数
              $.heatOwn = res.data.heatOwn || 0 // 福气值
              $.heatConsume = res.data.heatConsume || 0 // 每次抽奖消耗
              $.cardNum = res.data.cardNum || 0 // 卡片数量
            } else {
              console.log(`异常：${data}`)
              if (res.code === 1002 || res.code === 1001) $.blockAccount = true;
            }
          }else{
            console.log(`异常：${data}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
function cradList() {
  const options = taskPostUrl(`/api/card/list`, {})
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              console.log('我的福卡')
              let msg = []
              for(let i of res['data']['cardList'] || []){
                if(i.cardId != 1 && i.count == 0){
                  msg.push(i.cardName)
                }
                console.log(`${i.cardName}:${i.count}`)
              }
              if(msg.length > 0){
                msg = "缺少:"+msg.join('、')
              }
              message += `开奖后您可参与${res['data']['carveUpMultiple']}倍瓜分\n${msg && msg+"\n" || ""}`
              console.log(`开奖后您可参与${res['data']['carveUpMultiple']}倍瓜分\n${msg && msg+"\n" || ""}`)
            } else {
              console.log(`异常：${data}`)
              if (res.code === 1002 || res.code === 1001) $.blockAccount = true;
            }
          }else{
            console.log(`异常：${data}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
function receivePrize() {
  const options = taskPostUrl(`/api/carveUp/receivePrize`, {})
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              if(res.data.jdNums > 0){
                console.log(`开奖获得:${res.data.jdNums}京豆`);
                $.beans += Number(res.data.jdNums) || 0;
              }else if(res.data.status == 2){
                console.log(`还没到瓜分时间`);
              }else{
                console.log(`瓜分失败\n${data}`);
              }
            } else {
              console.log(`异常：${data}`)
              if (res.code === 1002 || res.code === 1001) $.blockAccount = true;
            }
          }else{
            console.log(`异常：${data}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
//获取助力信息
function supportList() {
  const options = taskPostUrl('/api/task/support/list', {})
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              console.log(`助力情况：${res['data']['supportedNum']}/${res['data']['supportNeedNum']}`);
              message += `邀请好友助力：${res['data']['supportedNum']}/${res['data']['supportNeedNum']}\n`
            }
          }else{
            console.log(`助力详情异常：${data}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
//积分抽奖
function lottery() {
  const options = taskPostUrl('/api/lottery/lottery', {})
  return new Promise( (resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data) {
              if (![2,3,98,99].includes(res.data.prizeType)) {
                console.log(data)
                //已中奖
                const url = 'https://yearfestival.jd.com/#/record';
                console.log(`抽奖获得:${res.data.prizeName}`);
                message += `抽奖获得：${res.data.prizeName}\n`;
                $.msg($.name, '', `京东账号 ${$.index} ${$.nickName || $.UserName}\n抽奖获得：${res.data.prizeName}\n兑换地址：${url}`, { 'open-url': url });
                if ($.isNode()) await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName || $.UserName}\n抽奖获得：${res.data.prizeName}\n兑换地址：${url}`);
              } else if (res.data.prizeType == 2){
                console.log(`抽奖获得:${res.data.prizeCount}${res.data.prizeName}`);
                $.beans += Number(res.data.prizeCount) || 0;
              } else {
                console.log(`抽奖结果:${res.data.prizeName}`);
              }
            }
          }else{
            console.log(`抽奖异常：${data}`)
            $.headInfoFlag = false
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
async function doHelp() {
  console.log(`\n开始助力好友`);
  for (let i in $.newShareCodes) {
    let item = $.newShareCodes[i]
    if (!item) continue;
    const helpRes = await toHelp(item.trim(),1);
    if (typeof helpRes === 'object') {
      if (helpRes.data.status === 7) {
        console.log(`该助力码[${item}]助力成功`);
      }else if (helpRes.data.status === 5) {
        console.log(`助力机会已耗尽，跳出助力`);
        break;
      }else if (helpRes.data.status === 4){
        console.log(`该助力码[${item}]已达上限`);
        $.newShareCodes[i] = ''
      }else if (helpRes.data.status === 3){
        console.log(`已经助力过`);
      }else if (helpRes.data.status === 2){
        console.log(`该助力码[${item}]过期`);
        $.newShareCodes[i] = ''
      }else if (helpRes.data.status === 1){
        console.log(`不能助力自己`);
      }else if (helpRes.msg.indexOf('请求参数不合规') > -1){
        console.log(`该助力码[${item}]助力码有问题`)
        $.newShareCodes[i] = ''
      }else if (helpRes.msg.indexOf('未登录') > -1 || helpRes.msg.indexOf('火爆') > -1){
        console.log(`${helpRes.msg}，跳出助力`)
        break;
      }else{
        console.log(`该助力码[${item}]助力结果\n${$.toStr(helpRes)}`)
      }
    }else{
      console.log(`该助力码[${item}]助力结果\n${$.toStr(helpRes)}`)
    }
  }
}
//助力API
function toHelp(code = "",type = 0) {
  if(!code) return
  return new Promise(resolve => {
    const body = {"shareId":`${code}`};
    const options = taskPostUrl('/api/task/support/doSupport', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(`助力结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if(type == 0){
              if (data.data.status === 7) {
                console.log(`助力成功`);
              }else if (data.data.status === 5) {
                console.log(`助力机会已耗尽，跳出助力`);
              }else if (data.data.status === 4){
                console.log(`已达上限`);
                $.newShareCodes[i] = ''
              }else if (data.data.status === 3){
                console.log(`已经助力过`);
              }else if (data.data.status === 2){
                console.log(`助力码过期`);
                $.newShareCodes[i] = ''
              }else if (data.data.status === 1){
                console.log(`不能助力自己`);
              }else if (data.msg.indexOf('请求参数不合规') > -1){
                console.log(`助力码有问题`)
                $.newShareCodes[i] = ''
              }else if (data.msg.indexOf('未登录') > -1 || data.msg.indexOf('火爆') > -1){
                console.log(`${data.msg}，跳出助力`)
              }else{
                console.log(`助力结果\n${$.toStr(data)}`)
              }
            }
            if (data['data']['supporterPrize'] && data['data']['supporterPrize']['beans']) $.beans += data['data']['supporterPrize']['beans'];
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
//获取邀请码API
function getHelp() {
  return new Promise(resolve => {
    const options = taskPostUrl("/api/task/support/getShareId", {});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if (res.code === 200 && res.data.length >= 20) {
              console.log(`\n\n${$.name}互助码每天都变化,旧的不可继续使用`);
              $.log(`【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${res.data}\n\n`);
              $.temp.push(res.data);
            } else {
              console.log(`获取邀请码失败：${data}`);
              if (res.code === 1002 || res.code === 1001) $.blockAccount = true;
            }
          }else{
            console.log(`获取邀请码异常：${data}`)
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

function updateShareCodesCDN(url = 'https://cdn.jsdelivr.net/gh/smiek2121/updateTeam@master/shareCodes/jd_cityShareCodes.json') {
  return new Promise(resolve => {
    $.get({url , headers:{"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")}, timeout: 200000}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.updatePkActivityIdRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function readShareCode() {
  return new Promise(async resolve => {
    $.get({url: `https://jd.smiek.tk/info_carnivalcity`, 'timeout': 20000}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
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
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      // console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex] && inviteCodes[tempIndex].split('@') || [];
      if ($.updatePkActivityIdRes && $.updatePkActivityIdRes.length) $.newShareCodes = [...$.updatePkActivityIdRes, ...$.newShareCodes];
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
      if (process.env.JD818_SHARECODES) {
        if (process.env.JD818_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JD818_SHARECODES.split('\n');
        } else {
          shareCodes = process.env.JD818_SHARECODES.split('&');
        }
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

function taskPostUrl(a,t = {}) {
  const body = $.toStr({...t,"apiMapping":`${a}`})
  return {
    url: `${JD_API_HOST}`,
    body: `appid=china-joy&functionId=collect_bliss_cards_prod&body=${body}&t=${Date.now()}&loginType=2`,
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://yearfestival.jd.com",
      "Referer": "https://yearfestival.jd.com/",
      "Cookie": cookie,
      "User-Agent": $.UA,
    }
  }
}


async function showMsg() {
  if ($.beans) {
    allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n本次运行获得：${$.beans}京豆\n${message}\n\n`
  }
  $.msg($.name, `京东账号${$.index} ${$.nickName || $.UserName}`, `${$.beans > 0 && "本次运行获得："+$.beans+"京豆\n" || ""}${message}具体详情点击弹窗跳转后即可查看`, {"open-url": "https://yearfestival.jd.com"});
}

function getUA(){
  $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
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

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}look(){console.log('authorization')}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
