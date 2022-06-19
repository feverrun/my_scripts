/*
const $=new Env('LZ组队瓜分京豆')
一共有2个变量
jd_zdjr_activityId  活动ID 必需
jd_zdjr_activityUrl 活动地址 必需
已适配docker
需要配合重写获取=>活动id、活动地址
https://\w+-isv.isvjcloud.com/wxTeam/shopInfo url script-request-body jd_zdjr.js
mitm
cron "1 1 1 1 1" jd_zdjr.js
*-isv.isvjcloud.com
*/

let jd_zdjr_activityId = ''// 活动ID
let jd_zdjr_activityUrl = 'https://lzkjdz-isv.isvjcloud.com'// 活动地址

const $=new Env('LZ组队瓜分京豆');
const notify=$.isNode()?require('./sendNotify'):'';
const jdCookieNode=$.isNode()?require('./jdCookie.js'):'';

let cookiesArr=[],cookie='',message='',messageTitle='';
activityId=$.getdata('jd_zdjr_activityId')?$.getdata('jd_zdjr_activityId'):jd_zdjr_activityId;
activityUrl=$.getdata('jd_zdjr_activityUrl')?$.getdata('jd_zdjr_activityUrl'):jd_zdjr_activityUrl;
let activityCookie='';
if($.isNode()){
    if(process.env.jd_zdjr_activityId)activityId=process.env.jd_zdjr_activityId;
    if(process.env.jd_zdjr_activityUrl)activityUrl=process.env.jd_zdjr_activityUrl;
    Object.keys(jdCookieNode).forEach(_0x3a3a91=>{
        cookiesArr.push(jdCookieNode[_0x3a3a91]);
    });
    if(process.env.JD_DEBUG&&process.env.JD_DEBUG==='false')console.log=()=>{};
    if(JSON.stringify(process.env).indexOf('GITHUB')>-1)process.exit(0);
}else{
    let cookiesData=$.getdata('CookiesJD')||'[]';
    cookiesData=jsonParse(cookiesData);
    cookiesArr=cookiesData.map(_0x452c83=>_0x452c83.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'),$.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr=cookiesArr.filter(_0x7f89dd=>_0x7f89dd!==''&&_0x7f89dd!==null&&_0x7f89dd!==undefined);
}
const JD_API_HOST='https://api.m.jd.com/client.action';
let isGetCookie=typeof $request!=='undefined';
if(isGetCookie){
    GetCookie();
    $.done();
}

!(async()=>{
    if(!activityId){
        $.msg($.name,'','活动id不存在');
        $.done();
        return;
    }
    if(!cookiesArr[0]){
        $.msg($.name,'【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取','https://bean.m.jd.com/',{'open-url':'https://bean.m.jd.com/'});
        return;
    }
    $.memberCount=0;
    messageTitle+='活动id: '+activityId+'\n';
    $.toactivity=true;
    for(let _0x41e762=0;_0x41e762<cookiesArr.length;_0x41e762++){
        if(cookiesArr[_0x41e762]){
            cookie=cookiesArr[_0x41e762];
            $.UserName=decodeURIComponent(cookie.match(/pt_pin=(.+?);/)&&cookie.match(/pt_pin=(.+?);/)[1]);
            $.index=_0x41e762+1;
            $.isLogin=true;
            $.nickName='';
            console.log('\n******开始【京东账号'+$.index+'】'+($.nickName||$.UserName)+'*********\n');
            if(!$.isLogin){
                $.msg($.name,'【提示】cookie已失效','京东账号'+$.index+' '+($.nickName||$.UserName)+'\n请重新登录获取\nhttps://bean.m.jd.com/',{'open-url':'https://bean.m.jd.com/'});
                if($.isNode()){
                    await notify.sendNotify($.name+'cookie已失效 - '+$.UserName,'京东账号'+$.index+' '+$.UserName+'\n请重新登录获取cookie');
                }
                continue;
            }
            await jrzd();
            if(!$.toactivity||$.maxTeam){
                break;
            }
        }
    }
    messageTitle+='队伍人数 '+$.memberCount+'\n';
    await showMsg();
})().catch(_0x4160a2=>{
    $.log('','❌ '+$.name+', 失败! 原因: '+_0x4160a2+'!','');
}).finally(()=>{
    $.done();
});
async function jrzd(){
    $.sid='',$.userId='',$.Token='',$.Pin='';
    $.saveTeam=false;
    await getCk();
    await getshopInfo();
    await $.wait(1000);
    if($.sid&&$.userId){
        await getToken();
        if($.Token)await getPin();
        console.log('pin:'+$.Pin);
        await getUserInfo();
        await $.wait(1000);
        await getTeam();
        await $.wait(1000);
        if($.maxTeam){
            console.log('队伍已满员');
            return;
        }
    }else{
        console.log('【京东账号'+$.index+'】 未能获取活动信息');
        message+='【京东账号'+$.index+'】 未能获取活动信息\n';
    }
}
function showMsg(){
    return new Promise(_0x5e1092=>{
        let _0x3f1238=openAppUrl();
        console.log('运行完毕');
        console.log(_0x3f1238);
        $.msg($.name,''+$.shopName,''+messageTitle+message+' \n点击弹窗跳转到京东APP活动页面',{'open-url':_0x3f1238});
        _0x5e1092();
    });
}
function openAppUrl(){
    let _0x2736f1=activityUrl+'/wxTeam/activity?activityId='+activityId;
    let _0x1cda78=_0x2736f1;
    if(_0x2736f1.substr(0,5)==='https'){
        let _0x53f3b9={'category':'jump','des':'getCoupon','url':_0x2736f1.substr(8)};
        _0x1cda78='openApp.jdMobile://virtual?params='+encodeURIComponent(JSON.stringify(_0x53f3b9));
    }else if(_0x2736f1.substr(0,4)==='http'){
        let _0x1c5b66={'category':'jump','des':'getCoupon','url':_0x2736f1.substr(7)};
        _0x1cda78='openApp.jdMobile://virtual?params='+encodeURIComponent(JSON.stringify(_0x1c5b66));
    }
    return _0x1cda78;
}
function getCk(){
    return new Promise(_0x5c0114=>{
        let _0x1421ee={'url':activityUrl+'/wxTeam/activity?activityId='+activityId,'headers':{'Cookie':cookie,'User-Agent':$.isNode()?process.env.JD_USER_AGENT?process.env.JD_USER_AGENT:'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1':$.getdata('JDUA')?$.getdata('JDUA'):'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}};
        $.get(_0x1421ee,async(_0x58d7c7,_0xcd85c5,_0x3f505b)=>{
            try{
                if(_0x58d7c7){
                    console.log(''+JSON.stringify(_0x58d7c7));
                    console.log($.name+' cookie API请求失败，请检查网路重试');
                }else{
                    if(_0xcd85c5.status==200){
                        let _0x38a232=JSON.stringify(_0xcd85c5).match(/LZ_TOKEN_KEY=[a-zA-Z0-9._-]+;/);
                        let _0x1dccee=JSON.stringify(_0xcd85c5).match(/LZ_TOKEN_VALUE=[\+a-zA-Z0-9._-]+/);
                        if(_0x38a232&&_0x1dccee)activityCookie=''+_0x38a232+_0x1dccee+'==';
                    }
                }
            }catch(_0x2b4965){
                $.logErr(_0x2b4965,_0xcd85c5);
            }
            finally{
                _0x5c0114();
            }
        });
    });
}
function getToken(){
    return new Promise(_0x109c10=>{
        let _0x26a814='adid=7B411CD9-D62C-425B-B083-9AFC49B94228&area=16_1332_42932_43102&body=%7B%22url%22%3A%22https%3A%5C/%5C/cjhydz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167541&client=apple&clientVersion=9.4.0&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=48&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=11&screen=750%2A1334&sign=60bde51b4b7f7ff6e1bc1f473ecf3d41&st=1613720203903&sv=110&uts=0f31TVRjBStG9NoZJdXLGd939Wv4AlsWNAeL1nxafUsZqiV4NLsVElz6AjC4L7tsnZ1loeT2A8Z5/KfI/YoJAUfJzTd8kCedfnLG522ydI0p40oi8hT2p2sNZiIIRYCfjIr7IAL%2BFkLsrWdSiPZP5QLptc8Cy4Od6/cdYidClR0NwPMd58K5J9narz78y9ocGe8uTfyBIoA9aCd/X3Muxw%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=9cf90c586c4468e00678545b16176ed2';
        $.post(taskUrl('?functionId=isvObfuscator',_0x26a814),async(_0x31d790,_0x447d8a,_0x2343f2)=>{
            try{
                if(_0x31d790){
                    console.log(''+JSON.stringify(_0x31d790));
                    console.log($.name+' 2 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x2343f2)){
                        _0x2343f2=JSON.parse(_0x2343f2);
                        if((_0x2343f2.code==0)&&_0x2343f2.token){
                            $.Token=_0x2343f2.token;
                        }else{
                            console.log('异常2：'+JSON.stringify(_0x2343f2));
                        }
                    }
                }
            }catch(_0xa4cde0){
                $.logErr(_0xa4cde0,_0x447d8a);
            }
            finally{
                _0x109c10();
            }
        });
    });
}
function getPin(){
    return new Promise(_0x24dbe7=>{
        let _0x17c57b='userId='+$.userId+'&token='+$.Token+'&fromType=APP';
        $.post(taskPostUrl('/customer/getMyPing',_0x17c57b),async(_0x39696a,_0x49556b,_0x1ca88f)=>{
            try{
                if(_0x39696a){
                    console.log(''+JSON.stringify(_0x39696a));
                    console.log($.name+' 3 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x1ca88f)){
                        _0x1ca88f=JSON.parse(_0x1ca88f);
                        if(_0x1ca88f.result&&_0x1ca88f.data){
                            $.Pin=_0x1ca88f.data.secretPin;
                        }else{
                            console.log('异常3：'+JSON.stringify(_0x1ca88f));
                        }
                    }
                }
            }catch(_0x884b80){
                $.logErr(_0x884b80,_0x49556b);
            }
            finally{
                _0x24dbe7();
            }
        });
    });
}
function getshopInfo(){
    return new Promise(_0x55df75=>{
        $.post(taskPostUrl('/wxTeam/shopInfo','activityId='+activityId),async(_0x36e0ae,_0x40da01,_0x22237a)=>{
            try{
                if(_0x36e0ae){
                    console.log(''+JSON.stringify(_0x36e0ae));
                    console.log($.name+' 1 API请求失败，请检查网路重试');
                }else{
                    if(_0x22237a&&safeGet(_0x22237a)){
                        _0x22237a=JSON.parse(_0x22237a);
                        if(_0x22237a.data){
                            $.sid=_0x22237a.data.sid;
                            $.userId=_0x22237a.data.userId;
                            $.shopName=_0x22237a.data.shopName;
                        }else{
                            console.log('异常1：'+JSON.stringify(_0x22237a));
                        }
                    }
                }
            }catch(_0x53e118){
                $.logErr(_0x53e118,_0x40da01);
            }
            finally{
                _0x55df75();
            }
        });
    });
}
function joinShop(){
    return new Promise(_0xad9328=>{
        let _0x4e7b5a='venderId='+$.userId+'&buyerPin='+encodeURIComponent($.Pin);
        $.post(taskPostUrl('/mc/new/brandCard/common/shopAndBrand/getOpenCardInfo',_0x4e7b5a),async(_0x57cdf5,_0x53f161,_0x1ac107)=>{
            try{
                if(_0x57cdf5){
                    console.log(''+JSON.stringify(_0x57cdf5));
                    console.log($.name+' 4 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x1ac107)){
                        _0x1ac107=JSON.parse(_0x1ac107);
                        if(_0x1ac107.result&&_0x1ac107.data){
                            if(_0x1ac107.data.openCardLink){
                                let _0x2b47ad=_0x1ac107.data.openCardLink.match(/channel=(\d+)/);
                                const _0x326ed3={'venderId':$.userId,'shopId':$.sid,'bindByVerifyCodeFlag':1,'registerExtend':{},'writeChildFlag':0,'channel':_0x2b47ad[1]};
                                let h5st='20220614090341726%3B0284392757226553%3Bef79a%3Btk02wcbf51cf018njrSeb2PERKoZxKtLTPV0g0paq33tkJwK4bJurufnMpBuFkn4RVxkfBmwRhN8VRd%2BB2q%2BrzaXvMR7%3B775673aed4a823ebbe0003522fffd49e329ba7842f8ad82e5099117cd00d871e%3B3.0%3B1655168621726'
                                let _0x1324f5='https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body='+encodeURIComponent(JSON.stringify(_0x326ed3))+'&client=H5&clientVersion=9.2.0&uuid=88888&h5st='+h5st;
                                let _0x21c3ee=''+_0x1ac107.data.openCardLink;
                                await jiaru(_0x1324f5,_0x21c3ee);
                            }
                        }else{
                            console.log('异常4：'+JSON.stringify(_0x1ac107));
                        }
                    }
                }
            }catch(_0x14db99){
                $.logErr(_0x14db99,_0x53f161);
            }
            finally{
                _0xad9328();
            }
        });
    });
}
function jiaru(_0x44818b,_0x18f4bb){
    return new Promise(_0x1159f9=>{
        let _0x1ffa51={'url':_0x44818b,'headers':{'Accept':'*/*','Accept-Encoding':'gzip, deflate, br','Accept-Language':'zh-cn','Connection':'keep-alive','Host':'api.m.jd.com','Referer':_0x18f4bb,'Cookie':cookie,'User-Agent':$.isNode()?process.env.JD_USER_AGENT?process.env.JD_USER_AGENT:'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1':$.getdata('JDUA')?$.getdata('JDUA'):'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}};
        $.get(_0x1ffa51,async(_0x1b6eb6,_0x33d202,_0x2235d4)=>{
            try{
                if(_0x1b6eb6){
                    console.log(''+JSON.stringify(_0x1b6eb6));
                    console.log($.name+' 入会 API请求失败，请检查网路重试');
                }else{
                    $.log(_0x2235d4);
                }
            }catch(_0x2454de){
                $.logErr(_0x2454de,_0x33d202);
            }
            finally{
                _0x1159f9();
            }
        });
    });
}
function getUserInfo(){
    return new Promise(_0x4f6b7a=>{
        let _0x3f860c='pin='+encodeURIComponent($.Pin);
        $.post(taskPostUrl('/wxActionCommon/getUserInfo',_0x3f860c),async(_0x1040f0,_0x5b65b4,_0x5b3351)=>{
            try{
                if(_0x1040f0){
                    console.log(''+JSON.stringify(_0x1040f0));
                    console.log($.name+' 6-1 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x5b3351)){
                        _0x5b3351=JSON.parse(_0x5b3351);
                        if(_0x5b3351.result&&_0x5b3351.data){
                            $.attrTouXiang=(_0x5b3351.data.yunMidImageUrl!=_0x5b3351.data.yunMidImageUrl)?$.attrTouXiang=_0x5b3351.data.yunMidImageUrl:$.attrTouXiang='https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg';
                        }else{
                            console.log('异常6-2：'+JSON.stringify(_0x5b3351));
                        }
                    }
                }
            }catch(_0x15a33d){
                $.logErr(_0x15a33d,_0x5b65b4);
            }
            finally{
                _0x4f6b7a();
            }
        });
    });
}
function getTeam(){
    return new Promise(_0x33a3ce=>{
        let _0x979688='activityId='+activityId+'&pin='+encodeURIComponent($.Pin);
        if($.signUuid)_0x979688+='&signUuid='+$.signUuid;
        $.post(taskPostUrl('/wxTeam/activityContent',_0x979688),async(_0x4b830d,_0xfcd685,_0x28a585)=>{
            try{
                if(_0x4b830d){
                    console.log(''+JSON.stringify(_0x4b830d));
                    console.log($.name+' 5 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x28a585)){
                        _0x28a585=JSON.parse(_0x28a585);
                        if(_0x28a585.result&&_0x28a585.data){
                            if(new Date(_0x28a585.data.active.endTimeStr.replace(/-/g,'/')).getTime()<new Date().getTime()){
                                $.toactivity=false;
                                console.log('活动结束');
                                messageTitle+='活动结束\n';
                                _0x33a3ce();
                            }else{
                                if((_0x28a585.data.canCreate==false)&&(_0x28a585.data.list==null))message+='人数已满\n';
                                if(_0x28a585.data.share){
                                    $.memberCount=(parseInt(_0x28a585.data.share.memberCount,10)+1);
                                }else{
                                    $.memberCount=0;
                                }if($.index==1){
                                    $.saveTeam=true;
                                    $.teamNum=_0x28a585.data.active.actRule.match(/最多可以组建(\d+)个战队/);
                                    if($.teamNum){
                                        $.teamNum=$.teamNum[1];
                                        messageTitle+='最多可以组建'+$.teamNum+'个战队\n';
                                    }
                                }if($.signUuid&&($.index!=1)){
                                    $.log('加入队伍 id: '+$.signUuid);
                                    await joinTeam();
                                }if($.saveTeam){
                                    if(_0x28a585.data.canCreate){
                                        await saveTeam();
                                    }else{
                                        $.signUuid=_0x28a585.data.signUuid;
                                        messageTitle+='队伍id: '+$.signUuid+'\n';
                                        message+='【京东账号'+$.index+'】 创建队伍id: '+$.signUuid+'\n';
                                        $.log('队伍id: '+$.signUuid);
                                    }
                                }
                            }
                        }else{
                            console.log('异常5：'+JSON.stringify(_0x28a585));
                        }
                    }
                }
            }catch(_0x3c19ca){
                $.logErr(_0x3c19ca,_0xfcd685);
            }
            finally{
                _0x33a3ce();
            }
        });
    });
}
function saveTeam(_0x3b216f=0){
    return new Promise(_0x26e343=>{
        let _0x5a4995=encodeURIComponent($.Pin);
        if(_0x3b216f==1)_0x5a4995=encodeURIComponent(encodeURIComponent($.Pin));
        let _0x598a25='activityId='+activityId+'&pin='+_0x5a4995+'&pinImg='+encodeURIComponent($.attrTouXiang);
        $.post(taskPostUrl('/wxTeam/saveCaptain',_0x598a25),async(_0x44a0af,_0x284baf,_0x3b79c1)=>{
            try{
                if(_0x44a0af){
                    console.log(''+JSON.stringify(_0x44a0af));
                    console.log($.name+' 6 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x3b79c1)){
                        _0x3b79c1=JSON.parse(_0x3b79c1);
                        if(_0x3b79c1.result&&_0x3b79c1.data){
                            message+='【京东账号'+$.index+'】 创建队伍id: '+_0x3b79c1.data.signUuid+'\n';
                            console.log('创建队伍成功 id: '+_0x3b79c1.data.signUuid);
                            $.signUuid=_0x3b79c1.data.signUuid;
                            messageTitle+='队伍id: '+$.signUuid+'\n';
                        }else{
                            console.log('异常6：'+JSON.stringify(_0x3b79c1));
                            if((_0x3b79c1.errorMessage.indexOf('不是店铺会员')>-1)&&(_0x3b216f!=3)){
                                await joinShop();
                                await saveTeam(3);
                            }else if((_0x3b79c1.errorMessage.indexOf('奖品与您擦肩而过')>-1)&&(_0x3b216f==0)){
                                await saveTeam(1);
                            }
                        }
                    }
                }
            }catch(_0x51bd62){
                $.logErr(_0x51bd62,_0x284baf);
            }
            finally{
                _0x26e343();
            }
        });
    });
}
function joinTeam(_0x5d5fb6=0){
    return new Promise(_0x3471e7=>{
        let _0x1b200c=encodeURIComponent(encodeURIComponent($.Pin));
        if(_0x5d5fb6==1)_0x1b200c=encodeURIComponent($.Pin);
        let _0x1bd3fe='activityId='+activityId+'&signUuid='+$.signUuid+'&pin='+_0x1b200c+'&pinImg='+encodeURIComponent($.attrTouXiang);
        $.post(taskPostUrl('/wxTeam/saveMember',_0x1bd3fe),async(_0x163909,_0x39e7e5,_0x32054d)=>{
            try{
                if(_0x163909){
                    console.log(''+JSON.stringify(_0x163909));
                    console.log($.name+' 7 API请求失败，请检查网路重试');
                }else{
                    if(safeGet(_0x32054d)){
                        _0x32054d=JSON.parse(_0x32054d);
                        if(_0x32054d.result&&_0x32054d.data){
                            message+='【京东账号'+$.index+'】 加入队伍\n';
                            $.log('加入队伍成功');
                        }else{
                            if(_0x32054d.errorMessage.indexOf('不是店铺会员')>-1&&_0x5d5fb6!=3){
                                await joinShop();
                                await joinTeam(3);
                            }else if(_0x32054d.errorMessage.indexOf('队伍已经满员')>-1){
                                $.maxTeam=true;
                            }else if((_0x32054d.errorMessage.indexOf('奖品与您擦肩而过')>-1)&&_0x5d5fb6==0){
                                await joinTeam(1);
                            }else{
                                console.log('异常7：'+JSON.stringify(_0x32054d));
                                message+='【京东账号'+$.index+'】 '+_0x32054d.errorMessage+'\n';
                            }
                        }
                    }
                }
            }catch(_0x3b40cd){
                $.logErr(_0x3b40cd,_0x39e7e5);
            }
            finally{
                _0x3471e7();
            }
        });
    });
}
function taskPostUrl(_0x4e85b6,_0x1f0e72){
    return{'url':''+activityUrl+_0x4e85b6,'body':_0x1f0e72,'headers':{'Accept':'application/json','Accept-Encoding':'gzip, deflate, br','Accept-Language':'zh-cn','Connection':'keep-alive','Content-Type':'application/x-www-form-urlencoded','Referer':activityUrl+'/wxTeam/activity?activityId='+activityId,'Cookie':(cookie+activityCookie),'User-Agent':$.isNode()?process.env.JD_USER_AGENT?process.env.JD_USER_AGENT:'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1':$.getdata('JDUA')?$.getdata('JDUA'):'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}};
}
function taskUrl(_0x4a2b20,_0x290f26){
    return{'url':'https://api.m.jd.com/client.action'+_0x4a2b20,'body':_0x290f26,'headers':{'Accept':'*/*','Accept-Encoding':'gzip, deflate, br','Accept-Language':'zh-cn','Connection':'keep-alive','Content-Type':'application/x-www-form-urlencoded','Host':'api.m.jd.com','Cookie':cookie,'User-Agent':$.isNode()?process.env.JD_USER_AGENT?process.env.JD_USER_AGENT:'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1':$.getdata('JDUA')?$.getdata('JDUA'):'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}};
}
function TotalBean(){
    return new Promise(async _0x4d5146=>{
        const _0x25151={'url':'https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2','headers':{'Accept':'application/json,text/plain, */*','Content-Type':'application/x-www-form-urlencoded','Accept-Encoding':'gzip, deflate, br','Accept-Language':'zh-cn','Connection':'keep-alive','Cookie':cookie,'Referer':'https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2','User-Agent':$.isNode()?process.env.JD_USER_AGENT?process.env.JD_USER_AGENT:'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1':$.getdata('JDUA')?$.getdata('JDUA'):'jdapp;iPhone;9.4.0;13.1.2;2f7578cb634065f9beae94d013f172e197d62283;network/wifi;ADID/7B411CD9-D62C-425B-B083-9AFC49B94228;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,1;addressid/2474290248;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;pv/80.1;apprpd/Home_Main;ref/JDMainPageViewController;psq/1;ads/;psn/2f7578cb634065f9beae94d013f172e197d62283|138;jdv/0|kong|t_1000170135|tuiguang|notset|1611219732062|1611219732;adk/;app_device/IOS;pap/JA2015_311210|9.4.0|IOS 13.1.2;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}};
        $.post(_0x25151,(_0x6dc3a7,_0x542754,_0x51b420)=>{
            try{
                if(_0x6dc3a7){
                    console.log(''+JSON.stringify(_0x6dc3a7));
                    console.log($.name+' API请求失败，请检查网路重试');
                }else{
                    if(_0x51b420){
                        _0x51b420=JSON.parse(_0x51b420);
                        if(_0x51b420.retcode===13){
                            $.isLogin=false;
                            return;
                        }
                    }else{
                        console.log('京东服务器返回空数据');
                    }
                }
            }catch(_0x36cdb2){
                $.logErr(_0x36cdb2,_0x542754);
            }
            finally{
                _0x4d5146();
            }
        });
    });
}
function safeGet(_0x480f9b){
    try{
        if(typeof JSON.parse(_0x480f9b)=='object'){
            return true;
        }
    }catch(_0x1f914e){
        console.log(_0x1f914e);
        console.log('京东服务器访问数据为空，请检查自身设备网络情况');
        return false;
    }
}
function jsonParse(_0x9ce96){
    if(typeof _0x9ce96=='string'){
        try{
            return JSON.parse(_0x9ce96);
        }catch(_0x3cda17){
            console.log(_0x3cda17);
            $.msg($.name,'','不要在BoxJS手动复制粘贴修改cookie');
            return[];
        }
    }
}
function GetCookie(){
    if($request.url.indexOf('/wxTeam/shopInfo')>-1){
        if($request.body){
            let _0x20d309=$request.body.match(/activityId=([a-zA-Z0-9._-]+)/);
            if(_0x20d309){
                let _0x3ed1f9=$request.url.split('/');
                console.log('activityId: '+_0x20d309[1]);
                console.log('activityUrl: '+_0x3ed1f9[0]+'//'+_0x3ed1f9[2]);
                $.setdata(_0x20d309[1],'jd_smiek_zdjr_activityId');
                $.setdata(_0x3ed1f9[0]+'//'+_0x3ed1f9[2],'jd_smiek_zdjr_activityUrl');
                $.msg($.name,'获取activityId: 成功🎉','activityId:'+_0x20d309[1]+'\nactivityUrl:'+_0x3ed1f9[0]+'//'+_0x3ed1f9[2]);
            }else{
                $.msg($.name,'找不到activityId','');
            }
        }
    }
};

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}