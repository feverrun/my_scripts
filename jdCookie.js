/*
此文件为Node.js专用。其他用户请忽略
此处填写京东账号cookie。
 */
let CookieJDs = []

if (process.env.JD_COOKIE) {
    let jd_cookies = process.env.JD_COOKIE.replace(/\s+/g, '');
    CookieJDs = jd_cookies.split(/[\n&]+/);
}

// if (JSON.stringify(process.env).indexOf('GITHUB') > -1) {
//     console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
//     !(async () => {
//         await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
//         await process.exit(0);
//     })()
// }

CookieJDs = [...new Set(CookieJDs.filter(item => !!item))]
console.log(`\n【保护环境】欢迎进群反馈问题: https://t.me/proenv\n`);
console.log(`===============共${CookieJDs.length}个京东账号Cookie===============\n`);
if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
};

// const path = require('path');
// /**
//  * 获取当前活动脚本的文件名或完整路径
//  * @param {boolean} onlyName - 如果为 true，则返回文件名；如果为 false，则返回完整路径
//  * @returns {string} 当前活动脚本的文件名或完整路径
//  */
// function getCurrentScriptName(onlyName = false) {
//     if (onlyName) {
//         return path.basename(__filename); // 返回文件名
//     }
//     return __filename; // 返回完整路径
// }
// console.log(getCurrentScriptName(true), getCurrentScriptName(false))

for (let i = 0; i < CookieJDs.length; i++) {
    const cookie = CookieJDs[i];
    const hasPtPin = cookie.match(/pt_pin=(.+?);/);
    const hasPtKey = cookie.match(/pt_key=(.+?);/);
    if (!hasPtPin || !hasPtKey) {
        console.log(`\n提示:京东cookie 【${cookie}】填写不规范,可能会影响部分脚本正常使用。正确格式为: pt_key=xxx;pt_pin=xxx;（分号;不可少）\n`);
    }
    const index = (i === 0) ? '' : (i + 1);
    exports['CookieJD' + index] = cookie.trim();
}