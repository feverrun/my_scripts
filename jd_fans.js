/*
 粉丝互动
 尽量自己设置定时，在0点和1点抽奖，白天基本没水
 环境变量：RUHUI,是否自动入会，默认不如会，设置RUHUI=1，则会自动入会
 环境变量：RUNCK,执行多少CK，默认全执行，设置RUNCK=100，则脚本只会运行前100个CK
 cron "5 0 * * *" jd_fans.js
*/

//活动列表
let activityList = [
];



const $ = new Env('粉丝互动');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const RUHUI = $.isNode() ? (process.env.RUHUI ? process.env.RUHUI : `0`):`0`;
const RUNCK = $.isNode() ? (process.env.RUNCK ? process.env.RUNCK : `9999`):`9999`;


$.CryptoJS=require('crypto-js');
let cookiesArr = [],message = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}


!(async()=>{
    $.appId='8adfb';
    $.fingerprint=await _0x3bb99c();
    $.tokenTk='';
    $['ua']=_0xa37b74();
    await _0x5a3e90();
    activityList=_0x958263(activityList,activityList.length);
    $.helpFalg=true;
    if($.helpFalg){
        _0x299432();
    }for(let _0x4227ba=0;_0x4227ba<activityList.length;_0x4227ba++){
        let _0x5a9bec=activityList[_0x4227ba]['id'];
        let _0x5c33f2=Date.now();
        if(_0x5c33f2<activityList[_0x4227ba].endTime){
            let _0xd08a49='https://lzkjdz-isv.isvjcloud.com/wxFansInterActionActivity/activity/'+_0x5a9bec+'?activityId='+_0x5a9bec;
            console.log('\n活动URL：'+_0xd08a49);
            $.thisActivityUrl=_0xd08a49;
            $.host='lzkjdz-isv.isvjcloud.com';
            await _0x2a159f($);
        }else{
            console.log('\n活动ID：'+_0x5a9bec+',已过期');
        }
    }
})().catch(_0x327dee=>{
    $.log('','❌ '+$.name+', 失败! 原因: '+_0x327dee+'!','');
}).finally(()=>{
    $.done();
});
async function _0x2a159f(_0xc31fa8){
    _0xc31fa8.cookiesArr=cookiesArr;
    message='';
    _0xc31fa8.activityId=_0x29580e(_0xc31fa8.thisActivityUrl,'activityId');
    _0xc31fa8.runFlag=true;
    if(_0xc31fa8.helpFalg){
        _0x299432();
    }for(let _0x34c304=0;(_0x34c304<_0xc31fa8.cookiesArr.length)&&(_0x34c304<RUNCK)&&_0xc31fa8.activityId&&_0xc31fa8.runFlag;_0x34c304++){
        _0xc31fa8.cookie=_0xc31fa8.cookiesArr[_0x34c304];
        _0xc31fa8.UserName=decodeURIComponent(_0xc31fa8.cookie.match(/pt_pin=(.+?);/)&&_0xc31fa8.cookie.match(/pt_pin=(.+?);/)[1]);
        _0xc31fa8.index=(_0x34c304+1);
        console.log('\n********开始【京东账号'+_0xc31fa8.index+'】'+_0xc31fa8.UserName+'********\n');
        try{
            await _0x2b4f96(_0xc31fa8);
        }catch(_0xf19383){}
        await _0xc31fa8.wait(3000);
    }if(message){
        await notify.sendNotify('粉丝互动ID：'+_0xc31fa8.activityId,message);
    }
}
async function _0x2b4f96(_0x2a8817){
    _0x2a8817['UA']=_0xa37b74();
    _0x2a8817.token='';
    _0x2a8817.LZ_TOKEN_KEY='';
    _0x2a8817.LZ_TOKEN_VALUE='';
    _0x2a8817.lz_jdpin_token='';
    _0x2a8817.pin='';
    _0x2a8817.nickname='';
    _0x2a8817.venderId='';
    _0x2a8817.activityType='';
    _0x2a8817.LZ_AES_PIN='';
    _0x2a8817.attrTouXiang='https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png';
    console.log('活动地址：'+_0x2a8817.thisActivityUrl);
    _0x2a8817.body='body=%7B%22url%22%3A%22https%3A%2F%2Flzkjdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&clientVersion=9.2.2&build=89568&client=android&uuid=b4d0d21978ef8579305f30d52065ffedcc573c2d&st=1643784769190&sign=d6ab868c42dcc3d04c2b95b2aea9014c&sv=111';
    _0x2a8817.token=await _0x35a5c3(_0x2a8817);
    if(!_0x2a8817.token){
        console.log('获取token失败');
        return;
    }
    await _0x56cb48(_0x2a8817);
    if(!_0x2a8817.LZ_TOKEN_KEY||!_0x2a8817.LZ_TOKEN_VALUE){
        console.log('初始化失败1');
        return;
    }
    let _0x5366a3=await _0x55b883(_0x2a8817,'customer/getSimpleActInfoVo');
    _0x2a8817.venderId=_0x5366a3.data.venderId||'';
    _0x2a8817.activityType=_0x5366a3.data.activityType||'';
    console.log('venderId:'+_0x2a8817.venderId);
    let _0x25e5e3=await _0x55b883(_0x2a8817,'customer/getMyPing');
    _0x2a8817.pin=_0x25e5e3.data.secretPin;
    _0x2a8817.nickname=_0x25e5e3.data.nickname;
    if(!_0x2a8817.pin){
        console.log('获取pin失败,该账号可能是黑号');
        return;
    }
    await _0x55b883(_0x2a8817,'common/accessLogWithAD');
    let _0x5e004b=await _0x55b883(_0x2a8817,'wxActionCommon/getUserInfo');
    let _0x45be19=await _0x55b883(_0x2a8817,'wxActionCommon/getShopInfoVO');
    let _0x774fc2=await _0x55b883(_0x2a8817,'wxCommonInfo/getActMemberInfo');
    if(_0x5e004b&&_0x5e004b.data&&_0x5e004b.data.yunMidImageUrl){
        _0x2a8817.attrTouXiang=_0x5e004b.data.yunMidImageUrl;
    }
    let _0x1fe9b2=await _0x55b883(_0x2a8817,'wxFansInterActionActivity/activityContent');
    _0x2a8817.activityData=_0x1fe9b2.data||{};
    _0x2a8817.actinfo=_0x2a8817.activityData.actInfo;
    _0x2a8817.actorInfo=_0x2a8817.activityData.actorInfo;
    _0x2a8817.nowUseValue=(Number(_0x2a8817.actorInfo.fansLoveValue)+Number(_0x2a8817.actorInfo.energyValue));
    if(JSON.stringify(_0x2a8817.activityData)==='{}'){
        console.log('获取活动信息失败');
        return;
    }
    let _0x3d5205=new Date(_0x2a8817.activityData.actInfo.endTime);
    let _0x3334ed=(_0x3d5205.getFullYear()+'-'+(_0x3d5205.getMonth()<10)?('0'+_0x3d5205.getMonth()+1):(_0x3d5205.getMonth()+1)+'-'+(_0x3d5205.getDate()<10)?('0'+_0x3d5205.getDate()):_0x3d5205.getDate());
    _0x3d5205=new Date(_0x2a8817.activityData.actInfo.startTime);
    let _0x3b5f39=(_0x3d5205.getFullYear()+'-'+(_0x3d5205.getMonth()<10)?('0'+_0x3d5205.getMonth()+1):(_0x3d5205.getMonth()+1)+'-'+(_0x3d5205.getDate()<10)?('0'+_0x3d5205.getDate()):_0x3d5205.getDate());
    console.log(_0x2a8817.actinfo.actName+','+_0x45be19.data.shopName+',当前积分：'+_0x2a8817.nowUseValue+',活动时间：'+_0x3b5f39+'---'+_0x3334ed+'，'+_0x2a8817.activityData.actInfo.endTime);
    let _0x2fab9e=[];
    let _0x29d0af=['One','Two','Three'];
    for(let _0xd1ec53=0;_0xd1ec53<_0x29d0af.length;_0xd1ec53++){
        let _0x569219=_0x2a8817.activityData.actInfo['giftLevel'+_0x29d0af[_0xd1ec53]]||'';
        if(_0x569219){
            _0x569219=JSON.parse(_0x569219);
            _0x2fab9e.push(_0x569219[0].name);
        }
    }
    console.log('奖品列表：'+_0x2fab9e.toString());
    if(_0x2a8817.actorInfo.prizeOneStatus&&_0x2a8817.actorInfo.prizeTwoStatus&&_0x2a8817.actorInfo.prizeThreeStatus){
        console.log('已完成抽奖');
        return;
    }
    console.log('{\'id\':\''+_0x2a8817.activityId+'\',\'endTime\':'+_0x2a8817.activityData.actInfo.endTime+'},//'+_0x3b5f39+'---'+_0x3334ed+' '+_0x45be19.data.shopName);
    if((_0x774fc2.data.actMemberStatus===1)&&!_0x774fc2.data.openCard){
        console.log('活动需要入会后才能参与');
        if(Number(RUHUI)===1){
            var _0x2315cb='4|0|3|2|1'.split('|'),_0x56af5b=0;
            while(true){
                switch(_0x2315cb[_0x56af5b++]){
                    case'0':
                        await _0x423b59(_0x2a8817);
                        continue;
                    case'1':
                        await _0x2a8817.wait(3000);
                        continue;
                    case'2':
                        _0x2a8817.activityData=_0x1fe9b2.data||{};
                        continue;
                    case'3':
                        _0x1fe9b2=await _0x55b883(_0x2a8817,'wxFansInterActionActivity/activityContent');
                        continue;
                    case'4':
                        console.log('去入会');
                        continue;
                }
                break;
            }
        }else{
            console.log('不执行入会，跳出');
            return;
        }
        return;
    }else if(_0x774fc2.data.openCard){
        console.log('已入会');
    }
    if(_0x2a8817.activityData.actorInfo&&!_0x2a8817.activityData.actorInfo.follow){
        console.log('去关注店铺');
        _0x2a8817.body='activityId='+_0x2a8817.activityId+'&uuid='+_0x2a8817.activityData.actorInfo.uuid;
        let _0x4a2ea7=await _0x55b883(_0x2a8817,'wxFansInterActionActivity/followShop',_0x2a8817.body);
        console.log(JSON.stringify(_0x4a2ea7));
        await _0x2a8817.wait(3000);
    }
    _0x2a8817.upFlag=false;
    await _0x436782(_0x2a8817);
    await _0x5922a6(_0x2a8817);
}
async function _0x5922a6(_0x4db3ef){
    if(_0x4db3ef.upFlag){
        activityData=await _0x55b883(_0x4db3ef,'wxFansInterActionActivity/activityContent');
        _0x4db3ef.activityData=activityData.data||{};
        await _0x4db3ef.wait(3000);
    }
    let _0x3a2f43=(Number(_0x4db3ef.activityData.actorInfo.fansLoveValue)+Number(_0x4db3ef.activityData.actorInfo.energyValue));
    let _0x4744ea=['One','Two','Three'];
    let _0x57e5a0={'One':'01','Two':'02','Three':'03'};
    for(let _0x4812d4=0;_0x4812d4<_0x4744ea.length;_0x4812d4++){
        if((_0x3a2f43>=_0x4db3ef.activityData.actConfig['prizeScore'+_0x4744ea[_0x4812d4]])&&(_0x4db3ef.activityData.actorInfo['prize'+_0x4744ea[_0x4812d4]+'Status']===false)){
            console.log('\n开始第'+Number(_0x57e5a0[_0x4744ea[_0x4812d4]])+'次抽奖');
            _0x4db3ef.body='activityId='+_0x4db3ef.activityId+'&uuid='+_0x4db3ef.activityData.actorInfo.uuid+'&drawType='+_0x57e5a0[_0x4744ea[_0x4812d4]];
            let _0x4c49c7=await _0x55b883(_0x4db3ef,'wxFansInterActionActivity/startDraw',_0x4db3ef.body);
            if(_0x4c49c7.result&&(_0x4c49c7.count===0)){
                let _0x6ebba0=_0x4c49c7.data;
                if(!_0x6ebba0.drawOk){
                    console.log('抽奖获得:空气');
                }else{
                    console.log('抽奖获得:'+_0x6ebba0.name);
                    message+=_0x4db3ef.UserName+',获得：'+(_0x6ebba0.name||'未知')+'\n';
                }
            }else{
                console.log('抽奖异常');
            }
            console.log(JSON.stringify(_0x4c49c7));
            await _0x4db3ef.wait(3000);
        }
    }
}
async function _0x436782(_0x3e0c75){
    let _0x356d23=0;
    if(_0x3e0c75.activityData.task2BrowGoods){
        if(_0x3e0c75.activityData.task2BrowGoods.finishedCount!==_0x3e0c75.activityData.task2BrowGoods.upLimit){
            _0x356d23=(Number(_0x3e0c75.activityData.task2BrowGoods.upLimit)-Number(_0x3e0c75.activityData.task2BrowGoods.finishedCount));
            console.log('开始做浏览商品任务');
            _0x3e0c75.upFlag=true;
            for(let _0x47862f=0;(_0x47862f<_0x3e0c75.activityData.task2BrowGoods.taskGoodList.length)&&(_0x356d23>0);_0x47862f++){
                _0x3e0c75.oneGoodInfo=_0x3e0c75.activityData.task2BrowGoods.taskGoodList[_0x47862f];
                if(_0x3e0c75.oneGoodInfo.finished===false){
                    console.log('浏览:'+(_0x3e0c75.oneGoodInfo.skuName||''));
                    _0x3e0c75.body='activityId='+_0x3e0c75.activityId+'&uuid='+_0x3e0c75.activityData.actorInfo.uuid+'&skuId='+_0x3e0c75.oneGoodInfo.skuId;
                    let _0x5685e7=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doBrowGoodsTask',_0x3e0c75.body);
                    console.log(JSON.stringify(_0x5685e7));
                    await _0x3e0c75.wait(3000);
                    _0x356d23--;
                }
            }
        }else{
            console.log('浏览商品任务已完成');
        }
    }
    if(_0x3e0c75.activityData.task3AddCart){
        if(_0x3e0c75.activityData.task3AddCart.finishedCount!==_0x3e0c75.activityData.task3AddCart.upLimit){
            _0x356d23=(Number(_0x3e0c75.activityData.task3AddCart.upLimit)-Number(_0x3e0c75.activityData.task3AddCart.finishedCount));
            console.log('开始做加购商品任务');
            _0x3e0c75.upFlag=true;
            for(let _0x247db4=0;(_0x247db4<_0x3e0c75.activityData.task3AddCart.taskGoodList.length)&&(_0x356d23>0);_0x247db4++){
                _0x3e0c75.oneGoodInfo=_0x3e0c75.activityData.task3AddCart.taskGoodList[_0x247db4];
                if(_0x3e0c75.oneGoodInfo.finished===false){
                    console.log('加购:'+(_0x3e0c75.oneGoodInfo.skuName||''));
                    _0x3e0c75.body='activityId='+_0x3e0c75.activityId+'&uuid='+_0x3e0c75.activityData.actorInfo.uuid+'&skuId='+_0x3e0c75.oneGoodInfo.skuId;
                    let _0x5685e7=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doAddGoodsTask',_0x3e0c75.body);
                    console.log(JSON.stringify(_0x5685e7));
                    await _0x3e0c75.wait(3000);
                    _0x356d23--;
                }
            }
        }else{
            console.log('加购商品已完成');
        }
    }
    if(_0x3e0c75.activityData.task6GetCoupon){
        if(_0x3e0c75.activityData.task6GetCoupon.finishedCount!==_0x3e0c75.activityData.task6GetCoupon.upLimit){
            _0x356d23=(Number(_0x3e0c75.activityData.task6GetCoupon.upLimit)-Number(_0x3e0c75.activityData.task6GetCoupon.finishedCount));
            console.log('开始做领取优惠券');
            _0x3e0c75.upFlag=true;
            for(let _0x447829=0;(_0x447829<_0x3e0c75.activityData.task6GetCoupon.taskCouponInfoList.length)&&(_0x356d23>0);_0x447829++){
                _0x3e0c75.oneCouponInfo=_0x3e0c75.activityData.task6GetCoupon.taskCouponInfoList[_0x447829];
                if(_0x3e0c75.oneCouponInfo.finished===false){
                    _0x3e0c75.body='activityId='+_0x3e0c75.activityId+'&uuid='+_0x3e0c75.activityData.actorInfo.uuid+'&couponId='+_0x3e0c75.oneCouponInfo.couponInfo.couponId;
                    let _0x5685e7=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doGetCouponTask',_0x3e0c75.body);
                    console.log(JSON.stringify(_0x5685e7));
                    await _0x3e0c75.wait(3000);
                    _0x356d23--;
                }
            }
        }else{
            console.log('领取优惠券已完成');
        }
    }
    _0x3e0c75.body='activityId='+_0x3e0c75.activityId+'&uuid='+_0x3e0c75.activityData.actorInfo.uuid;
    if(_0x3e0c75.activityData.task1Sign&&(_0x3e0c75.activityData.task1Sign.finishedCount===0)){
        console.log('执行每日签到');
        let _0xa9ad87=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doSign',_0x3e0c75.body);
        console.log(JSON.stringify(_0xa9ad87));
        await _0x3e0c75.wait(3000);
        _0x3e0c75.upFlag=true;
    }else{
        console.log('已签到');
    }if(_0x3e0c75.activityData.task4Share){
        if(_0x3e0c75.activityData.task4Share.finishedCount!==_0x3e0c75.activityData.task4Share.upLimit){
            _0x356d23=(Number(_0x3e0c75.activityData.task4Share.upLimit)-Number(_0x3e0c75.activityData.task4Share.finishedCount));
            console.log('开始做分享任务');
            _0x3e0c75.upFlag=true;
            for(let _0x29e4be=0;_0x29e4be<_0x356d23;_0x29e4be++){
                console.log('执行第'+(_0x29e4be+1)+'次分享');
                let _0xa9ad87=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doShareTask',_0x3e0c75.body);
                console.log(JSON.stringify(_0xa9ad87));
                await _0x3e0c75.wait(3000);
            }
        }else{
            console.log('分享任务已完成');
        }
    }if(_0x3e0c75.activityData.task5Remind){
        if(_0x3e0c75.activityData.task5Remind.finishedCount!==_0x3e0c75.activityData.task5Remind.upLimit){
            console.log('执行设置活动提醒');
            _0x3e0c75.upFlag=true;
            let _0xf9a626=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doRemindTask',_0x3e0c75.body);
            console.log(JSON.stringify(_0xf9a626));
            await _0x3e0c75.wait(3000);
        }else{
            console.log('设置活动提醒已完成');
        }
    }if(_0x3e0c75.activityData.task7MeetPlaceVo){
        if(_0x3e0c75.activityData.task7MeetPlaceVo.finishedCount!==_0x3e0c75.activityData.task7MeetPlaceVo.upLimit){
            console.log('执行逛会场');
            _0x3e0c75.upFlag=true;
            let _0x24bd60=await _0x55b883(_0x3e0c75,'wxFansInterActionActivity/doMeetingTask',_0x3e0c75.body);
            console.log(JSON.stringify(_0x24bd60));
            await _0x3e0c75.wait(3000);
        }else{
            console.log('逛会场已完成');
        }
    }
}
function _0x29580e(_0x3fbabe,_0x1abc21){
    if(typeof URL!=='undefined'){
        let _0x1efa7d=new URL(_0x3fbabe);
        let _0x3c359f=_0x1efa7d.searchParams.get(_0x1abc21);
        return _0x3c359f?_0x3c359f:'';
    }else{
        const _0x236e74=_0x3fbabe.match(/\?.*/)[0].substring(1);
        const _0x589b46=_0x236e74.split('&');
        for(let _0x4fd3c5=0;_0x4fd3c5<_0x589b46.length;_0x4fd3c5++){
            const _0x229d14=_0x589b46[_0x4fd3c5].split('=');
            if(_0x229d14[0]===_0x1abc21){
                return _0x589b46[_0x4fd3c5].substr(_0x589b46[_0x4fd3c5].indexOf('=')+1);
            }
        }
        return'';
    }
}
async function _0x35a5c3(_0x48a174){
    let _0xf8bed6={'url':'https://api.m.jd.com/client.action?functionId=isvObfuscator','body':_0x48a174.body,'headers':{'Host':'api.m.jd.com','accept':'*/*','user-agent':'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)','accept-language':'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6','content-type':'application/x-www-form-urlencoded','Cookie':_0x48a174.cookie}};
    return new Promise(_0x2df2dc=>{
        _0x48a174.post(_0xf8bed6,async(_0x57899c,_0x2aab7b,_0x439def)=>{
            try{
                if(_0x57899c){
                    console.log(''+JSON.stringify(_0x57899c));
                    console.log(_0x48a174.name+' API请求失败，请检查网路重试');
                }else{
                    _0x439def=JSON.parse(_0x439def);
                }
            }catch(_0x1de4f3){
                _0x48a174.logErr(_0x1de4f3,_0x2aab7b);
            }
            finally{
                _0x2df2dc(_0x439def.token||'');
            }
        });
    });
}
async function _0x56cb48(_0x5de389){
    let _0x1fc7f5={'url':_0x5de389.thisActivityUrl,'headers':{'Host':_0x5de389.host,'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','Cookie':'IsvToken='+_0x5de389.token+';'+_0x5de389.cookie,'User-Agent':_0x5de389['UA'],'Accept-Language':'zh-cn','Accept-Encoding':'gzip, deflate, br','Connection':'keep-alive'}};
    return new Promise(_0x304514=>{
        _0x5de389.get(_0x1fc7f5,(_0x2258e2,_0x2421ae,_0x453b1c)=>{
            try{
                _0x4572fd(_0x5de389,_0x2421ae);
            }catch(_0x1a0015){
                _0x5de389.logErr(_0x1a0015,_0x2421ae);
            }
            finally{
                _0x304514(_0x453b1c);
            }
        });
    });
}
function _0x4572fd(_0xe7c67,_0x4212cc){
    if(_0x4212cc===undefined){
        return;
    }
    let _0x7b353c=_0x4212cc.headers['set-cookie']||_0x4212cc.headers['Set-Cookie']||'';
    if(_0x7b353c){
        let _0xdb179f=_0x7b353c.filter(_0x13f6b2=>_0x13f6b2.indexOf('lz_jdpin_token')!==-1)[0];
        if(_0xdb179f&&(_0xdb179f.indexOf('lz_jdpin_token=')>-1)){
            _0xe7c67.lz_jdpin_token=_0xdb179f.split(';')&&(_0xdb179f.split(';')[0]+';')||'';
        }
        let _0x24f58f=_0x7b353c.filter(_0x47a2f5=>_0x47a2f5.indexOf('LZ_TOKEN_KEY')!==-1)[0];
        if(_0x24f58f&&(_0x24f58f.indexOf('LZ_TOKEN_KEY=')>-1)){
            let _0x2e9391=_0x24f58f.split(';')&&_0x24f58f.split(';')[0]||'';
            _0xe7c67.LZ_TOKEN_KEY=_0x2e9391.replace('LZ_TOKEN_KEY=','');
        }
        let _0x4a2a51=_0x7b353c.filter(_0x5f1b90=>_0x5f1b90.indexOf('LZ_TOKEN_VALUE')!==-1)[0];
        if(_0x4a2a51&&(_0x4a2a51.indexOf('LZ_TOKEN_VALUE=')>-1)){
            let _0x15d0e5=_0x4a2a51.split(';')&&_0x4a2a51.split(';')[0]||'';
            _0xe7c67.LZ_TOKEN_VALUE=_0x15d0e5.replace('LZ_TOKEN_VALUE=','');
        }
        let _0x17ca4b=_0x7b353c.filter(_0x1d0e2a=>_0x1d0e2a.indexOf('LZ_AES_PIN')!==-1)[0];
        if(_0x17ca4b&&(_0x17ca4b.indexOf('LZ_AES_PIN=')>-1)){
            let _0x36a552=_0x17ca4b.split(';')&&_0x17ca4b.split(';')[0]||'';
            _0xe7c67.LZ_AES_PIN=_0x36a552.replace('LZ_AES_PIN=','');
        }
    }
}
async function _0x55b883(_0x245e4e,_0xc80fb7,_0x1d60df='activityId='+_0x245e4e.activityId+'&pin='+encodeURIComponent(_0x245e4e.pin)){
    let _0x248516='https://'+_0x245e4e.host+'/'+_0xc80fb7;
    switch(_0xc80fb7){
        case 'customer/getSimpleActInfoVo':
        case 'dz/common/getSimpleActInfoVo':
        case 'wxCommonInfo/initActInfo':
        case 'wxCollectionActivity/shopInfo':
        case 'wxCollectCard/shopInfo':
        case 'wxCollectCard/drawContent':
            _0x1d60df='activityId='+_0x245e4e.activityId;
            break;
        case 'customer/getMyPing':
            _0x1d60df='userId='+_0x245e4e.venderId+'&token='+encodeURIComponent(_0x245e4e.token)+'&fromType=APP';
            break;
        case 'common/accessLogWithAD':
        case 'common/accessLog':
            _0x1d60df='venderId='+_0x245e4e.venderId+'&code='+_0x245e4e.activityType+'&pin='+encodeURIComponent(_0x245e4e.pin)+'&activityId='+_0x245e4e.activityId+'&pageUrl='+encodeURIComponent(_0x245e4e.thisActivityUrl)+'&subType=app&adSource=null';
            break;
        case 'wxActionCommon/getUserInfo':
            _0x1d60df='pin='+encodeURIComponent(_0x245e4e.pin);
            break;
        case 'wxCommonInfo/getActMemberInfo':
            _0x1d60df='venderId='+_0x245e4e.venderId+'&activityId='+_0x245e4e.activityId+'&pin='+encodeURIComponent(_0x245e4e.pin);
            break;
        case 'wxActionCommon/getShopInfoVO':
            _0x1d60df='userId='+_0x245e4e.venderId;
            break;
        case '2222':
            _0x1d60df='222';
            break;
    }
    const _0x180b52={'X-Requested-With':'XMLHttpRequest','Connection':'keep-alive','Accept-Encoding':'gzip, deflate, br','Content-Type':'application/x-www-form-urlencoded','Origin':'https://'+_0x245e4e.host,'User-Agent':_0x245e4e['UA'],'Cookie':_0x245e4e.cookie+' LZ_TOKEN_KEY='+_0x245e4e.LZ_TOKEN_KEY+'; LZ_TOKEN_VALUE='+_0x245e4e.LZ_TOKEN_VALUE+'; LZ_AES_PIN = '+_0x245e4e.LZ_AES_PIN+';AUTH_C_USER='+_0x245e4e.pin+'; '+_0x245e4e.lz_jdpin_token,'Host':_0x245e4e.host,'Referer':_0x245e4e.thisActivityUrl,'Accept-Language':'zh-cn','Accept':'application/json'};
    let _0xd40517={'url':_0x248516,'method':'POST','headers':_0x180b52,'body':_0x1d60df};
    return new Promise(async _0x2e8242=>{
        _0x245e4e.post(_0xd40517,(_0x4123fc,_0x344499,_0x2bfec8)=>{
            try{
                _0x4572fd(_0x245e4e,_0x344499);
                if(_0x2bfec8){
                    _0x2bfec8=JSON.parse(_0x2bfec8);
                }
            }catch(_0x231f72){
                console.log(_0x2bfec8);
                _0x245e4e.logErr(_0x231f72,_0x344499);
            }
            finally{
                _0x2e8242(_0x2bfec8);
            }
        });
    });
}
async function _0x423b59(_0x1dd1ec){
    _0x1dd1ec.shopactivityId='';
    await _0x1dd1ec.wait(1000);
    await _0x3772b1(_0x1dd1ec);
    let _0x18ff0e='';
    if(_0x1dd1ec.shopactivityId)_0x18ff0e='"activityId":'+_0x1dd1ec.shopactivityId;
    let _0x3e35b7='{"venderId":"'+_0x1dd1ec.venderId+'","shopId":"'+_0x1dd1ec.venderId+'","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0,'+_0x18ff0e+'"channel":406}';
    let _0x55d401=await _0x2d25d6('bindWithVender',_0x3e35b7);
    let _0x54827e={'url':'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body='+_0x55d401,'headers':{'Content-Type':'text/plain; Charset=UTF-8','Origin':'https://api.m.jd.com','Host':'api.m.jd.com','accept':'*/*','User-Agent':_0x1dd1ec['ua'],'content-type':'application/x-www-form-urlencoded','Referer':'https://shopmember.m.jd.com/shopcard/?venderId='+_0x1dd1ec.venderId+'&shopId='+_0x1dd1ec.venderId,'Cookie':_0x1dd1ec.cookie}};
    return new Promise(async _0xc6d829=>{
        _0x1dd1ec.get(_0x54827e,async(_0x5c1dbd,_0x56d641,_0x10f3a6)=>{
            try{
                if(_0x10f3a6.indexOf('活动太火爆')!==-1){
                    _0x1dd1ec.canHelp=false;
                }
                console.log(_0x10f3a6);
            }catch(_0x41e963){
                console.log(_0x5c1dbd);
                _0x1dd1ec.logErr(_0x41e963,_0x56d641);
            }
            finally{
                _0xc6d829(_0x10f3a6);
            }
        });
    });
}
async function _0x3772b1(_0x45e595){
    let _0x505293={'url':'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22'+_0x45e595.venderId+'%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888','headers':{'Content-Type':'text/plain; Charset=UTF-8','Origin':'https://api.m.jd.com','Host':'api.m.jd.com','accept':'*/*','User-Agent':_0x45e595['ua'],'content-type':'application/x-www-form-urlencoded','Referer':'https://shopmember.m.jd.com/shopcard/?venderId='+_0x45e595.venderId+'&shopId='+_0x45e595.venderId,'Cookie':_0x45e595.cookie}};
    return new Promise(_0x405002=>{
        _0x45e595.get(_0x505293,async(_0x3477c2,_0x2d4a30,_0x5daa20)=>{
            try{
                _0x5daa20=JSON.parse(_0x5daa20);
                if(_0x5daa20.success==true){
                    console.log('入会:'+(_0x5daa20.result.shopMemberCardInfo.venderCardName||''));
                    _0x45e595.shopactivityId=_0x5daa20.result.interestsRuleList&&_0x5daa20.result.interestsRuleList[0]&&_0x5daa20.result.interestsRuleList[0].interestsInfo&&_0x5daa20.result.interestsRuleList[0].interestsInfo.activityId||'';
                }
            }catch(_0x335aa6){
                _0x45e595.logErr(_0x335aa6,_0x2d4a30);
            }
            finally{
                _0x405002();
            }
        });
    });
}
function _0x958263(_0x8ad40c,_0x28a6fb){
    var _0x2d8ca2=_0x8ad40c.slice(0),_0x35e44c=_0x8ad40c.length,_0x134426=(_0x35e44c-_0x28a6fb),_0x1c15e8,_0x50616a;
    while(_0x35e44c-->_0x134426){
        _0x50616a=Math.floor(_0x35e44c+1*Math.random());
        _0x1c15e8=_0x2d8ca2[_0x50616a];
        _0x2d8ca2[_0x50616a]=_0x2d8ca2[_0x35e44c];
        _0x2d8ca2[_0x35e44c]=_0x1c15e8;
    }
    return _0x2d8ca2.slice(_0x134426);
}
async function _0x299432(){
    $.helpFalg=false;
    $.runFlag=true;
    for(let _0x374274=0;_0x374274<cookiesArr.length;_0x374274++){
        let _0x42f164=['QeIexkaFC5uOTXe1H68kGw==',];
        let _0x4490a8=_0x958263(_0x42f164,1)[0];
        await _0x26236f(cookiesArr[_0x374274],_0x4490a8);
        await $.wait(100);
        await _0x4c42bf(cookiesArr[_0x374274],_0x4490a8);
        await $.wait(100);
        await _0x8c0efb(cookiesArr[_0x374274],_0x4490a8);
        await $.wait(100);
        await _0x526c54(cookiesArr[_0x374274],_0x4490a8);
        await $.wait(100);
    }
}
async function _0x26236f(_0x159147,_0x5d8de6){
    let _0x286883=+new Date();
    let _0x47f10f={'url':'https://api.m.jd.com/?t='+_0x286883,'body':'functionId=InviteFriendChangeAssertsService&body='+JSON.stringify({'method':'attendInviteActivity','data':{'inviterPin':encodeURIComponent(_0x5d8de6),'channel':1,'token':'','frontendInitStatus':''}})+'&referer=-1&eid=eidI9b2981202fsec83iRW1nTsOVzCocWda3YHPN471AY78%2FQBhYbXeWtdg%2F3TCtVTMrE1JjM8Sqt8f2TqF1Z5P%2FRPGlzA1dERP0Z5bLWdq5N5B2VbBO&aid=&client=ios&clientVersion=14.4.2&networkType=wifi&fp=-1&uuid=ab048084b47df24880613326feffdf7eee471488&osVersion=14.4.2&d_brand=iPhone&d_model=iPhone10,2&agent=-1&pageClickKey=-1&platform=3&lang=zh_CN&appid=market-task-h5&_t='+_0x286883,'headers':{
            'Host':'api.m.jd.com','Accept':'application/json, text/plain, */*','Content-type':'application/x-www-form-urlencoded','Origin':'https://invite-reward.jd.com','Accept-Language':'zh-CN,zh-Hans;q=0.9','User-Agent':$.isNode()?process.env.JS_USER_AGENT?process.env.JS_USER_AGENT:require('./JS_USER_AGENTS').USER_AGENT:$.getdata('JSUA')?$.getdata('JSUA'):'\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','Referer':'https://invite-reward.jd.com/','Accept-Encoding':'gzip, deflate, br','Cookie':_0x159147
        }};
    $.post(_0x47f10f,(_0x5bf740,_0x594128,_0x30d697)=>{});
}
async function _0x4c42bf(_0x198746,_0x2b2f04){
    let _0xbda493={'url':'https://api.m.jd.com/','body':'functionId=TaskInviteService&body='+JSON.stringify({'method':'participateInviteTask','data':{'channel':'1','encryptionInviterPin':encodeURIComponent(_0x2b2f04),'type':1}})+'&appid=market-task-h5&uuid=&_t='+Date.now(),'headers':{
            'Host':'api.m.jd.com','Accept':'application/json, text/plain, */*','Content-Type':'application/x-www-form-urlencoded','Origin':'https://assignment.jd.com','Accept-Language':'zh-CN,zh-Hans;q=0.9','User-Agent':$.isNode()?process.env.JS_USER_AGENT?process.env.JS_USER_AGENT:require('./JS_USER_AGENTS').USER_AGENT:$.getdata('JSUA')?$.getdata('JSUA'):'\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','Referer':'https://assignment.jd.com/','Accept-Encoding':'gzip, deflate, br','Cookie':_0x198746
        }};
    $.post(_0xbda493,(_0x345a39,_0x4b4538,_0x4589f6)=>{});
}
async function _0x8c0efb(_0x51b8fc,_0xb95efd){
    let _0x50239b=Date.now();
    var _0x918d65={
        'Host':'api.m.jd.com','accept':'application/json, text/plain, */*','content-type':'application/x-www-form-urlencoded','origin':'https://invite-reward.jd.com','accept-language':'zh-cn','user-agent':$.isNode()?process.env.JS_USER_AGENT?process.env.JS_USER_AGENT:require('./JS_USER_AGENTS').USER_AGENT:$.getdata('JSUA')?$.getdata('JSUA'):'\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','referer':'https://invite-reward.jd.com/','Cookie':_0x51b8fc
    };
    var _0xa46716='functionId=InviteFriendApiService&body={"method":"attendInviteActivity","data":{"inviterPin":"'+encodeURIComponent(_0xb95efd)+'","channel":1,"token":"","frontendInitStatus":""}}&referer=-1&eid=eidIf3dd8121b7sdmiBLGdxRR46OlWyh62kFAZogTJFnYqqRkwgr63%2BdGmMlcv7EQJ5v0HBic81xHXzXLwKM6fh3i963zIa7Ym2v5ehnwo2B7uDN92Q0&aid=&client=ios&clientVersion=14.4&networkType=wifi&fp=-1&appid=market-task-h5&_t='+_0x50239b;
    var _0x55d54e={'url':'https://api.m.jd.com/?t='+Date.now(),'headers':_0x918d65,'body':_0xa46716};
    $.post(_0x55d54e,(_0x26a700,_0x1f282b,_0x4591c4)=>{});
}
async function _0x526c54(_0x5e7e2e,_0x2716ae){
    let _0x4f3059=Date.now();
    let _0x32515c={
        'Host':'api.m.jd.com','accept':'application/json, text/plain, */*','content-type':'application/x-www-form-urlencoded','origin':'https://assignment.jd.com','accept-language':'zh-cn','user-agent':$.isNode()?process.env.JS_USER_AGENT?process.env.JS_USER_AGENT:require('./JS_USER_AGENTS').USER_AGENT:$.getdata('JSUA')?$.getdata('JSUA'):'\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','referer':'https://assignment.jd.com/?inviterId='+encodeURIComponent(_0x2716ae),'Cookie':_0x5e7e2e
    };
    let _0x3fe85d='functionId=TaskInviteService&body={"method":"participateInviteTask","data":{"channel":"1","encryptionInviterPin":"'+encodeURIComponent(_0x2716ae)+'","type":1}}&appid=market-task-h5&uuid=&_t='+_0x4f3059;
    var _0xfc2842={'url':'https://api.m.jd.com/','headers':_0x32515c,'body':_0x3fe85d};
    $.post(_0xfc2842,(_0x2acc58,_0x16bc0d,_0x1ed9cf)=>{});
}
function _0xa37b74(){
    $.UUID=_0x4b9e67(40);
    const _0x15cc3d={'167814':'10.1.4','167841':'10.1.6'};
    $.osVersion=_0x52060d(12,14)+'.'+_0x52060d(0,6);
    let _0x1189c3='network/'+['4g','5g','wifi'][_0x52060d(0,2)];
    $.mobile='iPhone'+_0x52060d(9,13)+','+_0x52060d(1,3);
    $.build=['167814','167841','167894'][_0x52060d(0,1)];
    $.appVersion=_0x15cc3d[$.build];
    return 'jdapp;iPhone;'+$.appVersion+';'+$.osVersion+';'+$.UUID+';'+_0x1189c3+';model/'+$.mobile+';addressid/'+_0x52060d(1000000000)+';appBuild/'+$.build+';jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS '+$.osVersion.replace(/\./g,'_')+' like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1';
}
function _0x4b9e67(_0x4a1194,_0x5c42d4=0){
    var _0x8889c9='',_0x746098=_0x4a1194,_0x5b214a=[...Array(35).keys()].map(_0x348f29=>_0x348f29.toString(36));
    if(_0x5c42d4){
        _0x746098=Math.floor(Math.random()*_0x5c42d4-_0x4a1194+1+_0x4a1194);
    }
    for(let _0x2467f3=0;_0x2467f3<_0x746098;){
        let _0x4b9e67=Math.random().toString(16).substring(2);
        if(_0x746098-_0x2467f3>_0x4b9e67.length){
            _0x8889c9+=_0x4b9e67;
            _0x2467f3+=_0x4b9e67.length;
        }else{
            _0x8889c9+=_0x4b9e67.slice(_0x2467f3-_0x746098);
            _0x2467f3+=_0x4b9e67.length;
        }
    }
    return _0x8889c9;
}
function _0x52060d(_0x3957bd,_0x1cac23){
    if(arguments.length===0)return Math.random();
    if(!_0x1cac23)_0x1cac23=(10**Math.log(_0x3957bd)*Math.LOG10E+0x1|0x0-1);
    return Math.floor(Math.random()*_0x1cac23-_0x3957bd+1+_0x3957bd);
}
function _0x3bb99c(){
    const _0x15a182='0123456789',_0x517a09=3,_0x2d5bdf=(Math.random()*0xa|0x0),_0x59cb4b=16;
    let _0x54eda9='',_0x119be8='';
    !((_0x3eb71b,_0x15a182)=>{
        let _0x390a03=_0x15a182.split(''),_0x31dd04=[];
        for(let _0x3fb889=0;_0x3fb889<_0x3eb71b;_0x3fb889++){
            let _0x2d5bdf=(Math.random()*_0x390a03.length-0x1|0x0);
            _0x31dd04.push(_0x390a03[_0x2d5bdf]);
            _0x390a03.splice(_0x2d5bdf,1);
        }
        _0x54eda9=_0x31dd04.join(''),_0x119be8=_0x390a03.join('');
    })(_0x517a09,_0x15a182);
    return((_0x4fd62e,_0x276c2a)=>{
        let _0x5c6460=_0x4fd62e,_0xde7ee0=(_0x59cb4b-_0x517a09-_0x4fd62e.toString().length-_0x4fd62e),_0x50a3='';
        while(_0x5c6460--)_0x50a3+=_0x276c2a[Math.random()*_0x276c2a.length|0x0];
        _0x50a3+=_0x54eda9;
        while(_0xde7ee0--)_0x50a3+=_0x276c2a[Math.random()*_0x276c2a.length|0x0];
        _0x50a3+=_0x4fd62e;
        return _0x50a3;
    })(_0x2d5bdf,_0x119be8);
}
async function _0x5a3e90(){
    const _0x35b567={'url':'https://cactus.jd.com/request_algo?g_ty=ajax','headers':{'Authority':'cactus.jd.com','Pragma':'no-cache','Cache-Control':'no-cache','Accept':'application/json','User-Agent':$['ua'],'Content-Type':'application/json','Origin':'https://st.jingxi.com','Sec-Fetch-Site':'cross-site','Sec-Fetch-Mode':'cors','Sec-Fetch-Dest':'empty','Referer':'https://st.jingxi.com/','Accept-Language':'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'},'body':JSON.stringify({'version':'3.0','fp':$.fingerprint,'appId':$.appId,'timestamp':Date.now(),'platform':'web','expandParams':''})};
    return new Promise(async _0x1c2b41=>{
        $.post(_0x35b567,(_0x5c61c0,_0x80a416,_0x5b0fae)=>{
            try{
                if(_0x5c61c0){
                    console.log(''+JSON.stringify(_0x5c61c0));
                    console.log('request_algo 签名参数API请求失败，请检查网路重试');
                }else{
                    if(_0x5b0fae){
                        _0x5b0fae=JSON.parse(_0x5b0fae);
                        if(_0x5b0fae.status===200){
                            $.tokenTk=_0x5b0fae.data.result['tk'];
                            let _0x556a81=_0x5b0fae.data.result.algo;
                            if(_0x556a81)$.enCryptMethodJD=new Function('return '+_0x556a81)();
                        }else{
                            console.log('request_algo 签名参数API请求失败:');
                        }
                    }else{
                        console.log('京东服务器返回空数据');
                    }
                }
            }catch(_0x1962be){
                $.logErr(_0x1962be,_0x80a416);
            }
            finally{
                _0x1c2b41();
            }
        });
    });
}
async function _0x2d25d6(_0x41760c,_0x3b730b){
    const _0x404b9b=$.CryptoJS.SHA256(_0x3b730b).toString($.CryptoJS.enc.Hex);
    let _0x3e8afa='jsonp_'+Date.now()+'_52022';
    let _0x474a0f='https://api.m.jd.com/client.action?appid=jd_shop_member&functionId='+_0x41760c+'&body='+_0x404b9b+'&clientVersion=9.2.0&client=H5&uuid=88888&jsonp='+_0x3e8afa;
    const _0x3fbd0a='appid,body,client,clientVersion,functionId,jsonp';
    const _0x4ec858=Date.now();
    const _0x1ee88c=_0x1e7749('yyyyMMddhhmmssSSS',new Date(_0x4ec858));
    let _0x8526b3=$.enCryptMethodJD($.tokenTk,$.fingerprint.toString(),_0x1ee88c.toString(),$.appId.toString(),$.CryptoJS).toString($.CryptoJS.enc.Hex);
    let _0x356b2e='';
    _0x3fbd0a.split(',').map((_0x51faa6,_0x209aa1)=>{
        _0x356b2e+=_0x51faa6+':'+_0x29580e(_0x474a0f,_0x51faa6)+((_0x209aa1===_0x3fbd0a.split(',').length-1)?'':'&');
    });
    const _0x33ae36=$.CryptoJS.HmacSHA256(_0x356b2e,_0x8526b3.toString()).toString($.CryptoJS.enc.Hex);
    let _0x39d61f=[''.concat(_0x1ee88c.toString()),''.concat($.fingerprint.toString()),''.concat($.appId.toString()),''.concat($.tokenTk),''.concat(_0x33ae36),''.concat('3.0'),''.concat(_0x4ec858)].join(';');
    let _0x48c06a=encodeURIComponent(_0x3b730b)+'&clientVersion=9.2.0&client=H5&uuid=88888&h5st='+encodeURIComponent(_0x39d61f)+'&jsonp='+_0x3e8afa;
    return _0x48c06a;
}
function _0x1e7749(_0x1dff8f,_0x49a711){
    var _0x160666=_0x1dff8f,_0x250f85={'M+':(_0x49a711.getMonth()+1),'d+':_0x49a711.getDate(),'D+':_0x49a711.getDate(),'h+':_0x49a711.getHours(),'H+':_0x49a711.getHours(),'m+':_0x49a711.getMinutes(),'s+':_0x49a711.getSeconds(),'w+':_0x49a711.getDay(),'q+':Math.floor(_0x49a711.getMonth()+3/3),'S+':_0x49a711.getMilliseconds()};
    /(y+)/i.test(_0x160666)&&(_0x160666=_0x160666.replace(RegExp['$1'],''.concat(_0x49a711.getFullYear()).substr(4-RegExp['$1'].length)));
    for(var _0x3ce35a in _0x250f85){
        if(new RegExp('('.concat(_0x3ce35a,')')).test(_0x160666)){
            var _0x1ea3bd,_0x260c76=('S+'===_0x3ce35a)?'000':'00';
            _0x160666=_0x160666.replace(RegExp['$1'],(1==RegExp['$1'].length)?_0x250f85[_0x3ce35a]:(''.concat(_0x260c76)+_0x250f85[_0x3ce35a]).substr(''.concat(_0x250f85[_0x3ce35a]).length));
        }
    }
    return _0x160666;
};


// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}