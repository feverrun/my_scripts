/*
此文件为Node.js专用。其他用户请忽略
此处填写京东账号cookie。
 */
let CookieJDs = []

// modified by proenv
if (process.env.JD_COOKIE) {
    let jd_cookies = process.env.JD_COOKIE;
    let jdStr = '';
    jd_cookies = jd_cookies.replace(/\r\n/g, "");
    jd_cookies = jd_cookies.replace(/\n/g, "");
    jd_cookies = jd_cookies.replace(/\s+/g, "");
    pkes = jd_cookies.match(/pt_key=(.*?);/g);
    ppins = jd_cookies.match(/pt_pin=(.*?);/g);
    if (pkes.length >= 1) {
        for (let i = 0; i < pkes.length; i++) {
            jdStr += pkes[i] + ppins[i] + '&';
        }
        jd_cookies = jdStr.substr(0, jdStr.length - 1);
    }else {
        jd_cookies = jd_cookies;
    }
    if (jd_cookies.indexOf('&') > -1) {
        CookieJDs = jd_cookies.split('&');
    } else if (jd_cookies.indexOf('\n') > -1) {
        CookieJDs = jd_cookies.split('\n');
    } else {
        CookieJDs = [jd_cookies];
    }
}

// if (JSON.stringify(process.env).indexOf('GITHUB') > -1) {
//     console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
//     !(async () => {
//         await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
//         await process.exit(0);
//     })()
// }

CookieJDs = [...new Set(CookieJDs.filter(item => !!item))]
console.log(`\n===============共${CookieJDs.length}个京东账号Cookie===============\n`);
if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
};

for (let i = 0; i < CookieJDs.length; i++) {
    if (!CookieJDs[i].match(/pt_pin=(.+?);/) || !CookieJDs[i].match(/pt_key=(.+?);/)) console.log(`\n提示:京东cookie 【${CookieJDs[i]}】填写不规范,可能会影响部分脚本正常使用。正确格式为: pt_key=xxx;pt_pin=xxx;（分号;不可少）\n`);
    const index = (i + 1 === 1) ? '' : (i + 1);
    exports['CookieJD' + index] = CookieJDs[i].trim();
}
