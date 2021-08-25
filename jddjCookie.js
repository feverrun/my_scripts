/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号cookie。
let CookieJDs = ['PDJ_RN_JDPIN=18862988021_p; PDJ_RN_MOBILE=188****7028; PDJ_RN_PIN=JD_a5faf6efe75a000; cart_uuid=d45a13a650de78a8; o2o_m_rn_sid=9a3935bf-7b4f-4639-bd02-2c1e4ac25a61']

// 判断环境变量里面是否有京东到家ck
if (process.env.JDDJ_COOKIE) {
  if (process.env.JDDJ_COOKIE.indexOf('&') > -1) {
    console.log(`您的cookie选择的是用&隔开\n`)
    CookieJDs = process.env.JDDJ_COOKIE.split('&');
  } else if (process.env.JDDJ_COOKIE.indexOf('\n') > -1) {
    console.log(`您的cookie选择的是用换行隔开\n`)
    CookieJDs = process.env.JDDJ_COOKIE.split('\n');
  } else {
    CookieJDs = [process.env.JDDJ_COOKIE];
  }
}
if (JSON.stringify(process.env).indexOf('GITHUB') > -1) {
  console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
  !(async () => {
    await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
    await process.exit(0);
  })()
}
CookieJDs = [...new Set(CookieJDs.filter(item => item !== "" && item !== null && item !== undefined))]
console.log(`\n====================共有${CookieJDs.length}个京东账号Cookie=========\n`);
console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()}=====================\n`)
for (let i = 0; i < CookieJDs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieJD' + index] = CookieJDs[i].trim();
}
//exports['CookieJDs'] = CookieJDs;
