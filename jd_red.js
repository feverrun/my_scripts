/*
领红包
返利变量：CODE1111
export CODE1111="xxxxxxx"
*/

const $ = new Env('领红包');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';



$.CryptoJS = require('crypto-js')
const jsdom = require('jsdom');
let rebateCodes = '';
let rebatePin = '';
let redTimes = 0
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}


// if(!rebateCodes) rebateCodes='xdKrO3x';
if(!rebatePin)rebatePin='';
rebateCodes=$.isNode()?process.env.CODE1111?process.env.CODE1111:''+rebateCodes:$.getdata('CODE1111')?$.getdata('CODE1111'):''+rebateCodes;
rebatePin=$.isNode()?process.env.CODE1111_PIN?process.env.CODE1111_PIN:''+rebatePin:$.getdata('CODE1111_PIN')?$.getdata('CODE1111_PIN'):''+rebatePin;
redTimes=$.isNode()?process.env.CODE1111_REDTIMES?process.env.CODE1111_REDTIMES:''+redTimes:$.getdata('CODE1111_REDTIMES')?$.getdata('CODE1111_REDTIMES'):''+redTimes;
let iIill11I=rebatePin&&rebatePin.split(',')||[];
rebateCode=rebateCodes+'';
$.time('yyyy-MM-dd HH:mm:ss');
message='';
newCookie='';
resMsg='';
$.uiUpdateTime='';
$.endFlag=false;
$.runEnd=false;
let IIiiiIii={};
$.getH5st_WQ_Arr={};
$.runArr={};
let iIill1i1=null;
const i1I11ilI='2022/11/12 00:00:00+08:00';
let Il1IIilI=new Date().getTime()+new Date().getTimezoneOffset()*60*1000+8*60*60*1000;
let iiIiiIli=$.time('H',Il1IIilI);
$.UVCookieArr={};
lr={};
$.UVCookie='';
let i1IlIl1l='';
let lIIIIliI='';
$.time('yyyy-MM-dd');
i1IIilil();
!(async()=>{
    if(/https:\/\/u\.jd\.com\/.+/.test(rebateCode)){
        if(rebateCode.split('/').pop()){
            rebateCode=rebateCode.split('/').pop().split('?').shift();
        }else{
            console.log('请填写正确的rebateCode');
            return;
        }
    }
    if(!cookiesArr[0]){
        $.msg($.name,'【提示】请先获取cookie\n直接使用NobyDa的京东签到获取','https://bean.m.jd.com/',{'open-url':'https://bean.m.jd.com/'});
        if(process&&process.env&&process.env.jd_221111_Red_code=='tg'){
            console.log('===encryption==='),$.setdata('===encryption===','jd_221111_Red_code');
        }
        return;
    }
    if(Il1IIilI>new Date(i1I11ilI).getTime()){
        $.msg($.name,'活动已结束','请删除此脚本');
        $.setdata('','JD_221111_Reds');
        $.setdata('','JD_221111_Red');
        $.setdata('','JD_221111_Red_pin');
        return;
    }
    // console.log('当前版本：2022年11月2日 V14');
    // console.log('返利码：'+rebateCode.replace(/.+(.{3})/,'***$1')+'\n');
    const authorCodes=['xKItE54','xtIutS4','xdIinzp','xtIwBYL','xdIwcx6','xMILovD','xtIMZPy','xMILxNZ','xdIG2aq','xCIiHia'];
    if (!rebateCodes) rebateCode = authorCodes[random(0, authorCodes.length)];
    $.shareCodeArr={};
    $.shareCodePinArr=$.getdata('JD_221111_Red_pin')||{};
    $.shareCode='';
    $.again=false;
    let l1liI1il=false;
    await l1I1I1Il();
    for(let i=0;i<cookiesArr.length&&!$.runEnd;i++){
        if($.endFlag)break;
        cookie=cookiesArr[i];
        if(cookie){
            $.UserName=decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/)&&cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
            $.index=i+1;
            if($.runArr[$.UserName])continue;
            console.log('\n\n******开始【京东账号'+$.index+'】'+($.nickName||$.UserName)+'*********\n');

            if (i==0 && rebateCodes) {
                rebateCode = authorCodes[random(0, authorCodes.length)];
            }else {
                if (rebateCodes) {
                    rebateCode = rebateCodes;
                }else {
                    rebateCode = authorCodes[random(0, authorCodes.length)];
                }
            }

            let i1lIIii1=1;
            if(!cookie.includes('app_open')){
                i1lIIii1=2;
            }
            await getUA(i1lIIii1);
            await li1li111();
            await $.wait(parseInt(Math.random()*100+100,10))
            if($.endFlag)break;
        }
        $.setdata($.shareCodePinArr,'JD_221111_Red_pin');
    }
    $.setdata($.shareCodePinArr,'JD_221111_Red_pin');
    if(message){
        $.msg($.name,'',message+'\nhttps://u.jd.com/'+rebateCode+'\n\n跳转到app 可查看助力情况');
        if($.isNode()){}
    }
})().catch(iIilIi1=>$.logErr(iIilIi1)).finally(()=>{
    if(iIill1i1)iIill1i1.close();
    $.done();
});

async function li1li111(llllIllI=0){
    try{
        $.UVCookie=$.UVCookieArr[$.UserName]||'';
        if(!$.UVCookie){
            i1IIilil();
        }
        resMsg='';
        let IIlIlIi=false;
        let I11l1Ii=0;
        let II1iiill=0;
        let IIl1iIiI=0;
        $.shareFlag=true;
        do{
            if(II1iiill>2)I11l1Ii=0;
            $.flag=0;
            newCookie='';
            $.url1='';
            await IIll1ll();
            if(!$.url1){
                console.log('获取url1失败');
                break;
            }
            $.url2='';
            $.UVCookie=i1IlIl1l.getUVCookie('','',$.url1,$.UVCookie);
            $.UVCookieArr[$.UserName]=$.UVCookie+'';
            await iIIIlIi();
            if(!/unionActId=\d+/.test($.url2)&&!new RegExp('&d='+rebateCode).test($.url2)){
                console.log('改返利url：https://u.jd.com/'+rebateCode+' 可能不是红包页面');
                $.runEnd=true;
                return;
            }
            if(!$.url2)$.url2='https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html?unionActId=31149&d='+rebateCode+'&cu=true&utm_source=kong&utm_medium=jingfen';
            $.actId=$.url2.match(/mall\/active\/([^\/]+)\/index\.html/)&&$.url2.match(/mall\/active\/([^\/]+)\/index\.html/)[1]||'22Dzqz8Cvk1Cj7BdKE46ZKSVARFE';
            $.UVCookie=i1IlIl1l.getUVCookie('','',$.url2,$.UVCookie);
            $.UVCookieArr[$.UserName]=$.UVCookie+'';
            let Il1li1i1=getBody($.UA,$.url2);
            await l111i11(Il1li1i1);
            if(!$.eid){
                $.eid=-1;
            }
            if(llllIllI==0){
                let i1li1l11=0;
                let ii1I1l1=true;
                let lIli1liI=0;
                if(Object.getOwnPropertyNames(IIiiiIii).length>I11l1Ii&&$.shareFlag){
                    for(let IIIlliIi in IIiiiIii||{}){
                        if(IIIlliIi==$.UserName){
                            $.flag=1;
                            continue;
                        }
                        if(i1li1l11==I11l1Ii){
                            $.flag=0;
                            $.shareCode=IIiiiIii[IIIlliIi]||'';
                            if($.shareCodePinArr[IIIlliIi]&&$.shareCodePinArr[IIIlliIi].includes($.UserName)){
                                lIli1liI++;
                                continue;
                            }
                            if($.shareCode.count>=$.shareCodeArr.shareCount){
                                lIli1liI++;
                                continue;
                            }
                            $.getlj=false;
                            if($.shareCode)console.log('助力['+IIIlliIi+']');
                            let i1I11ii1=await iIlIi1li($.shareCode.code,1);
                            if(/重复助力/.test(i1I11ii1)){
                                if(!$.shareCodePinArr[IIIlliIi])$.shareCodePinArr[IIIlliIi]=[];
                                $.shareCodePinArr[IIIlliIi].push($.UserName);
                                I11l1Ii--;
                                IIl1iIiI--;
                            }else if(/助力/.test(i1I11ii1)&&/上限/.test(i1I11ii1)){
                                $.shareFlag=false;
                            }else if(!/领取上限/.test(i1I11ii1)&&$.getlj==true){
                                if(!$.shareCodePinArr[IIIlliIi])$.shareCodePinArr[IIIlliIi]=[];
                                if(!$.shareCodePinArr[IIIlliIi].includes($.UserName)){
                                    $.shareCodePinArr[IIIlliIi].push($.UserName);
                                }
                                I11l1Ii--;
                            }else{
                                ii1I1l1=false;
                            }
                        }
                        i1li1l11++;
                    }
                }
                if(ii1I1l1&&lIli1liI==Object.getOwnPropertyNames(IIiiiIii).length){
                    IIlIlIi=true;
                }
                if(i1li1l11==0){
                    $.getlj=false;
                    let iIl1l1I1=await iIlIi1li('',1);
                    if(!/领取上限/.test(iIl1l1I1)&&$.getlj==true){
                        I11l1Ii--;
                    }
                }
                if($.endFlag)break;
            }else{
                let lIiii1I1=await iIi1IIl1();
                if(!$.endFlag&&lIiii1I1&&$.again==false)await I1i1l1ii();
                if($.again==false)break;
            }
            if($.again==true&&II1iiill<1){
                II1iiill++;
                $.again=false;
            }
            I11l1Ii++;
            IIl1iIiI++;
            if($.flag==1){
                await $.wait(parseInt(Math.random()*500+100,10));
            }
            if(redTimes>0&&redTimes<=IIl1iIiI)break;
        }while($.flag==1&&I11l1Ii<5);
        if($.endFlag)return;
        if(resMsg){
            message+='【京东账号'+$.index+'】\n'+resMsg;
        }
        if(IIlIlIi){
            console.log('\n获取新的助力信息');
            await l1I1I1Il(1);
        }
        await $.wait(parseInt(Math.random()*500+200,10));
    }catch(liIi1IIl){
        console.log(liIi1IIl);
    }
}
async function l1I1I1Il(i1lil1I1=0){
    try{
        let iili11l1=2;
        if(i1lil1I1==1)iili11l1=1;
        let i1Ii1IIl=0;
        for(let II11i1ll in $.shareCodeArr||{}){
            if(II11i1ll==='flag'||II11i1ll==='updateTime'||II11i1ll==='shareCount')continue;
            if($.shareCodeArr[II11i1ll]&&$.shareCodeArr.shareCount&&$.shareCodeArr[II11i1ll].count<$.shareCodeArr.shareCount)i1Ii1IIl++;
        }
        for(let lIIl11I1=0;lIIl11I1<cookiesArr.length&&!$.runEnd;lIIl11I1++){
            cookie=cookiesArr[lIIl11I1];
            if(cookie){
                $.UserName=decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/)&&cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
                if(iIill11I.length>0&&iIill11I.indexOf($.UserName)==-1||$.shareCodeArr[$.UserName])continue;
                $.index=lIIl11I1+1;
                await getUA();
                await li1li111(1);
                let l11llI1i=0;
                for(let II11i1ll in $.shareCodeArr||{}){
                    if(II11i1ll==='flag'||II11i1ll==='updateTime'||II11i1ll==='shareCount')continue;
                    if($.shareCodeArr[II11i1ll]&&$.shareCodeArr.shareCount&&$.shareCodeArr[II11i1ll].count<$.shareCodeArr.shareCount)l11llI1i++;
                }
                if($.endFlag||l11llI1i-i1Ii1IIl>=iili11l1)break;
            }
        }
    }catch(illili1i){
        console.log(illili1i);
    }
    if(Object.getOwnPropertyNames($.shareCodeArr).length>0){
        for(let ilill1il in $.shareCodeArr||{}){
            if(ilill1il==='flag'||ilill1il==='updateTime'||ilill1il==='shareCount')continue;
            if($.shareCodeArr[ilill1il])IIiiiIii[ilill1il]=$.shareCodeArr[ilill1il];
        }
    }
}
function iIlIi1li(illIlIIi='',iIillli1=1){
    return new Promise(async I1I1Iill=>{
        $.UVCookie=i1IlIl1l.getUVCookie('','',$.url2,$.UVCookie);
        $.UVCookieArr[$.UserName]=$.UVCookie+'';
        let ill1111i='';
        let ll1I1il1=Date.now();
        const i1i1Ili={'platform':4,'unionActId':'31149','actId':$.actId,'d':rebateCode,'unionShareId':illIlIIi,'type':iIillli1,'eid':$.eid};
        const iii1I1li={'appid':'u','body':i1i1Ili,'client':'apple','clientVersion':'8.3.6','functionId':'getCoupons'};
        ill1111i=await IilIlI('6a98d',iii1I1li);
        ill1111i=encodeURIComponent(ill1111i);
        let lli1IIIi='';
        let lliI1i11={'url':'https://api.m.jd.com/api?functionId=getCoupons&appid=u&_='+ll1I1il1+'&loginType=2&body='+encodeURIComponent($.toStr(i1i1Ili))+'&client=apple&clientVersion=8.3.6&h5st='+ill1111i,'headers':{'accept':'*/*','Accept-Language':'zh-cn','Accept-Encoding':'gzip, deflate, br','Cookie':''+$.UVCookie+newCookie+' '+cookie,'origin':'https://prodev.m.jd.com','Referer':'https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html','User-Agent':$.UA}};
        if($.url2)lliI1i11.headers.Referer=$.url2;
        $.get(lliI1i11,async(lIIIiil1,i1llIili,I1i11Ill)=>{
            try{
                if(lIIIiil1){
                    console.log(''+$.toStr(lIIIiil1));
                    console.log($.name+' API请求失败，请检查网路重试');
                }else{
                    let I1liIIil=$.toObj(I1i11Ill,I1i11Ill);
                    if(typeof I1liIIil=='object'){
                        if(I1liIIil.msg){
                            lli1IIIi=I1liIIil.msg;
                            console.log(I1liIIil.msg);
                        }
                        if(I1liIIil.msg.indexOf('不展示弹层')>-1&&iIillli1==1)$.again=true;
                        if(I1liIIil.msg.indexOf('领取上限')===-1&&I1liIIil.msg.indexOf('登录')===-1){
                            if(iIillli1==1)$.flag=1;
                        }
                        if(I1liIIil.msg.indexOf('活动已结束')>-1||I1liIIil.msg.indexOf('活动未开始')>-1){
                            $.endFlag=true;
                            return;
                        }
                        if(illIlIIi&&typeof I1liIIil.data!=='undefined'&&typeof I1liIIil.data.joinNum!=='undefined'){
                            console.log('当前'+I1liIIil.data.joinSuffix+':'+I1liIIil.data.joinNum);
                        }
                        if(I1liIIil.code==0&&I1liIIil.data){
                            if(iIillli1==1)$.shareCode.count++;
                            let IiiIIil='';
                            if(I1liIIil.data.type==1){
                                $.getlj=true;
                                IiiIIil='获得[红包]🧧'+I1liIIil.data.discount+'元 使用时间:'+$.time('yyyy-MM-dd',I1liIIil.data.beginTime)+' '+$.time('yyyy-MM-dd',I1liIIil.data.endTime);
                            }else if(I1liIIil.data.type==3){
                                $.getlj=true;
                                IiiIIil='获得[优惠券]🎟️满'+I1liIIil.data.quota+'减'+I1liIIil.data.discount+' 使用时间:'+$.time('yyyy-MM-dd',I1liIIil.data.beginTime)+' '+$.time('yyyy-MM-dd',I1liIIil.data.endTime);
                            }else if(I1liIIil.data.type==6){
                                $.getlj=true;
                                IiiIIil='获得[打折券]]🎫满'+I1liIIil.data.quota+'打'+I1liIIil.data.discount*10+'折 使用时间:'+$.time('yyyy-MM-dd',I1liIIil.data.beginTime)+' '+$.time('yyyy-MM-dd',I1liIIil.data.endTime);
                            }else{
                                $.getlj=true;
                                IiiIIil='获得[未知]🎉'+(I1liIIil.data.quota||'')+' '+I1liIIil.data.discount+' 使用时间:'+$.time('yyyy-MM-dd',I1liIIil.data.beginTime)+' '+$.time('yyyy-MM-dd',I1liIIil.data.endTime);
                                console.log(I1i11Ill);
                            }
                            if(IiiIIil){
                                resMsg+=IiiIIil+'\n';
                                console.log(IiiIIil);
                            }
                        }
                        if(iIillli1==1&&typeof I1liIIil.data!=='undefined'&&typeof I1liIIil.data.groupData!=='undefined'&&typeof I1liIIil.data.groupData.groupInfo!=='undefined'){
                            for(let l11l11Ii of I1liIIil.data.groupData.groupInfo||[]){
                                if(l11l11Ii.status==2){
                                    console.log('助力满可以领取'+l11l11Ii.info+'元红包🧧');
                                    await $.wait(parseInt(Math.random()*2000+2000,10));
                                    await iIlIi1li('',2);
                                }
                            }
                        }
                    }else{
                        console.log(I1i11Ill);
                    }
                }
            }catch(l1IIl1Il){
                $.logErr(l1IIl1Il,i1llIili);
            }finally{
                I1I1Iill(lli1IIIi);
            }
        });
    });
}
function iIi1IIl1(II1lI11i=''){
    let ilii1I11=true;
    return new Promise(i1l1Ill1=>{
        $.UVCookie=i1IlIl1l.getUVCookie('','',$.url2,$.UVCookie);
        $.UVCookieArr[$.UserName]=$.UVCookie+'';
        let Il1i1l1l={'url':'https://api.m.jd.com/api?functionId=showCoupon&appid=u&_='+Date.now()+'&loginType=2&body={%22actId%22:%22'+$.actId+'%22,%22unionActId%22:%2231149%22,%22unpl%22:%22'+$.unpl+'%22,%22platform%22:4,%22unionShareId%22:%22%22,'+($.uiUpdateTime?'%22uiUpdateTime%22:'+$.uiUpdateTime+',':'')+'%22d%22:%22'+rebateCode+'%22,%22eid%22:%22'+$.eid+'%22}&client=iPhone&clientVersion=&osVersion=iOS&screen=414*896&d_brand=iPhone&d_model=iPhone&lang=zh-cn&sdkVersion=&openudid=','headers':{'accept':'*/*','Accept-Language':'zh-cn','Accept-Encoding':'gzip, deflate, br','Cookie':''+$.UVCookie+newCookie+' '+cookie,'origin':'https://prodev.m.jd.com','Referer':'https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html','User-Agent':$.UA}};
        if($.url2)Il1i1l1l.headers.Referer=$.url2;
        $.get(Il1i1l1l,async(i1i1IIil,IiiillI,Iii1Illl)=>{
            try{
                if(i1i1IIil){
                    console.log(''+$.toStr(i1i1IIil));
                    console.log($.name+' API请求失败，请检查网路重试');
                }else{
                    let II1i1lI1=$.toObj(Iii1Illl,Iii1Illl);
                    if(typeof II1i1lI1=='object'){
                        if(II1i1lI1.msg)console.log(II1i1lI1.msg);
                        if(II1i1lI1.msg.indexOf('不展示弹层')>-1)$.again=true;
                        if(II1i1lI1.msg.indexOf('领取上限')>-1)$.runArr[$.UserName]=true;
                        if(II1i1lI1.msg.indexOf('上限')===-1&&II1i1lI1.msg.indexOf('登录')===-1){
                            $.flag=1;
                        }
                        if(II1i1lI1.msg.indexOf('活动已结束')>-1||II1i1lI1.msg.indexOf('活动未开始')>-1){
                            $.endFlag=true;
                            return;
                        }
                        if(II1i1lI1.data.uiUpdateTime)$.uiUpdateTime=II1i1lI1.data.uiUpdateTime;
                        if(typeof II1i1lI1.data!=='undefined'&&typeof II1i1lI1.data.groupData!=='undefined'&&typeof II1i1lI1.data.groupData.joinNum!=='undefined'){
                            $.joinNum=II1i1lI1.data.groupData.joinNum;
                            $.shareCount=0;
                            for(let l1lliliI of II1i1lI1.data.groupData.groupInfo){
                                if($.shareCount<l1lliliI.num)$.shareCount=l1lliliI.num;
                            }
                            if($.shareCodeArr[$.UserName]){
                                $.shareCodeArr[$.UserName].count=$.shareCount;
                            }
                            $.shareCodeArr.shareCount=$.shareCount;
                            if($.shareCount<=$.joinNum){
                                if(!$.shareCodeArr[$.UserName])$.shareCodeArr[$.UserName]={};
                                $.shareCodeArr[$.UserName].count=$.joinNum;
                                ilii1I11=false;
                            }
                            console.log('【账号'+$.index+'】'+($.nickName||$.UserName)+' '+$.joinNum+'/'+$.shareCount+'人');
                        }
                        if(II1i1lI1.msg.indexOf('活动已结束')>-1){
                            ilii1I11=false;
                        }
                        if(typeof II1i1lI1.data!=='undefined'&&typeof II1i1lI1.data.groupData!=='undefined'&&typeof II1i1lI1.data.groupData.groupInfo!=='undefined'){
                            for(let Il1II1 of II1i1lI1.data.groupData.groupInfo||[]){
                                if(Il1II1.status==2){
                                    console.log('助力满可以领取'+Il1II1.info+'元红包🧧');
                                    await $.wait(parseInt(Math.random()*2000+2000,10));
                                    await iIlIi1li('',2);
                                }
                            }
                        }
                    }else{
                        console.log(Iii1Illl);
                    }
                }
            }catch(lIlIi1l1){
                $.logErr(lIlIi1l1,IiiillI);
            }finally{
                i1l1Ill1(ilii1I11);
            }
        });
    });
}
function I1i1l1ii(){
    if($.shareCodeArr[$.UserName]){
        console.log('【账号'+$.index+'】缓存分享码:'+$.shareCodeArr[$.UserName].code.replace(/.+(.{3})/,'***$1'));
        return;
    }
    return new Promise(ll1i11I=>{
        let llIlIIi1={'url':'https://api.m.jd.com/api?functionId=shareUnionCoupon&appid=u&_='+Date.now()+'&loginType=2&body={%22unionActId%22:%2231149%22,%22actId%22:%22'+$.actId+'%22,%22platform%22:4,%22unionShareId%22:%22%22,%22d%22:%22'+rebateCode+'%22,%22supportPic%22:2,%22supportLuckyCode%22:0,%22eid%22:%22'+$.eid+'%22}&client=iPhone&clientVersion=&osVersion=iOS&screen=414*896&d_brand=iPhone&d_model=iPhone&lang=zh-cn&sdkVersion=&openudid=','headers':{'accept':'*/*','Accept-Language':'zh-cn','Accept-Encoding':'gzip, deflate, br','Cookie':''+$.UVCookie+newCookie+' '+cookie,'origin':'https://prodev.m.jd.com','Referer':'https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html','User-Agent':$.UA}};
        $.get(llIlIIi1,async(iII1iI1l,Il1liIl,lIi1Il11)=>{
            try{
                if(iII1iI1l){
                    console.log(''+$.toStr(iII1iI1l));
                    console.log($.name+' API请求失败，请检查网路重试');
                }else{
                    let i1ilI1i1=$.toObj(lIi1Il11,lIi1Il11);
                    if(typeof i1ilI1i1=='object'){
                        if(i1ilI1i1.code==0&&i1ilI1i1.data&&i1ilI1i1.data.shareUrl){
                            let lliiIlil=i1ilI1i1.data.shareUrl.match(/\?s=([^&]+)/)&&i1ilI1i1.data.shareUrl.match(/\?s=([^&]+)/)[1]||'';
                            if(lliiIlil){
                                console.log('【账号'+$.index+'】分享码：'+lliiIlil.replace(/.+(.{3})/,'***$1'));
                                $.shareCodeArr[$.UserName]={'code':lliiIlil,'count':$.joinNum};
                            }
                        }
                    }else{
                        console.log(lIi1Il11);
                    }
                }
            }catch(lliill){
                $.logErr(lliill,Il1liIl);
            }finally{
                ll1i11I();
            }
        });
    });
}
function iIIIlIi(){
    return new Promise(il1IiIII=>{
        const lIil1ili={'url':$.url1,'followRedirect':false,'headers':{'Cookie':''+$.UVCookie+newCookie+' '+cookie,'User-Agent':$.UA}};
        $.get(lIil1ili,async(l11iilii,lllli1,lllI11II)=>{
            try{
                I1IiI11(lllli1);
                $.url2=lllli1&&lllli1.headers&&(lllli1.headers.location||lllli1.headers.Location||'')||'';
                $.url2=decodeURIComponent($.url2);
                $.url2=$.url2.match(/(https:\/\/prodev[\.m]{0,}\.jd\.com\/mall[^'"]+)/)&&$.url2.match(/(https:\/\/prodev[\.m]{0,}\.jd\.com\/mall[^'"]+)/)[1]||'';
            }catch(iIllI){
                $.logErr(iIllI,lllli1);
            }finally{
                il1IiIII(lllI11II);
            }
        });
    });
}
function IIll1ll(){
    return new Promise(iIII1Ili=>{
        const liliI1l={'url':'https://u.jd.com/'+rebateCode+($.shareCode&&'?s='+$.shareCode||''),'followRedirect':false,'headers':{'Cookie':''+$.UVCookie+newCookie+' '+cookie,'User-Agent':$.UA}};
        $.get(liliI1l,async(illlIIl1,ilii1II,IlI1ii1l)=>{
            try{
                I1IiI11(ilii1II);
                $.url1=IlI1ii1l&&IlI1ii1l.match(/(https:\/\/u\.jd\.com\/jda[^']+)/)&&IlI1ii1l.match(/(https:\/\/u\.jd\.com\/jda[^']+)/)[1]||'';
            }catch(Il1iiIli){
                $.logErr(Il1iiIli,ilii1II);
            }finally{
                iIII1Ili(IlI1ii1l);
            }
        });
    });
}
function l111i11(I1I1ilI1){
    return new Promise(i1lII11I=>{
        const iiiIIIIl={'url':'https://gia.jd.com/fcf.html?a='+I1I1ilI1.a,'body':'d='+I1I1ilI1.d,'headers':{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','User-Agent':$.UA}};
        $.post(iiiIIIIl,async(li1I11,liiI1iiI,i11ll1iI)=>{
            try{
                if(li1I11){
                    throw new Error(li1I11);
                }else{
                    if(i11ll1iI.indexOf('*_*')>0){
                        i11ll1iI=i11ll1iI.split('*_*',2);
                        i11ll1iI=JSON.parse(i11ll1iI[1]);
                        $.eid=i11ll1iI.eid;
                    }else{
                        console.log('京豆api返回数据为空，请检查自身原因');
                    }
                }
            }catch(i1I1l1i){
                $.logErr(i1I1l1i,liiI1iiI);
            }finally{
                i1lII11I(i11ll1iI);
            }
        });
    });
}
function I1IiI11(il1iIi1i){
    let IiI1I1i1=il1iIi1i&&il1iIi1i.headers&&(il1iIi1i.headers['set-cookie']||il1iIi1i.headers['Set-Cookie']||'')||'';
    let li11IiIl='';
    if(IiI1I1i1){
        if(typeof IiI1I1i1!='object'){
            li11IiIl=IiI1I1i1.split(',');
        }else li11IiIl=IiI1I1i1;
        for(let II11I1II of li11IiIl){
            let IIIiil1=II11I1II.split(';')[0].trim();
            if(IIIiil1.split('=')[1]){
                if(IIIiil1.split('=')[0]=='unpl'&&IIIiil1.split('=')[1]){
                    $.unpl=IIIiil1.split('=')[1];
                }
                if(newCookie.indexOf(IIIiil1.split('=')[1])==-1)newCookie+=IIIiil1.replace(/ /g,'')+'; ';
            }
        }
    }
}
function getUA(iilII=1){
    iilII=1;
    if(iilII==2){
        $.UA='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    }else{
        let userNameString=$.CryptoJS.SHA1($.UserName+'reds').toString();
        $.UA='jdapp;iPhone;'+getJDVersion()+';'+getIphoneVersion()+';'+userNameString+';M/5.0;network/wifi;ADID/;model/iPhone15,1;addressid/;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1';
    }
}
function i11Iii11(li1iiil){
    if(typeof li1iiil=='string'){
        try{
            return JSON.parse(li1iiil);
        }catch(iiIiiIIl){
            console.log(iiIiiIIl);
            $.msg($.name,'','请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie');
            return[];
        }
    }
}
async function l1iIIil(i1Ii1i1i){
    return new Promise(I11ii=>setTimeout(I11ii,i1Ii1i1i));
}

async function IilIlI(iI1i1il,IIIIi1){
    if(!$.getH5st_WQ_Arr[$.UserName])$.getH5st_WQ_Arr[$.UserName]={};
    let Ill11Iil=$.getH5st_WQ_Arr[$.UserName];
    if(!iIill1i1){
        await iIliiilI();
    }
    iIill1i1.localStorage.setItem('WQ__dy_tk_s_'+iI1i1il,Ill11Iil['WQ__dy_tk_s_'+iI1i1il]||'');
    iIill1i1.localStorage.setItem('WQ__dy_algo_s_'+iI1i1il,Ill11Iil['WQ__dy_algo_s_'+iI1i1il]||'');
    iIill1i1.localStorage.setItem('WQ_qe_'+iI1i1il,Ill11Iil['WQ_qe_'+iI1i1il]||'');
    return new Promise(async l1IIl1l1=>{
        let ii11ll11='';
        try{
            if(typeof iIill1i1.signWaap==='function'){
                ii11ll11=await iIill1i1.signWaap(iI1i1il,IIIIi1);
            }else{
                let i1lll1I1=0;
                timer=setInterval(async()=>{
                    i1lll1I1++;
                    if(typeof iIill1i1.signWaap==='function'){
                        clearInterval(timer);
                        timer=null;
                        ii11ll11=await iIill1i1.signWaap(iI1i1il,IIIIi1);
                    }
                    if(i1lll1I1>=100){
                        clearInterval(timer);
                    }
                },100);
            }
        }catch(l1I1I11i){
            console.log(l1I1I11i);
        }finally{
            if(ii11ll11){
                Ill11Iil['WQ__dy_tk_s_'+iI1i1il]=iIill1i1.localStorage.getItem('WQ__dy_tk_s_'+iI1i1il);
                Ill11Iil['WQ__dy_algo_s_'+iI1i1il]=iIill1i1.localStorage.getItem('WQ__dy_algo_s_'+iI1i1il);
                Ill11Iil['WQ_qe_'+iI1i1il]=iIill1i1.localStorage.getItem('WQ_qe_'+iI1i1il);
            }
            l1IIl1l1(ii11ll11);
        }
    });
}


async function iIliiilI(){
    try{
        const{JSDOM}=jsdom;
        let lii1i11i={'url':'https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html?unionActId=31149&d='+rebateCode+'&cu=true&utm_source=kong&utm_medium=jingfen','referrer':'https://u.jd.com/','userAgent':'jdapp;iPhone;10.5.2;14.3;;M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','runScripts':'dangerously','resources':new jsdom[('ResourceLoader')]({'userAgent':'jdapp;iPhone;10.1.4;14.3;;M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','referrer':'https://u.jd.com/'}),'includeNodeLocations':true,'storageQuota':10000000,'pretendToBeVisual':true,'virtualConsole':new jsdom[('VirtualConsole')]()};
        const llliIiil=new JSDOM('<body>\n        <script src="https://static.360buyimg.com/siteppStatic/script/mescroll/map.js"></script>\n        <script src="https://storage.360buyimg.com/webcontainer/js_security_v3.js"></script>\n        <script src="https://static.360buyimg.com/siteppStatic/script/utils.js"></script>\n        </body>',lii1i11i);
        await l1iIIil(1000);
        iIill1i1=llliIiil.window;
    }catch(i111ilii){
        console.log(i111ilii);
    }
}
function getJDVersion() {
    let version = [
        '10.1.4', '10.1.2', '10.1.0', '10.0.10', '10.0.8', '10.0.6', '10.0.5', '10.0.4', '10.0.2', '10.0.1', '10.0.0',
        '10.1.6', '10.2.0', '10.2.4', '10.2.6', '10.3.0', '10.3.2', '10.3.3', '10.3.4', '10.3.5', '10.4.0', '10.4.2', '10.4.3', '10.4.4',
        '10.4.5', '10.4.6', '10.5.0', '10.5.2', '10.5.4', '11.0.0', '11.0.2', '11.0.4', '11.1.0', '11.1.2', '11.1.4', '11.2.0', '11.2.4', '11.2.5', '11.2.6',
    ];
    return version[random(0, version.length)]
}

function getIphoneVersion() {
    let version = [
        '9.0','9.1','9.2','9.3','10.0','10.1','10.2','10.3','11.0','11.1','11.2','11.3','11.4',
        '12.0', '12.1', '12.2', '12.3', '12.4', '12.5', '13.0', '13.1', '13.2', '13.3', '13.4', '13.5', '13.6', '13.7',
        '14.0', '14.1', '14.2', '14.3', '14.4', '14.5', '14.6', '14.7', '14.8', '15.0', '15.1', '15.2', '15.3',
        '15.4','15.5','15.6',
    ];
    return version[random(0, version.length)]
}
function random(m,n){
    return Math.floor(Math.random()*(n-m))+m;
}
function i1IIilil(){
    class I111lill{
        constructor(){
            this.UVCookie='';
            this.ltr=0;
            this.mr=[1,0];
            this.document={'cookie':'','cookies':'__jdc=123;','domain':'prodev.m.jd.com','referrer':'https://u.jd.com/','location':{'href':'https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html','hrefs':'https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html'}};
            this.navigator={'userAgent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1','userAgents':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'};
            this.window={};
        }['getUVCookie'](ilii1lI1='',Ilil1il='',Il1Iili1='',l1lliiiI=''){
            try{
                this.document.location.href=this.document.location.hrefs+'';
                this.document.cookie=this.document.cookies+'';
                if(Il1Iili1)this.document.location.href=Il1Iili1;
                if(l1lliiiI)this.document.cookie=l1lliiiI;
                this.UVCookie='';
                this.navigator.userAgent=this.navigator.userAgents+'';
                this.ltr=1011+Math.round(31*Math.random());
                if(false){
                    this.mr[1]++;
                    if(this.mr[1]>=314){
                        this.mr[1]=Math.round(31*Math.random());
                    }
                    if(!Ilil1il){
                        Ilil1il=$.CryptoJS.SHA1('').toString();
                    }
                    let IllilIll=0;
                    while(true){
                        this.mr[0]=parseInt(Ilil1il.match(/\d/g)[IllilIll]);
                        IllilIll++;
                        if(this.mr[0]>0||IllilIll>=Ilil1il.match(/\d/g).length){
                            break;
                        }
                    }
                    this.mr[0]+=Math.round((new Date().getTime()-new Date('2022-09-02').getTime())/86400000);
                }
                if(ilii1lI1)this.navigator.userAgent=ilii1lI1;
                this.lr={'ckJda':'__jda','ckJdb':'__jdb','ckJdv':'__jdv','ckJdc':'__jdc','refUrl':'https://u.jd.com/'};
                this.q();
                this.s(Ilil1il);
                return this.UVCookie;
            }catch(I1lIIl1I){
                console.log(I1lIIl1I);
            }
        }['s'](lil1iii=''){
            var lIIiiill,Il1I1lll,illII1ll,l111i1l1,IiIl1iII=(this.getCookie(this.lr.ckJda)||'').split('.'),iii1IIIl=(this.getCookie(this.lr.ckJdb)||'').split('.'),I11lIii1=(this.getCookie(this.lr.ckJdv)||'').split('|'),iiIill1l=this.getCookie(this.lr.ckJdc)||'',i11l1Iil=parseInt((new Date().getTime()-this.ltr)/1000),li11ilI1=0,i1lIiIIl=1,iIi11I1i='direct',IilIi1l='-',IiIlii1I='none',lliiii11='-';
            if(IiIl1iII.length>3)for(var llIlilII=2;llIlilII<5&&llIlilII<IiIl1iII.length;llIlilII++){
                var lIi1IiI1=IiIl1iII[llIlilII];
                lIi1IiI1.length>10&&(IiIl1iII[llIlilII]=lIi1IiI1.substr(0,10));
            }
            IiIl1iII.length>5?(illII1ll=IiIl1iII[0],l111i1l1=IiIl1iII[1],lIIiiill=parseInt(IiIl1iII[2],10),Il1I1lll=parseInt(IiIl1iII[3],10),i11l1Iil=parseInt(IiIl1iII[4],10),i1lIiIIl=parseInt(IiIl1iII[5],10)||i1lIiIIl):(l111i1l1=this.genUuid(),lIIiiill=i11l1Iil,Il1I1lll=i11l1Iil),this.lr.uuid=l111i1l1,iii1IIIl.length>3&&(illII1ll||(illII1ll=iii1IIIl[0]),li11ilI1=parseInt(iii1IIIl[1],10)||0),I11lIii1.length>4&&(illII1ll||(illII1ll=I11lIii1[0]),iIi11I1i=I11lIii1[1],IilIi1l=I11lIii1[2],IiIlii1I=I11lIii1[3],lliiii11=I11lIii1[4]),iiIill1l&&''!==iiIill1l&&(illII1ll||(illII1ll=iiIill1l));
            var lIl1iI1i,l111iII=[],llI1lll=iii1IIIl.length<4,I1IIIIil=this.getParameter('utm_source'),userNameString=!1;
            if(I1IIIIil){
                var iIIl1llI=this.getParameter('utm_campaign'),lliiIl1=this.getParameter('utm_medium'),l1i1II1i=this.getParameter('utm_term');
                l111iII.push(I1IIIIil||iIi11I1i),l111iII.push(iIIl1llI||IilIi1l),l111iII.push(lliiIl1||IiIlii1I),l111iII.push(l1i1II1i||lliiii11),lliiii11=l111iII[3],userNameString=!0;
            }else{
                var l11IIlil,lll1I11l=this.lr.refUrl&&this.lr.refUrl.split('/')[2],II11i1lI=!1;
                if(lll1I11l&&lll1I11l.indexOf(this.lr.ckDomain)<0){
                    for(l11IIlil=this.lr.seo,llIlilII=0;llIlilII<l11IIlil.length;llIlilII++){
                        var iilI1l=l11IIlil[llIlilII].split(':');
                        if(lll1I11l.indexOf(iilI1l[0].toLowerCase())>-1&&this.lr.refUrl.indexOf((iilI1l[1]+'=').toLowerCase())>-1){
                            var iI1iill1=this.getParameter(iilI1l[1],this.lr.refUrl);
                            /[^\x00-\xff]/.test(iI1iill1)&&(iI1iill1=encodeURIComponent(iI1iill1)),l111iII.push(iilI1l[0]),l111iII.push('-'),l111iII.push('organic'),l111iII.push(iI1iill1||'not set'),lliiii11=l111iII[3],II11i1lI=!0;
                            break;
                        }
                    }
                    II11i1lI||(lll1I11l.indexOf('zol.com.cn')>-1?(l111iII.push('zol.com.cn'),l111iII.push('-'),l111iII.push('cpc'),l111iII.push('not set')):(l111iII.push(lll1I11l),l111iII.push('-'),l111iII.push('referral'),l111iII.push('-')));
                }
            }
            lIl1iI1i=l111iII.length>0&&(l111iII[0]!==iIi11I1i||l111iII[1]!==IilIi1l||l111iII[2]!==IiIlii1I)&&'referral'!==l111iII[2],llI1lll||!llI1lll&&lIl1iI1i?(iIi11I1i=l111iII[0]||iIi11I1i,IilIi1l=l111iII[1]||IilIi1l,IiIlii1I=l111iII[2]||IiIlii1I,lliiii11=l111iII[3]||lliiii11,IiIl1iII.length>5?(lIIiiill=parseInt(IiIl1iII[2],10),Il1I1lll=parseInt(IiIl1iII[4],10),i11l1Iil=parseInt((new Date().getTime()-this.ltr)/1000),i1lIiIIl++,li11ilI1=1):(i1lIiIIl=1,li11ilI1=1)):li11ilI1++;
            var I1iilIil=this.getPageParamFromSdk();
            if(I1iilIil&&I1iilIil.vts){
                var iI111l1I=1*I1iilIil.vts,lil111li=1*I1iilIil.seq;
                (iI111l1I>i1lIiIIl||iI111l1I===i1lIiIIl&&lil111li>=li11ilI1)&&(i1lIiIIl=iI111l1I,li11ilI1=lil111li+1);
            }
            if(illII1ll||(illII1ll=this.genHash(this.lr.ckDomain)),this.setCookie(this.lr.ckJda,[illII1ll,l111i1l1,lIIiiill,Il1I1lll,i11l1Iil,i1lIiIIl||1].join('.'),this.lr.ckDomain,this.lr.ckJdaExp),this.setCookie(this.lr.ckJdb,[illII1ll,li11ilI1,l111i1l1+'|'+i1lIiIIl,i11l1Iil].join('.'),this.lr.ckDomain,this.lr.ckJdbExp),userNameString||lIl1iI1i||I11lIii1.length<5){
                var illl1l=[illII1ll,iIi11I1i||'direct',IilIi1l||'-',IiIlii1I||'none',lliiii11||'-',new Date().getTime()-this.ltr].join('|');
                this.setJdv(illl1l=encodeURIComponent(illl1l),illII1ll);
            }
            this.setCookie(this.lr.ckJdc,illII1ll,this.lr.ckDomain);
            if(false){
                this.setCookie('mba_sid',this.mr.join('.'),this.lr.ckDomain);
                this.setCookie('mba_muid',[l111i1l1,this.mr[0],new Date().getTime()].join('.'),this.lr.ckDomain);
                var li11ilI1=0;
                var ii1lIi1l='';
                if(lil1iii){
                    while(true){
                        ii1lIi1l+=lil1iii.match(/\d/g)[li11ilI1];
                        li11ilI1++;
                        if(ii1lIi1l.split('').length>=2||li11ilI1>=lil1iii.match(/\d/g).length){
                            break;
                        }
                    }
                }
            }
        }['q'](){
            this.lr.rpDomain=this.lr.rpDomain||'uranus.jd.com',this.lr.logUrl='//'+this.lr.rpDomain+'/log/m',this.lr.logType={'pv':'1','pf':'2','cl':'3','od':'4','pd':'5','hm':'6','magic':'000001'},this.lr.useTmpCookie?(this.lr.ckJda='__tra',this.lr.ckJdb='__trb',this.lr.ckJdc='__trc',this.lr.ckJdu='__tru'):(this.lr.ckJda='__jda',this.lr.ckJdb='__jdb',this.lr.ckJdc='__jdc',this.lr.ckJdu='__jdu'),this.lr.ckJdv='__jdv',this.lr.ckWxAppCk='__jdwxapp',this.lr.ckRefCls='__jd_ref_cls',this.lr.ckJdaExp=15552000000,this.lr.ckJdbExp=1800000,this.lr.ckJduExp=15552000000,this.lr.ckJdvExp=1296000000,this.lr.ckJdvEmbeddedExp=86400000,this.lr.ckWxAppCkExp=15552000000,this.lr.mtSubsiteExp=31536000000,this.lr.ckDomain=(this.document.domain.match(/[^.]+\.(com.cn|net.cn|org.cn|gov.cn|edu.cn)$/)||[''])[0]||this.document.domain.replace(/.*?([^.]+\.[^.]+)$/,'$1'),this.lr.title=this.document.title,this.lr.refUrl=this.document.referrer,this.lr.seo=['i.easou.com:q','m.baidu.com:word','m.sm.cn:q','m.so.com:q','wap.sogou.com:keyword','m.sogou.com:keyword','wap.sogo.com:keyword','m.sogo.com:keyword','page.roboo.com:q','ask.com:q','baidu:word','baidu:wd','bing:q','easou:q','google:q','roboo:word','roboo:q','sm.cn:q','so.com:q','sogou:keyword','sogou:query','sogo.com:keyword','sogo.com:query','yahoo:p','yandex:text','yicha:key'];
        }['setCookie'](liiiIiil,Ii1llii1,iiiilIIl,II1ili1I){
            if(liiiIiil){
                var ii1Iili1='';
                if(II1ili1I){
                    var ll1i1l=new Date();
                    ll1i1l.setTime(ll1i1l.getTime()-this.ltr+II1ili1I),ii1Iili1=';expires='+ll1i1l.toGMTString();
                }
                this.UVCookie+=liiiIiil+'='+Ii1llii1+'; ';
            }
        }['setJdv'](lli1I1ll,I11liiIi,ilIIIilI){
            var Il1ilill='';
            Il1ilill=this.isPrey(10)&&(!lli1I1ll||lli1I1ll.length>400)?I11liiIi+'|direct|-|none|-|'+(new Date().getTime()-this.ltr):lli1I1ll;
            var l1IIll1l=ilIIIilI||this.isEmbedded()?this.lr.ckJdvEmbeddedExp:this.lr.ckJdvExp;
            this.setCookie(this.lr.ckJdv||'__jdv',Il1ilill,this.lr.ckDomain,l1IIll1l);
        }['getCookie'](l1l11lIi,lilIIlil){
            var l1lIl1I=this.document.cookie.match(new RegExp('(^| )'+l1l11lIi+'=([^;]*)(;|$)'));
            return null!==l1lIl1I?lilIIlil?l1lIl1I[2]:this.urlDecode(l1lIl1I[2]):'';
        }['genUuid'](){
            return new Date().getTime()-this.ltr+''+parseInt(2147483647*Math.random());
        }['getParameter'](I1iIiIl1,lIillll){
            var l1l1I1li=lIillll||this.document.location.href,Il11iIii=new RegExp('(?:^|&|[?]|[/])'+I1iIiIl1+'=([^&]*)').exec(l1l1I1li);
            return Il11iIii?this.urlDecode(Il11iIii[1]):null;
        }['urlDecode'](IiiIiI1){
            try{
                return decodeURIComponent(IiiIiI1);
            }catch(iIiIlIll){
                return IiiIiI1;
            }
        }['genHash'](Il1l1l1I){
            var Iiil1ill,llIIli1=1,lil1il1I=0;
            if(Il1l1l1I)for(llIIli1=0,Iiil1ill=Il1l1l1I.length-1;Iiil1ill>=0;Iiil1ill--){
                llIIli1=0!==(lil1il1I=0xfe00000&(llIIli1=(llIIli1<<0x6&0xfffffff)+(lil1il1I=Il1l1l1I.charCodeAt(Iiil1ill))+(lil1il1I<<0xe)))?llIIli1^lil1il1I>>0x15:llIIli1;
            }
            return llIIli1;
        }['isPrey'](ll1l1i1i){
            if(ll1l1i1i>=100)return!0;
            var IIiII1li=this.lr.uuid,ilIiiIil=IIiII1li.substr(IIiII1li.length-2);
            return!!ilIiiIil&&1*ilIiiIil<ll1l1i1i;
        }['isEmbedded'](){
            var IlIIl1I1=this.navigator.userAgent||'';
            return/^(jdapp|jdltapp|jdpingou);/.test(IlIIl1I1)||this.isJdLog();
        }['isJdLog'](){
            return (this.navigator.userAgent||'').indexOf(';jdlog;')>-1;
        }['getPageParamFromSdk'](){
            var III1iliI,l1il1Iil;
            try{
                this.window.JDMAUnifyBridge&&this.window.JDMAUnifyBridge.JDMAGetMPageParam?l1il1Iil=JDMAUnifyBridge.JDMAGetMPageParam():this.window.JDMAGetMPageParam?l1il1Iil=JDMAGetMPageParam():this.window.webkit&&this.window.webkit.messageHandlers&&this.window.webkit.messageHandlers.JDMASetMPageParam&&(l1il1Iil=this.window.prompt('JDMAGetMPageParam','')),l1il1Iil&&(III1iliI=JSON.parse(l1il1Iil));
            }catch(lliii1li){}
            return III1iliI;
        }['time'](I1li11Ii,iiII1i1i=null){
            const iIiIIl1l=iiII1i1i?new Date(iiII1i1i):new Date();
            let iliI11l1={'M+':iIiIIl1l.getMonth()+1,'d+':iIiIIl1l.getDate(),'H+':iIiIIl1l.getHours(),'m+':iIiIIl1l.getMinutes(),'s+':iIiIIl1l.getSeconds(),'q+':Math.floor((iIiIIl1l.getMonth()+3)/3),'S':iIiIIl1l.getMilliseconds()};
            /(y+)/.test(I1li11Ii)&&(I1li11Ii=I1li11Ii.replace(RegExp.$1,(iIiIIl1l.getFullYear()+'').substr(4-RegExp.$1.length)));
            for(let iiII1i1i in iliI11l1)new RegExp('('+iiII1i1i+')').test(I1li11Ii)&&(I1li11Ii=I1li11Ii.replace(RegExp.$1,1==RegExp.$1.length?iliI11l1[iiII1i1i]:('00'+iliI11l1[iiII1i1i]).substr((''+iliI11l1[iiII1i1i]).length)));
            return I1li11Ii;
        }
    }i1IlIl1l=new I111lill();
};






function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}
const navigator = {
    userAgent: `jdapp;iPhone;10.1.4;14.3;${$.CryptoJS.SHA1(randomString(40)).toString()};M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    plugins: { length: 0 },
    language: "zh-CN",
};
const screen = {
    availHeight: 812,
    availWidth: 375,
    colorDepth: 24,
    height: 812,
    width: 375,
    pixelDepth: 24,
};
const window = {};
const document = {
    location: {
        ancestorOrigins: {},
        href: "https://prodev.m.jd.com/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html",
        origin: "https://prodev.m.jd.com",
        protocol: "https:",
        host: "prodev.m.jd.com",
        hostname: "prodev.m.jd.com",
        port: "",
        pathname: "/mall/active/22Dzqz8Cvk1Cj7BdKE46ZKSVARFE/index.html",
        search: "",
        hash: "",
    },
};
var start_time = new Date().getTime(),
    _jdfp_canvas_md5 = "",
    _jdfp_webgl_md5 = "",
    _fingerprint_step = 1,
    _JdEid = "",
    _eidFlag = !1,
    risk_jd_local_fingerprint = "",
    _jd_e_joint_;

function t(a) {
    if (null == a || void 0 == a || "" == a) return "NA";
    if (null == a || void 0 == a || "" == a) var b = "";
    else {
        b = [];
        for (var c = 0; c < 8 * a.length; c += 8)
            b[c >> 5] |= (a.charCodeAt(c / 8) & 255) << c % 32;
    }
    a = 8 * a.length;
    b[a >> 5] |= 128 << a % 32;
    b[(((a + 64) >>> 9) << 4) + 14] = a;
    a = 1732584193;
    c = -271733879;
    for (var l = -1732584194, h = 271733878, q = 0; q < b.length; q += 16) {
        var z = a,
            C = c,
            D = l,
            B = h;
        a = v(a, c, l, h, b[q + 0], 7, -680876936);
        h = v(h, a, c, l, b[q + 1], 12, -389564586);
        l = v(l, h, a, c, b[q + 2], 17, 606105819);
        c = v(c, l, h, a, b[q + 3], 22, -1044525330);
        a = v(a, c, l, h, b[q + 4], 7, -176418897);
        h = v(h, a, c, l, b[q + 5], 12, 1200080426);
        l = v(l, h, a, c, b[q + 6], 17, -1473231341);
        c = v(c, l, h, a, b[q + 7], 22, -45705983);
        a = v(a, c, l, h, b[q + 8], 7, 1770035416);
        h = v(h, a, c, l, b[q + 9], 12, -1958414417);
        l = v(l, h, a, c, b[q + 10], 17, -42063);
        c = v(c, l, h, a, b[q + 11], 22, -1990404162);
        a = v(a, c, l, h, b[q + 12], 7, 1804603682);
        h = v(h, a, c, l, b[q + 13], 12, -40341101);
        l = v(l, h, a, c, b[q + 14], 17, -1502002290);
        c = v(c, l, h, a, b[q + 15], 22, 1236535329);
        a = x(a, c, l, h, b[q + 1], 5, -165796510);
        h = x(h, a, c, l, b[q + 6], 9, -1069501632);
        l = x(l, h, a, c, b[q + 11], 14, 643717713);
        c = x(c, l, h, a, b[q + 0], 20, -373897302);
        a = x(a, c, l, h, b[q + 5], 5, -701558691);
        h = x(h, a, c, l, b[q + 10], 9, 38016083);
        l = x(l, h, a, c, b[q + 15], 14, -660478335);
        c = x(c, l, h, a, b[q + 4], 20, -405537848);
        a = x(a, c, l, h, b[q + 9], 5, 568446438);
        h = x(h, a, c, l, b[q + 14], 9, -1019803690);
        l = x(l, h, a, c, b[q + 3], 14, -187363961);
        c = x(c, l, h, a, b[q + 8], 20, 1163531501);
        a = x(a, c, l, h, b[q + 13], 5, -1444681467);
        h = x(h, a, c, l, b[q + 2], 9, -51403784);
        l = x(l, h, a, c, b[q + 7], 14, 1735328473);
        c = x(c, l, h, a, b[q + 12], 20, -1926607734);
        a = u(c ^ l ^ h, a, c, b[q + 5], 4, -378558);
        h = u(a ^ c ^ l, h, a, b[q + 8], 11, -2022574463);
        l = u(h ^ a ^ c, l, h, b[q + 11], 16, 1839030562);
        c = u(l ^ h ^ a, c, l, b[q + 14], 23, -35309556);
        a = u(c ^ l ^ h, a, c, b[q + 1], 4, -1530992060);
        h = u(a ^ c ^ l, h, a, b[q + 4], 11, 1272893353);
        l = u(h ^ a ^ c, l, h, b[q + 7], 16, -155497632);
        c = u(l ^ h ^ a, c, l, b[q + 10], 23, -1094730640);
        a = u(c ^ l ^ h, a, c, b[q + 13], 4, 681279174);
        h = u(a ^ c ^ l, h, a, b[q + 0], 11, -358537222);
        l = u(h ^ a ^ c, l, h, b[q + 3], 16, -722521979);
        c = u(l ^ h ^ a, c, l, b[q + 6], 23, 76029189);
        a = u(c ^ l ^ h, a, c, b[q + 9], 4, -640364487);
        h = u(a ^ c ^ l, h, a, b[q + 12], 11, -421815835);
        l = u(h ^ a ^ c, l, h, b[q + 15], 16, 530742520);
        c = u(l ^ h ^ a, c, l, b[q + 2], 23, -995338651);
        a = w(a, c, l, h, b[q + 0], 6, -198630844);
        h = w(h, a, c, l, b[q + 7], 10, 1126891415);
        l = w(l, h, a, c, b[q + 14], 15, -1416354905);
        c = w(c, l, h, a, b[q + 5], 21, -57434055);
        a = w(a, c, l, h, b[q + 12], 6, 1700485571);
        h = w(h, a, c, l, b[q + 3], 10, -1894986606);
        l = w(l, h, a, c, b[q + 10], 15, -1051523);
        c = w(c, l, h, a, b[q + 1], 21, -2054922799);
        a = w(a, c, l, h, b[q + 8], 6, 1873313359);
        h = w(h, a, c, l, b[q + 15], 10, -30611744);
        l = w(l, h, a, c, b[q + 6], 15, -1560198380);
        c = w(c, l, h, a, b[q + 13], 21, 1309151649);
        a = w(a, c, l, h, b[q + 4], 6, -145523070);
        h = w(h, a, c, l, b[q + 11], 10, -1120210379);
        l = w(l, h, a, c, b[q + 2], 15, 718787259);
        c = w(c, l, h, a, b[q + 9], 21, -343485551);
        a = A(a, z);
        c = A(c, C);
        l = A(l, D);
        h = A(h, B);
    }
    b = [a, c, l, h];
    a = "";
    for (c = 0; c < 4 * b.length; c++)
        a +=
            "0123456789abcdef".charAt((b[c >> 2] >> ((c % 4) * 8 + 4)) & 15) +
            "0123456789abcdef".charAt((b[c >> 2] >> ((c % 4) * 8)) & 15);
    return a;
}

function u(a, b, c, l, h, q) {
    a = A(A(b, a), A(l, q));
    return A((a << h) | (a >>> (32 - h)), c);
}

function v(a, b, c, l, h, q, z) {
    return u((b & c) | (~b & l), a, b, h, q, z);
}

function x(a, b, c, l, h, q, z) {
    return u((b & l) | (c & ~l), a, b, h, q, z);
}

function w(a, b, c, l, h, q, z) {
    return u(c ^ (b | ~l), a, b, h, q, z);
}

function A(a, b) {
    var c = (a & 65535) + (b & 65535);
    return (((a >> 16) + (b >> 16) + (c >> 16)) << 16) | (c & 65535);
}
_fingerprint_step = 2;
var y = "",
    n = navigator.userAgent.toLowerCase();
n.indexOf("jdapp") && (n = n.substring(0, 90));
var e = navigator.language,
    f = n;
-1 != f.indexOf("ipad") ||
-1 != f.indexOf("iphone os") ||
-1 != f.indexOf("midp") ||
-1 != f.indexOf("rv:1.2.3.4") ||
-1 != f.indexOf("ucweb") ||
-1 != f.indexOf("android") ||
-1 != f.indexOf("windows ce") ||
f.indexOf("windows mobile");
var r = "NA",
    k = "NA";
try {
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("95") &&
    ((r = "windows"), (k = "95")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("98") &&
    ((r = "windows"), (k = "98")),
    -1 != f.indexOf("win 9x") &&
    -1 != f.indexOf("4.90") &&
    ((r = "windows"), (k = "me")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 5.0") &&
    ((r = "windows"), (k = "2000")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt") &&
    ((r = "windows"), (k = "NT")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 5.1") &&
    ((r = "windows"), (k = "xp")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("32") &&
    ((r = "windows"), (k = "32")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 5.1") &&
    ((r = "windows"), (k = "7")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("6.0") &&
    ((r = "windows"), (k = "8")),
    -1 == f.indexOf("win") ||
    (-1 == f.indexOf("nt 6.0") && -1 == f.indexOf("nt 6.1")) ||
    ((r = "windows"), (k = "9")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 6.2") &&
    ((r = "windows"), (k = "10")),
    -1 != f.indexOf("linux") && (r = "linux"),
    -1 != f.indexOf("unix") && (r = "unix"),
    -1 != f.indexOf("sun") && -1 != f.indexOf("os") && (r = "sun os"),
    -1 != f.indexOf("ibm") && -1 != f.indexOf("os") && (r = "ibm os/2"),
    -1 != f.indexOf("mac") && -1 != f.indexOf("pc") && (r = "mac"),
    -1 != f.indexOf("aix") && (r = "aix"),
    -1 != f.indexOf("powerpc") && (r = "powerPC"),
    -1 != f.indexOf("hpux") && (r = "hpux"),
    -1 != f.indexOf("netbsd") && (r = "NetBSD"),
    -1 != f.indexOf("bsd") && (r = "BSD"),
    -1 != f.indexOf("osf1") && (r = "OSF1"),
    -1 != f.indexOf("irix") && ((r = "IRIX"), (k = "")),
    -1 != f.indexOf("freebsd") && (r = "FreeBSD"),
    -1 != f.indexOf("symbianos") &&
    ((r = "SymbianOS"), (k = f.substring(f.indexOf("SymbianOS/") + 10, 3)));
} catch (a) {}
_fingerprint_step = 3;
var g = "NA",
    m = "NA";
try {
    -1 != f.indexOf("msie") &&
    ((g = "ie"),
        (m = f.substring(f.indexOf("msie ") + 5)),
    m.indexOf(";") && (m = m.substring(0, m.indexOf(";"))));
    -1 != f.indexOf("firefox") &&
    ((g = "Firefox"), (m = f.substring(f.indexOf("firefox/") + 8)));
    -1 != f.indexOf("opera") &&
    ((g = "Opera"), (m = f.substring(f.indexOf("opera/") + 6, 4)));
    -1 != f.indexOf("safari") &&
    ((g = "safari"), (m = f.substring(f.indexOf("safari/") + 7)));
    -1 != f.indexOf("chrome") &&
    ((g = "chrome"),
        (m = f.substring(f.indexOf("chrome/") + 7)),
    m.indexOf(" ") && (m = m.substring(0, m.indexOf(" "))));
    -1 != f.indexOf("navigator") &&
    ((g = "navigator"), (m = f.substring(f.indexOf("navigator/") + 10)));
    -1 != f.indexOf("applewebkit") &&
    ((g = "applewebkit_chrome"),
        (m = f.substring(f.indexOf("applewebkit/") + 12)),
    m.indexOf(" ") && (m = m.substring(0, m.indexOf(" "))));
    -1 != f.indexOf("sogoumobilebrowser") &&
    (g = "\u641c\u72d7\u624b\u673a\u6d4f\u89c8\u5668");
    if (-1 != f.indexOf("ucbrowser") || -1 != f.indexOf("ucweb"))
        g = "UC\u6d4f\u89c8\u5668";
    if (-1 != f.indexOf("qqbrowser") || -1 != f.indexOf("tencenttraveler"))
        g = "QQ\u6d4f\u89c8\u5668";
    -1 != f.indexOf("metasr") && (g = "\u641c\u72d7\u6d4f\u89c8\u5668");
    -1 != f.indexOf("360se") && (g = "360\u6d4f\u89c8\u5668");
    -1 != f.indexOf("the world") &&
    (g = "\u4e16\u754c\u4e4b\u7a97\u6d4f\u89c8\u5668");
    -1 != f.indexOf("maxthon") && (g = "\u9068\u6e38\u6d4f\u89c8\u5668");
} catch (a) {}

class JdJrTdRiskFinger {
    f = {
        options: function () {
            return {};
        },
        nativeForEach: Array.prototype.forEach,
        nativeMap: Array.prototype.map,
        extend: function (a, b) {
            if (null == a) return b;
            for (var c in a) null != a[c] && b[c] !== a[c] && (b[c] = a[c]);
            return b;
        },
        getData: function () {
            return y;
        },
        get: function (a) {
            var b = 1 * m,
                c = [];
            "ie" == g && 7 <= b
                ? (c.push(n),
                    c.push(e),
                    (y = y + ",'userAgent':'" + t(n) + "','language':'" + e + "'"),
                    this.browserRedirect(n))
                : ((c = this.userAgentKey(c)), (c = this.languageKey(c)));
            c.push(g);
            c.push(m);
            c.push(r);
            c.push(k);
            y =
                y +
                ",'os':'" +
                r +
                "','osVersion':'" +
                k +
                "','browser':'" +
                g +
                "','browserVersion':'" +
                m +
                "'";
            c = this.colorDepthKey(c);
            c = this.screenResolutionKey(c);
            c = this.timezoneOffsetKey(c);
            c = this.sessionStorageKey(c);
            c = this.localStorageKey(c);
            c = this.indexedDbKey(c);
            c = this.addBehaviorKey(c);
            c = this.openDatabaseKey(c);
            c = this.cpuClassKey(c);
            c = this.platformKey(c);
            c = this.hardwareConcurrencyKey(c);
            c = this.doNotTrackKey(c);
            c = this.pluginsKey(c);
            c = this.canvasKey(c);
            c = this.webglKey(c);
            b = this.x64hash128(c.join("~~~"), 31);
            return a(b);
        },
        userAgentKey: function (a) {
            a.push(navigator.userAgent),
                (y = y + ",'userAgent':'" + t(navigator.userAgent) + "'"),
                this.browserRedirect(navigator.userAgent);
            return a;
        },
        replaceAll: function (a, b, c) {
            for (; 0 <= a.indexOf(b); ) a = a.replace(b, c);
            return a;
        },
        browserRedirect: function (a) {
            var b = a.toLowerCase();
            a = "ipad" == b.match(/ipad/i);
            var c = "iphone os" == b.match(/iphone os/i),
                l = "midp" == b.match(/midp/i),
                h = "rv:1.2.3.4" == b.match(/rv:1.2.3.4/i),
                q = "ucweb" == b.match(/ucweb/i),
                z = "android" == b.match(/android/i),
                C = "windows ce" == b.match(/windows ce/i);
            b = "windows mobile" == b.match(/windows mobile/i);
            y =
                a || c || l || h || q || z || C || b
                    ? y + ",'origin':'mobile'"
                    : y + ",'origin':'pc'";
        },
        languageKey: function (a) {
            "" ||
            (a.push(navigator.language),
                (y =
                    y +
                    ",'language':'" +
                    this.replaceAll(navigator.language, " ", "_") +
                    "'"));
            return a;
        },
        colorDepthKey: function (a) {
            "" ||
            (a.push(screen.colorDepth),
                (y = y + ",'colorDepth':'" + screen.colorDepth + "'"));
            return a;
        },
        screenResolutionKey: function (a) {
            if (!this.options.excludeScreenResolution) {
                var b = this.getScreenResolution();
                "undefined" !== typeof b &&
                (a.push(b.join("x")),
                    (y = y + ",'screenResolution':'" + b.join("x") + "'"));
            }
            return a;
        },
        getScreenResolution: function () {
            return this.options.detectScreenOrientation
                ? screen.height > screen.width
                    ? [screen.height, screen.width]
                    : [screen.width, screen.height]
                : [screen.height, screen.width];
        },
        timezoneOffsetKey: function (a) {
            this.options.excludeTimezoneOffset ||
            (a.push(new Date().getTimezoneOffset()),
                (y =
                    y +
                    ",'timezoneOffset':'" +
                    new Date().getTimezoneOffset() / 60 +
                    "'"));
            return a;
        },
        sessionStorageKey: function (a) {
            !this.options.excludeSessionStorage &&
            this.hasSessionStorage() &&
            (a.push("sessionStorageKey"), (y += ",'sessionStorage':true"));
            return a;
        },
        localStorageKey: function (a) {
            !this.options.excludeSessionStorage &&
            this.hasLocalStorage() &&
            (a.push("localStorageKey"), (y += ",'localStorage':true"));
            return a;
        },
        indexedDbKey: function (a) {
            !this.options.excludeIndexedDB &&
            this.hasIndexedDB() &&
            (a.push("indexedDbKey"), (y += ",'indexedDb':true"));
            return a;
        },
        addBehaviorKey: function (a) {
            document.body &&
            !this.options.excludeAddBehavior &&
            document.body.addBehavior
                ? (a.push("addBehaviorKey"), (y += ",'addBehavior':true"))
                : (y += ",'addBehavior':false");
            return a;
        },
        openDatabaseKey: function (a) {
            !this.options.excludeOpenDatabase && window.openDatabase
                ? (a.push("openDatabase"), (y += ",'openDatabase':true"))
                : (y += ",'openDatabase':false");
            return a;
        },
        cpuClassKey: function (a) {
            this.options.excludeCpuClass ||
            (a.push(this.getNavigatorCpuClass()),
                (y = y + ",'cpu':'" + this.getNavigatorCpuClass() + "'"));
            return a;
        },
        platformKey: function (a) {
            this.options.excludePlatform ||
            (a.push(this.getNavigatorPlatform()),
                (y = y + ",'platform':'" + this.getNavigatorPlatform() + "'"));
            return a;
        },
        hardwareConcurrencyKey: function (a) {
            var b = this.getHardwareConcurrency();
            a.push(b);
            y = y + ",'ccn':'" + b + "'";
            return a;
        },
        doNotTrackKey: function (a) {
            this.options.excludeDoNotTrack ||
            (a.push(this.getDoNotTrack()),
                (y = y + ",'track':'" + this.getDoNotTrack() + "'"));
            return a;
        },
        canvasKey: function (a) {
            if (!this.options.excludeCanvas && this.isCanvasSupported()) {
                var b = this.getCanvasFp();
                a.push(b);
                _jdfp_canvas_md5 = t(b);
                y = y + ",'canvas':'" + _jdfp_canvas_md5 + "'";
            }
            return a;
        },
        webglKey: function (a) {
            if (!this.options.excludeWebGL && this.isCanvasSupported()) {
                var b = this.getWebglFp();
                _jdfp_webgl_md5 = t(b);
                a.push(b);
                y = y + ",'webglFp':'" + _jdfp_webgl_md5 + "'";
            }
            return a;
        },
        pluginsKey: function (a) {
            this.isIE()
                ? (a.push(this.getIEPluginsString()),
                    (y = y + ",'plugins':'" + t(this.getIEPluginsString()) + "'"))
                : (a.push(this.getRegularPluginsString()),
                    (y = y + ",'plugins':'" + t(this.getRegularPluginsString()) + "'"));
            return a;
        },
        getRegularPluginsString: function () {
            return this.map(
                navigator.plugins,
                function (a) {
                    var b = this.map(a, function (c) {
                        return [c.type, c.suffixes].join("~");
                    }).join(",");
                    return [a.name, a.description, b].join("::");
                },
                this
            ).join(";");
        },
        getIEPluginsString: function () {
            return window.ActiveXObject
                ? this.map(
                    "AcroPDF.PDF;Adodb.Stream;AgControl.AgControl;DevalVRXCtrl.DevalVRXCtrl.1;MacromediaFlashPaper.MacromediaFlashPaper;Msxml2.DOMDocument;Msxml2.XMLHTTP;PDF.PdfCtrl;QuickTime.QuickTime;QuickTimeCheckObject.QuickTimeCheck.1;RealPlayer;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);Scripting.Dictionary;SWCtl.SWCtl;Shell.UIHelper;ShockwaveFlash.ShockwaveFlash;Skype.Detection;TDCCtl.TDCCtl;WMPlayer.OCX;rmocx.RealPlayer G2 Control;rmocx.RealPlayer G2 Control.1".split(
                        ";"
                    ),
                    function (a) {
                        try {
                            return new ActiveXObject(a), a;
                        } catch (b) {
                            return null;
                        }
                    }
                ).join(";")
                : "";
        },
        hasSessionStorage: function () {
            try {
                return !!window.sessionStorage;
            } catch (a) {
                return !0;
            }
        },
        hasLocalStorage: function () {
            try {
                return !!window.localStorage;
            } catch (a) {
                return !0;
            }
        },
        hasIndexedDB: function () {
            return true;
            return !!window.indexedDB;
        },
        getNavigatorCpuClass: function () {
            return navigator.cpuClass ? navigator.cpuClass : "NA";
        },
        getNavigatorPlatform: function () {
            return navigator.platform ? navigator.platform : "NA";
        },
        getHardwareConcurrency: function () {
            return navigator.hardwareConcurrency
                ? navigator.hardwareConcurrency
                : "NA";
        },
        getDoNotTrack: function () {
            return navigator.doNotTrack ? navigator.doNotTrack : "NA";
        },
        getCanvasFp: function () {
            return "";
            var a = navigator.userAgent.toLowerCase();
            if (
                (0 < a.indexOf("jdjr-app") || 0 <= a.indexOf("jdapp")) &&
                (0 < a.indexOf("iphone") || 0 < a.indexOf("ipad"))
            )
                return null;
            a = document.createElement("canvas");
            var b = a.getContext("2d");
            b.fillStyle = "red";
            b.fillRect(30, 10, 200, 100);
            b.strokeStyle = "#1a3bc1";
            b.lineWidth = 6;
            b.lineCap = "round";
            b.arc(50, 50, 20, 0, Math.PI, !1);
            b.stroke();
            b.fillStyle = "#42e1a2";
            b.font = "15.4px 'Arial'";
            b.textBaseline = "alphabetic";
            b.fillText("PR flacks quiz gym: TV DJ box when? \u2620", 15, 60);
            b.shadowOffsetX = 1;
            b.shadowOffsetY = 2;
            b.shadowColor = "white";
            b.fillStyle = "rgba(0, 0, 200, 0.5)";
            b.font = "60px 'Not a real font'";
            b.fillText("No\u9a97", 40, 80);
            return a.toDataURL();
        },
        getWebglFp: function () {
            var a = navigator.userAgent;
            a = a.toLowerCase();
            if (
                (0 < a.indexOf("jdjr-app") || 0 <= a.indexOf("jdapp")) &&
                (0 < a.indexOf("iphone") || 0 < a.indexOf("ipad"))
            )
                return null;
            a = function (D) {
                b.clearColor(0, 0, 0, 1);
                b.enable(b.DEPTH_TEST);
                b.depthFunc(b.LEQUAL);
                b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                return "[" + D[0] + ", " + D[1] + "]";
            };
            var b = this.getWebglCanvas();
            if (!b) return null;
            var c = [],
                l = b.createBuffer();
            b.bindBuffer(b.ARRAY_BUFFER, l);
            var h = new Float32Array([
                -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0,
            ]);
            b.bufferData(b.ARRAY_BUFFER, h, b.STATIC_DRAW);
            l.itemSize = 3;
            l.numItems = 3;
            h = b.createProgram();
            var q = b.createShader(b.VERTEX_SHADER);
            b.shaderSource(
                q,
                "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
            );
            b.compileShader(q);
            var z = b.createShader(b.FRAGMENT_SHADER);
            b.shaderSource(
                z,
                "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
            );
            b.compileShader(z);
            b.attachShader(h, q);
            b.attachShader(h, z);
            b.linkProgram(h);
            b.useProgram(h);
            h.vertexPosAttrib = b.getAttribLocation(h, "attrVertex");
            h.offsetUniform = b.getUniformLocation(h, "uniformOffset");
            b.enableVertexAttribArray(h.vertexPosArray);
            b.vertexAttribPointer(h.vertexPosAttrib, l.itemSize, b.FLOAT, !1, 0, 0);
            b.uniform2f(h.offsetUniform, 1, 1);
            b.drawArrays(b.TRIANGLE_STRIP, 0, l.numItems);
            null != b.canvas && c.push(b.canvas.toDataURL());
            c.push("extensions:" + b.getSupportedExtensions().join(";"));
            c.push("extensions:" + b.getSupportedExtensions().join(";"));
            c.push("w1" + a(b.getParameter(b.ALIASED_LINE_WIDTH_RANGE)));
            c.push("w2" + a(b.getParameter(b.ALIASED_POINT_SIZE_RANGE)));
            c.push("w3" + b.getParameter(b.ALPHA_BITS));
            c.push("w4" + (b.getContextAttributes().antialias ? "yes" : "no"));
            c.push("w5" + b.getParameter(b.BLUE_BITS));
            c.push("w6" + b.getParameter(b.DEPTH_BITS));
            c.push("w7" + b.getParameter(b.GREEN_BITS));
            c.push(
                "w8" +
                (function (D) {
                    var B,
                        F =
                            D.getExtension("EXT_texture_filter_anisotropic") ||
                            D.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
                            D.getExtension("MOZ_EXT_texture_filter_anisotropic");
                    return F
                        ? ((B = D.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)),
                        0 === B && (B = 2),
                            B)
                        : null;
                })(b)
            );
            c.push("w9" + b.getParameter(b.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
            c.push("w10" + b.getParameter(b.MAX_CUBE_MAP_TEXTURE_SIZE));
            c.push("w11" + b.getParameter(b.MAX_FRAGMENT_UNIFORM_VECTORS));
            c.push("w12" + b.getParameter(b.MAX_RENDERBUFFER_SIZE));
            c.push("w13" + b.getParameter(b.MAX_TEXTURE_IMAGE_UNITS));
            c.push("w14" + b.getParameter(b.MAX_TEXTURE_SIZE));
            c.push("w15" + b.getParameter(b.MAX_VARYING_VECTORS));
            c.push("w16" + b.getParameter(b.MAX_VERTEX_ATTRIBS));
            c.push("w17" + b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
            c.push("w18" + b.getParameter(b.MAX_VERTEX_UNIFORM_VECTORS));
            c.push("w19" + a(b.getParameter(b.MAX_VIEWPORT_DIMS)));
            c.push("w20" + b.getParameter(b.RED_BITS));
            c.push("w21" + b.getParameter(b.RENDERER));
            c.push("w22" + b.getParameter(b.SHADING_LANGUAGE_VERSION));
            c.push("w23" + b.getParameter(b.STENCIL_BITS));
            c.push("w24" + b.getParameter(b.VENDOR));
            c.push("w25" + b.getParameter(b.VERSION));
            try {
                var C = b.getExtension("WEBGL_debug_renderer_info");
                C &&
                (c.push("wuv:" + b.getParameter(C.UNMASKED_VENDOR_WEBGL)),
                    c.push("wur:" + b.getParameter(C.UNMASKED_RENDERER_WEBGL)));
            } catch (D) {}
            return c.join("\u00a7");
        },
        isCanvasSupported: function () {
            return true;
            var a = document.createElement("canvas");
            return !(!a.getContext || !a.getContext("2d"));
        },
        isIE: function () {
            return "Microsoft Internet Explorer" === navigator.appName ||
            ("Netscape" === navigator.appName &&
                /Trident/.test(navigator.userAgent))
                ? !0
                : !1;
        },
        getWebglCanvas: function () {
            return null;
            var a = document.createElement("canvas"),
                b = null;
            try {
                var c = navigator.userAgent;
                c = c.toLowerCase();
                ((0 < c.indexOf("jdjr-app") || 0 <= c.indexOf("jdapp")) &&
                    (0 < c.indexOf("iphone") || 0 < c.indexOf("ipad"))) ||
                (b = a.getContext("webgl") || a.getContext("experimental-webgl"));
            } catch (l) {}
            b || (b = null);
            return b;
        },
        each: function (a, b, c) {
            if (null !== a)
                if (this.nativeForEach && a.forEach === this.nativeForEach)
                    a.forEach(b, c);
                else if (a.length === +a.length)
                    for (
                        var l = 0, h = a.length;
                        l < h && b.call(c, a[l], l, a) !== {};
                        l++
                    );
                else
                    for (l in a)
                        if (a.hasOwnProperty(l) && b.call(c, a[l], l, a) === {}) break;
        },
        map: function (a, b, c) {
            var l = [];
            if (null == a) return l;
            if (this.nativeMap && a.map === this.nativeMap) return a.map(b, c);
            this.each(a, function (h, q, z) {
                l[l.length] = b.call(c, h, q, z);
            });
            return l;
        },
        x64Add: function (a, b) {
            a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
            b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
            var c = [0, 0, 0, 0];
            c[3] += a[3] + b[3];
            c[2] += c[3] >>> 16;
            c[3] &= 65535;
            c[2] += a[2] + b[2];
            c[1] += c[2] >>> 16;
            c[2] &= 65535;
            c[1] += a[1] + b[1];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[0] += a[0] + b[0];
            c[0] &= 65535;
            return [(c[0] << 16) | c[1], (c[2] << 16) | c[3]];
        },
        x64Multiply: function (a, b) {
            a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
            b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
            var c = [0, 0, 0, 0];
            c[3] += a[3] * b[3];
            c[2] += c[3] >>> 16;
            c[3] &= 65535;
            c[2] += a[2] * b[3];
            c[1] += c[2] >>> 16;
            c[2] &= 65535;
            c[2] += a[3] * b[2];
            c[1] += c[2] >>> 16;
            c[2] &= 65535;
            c[1] += a[1] * b[3];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[1] += a[2] * b[2];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[1] += a[3] * b[1];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[0] += a[0] * b[3] + a[1] * b[2] + a[2] * b[1] + a[3] * b[0];
            c[0] &= 65535;
            return [(c[0] << 16) | c[1], (c[2] << 16) | c[3]];
        },
        x64Rotl: function (a, b) {
            b %= 64;
            if (32 === b) return [a[1], a[0]];
            if (32 > b)
                return [
                    (a[0] << b) | (a[1] >>> (32 - b)),
                    (a[1] << b) | (a[0] >>> (32 - b)),
                ];
            b -= 32;
            return [
                (a[1] << b) | (a[0] >>> (32 - b)),
                (a[0] << b) | (a[1] >>> (32 - b)),
            ];
        },
        x64LeftShift: function (a, b) {
            b %= 64;
            return 0 === b
                ? a
                : 32 > b
                    ? [(a[0] << b) | (a[1] >>> (32 - b)), a[1] << b]
                    : [a[1] << (b - 32), 0];
        },
        x64Xor: function (a, b) {
            return [a[0] ^ b[0], a[1] ^ b[1]];
        },
        x64Fmix: function (a) {
            a = this.x64Xor(a, [0, a[0] >>> 1]);
            a = this.x64Multiply(a, [4283543511, 3981806797]);
            a = this.x64Xor(a, [0, a[0] >>> 1]);
            a = this.x64Multiply(a, [3301882366, 444984403]);
            return (a = this.x64Xor(a, [0, a[0] >>> 1]));
        },
        x64hash128: function (a, b) {
            a = a || "";
            b = b || 0;
            var c = a.length % 16,
                l = a.length - c,
                h = [0, b];
            b = [0, b];
            for (
                var q,
                    z,
                    C = [2277735313, 289559509],
                    D = [1291169091, 658871167],
                    B = 0;
                B < l;
                B += 16
            )
                (q = [
                    (a.charCodeAt(B + 4) & 255) |
                    ((a.charCodeAt(B + 5) & 255) << 8) |
                    ((a.charCodeAt(B + 6) & 255) << 16) |
                    ((a.charCodeAt(B + 7) & 255) << 24),
                    (a.charCodeAt(B) & 255) |
                    ((a.charCodeAt(B + 1) & 255) << 8) |
                    ((a.charCodeAt(B + 2) & 255) << 16) |
                    ((a.charCodeAt(B + 3) & 255) << 24),
                ]),
                    (z = [
                        (a.charCodeAt(B + 12) & 255) |
                        ((a.charCodeAt(B + 13) & 255) << 8) |
                        ((a.charCodeAt(B + 14) & 255) << 16) |
                        ((a.charCodeAt(B + 15) & 255) << 24),
                        (a.charCodeAt(B + 8) & 255) |
                        ((a.charCodeAt(B + 9) & 255) << 8) |
                        ((a.charCodeAt(B + 10) & 255) << 16) |
                        ((a.charCodeAt(B + 11) & 255) << 24),
                    ]),
                    (q = this.x64Multiply(q, C)),
                    (q = this.x64Rotl(q, 31)),
                    (q = this.x64Multiply(q, D)),
                    (h = this.x64Xor(h, q)),
                    (h = this.x64Rotl(h, 27)),
                    (h = this.x64Add(h, b)),
                    (h = this.x64Add(this.x64Multiply(h, [0, 5]), [0, 1390208809])),
                    (z = this.x64Multiply(z, D)),
                    (z = this.x64Rotl(z, 33)),
                    (z = this.x64Multiply(z, C)),
                    (b = this.x64Xor(b, z)),
                    (b = this.x64Rotl(b, 31)),
                    (b = this.x64Add(b, h)),
                    (b = this.x64Add(this.x64Multiply(b, [0, 5]), [0, 944331445]));
            q = [0, 0];
            z = [0, 0];
            switch (c) {
                case 15:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 14)], 48));
                case 14:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 13)], 40));
                case 13:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 12)], 32));
                case 12:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 11)], 24));
                case 11:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 10)], 16));
                case 10:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 9)], 8));
                case 9:
                    (z = this.x64Xor(z, [0, a.charCodeAt(B + 8)])),
                        (z = this.x64Multiply(z, D)),
                        (z = this.x64Rotl(z, 33)),
                        (z = this.x64Multiply(z, C)),
                        (b = this.x64Xor(b, z));
                case 8:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 7)], 56));
                case 7:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 6)], 48));
                case 6:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 5)], 40));
                case 5:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 4)], 32));
                case 4:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 3)], 24));
                case 3:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 2)], 16));
                case 2:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 1)], 8));
                case 1:
                    (q = this.x64Xor(q, [0, a.charCodeAt(B)])),
                        (q = this.x64Multiply(q, C)),
                        (q = this.x64Rotl(q, 31)),
                        (q = this.x64Multiply(q, D)),
                        (h = this.x64Xor(h, q));
            }
            h = this.x64Xor(h, [0, a.length]);
            b = this.x64Xor(b, [0, a.length]);
            h = this.x64Add(h, b);
            b = this.x64Add(b, h);
            h = this.x64Fmix(h);
            b = this.x64Fmix(b);
            h = this.x64Add(h, b);
            b = this.x64Add(b, h);
            return (
                ("00000000" + (h[0] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (h[1] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (b[0] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (b[1] >>> 0).toString(16)).slice(-8)
            );
        },
    };
}

var JDDSecCryptoJS =
    JDDSecCryptoJS ||
    (function (t, u) {
        var v = {},
            x = (v.lib = {}),
            w = (x.Base = (function () {
                function g() {}

                return {
                    extend: function (m) {
                        g.prototype = this;
                        var a = new g();
                        m && a.mixIn(m);
                        a.hasOwnProperty("init") ||
                        (a.init = function () {
                            a.$super.init.apply(this, arguments);
                        });
                        a.init.prototype = a;
                        a.$super = this;
                        return a;
                    },
                    create: function () {
                        var m = this.extend();
                        m.init.apply(m, arguments);
                        return m;
                    },
                    init: function () {},
                    mixIn: function (m) {
                        for (var a in m) m.hasOwnProperty(a) && (this[a] = m[a]);
                        m.hasOwnProperty("toString") && (this.toString = m.toString);
                    },
                    clone: function () {
                        return this.init.prototype.extend(this);
                    },
                };
            })()),
            A = (x.WordArray = w.extend({
                init: function (g, m) {
                    g = this.words = g || [];
                    this.sigBytes = m != u ? m : 4 * g.length;
                },
                toString: function (g) {
                    return (g || n).stringify(this);
                },
                concat: function (g) {
                    var m = this.words,
                        a = g.words,
                        b = this.sigBytes;
                    g = g.sigBytes;
                    this.clamp();
                    if (b % 4)
                        for (var c = 0; c < g; c++)
                            m[(b + c) >>> 2] |=
                                ((a[c >>> 2] >>> (24 - (c % 4) * 8)) & 255) <<
                                (24 - ((b + c) % 4) * 8);
                    else if (65535 < a.length)
                        for (c = 0; c < g; c += 4) m[(b + c) >>> 2] = a[c >>> 2];
                    else m.push.apply(m, a);
                    this.sigBytes += g;
                    return this;
                },
                clamp: function () {
                    var g = this.words,
                        m = this.sigBytes;
                    g[m >>> 2] &= 4294967295 << (32 - (m % 4) * 8);
                    g.length = t.ceil(m / 4);
                },
                clone: function () {
                    var g = w.clone.call(this);
                    g.words = this.words.slice(0);
                    return g;
                },
                random: function (g) {
                    for (var m = [], a = 0; a < g; a += 4)
                        m.push((4294967296 * t.random()) | 0);
                    return new A.init(m, g);
                },
            }));
        x.UUID = w.extend({
            generateUuid: function () {
                for (
                    var g = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split(""),
                        m = 0,
                        a = g.length;
                    m < a;
                    m++
                )
                    switch (g[m]) {
                        case "x":
                            g[m] = t.floor(16 * t.random()).toString(16);
                            break;
                        case "y":
                            g[m] = (t.floor(4 * t.random()) + 8).toString(16);
                    }
                return g.join("");
            },
        });
        var y = (v.enc = {}),
            n = (y.Hex = {
                stringify: function (g) {
                    var m = g.words;
                    g = g.sigBytes;
                    var a = [];
                    for (var b = 0; b < g; b++) {
                        var c = (m[b >>> 2] >>> (24 - (b % 4) * 8)) & 255;
                        a.push((c >>> 4).toString(16));
                        a.push((c & 15).toString(16));
                    }
                    return a.join("");
                },
                parse: function (g) {
                    for (var m = g.length, a = [], b = 0; b < m; b += 2)
                        a[b >>> 3] |= parseInt(g.substr(b, 2), 16) << (24 - (b % 8) * 4);
                    return new A.init(a, m / 2);
                },
            }),
            e = (y.Latin1 = {
                stringify: function (g) {
                    var m = g.words;
                    g = g.sigBytes;
                    for (var a = [], b = 0; b < g; b++)
                        a.push(
                            String.fromCharCode((m[b >>> 2] >>> (24 - (b % 4) * 8)) & 255)
                        );
                    return a.join("");
                },
                parse: function (g) {
                    for (var m = g.length, a = [], b = 0; b < m; b++)
                        a[b >>> 2] |= (g.charCodeAt(b) & 255) << (24 - (b % 4) * 8);
                    return new A.init(a, m);
                },
            }),
            f = (y.Utf8 = {
                stringify: function (g) {
                    try {
                        return decodeURIComponent(escape(e.stringify(g)));
                    } catch (m) {
                        throw Error("Malformed UTF-8 data");
                    }
                },
                parse: function (g) {
                    return e.parse(unescape(encodeURIComponent(g)));
                },
            }),
            r = (x.BufferedBlockAlgorithm = w.extend({
                reset: function () {
                    this._data = new A.init();
                    this._nDataBytes = 0;
                },
                _append: function (g) {
                    "string" == typeof g && (g = f.parse(g));
                    this._data.concat(g);
                    this._nDataBytes += g.sigBytes;
                },
                _process: function (g) {
                    var m = this._data,
                        a = m.words,
                        b = m.sigBytes,
                        c = this.blockSize,
                        l = b / (4 * c);
                    l = g ? t.ceil(l) : t.max((l | 0) - this._minBufferSize, 0);
                    g = l * c;
                    b = t.min(4 * g, b);
                    if (g) {
                        for (var h = 0; h < g; h += c) this._doProcessBlock(a, h);
                        h = a.splice(0, g);
                        m.sigBytes -= b;
                    }
                    return new A.init(h, b);
                },
                clone: function () {
                    var g = w.clone.call(this);
                    g._data = this._data.clone();
                    return g;
                },
                _minBufferSize: 0,
            }));
        x.Hasher = r.extend({
            cfg: w.extend(),
            init: function (g) {
                this.cfg = this.cfg.extend(g);
                this.reset();
            },
            reset: function () {
                r.reset.call(this);
                this._doReset();
            },
            update: function (g) {
                this._append(g);
                this._process();
                return this;
            },
            finalize: function (g) {
                g && this._append(g);
                return this._doFinalize();
            },
            blockSize: 16,
            _createHelper: function (g) {
                return function (m, a) {
                    return new g.init(a).finalize(m);
                };
            },
            _createHmacHelper: function (g) {
                return function (m, a) {
                    return new k.HMAC.init(g, a).finalize(m);
                };
            },
        });
        var k = (v.algo = {});
        v.channel = {};
        return v;
    })(Math);
JDDSecCryptoJS.lib.Cipher ||
(function (t) {
    var u = JDDSecCryptoJS,
        v = u.lib,
        x = v.Base,
        w = v.WordArray,
        A = v.BufferedBlockAlgorithm,
        y = (v.Cipher = A.extend({
            cfg: x.extend(),
            createEncryptor: function (g, m) {
                return this.create(this._ENC_XFORM_MODE, g, m);
            },
            createDecryptor: function (g, m) {
                return this.create(this._DEC_XFORM_MODE, g, m);
            },
            init: function (g, m, a) {
                this.cfg = this.cfg.extend(a);
                this._xformMode = g;
                this._key = m;
                this.reset();
            },
            reset: function () {
                A.reset.call(this);
                this._doReset();
            },
            process: function (g) {
                this._append(g);
                return this._process();
            },
            finalize: function (g) {
                g && this._append(g);
                return this._doFinalize();
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: (function () {
                function g(m) {
                    if ("string" != typeof m) return k;
                }

                return function (m) {
                    return {
                        encrypt: function (a, b, c) {
                            return g(b).encrypt(m, a, b, c);
                        },
                        decrypt: function (a, b, c) {
                            return g(b).decrypt(m, a, b, c);
                        },
                    };
                };
            })(),
        }));
    v.StreamCipher = y.extend({
        _doFinalize: function () {
            return this._process(!0);
        },
        blockSize: 1,
    });
    var n = (u.mode = {}),
        e = (v.BlockCipherMode = x.extend({
            createEncryptor: function (g, m) {
                return this.Encryptor.create(g, m);
            },
            createDecryptor: function (g, m) {
                return this.Decryptor.create(g, m);
            },
            init: function (g, m) {
                this._cipher = g;
                this._iv = m;
            },
        }));
    n = n.CBC = (function () {
        function g(a, b, c) {
            var l = this._iv;
            l ? (this._iv = t) : (l = this._prevBlock);
            for (var h = 0; h < c; h++) a[b + h] ^= l[h];
        }

        var m = e.extend();
        m.Encryptor = m.extend({
            processBlock: function (a, b) {
                var c = this._cipher,
                    l = c.blockSize;
                g.call(this, a, b, l);
                c.encryptBlock(a, b);
                this._prevBlock = a.slice(b, b + l);
            },
        });
        m.Decryptor = m.extend({
            processBlock: function (a, b) {
                var c = this._cipher,
                    l = c.blockSize,
                    h = a.slice(b, b + l);
                c.decryptBlock(a, b);
                g.call(this, a, b, l);
                this._prevBlock = h;
            },
        });
        return m;
    })();
    var f = ((u.pad = {}).Pkcs7 = {
        pad: function (g, m) {
            m *= 4;
            m -= g.sigBytes % m;
            for (
                var a = (m << 24) | (m << 16) | (m << 8) | m, b = [], c = 0;
                c < m;
                c += 4
            )
                b.push(a);
            m = w.create(b, m);
            g.concat(m);
        },
        unpad: function (g) {
            g.sigBytes -= g.words[(g.sigBytes - 1) >>> 2] & 255;
        },
    });
    v.BlockCipher = y.extend({
        cfg: y.cfg.extend({
            mode: n,
            padding: f,
        }),
        reset: function () {
            y.reset.call(this);
            var g = this.cfg,
                m = g.iv;
            g = g.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var a = g.createEncryptor;
            else (a = g.createDecryptor), (this._minBufferSize = 1);
            this._mode = a.call(g, this, m && m.words);
        },
        _doProcessBlock: function (g, m) {
            this._mode.processBlock(g, m);
        },
        _doFinalize: function () {
            var g = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                g.pad(this._data, this.blockSize);
                var m = this._process(!0);
            } else (m = this._process(!0)), g.unpad(m);
            return m;
        },
        blockSize: 4,
    });
    var r = (v.CipherParams = x.extend({
        init: function (g) {
            this.mixIn(g);
        },
        toString: function (g) {
            return (g || this.formatter).stringify(this);
        },
    }));
    u.format = {};
    var k = (v.SerializableCipher = x.extend({
        cfg: x.extend({}),
        encrypt: function (g, m, a, b) {
            b = this.cfg.extend(b);
            var c = g.createEncryptor(a, b);
            m = c.finalize(m);
            c = c.cfg;
            return r.create({
                ciphertext: m,
                key: a,
                iv: c.iv,
                algorithm: g,
                mode: c.mode,
                padding: c.padding,
                blockSize: g.blockSize,
                formatter: b.format,
            });
        },
        decrypt: function (g, m, a, b) {
            b = this.cfg.extend(b);
            m = this._parse(m, b.format);
            return g.createDecryptor(a, b).finalize(m.ciphertext);
        },
        _parse: function (g, m) {
            return "string" == typeof g ? m.parse(g, this) : g;
        },
    }));
})();
(function () {
    var t = JDDSecCryptoJS,
        u = t.lib.BlockCipher,
        v = t.algo,
        x = [],
        w = [],
        A = [],
        y = [],
        n = [],
        e = [],
        f = [],
        r = [],
        k = [],
        g = [];
    (function () {
        for (var a = [], b = 0; 256 > b; b++)
            a[b] = 128 > b ? b << 1 : (b << 1) ^ 283;
        var c = 0,
            l = 0;
        for (b = 0; 256 > b; b++) {
            var h = l ^ (l << 1) ^ (l << 2) ^ (l << 3) ^ (l << 4);
            h = (h >>> 8) ^ (h & 255) ^ 99;
            x[c] = h;
            w[h] = c;
            var q = a[c],
                z = a[q],
                C = a[z],
                D = (257 * a[h]) ^ (16843008 * h);
            A[c] = (D << 24) | (D >>> 8);
            y[c] = (D << 16) | (D >>> 16);
            n[c] = (D << 8) | (D >>> 24);
            e[c] = D;
            D = (16843009 * C) ^ (65537 * z) ^ (257 * q) ^ (16843008 * c);
            f[h] = (D << 24) | (D >>> 8);
            r[h] = (D << 16) | (D >>> 16);
            k[h] = (D << 8) | (D >>> 24);
            g[h] = D;
            c ? ((c = q ^ a[a[a[C ^ q]]]), (l ^= a[a[l]])) : (c = l = 1);
        }
    })();
    var m = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    v = v.AES = u.extend({
        _doReset: function () {
            var a = this._key,
                b = a.words,
                c = a.sigBytes / 4;
            a = 4 * ((this._nRounds = c + 6) + 1);
            for (var l = (this._keySchedule = []), h = 0; h < a; h++)
                if (h < c) l[h] = b[h];
                else {
                    var q = l[h - 1];
                    h % c
                        ? 6 < c &&
                        4 == h % c &&
                        (q =
                            (x[q >>> 24] << 24) |
                            (x[(q >>> 16) & 255] << 16) |
                            (x[(q >>> 8) & 255] << 8) |
                            x[q & 255])
                        : ((q = (q << 8) | (q >>> 24)),
                            (q =
                                (x[q >>> 24] << 24) |
                                (x[(q >>> 16) & 255] << 16) |
                                (x[(q >>> 8) & 255] << 8) |
                                x[q & 255]),
                            (q ^= m[(h / c) | 0] << 24));
                    l[h] = l[h - c] ^ q;
                }
            b = this._invKeySchedule = [];
            for (c = 0; c < a; c++)
                (h = a - c),
                    (q = c % 4 ? l[h] : l[h - 4]),
                    (b[c] =
                        4 > c || 4 >= h
                            ? q
                            : f[x[q >>> 24]] ^
                            r[x[(q >>> 16) & 255]] ^
                            k[x[(q >>> 8) & 255]] ^
                            g[x[q & 255]]);
        },
        encryptBlock: function (a, b) {
            this._doCryptBlock(a, b, this._keySchedule, A, y, n, e, x);
        },
        decryptBlock: function (a, b) {
            var c = a[b + 1];
            a[b + 1] = a[b + 3];
            a[b + 3] = c;
            this._doCryptBlock(a, b, this._invKeySchedule, f, r, k, g, w);
            c = a[b + 1];
            a[b + 1] = a[b + 3];
            a[b + 3] = c;
        },
        _doCryptBlock: function (a, b, c, l, h, q, z, C) {
            for (
                var D = this._nRounds,
                    B = a[b] ^ c[0],
                    F = a[b + 1] ^ c[1],
                    H = a[b + 2] ^ c[2],
                    G = a[b + 3] ^ c[3],
                    I = 4,
                    M = 1;
                M < D;
                M++
            ) {
                var J =
                    l[B >>> 24] ^
                    h[(F >>> 16) & 255] ^
                    q[(H >>> 8) & 255] ^
                    z[G & 255] ^
                    c[I++],
                    K =
                        l[F >>> 24] ^
                        h[(H >>> 16) & 255] ^
                        q[(G >>> 8) & 255] ^
                        z[B & 255] ^
                        c[I++],
                    L =
                        l[H >>> 24] ^
                        h[(G >>> 16) & 255] ^
                        q[(B >>> 8) & 255] ^
                        z[F & 255] ^
                        c[I++];
                G =
                    l[G >>> 24] ^
                    h[(B >>> 16) & 255] ^
                    q[(F >>> 8) & 255] ^
                    z[H & 255] ^
                    c[I++];
                B = J;
                F = K;
                H = L;
            }
            J =
                ((C[B >>> 24] << 24) |
                    (C[(F >>> 16) & 255] << 16) |
                    (C[(H >>> 8) & 255] << 8) |
                    C[G & 255]) ^
                c[I++];
            K =
                ((C[F >>> 24] << 24) |
                    (C[(H >>> 16) & 255] << 16) |
                    (C[(G >>> 8) & 255] << 8) |
                    C[B & 255]) ^
                c[I++];
            L =
                ((C[H >>> 24] << 24) |
                    (C[(G >>> 16) & 255] << 16) |
                    (C[(B >>> 8) & 255] << 8) |
                    C[F & 255]) ^
                c[I++];
            G =
                ((C[G >>> 24] << 24) |
                    (C[(B >>> 16) & 255] << 16) |
                    (C[(F >>> 8) & 255] << 8) |
                    C[H & 255]) ^
                c[I++];
            a[b] = J;
            a[b + 1] = K;
            a[b + 2] = L;
            a[b + 3] = G;
        },
        keySize: 8,
    });
    t.AES = u._createHelper(v);
})();

(function () {
    var t = JDDSecCryptoJS,
        u = t.lib,
        v = u.WordArray,
        x = u.Hasher,
        w = [];
    u = t.algo.SHA1 = x.extend({
        _doReset: function () {
            this._hash = new v.init([
                1732584193, 4023233417, 2562383102, 271733878, 3285377520,
            ]);
        },
        _doProcessBlock: function (A, y) {
            for (
                var n = this._hash.words,
                    e = n[0],
                    f = n[1],
                    r = n[2],
                    k = n[3],
                    g = n[4],
                    m = 0;
                80 > m;
                m++
            ) {
                if (16 > m) w[m] = A[y + m] | 0;
                else {
                    var a = w[m - 3] ^ w[m - 8] ^ w[m - 14] ^ w[m - 16];
                    w[m] = (a << 1) | (a >>> 31);
                }
                a = ((e << 5) | (e >>> 27)) + g + w[m];
                a =
                    20 > m
                        ? a + (((f & r) | (~f & k)) + 1518500249)
                        : 40 > m
                        ? a + ((f ^ r ^ k) + 1859775393)
                        : 60 > m
                            ? a + (((f & r) | (f & k) | (r & k)) - 1894007588)
                            : a + ((f ^ r ^ k) - 899497514);
                g = k;
                k = r;
                r = (f << 30) | (f >>> 2);
                f = e;
                e = a;
            }
            n[0] = (n[0] + e) | 0;
            n[1] = (n[1] + f) | 0;
            n[2] = (n[2] + r) | 0;
            n[3] = (n[3] + k) | 0;
            n[4] = (n[4] + g) | 0;
        },
        _doFinalize: function () {
            var A = this._data,
                y = A.words,
                n = 8 * this._nDataBytes,
                e = 8 * A.sigBytes;
            y[e >>> 5] |= 128 << (24 - (e % 32));
            y[(((e + 64) >>> 9) << 4) + 14] = Math.floor(n / 4294967296);
            y[(((e + 64) >>> 9) << 4) + 15] = n;
            A.sigBytes = 4 * y.length;
            this._process();
            return this._hash;
        },
        clone: function () {
            var A = x.clone.call(this);
            A._hash = this._hash.clone();
            return A;
        },
    });
    t.SHA1 = x._createHelper(u);
    t.HmacSHA1 = x._createHmacHelper(u);
})();

(function () {
    var t = JDDSecCryptoJS,
        u = t.channel;
    u.Downlink = {
        deBase32: function (v) {
            if (void 0 == v || "" == v || null == v) return "";
            var x = t.enc.Hex.parse("30313233343536373839616263646566"),
                w = t.enc.Hex.parse("724e5428476f307361374d3233784a6c");
            return t.AES.decrypt(
                {
                    ciphertext: t.enc.Base32.parse(v),
                },
                w,
                {
                    mode: t.mode.CBC,
                    padding: t.pad.Pkcs7,
                    iv: x,
                }
            ).toString(t.enc.Utf8);
        },
        deBase64: function (v) {
            return "";
        },
    };
    u.Uplink = {
        enAsBase32: function (v) {
            return "";
        },
        enAsBase64: function (v) {
            return "";
        },
    };
})();

(function () {
    var t = JDDSecCryptoJS,
        u = t.lib.WordArray;
    t.enc.Base32 = {
        stringify: function (v) {
            var x = v.words,
                w = v.sigBytes,
                A = this._map;
            v.clamp();
            v = [];
            for (var y = 0; y < w; y += 5) {
                for (var n = [], e = 0; 5 > e; e++)
                    n[e] = (x[(y + e) >>> 2] >>> (24 - ((y + e) % 4) * 8)) & 255;
                n = [
                    (n[0] >>> 3) & 31,
                    ((n[0] & 7) << 2) | ((n[1] >>> 6) & 3),
                    (n[1] >>> 1) & 31,
                    ((n[1] & 1) << 4) | ((n[2] >>> 4) & 15),
                    ((n[2] & 15) << 1) | ((n[3] >>> 7) & 1),
                    (n[3] >>> 2) & 31,
                    ((n[3] & 3) << 3) | ((n[4] >>> 5) & 7),
                    n[4] & 31,
                ];
                for (e = 0; 8 > e && y + 0.625 * e < w; e++) v.push(A.charAt(n[e]));
            }
            if ((x = A.charAt(32))) for (; v.length % 8; ) v.push(x);
            return v.join("");
        },
        parse: function (v) {
            var x = v.length,
                w = this._map,
                A = w.charAt(32);
            A && ((A = v.indexOf(A)), -1 != A && (x = A));
            A = [];
            for (var y = 0, n = 0; n < x; n++) {
                var e = n % 8;
                if (0 != e && 2 != e && 5 != e) {
                    var f = 255 & (w.indexOf(v.charAt(n - 1)) << (40 - 5 * e) % 8),
                        r = 255 & (w.indexOf(v.charAt(n)) >>> (5 * e - 3) % 8);
                    e =
                        e % 3 ? 0 : 255 & (w.indexOf(v.charAt(n - 2)) << (3 == e ? 6 : 7));
                    A[y >>> 2] |= (f | r | e) << (24 - (y % 4) * 8);
                    y++;
                }
            }
            return u.create(A, y);
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    };
})();

class JDDMAC {
    static t() {
        return "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D"
            .split(" ")
            .map(function (v) {
                return parseInt(v, 16);
            });
    }

    mac(v) {
        for (var x = -1, w = 0, A = v.length; w < A; w++)
            x = (x >>> 8) ^ t[(x ^ v.charCodeAt(w)) & 255];
        return (x ^ -1) >>> 0;
    }
}

var _CurrentPageProtocol =
        "https:" == document.location.protocol ? "https://" : "http://",
    _JdJrTdRiskDomainName = window.__fp_domain || "gia.jd.com",
    _url_query_str = "",
    _root_domain = "",
    _CurrentPageUrl = (function () {
        var t = document.location.href.toString();
        try {
            _root_domain =
                /^https?:\/\/(?:\w+\.)*?(\w*\.(?:com\.cn|cn|com|net|id))[\\\/]*/.exec(
                    t
                )[1];
        } catch (v) {}
        var u = t.indexOf("?");
        0 < u &&
        ((_url_query_str = t.substring(u + 1)),
        500 < _url_query_str.length &&
        (_url_query_str = _url_query_str.substring(0, 499)),
            (t = t.substring(0, u)));
        return (t = t.substring(_CurrentPageProtocol.length));
    })(),
    jd_shadow__ = (function () {
        try {
            var t = JDDSecCryptoJS,
                u = [];
            u.push(_CurrentPageUrl);
            var v = t.lib.UUID.generateUuid();
            u.push(v);
            var x = new Date().getTime();
            u.push(x);
            var w = t.SHA1(u.join("")).toString().toUpperCase();
            u = [];
            u.push("JD3");
            u.push(w);
            var A = new JDDMAC().mac(u.join(""));
            u.push(A);
            var y = t.enc.Hex.parse("30313233343536373839616263646566"),
                n = t.enc.Hex.parse("4c5751554935255042304e6458323365"),
                e = u.join("");
            return t.AES.encrypt(t.enc.Utf8.parse(e), n, {
                mode: t.mode.CBC,
                padding: t.pad.Pkcs7,
                iv: y,
            }).ciphertext.toString(t.enc.Base32);
        } catch (f) {
            console.log(f);
        }
    })();
var td_collect = new (function () {
    function t() {
        var n =
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.RTCPeerConnection;
        if (n) {
            var e = function (k) {
                    var g = /([0-9]{1,3}(\.[0-9]{1,3}){3})/,
                        m =
                            /\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/;
                    try {
                        var a = g.exec(k);
                        if (null == a || 0 == a.length || void 0 == a) a = m.exec(k);
                        var b = a[1];
                        void 0 === f[b] && w.push(b);
                        f[b] = !0;
                    } catch (c) {}
                },
                f = {};
            try {
                var r = new n({
                    iceServers: [
                        {
                            url: "stun:stun.services.mozilla.com",
                        },
                    ],
                });
            } catch (k) {}
            try {
                void 0 === r &&
                (r = new n({
                    iceServers: [],
                }));
            } catch (k) {}
            if (r || window.mozRTCPeerConnection)
                try {
                    r.createDataChannel("chat", {
                        reliable: !1,
                    });
                } catch (k) {}
            r &&
            ((r.onicecandidate = function (k) {
                k.candidate && e(k.candidate.candidate);
            }),
                r.createOffer(
                    function (k) {
                        r.setLocalDescription(
                            k,
                            function () {},
                            function () {}
                        );
                    },
                    function () {}
                ),
                setTimeout(function () {
                    try {
                        r.localDescription.sdp.split("\n").forEach(function (k) {
                            0 === k.indexOf("a=candidate:") && e(k);
                        });
                    } catch (k) {}
                }, 800));
        }
    }

    function u(n) {
        var e;
        return (e = document.cookie.match(
            new RegExp("(^| )" + n + "=([^;]*)(;|$)")
        ))
            ? e[2]
            : "";
    }

    function v() {
        function n(g) {
            var m = {};
            r.style.fontFamily = g;
            document.body.appendChild(r);
            m.height = r.offsetHeight;
            m.width = r.offsetWidth;
            document.body.removeChild(r);
            return m;
        }

        var e = ["monospace", "sans-serif", "serif"],
            f = [],
            r = document.createElement("span");
        r.style.fontSize = "72px";
        r.style.visibility = "hidden";
        r.innerHTML = "mmmmmmmmmmlli";
        for (var k = 0; k < e.length; k++) f[k] = n(e[k]);
        this.checkSupportFont = function (g) {
            for (var m = 0; m < f.length; m++) {
                var a = n(g + "," + e[m]),
                    b = f[m];
                if (a.height !== b.height || a.width !== b.width) return !0;
            }
            return !1;
        };
    }

    function x(n) {
        var e = {};
        e.name = n.name;
        e.filename = n.filename.toLowerCase();
        e.description = n.description;
        void 0 !== n.version && (e.version = n.version);
        e.mimeTypes = [];
        for (var f = 0; f < n.length; f++) {
            var r = n[f],
                k = {};
            k.description = r.description;
            k.suffixes = r.suffixes;
            k.type = r.type;
            e.mimeTypes.push(k);
        }
        return e;
    }

    this.bizId = "";
    this.bioConfig = {
        type: "42",
        operation: 1,
        duraTime: 2,
        interval: 50,
    };
    this.worder = null;
    this.deviceInfo = {
        userAgent: "",
        isJdApp: !1,
        isJrApp: !1,
        sdkToken: "",
        fp: "",
        eid: "",
    };
    this.isRpTok = !1;
    this.obtainLocal = function (n) {
        n = "undefined" !== typeof n && n ? !0 : !1;
        var e = {};
        try {
            var f = document.cookie.replace(
                /(?:(?:^|.*;\s*)3AB9D23F7A4B3C9B\s*=\s*([^;]*).*$)|^.*$/,
                "$1"
            );
            0 !== f.length && (e.cookie = f);
        } catch (k) {}
        try {
            window.localStorage &&
            null !== window.localStorage &&
            0 !== window.localStorage.length &&
            (e.localStorage = window.localStorage.getItem("3AB9D23F7A4B3C9B"));
        } catch (k) {}
        try {
            window.sessionStorage &&
            null !== window.sessionStorage &&
            (e.sessionStorage = window.sessionStorage["3AB9D23F7A4B3C9B"]);
        } catch (k) {}
        try {
            p.globalStorage &&
            (e.globalStorage =
                window.globalStorage[".localdomain"]["3AB9D23F7A4B3C9B"]);
        } catch (k) {}
        try {
            d &&
            "function" == typeof d.load &&
            "function" == typeof d.getAttribute &&
            (d.load("jdgia_user_data"),
                (e.userData = d.getAttribute("3AB9D23F7A4B3C9B")));
        } catch (k) {}
        try {
            E.indexedDbId && (e.indexedDb = E.indexedDbId);
        } catch (k) {}
        try {
            E.webDbId && (e.webDb = E.webDbId);
        } catch (k) {}
        try {
            for (var r in e)
                if (32 < e[r].length) {
                    _JdEid = e[r];
                    n || (_eidFlag = !0);
                    break;
                }
        } catch (k) {}
        try {
            ("undefined" === typeof _JdEid || 0 >= _JdEid.length) &&
            this.db("3AB9D23F7A4B3C9B");
            if ("undefined" === typeof _JdEid || 0 >= _JdEid.length)
                _JdEid = u("3AB9D23F7A4B3C9B");
            if ("undefined" === typeof _JdEid || 0 >= _JdEid.length) _eidFlag = !0;
        } catch (k) {}
        return _JdEid;
    };
    var w = [],
        A =
            "Abadi MT Condensed Light;Adobe Fangsong Std;Adobe Hebrew;Adobe Ming Std;Agency FB;Arab;Arabic Typesetting;Arial Black;Batang;Bauhaus 93;Bell MT;Bitstream Vera Serif;Bodoni MT;Bookman Old Style;Braggadocio;Broadway;Calibri;Californian FB;Castellar;Casual;Centaur;Century Gothic;Chalkduster;Colonna MT;Copperplate Gothic Light;DejaVu LGC Sans Mono;Desdemona;DFKai-SB;Dotum;Engravers MT;Eras Bold ITC;Eurostile;FangSong;Forte;Franklin Gothic Heavy;French Script MT;Gabriola;Gigi;Gisha;Goudy Old Style;Gulim;GungSeo;Haettenschweiler;Harrington;Hiragino Sans GB;Impact;Informal Roman;KacstOne;Kino MT;Kozuka Gothic Pr6N;Lohit Gujarati;Loma;Lucida Bright;Lucida Fax;Magneto;Malgun Gothic;Matura MT Script Capitals;Menlo;MingLiU-ExtB;MoolBoran;MS PMincho;MS Reference Sans Serif;News Gothic MT;Niagara Solid;Nyala;Palace Script MT;Papyrus;Perpetua;Playbill;PMingLiU;Rachana;Rockwell;Sawasdee;Script MT Bold;Segoe Print;Showcard Gothic;SimHei;Snap ITC;TlwgMono;Tw Cen MT Condensed Extra Bold;Ubuntu;Umpush;Univers;Utopia;Vladimir Script;Wide Latin".split(
                ";"
            ),
        y =
            "4game;AdblockPlugin;AdobeExManCCDetect;AdobeExManDetect;Alawar NPAPI utils;Aliedit Plug-In;Alipay Security Control 3;AliSSOLogin plugin;AmazonMP3DownloaderPlugin;AOL Media Playback Plugin;AppUp;ArchiCAD;AVG SiteSafety plugin;Babylon ToolBar;Battlelog Game Launcher;BitCometAgent;Bitdefender QuickScan;BlueStacks Install Detector;CatalinaGroup Update;Citrix ICA Client;Citrix online plug-in;Citrix Receiver Plug-in;Coowon Update;DealPlyLive Update;Default Browser Helper;DivX Browser Plug-In;DivX Plus Web Player;DivX VOD Helper Plug-in;doubleTwist Web Plugin;Downloaders plugin;downloadUpdater;eMusicPlugin DLM6;ESN Launch Mozilla Plugin;ESN Sonar API;Exif Everywhere;Facebook Plugin;File Downloader Plug-in;FileLab plugin;FlyOrDie Games Plugin;Folx 3 Browser Plugin;FUZEShare;GDL Object Web Plug-in 16.00;GFACE Plugin;Ginger;Gnome Shell Integration;Google Earth Plugin;Google Earth Plug-in;Google Gears 0.5.33.0;Google Talk Effects Plugin;Google Update;Harmony Firefox Plugin;Harmony Plug-In;Heroes & Generals live;HPDetect;Html5 location provider;IE Tab plugin;iGetterScriptablePlugin;iMesh plugin;Kaspersky Password Manager;LastPass;LogMeIn Plugin 1.0.0.935;LogMeIn Plugin 1.0.0.961;Ma-Config.com plugin;Microsoft Office 2013;MinibarPlugin;Native Client;Nitro PDF Plug-In;Nokia Suite Enabler Plugin;Norton Identity Safe;npAPI Plugin;NPLastPass;NPPlayerShell;npTongbuAddin;NyxLauncher;Octoshape Streaming Services;Online Storage plug-in;Orbit Downloader;Pando Web Plugin;Parom.TV player plugin;PDF integrado do WebKit;PDF-XChange Viewer;PhotoCenterPlugin1.1.2.2;Picasa;PlayOn Plug-in;QQ2013 Firefox Plugin;QQDownload Plugin;QQMiniDL Plugin;QQMusic;RealDownloader Plugin;Roblox Launcher Plugin;RockMelt Update;Safer Update;SafeSearch;Scripting.Dictionary;SefClient Plugin;Shell.UIHelper;Silverlight Plug-In;Simple Pass;Skype Web Plugin;SumatraPDF Browser Plugin;Symantec PKI Client;Tencent FTN plug-in;Thunder DapCtrl NPAPI Plugin;TorchHelper;Unity Player;Uplay PC;VDownloader;Veetle TV Core;VLC Multimedia Plugin;Web Components;WebKit-integrierte PDF;WEBZEN Browser Extension;Wolfram Mathematica;WordCaptureX;WPI Detector 1.4;Yandex Media Plugin;Yandex PDF Viewer;YouTube Plug-in;zako".split(
                ";"
            );
    this.toJson = "object" === typeof JSON && JSON.stringify;
    this.init = function () {
        _fingerprint_step = 6;
        t();
        _fingerprint_step = 7;
        "function" !== typeof this.toJson &&
        (this.toJson = function (n) {
            var e = typeof n;
            if ("undefined" === e || null === n) return "null";
            if ("number" === e || "boolean" === e) return n + "";
            if ("object" === e && n && n.constructor === Array) {
                e = [];
                for (var f = 0; n.length > f; f++) e.push(this.toJson(n[f]));
                return "[" + (e + "]");
            }
            if ("object" === e) {
                e = [];
                for (f in n)
                    n.hasOwnProperty(f) && e.push('"' + f + '":' + this.toJson(n[f]));
                return "{" + (e + "}");
            }
        });
        this.sdkCollectInit();
    };
    this.sdkCollectInit = function () {
        try {
            try {
                bp_bizid && (this.bizId = bp_bizid);
            } catch (f) {
                this.bizId = "jsDefault";
            }
            var n = navigator.userAgent.toLowerCase(),
                e =
                    !n.match(/(iphone|ipad|ipod)/i) &&
                    (-1 < n.indexOf("android") || -1 < n.indexOf("adr"));
            this.deviceInfo.isJdApp = -1 < n.indexOf("jdapp");
            this.deviceInfo.isJrApp = -1 < n.indexOf("jdjr");
            this.deviceInfo.userAgent = navigator.userAgent;
            this.deviceInfo.isAndroid = e;
            this.createWorker();
        } catch (f) {}
    };
    this.db = function (n, e) {
        try {
            _fingerprint_step = "m";
            if (window.openDatabase) {
                var f = window.openDatabase(
                    "sqlite_jdtdstorage",
                    "",
                    "jdtdstorage",
                    1048576
                );
                void 0 !== e && "" != e
                    ? f.transaction(function (r) {
                        r.executeSql(
                            "CREATE TABLE IF NOT EXISTS cache(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value TEXT NOT NULL, UNIQUE (name))",
                            [],
                            function (k, g) {},
                            function (k, g) {}
                        );
                        r.executeSql(
                            "INSERT OR REPLACE INTO cache(name, value) VALUES(?, ?)",
                            [n, e],
                            function (k, g) {},
                            function (k, g) {}
                        );
                    })
                    : f.transaction(function (r) {
                        r.executeSql(
                            "SELECT value FROM cache WHERE name=?",
                            [n],
                            function (k, g) {
                                1 <= g.rows.length && (_JdEid = g.rows.item(0).value);
                            },
                            function (k, g) {}
                        );
                    });
            }
            _fingerprint_step = "n";
        } catch (r) {}
    };
    this.setCookie = function (n, e) {
        void 0 !== e &&
        "" != e &&
        (document.cookie =
            n +
            "=" +
            e +
            "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" +
            _root_domain);
    };
    this.tdencrypt = function (n) {
        n = this.toJson(n);
        n = encodeURIComponent(n);
        var e = "",
            f = 0;
        do {
            var r = n.charCodeAt(f++);
            var k = n.charCodeAt(f++);
            var g = n.charCodeAt(f++);
            var m = r >> 2;
            r = ((r & 3) << 4) | (k >> 4);
            var a = ((k & 15) << 2) | (g >> 6);
            var b = g & 63;
            isNaN(k) ? (a = b = 64) : isNaN(g) && (b = 64);
            e =
                e +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    m
                ) +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    r
                ) +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    a
                ) +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    b
                );
        } while (f < n.length);
        return e + "/";
    };
    this.collect = function () {
        var n = new Date();
        try {
            var e = document.createElement("div"),
                f = {},
                r =
                    "ActiveBorder ActiveCaption AppWorkspace Background ButtonFace ButtonHighlight ButtonShadow ButtonText CaptionText GrayText Highlight HighlightText InactiveBorder InactiveCaption InactiveCaptionText InfoBackground InfoText Menu MenuText Scrollbar ThreeDDarkShadow ThreeDFace ThreeDHighlight ThreeDLightShadow ThreeDShadow Window WindowFrame WindowText".split(
                        " "
                    );
            if (window.getComputedStyle)
                for (var k = 0; k < r.length; k++)
                    document.body.appendChild(e),
                        (e.style.color = r[k]),
                        (f[r[k]] = window.getComputedStyle(e).getPropertyValue("color")),
                        document.body.removeChild(e);
        } catch (D) {}
        e = {
            ca: {},
            ts: {},
            m: {},
        };
        r = e.ca;
        r.tdHash = _jdfp_canvas_md5;
        var g = !1;
        if ((k = window.WebGLRenderingContext))
            (k = navigator.userAgent),
                (k = k.toLowerCase()),
                (k =
                    (0 < k.indexOf("jdjr-app") || 0 <= k.indexOf("jdapp")) &&
                    (0 < k.indexOf("iphone") || 0 < k.indexOf("ipad"))
                        ? !0
                        : !1),
                (k = !k);
        if (k) {
            var m = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                a = [],
                b;
            for (k = 0; k < m.length; k++)
                try {
                    var c = !1;
                    (c = document.createElement("canvas").getContext(m[k], {
                        stencil: !0,
                    })) &&
                    c &&
                    ((b = c), a.push(m[k]));
                } catch (D) {}
            a.length &&
            (g = {
                name: a,
                gl: b,
            });
        }
        if (g) {
            k = g.gl;
            r.contextName = g.name.join();
            r.webglversion = k.getParameter(k.VERSION);
            r.shadingLV = k.getParameter(k.SHADING_LANGUAGE_VERSION);
            r.vendor = k.getParameter(k.VENDOR);
            r.renderer = k.getParameter(k.RENDERER);
            b = [];
            try {
                (b = k.getSupportedExtensions()), (r.extensions = b);
            } catch (D) {}
            try {
                var l = k.getExtension("WEBGL_debug_renderer_info");
                l &&
                ((r.wuv = k.getParameter(l.UNMASKED_VENDOR_WEBGL)),
                    (r.wur = k.getParameter(l.UNMASKED_RENDERER_WEBGL)));
            } catch (D) {}
        }
        e.m.documentMode = document.documentMode;
        e.m.compatMode = document.compatMode;
        l = [];
        // r = new v;
        // for (k = 0; k < A.length; k++) b = A[k], r.checkSupportFont(b) && l.push(b);
        e.fo = l;
        k = {};
        l = [];
        for (var h in navigator)
            "object" != typeof navigator[h] && (k[h] = navigator[h]), l.push(h);
        k.enumerationOrder = l;
        k.javaEnabled = false;
        try {
            k.taintEnabled = navigator.taintEnabled();
        } catch (D) {}
        e.n = k;
        k = navigator.userAgent.toLowerCase();
        if ((h = k.match(/rv:([\d.]+)\) like gecko/))) var q = h[1];
        if ((h = k.match(/msie ([\d.]+)/))) q = h[1];
        h = [];
        if (q)
            for (
                q =
                    "AcroPDF.PDF;Adodb.Stream;AgControl.AgControl;DevalVRXCtrl.DevalVRXCtrl.1;MacromediaFlashPaper.MacromediaFlashPaper;Msxml2.DOMDocument;Msxml2.XMLHTTP;PDF.PdfCtrl;QuickTime.QuickTime;QuickTimeCheckObject.QuickTimeCheck.1;RealPlayer;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);rmocx.RealPlayer G2 Control;Scripting.Dictionary;Shell.UIHelper;ShockwaveFlash.ShockwaveFlash;SWCtl.SWCtl;TDCCtl.TDCCtl;WMPlayer.OCX".split(
                        ";"
                    ),
                    k = 0;
                k < q.length;
                k++
            ) {
                var z = q[k];
                try {
                    var C = new ActiveXObject(z);
                    l = {};
                    l.name = z;
                    try {
                        l.version = C.GetVariable("$version");
                    } catch (D) {}
                    try {
                        l.version = C.GetVersions();
                    } catch (D) {}
                    (l.version && 0 < l.version.length) || (l.version = "");
                    h.push(l);
                } catch (D) {}
            }
        else {
            q = navigator.plugins;
            l = {};
            for (k = 0; k < q.length; k++) (z = q[k]), (l[z.name] = 1), h.push(x(z));
            for (k = 0; k < y.length; k++)
                (C = y[k]), l[C] || ((z = q[C]), z && h.push(x(z)));
        }
        q =
            "availHeight availWidth colorDepth bufferDepth deviceXDPI deviceYDPI height width logicalXDPI logicalYDPI pixelDepth updateInterval".split(
                " "
            );
        z = {};
        for (k = 0; q.length > k; k++)
            (C = q[k]), void 0 !== screen[C] && (z[C] = screen[C]);
        q = ["devicePixelRatio", "screenTop", "screenLeft"];
        l = {};
        for (k = 0; q.length > k; k++)
            (C = q[k]), void 0 !== window[C] && (l[C] = window[C]);
        e.p = h;
        e.w = l;
        e.s = z;
        e.sc = f;
        e.tz = n.getTimezoneOffset();
        e.lil = w.sort().join("|");
        e.wil = "";
        f = {};
        try {
            (f.cookie = navigator.cookieEnabled),
                (f.localStorage = !!window.localStorage),
                (f.sessionStorage = !!window.sessionStorage),
                (f.globalStorage = !!window.globalStorage),
                (f.indexedDB = !!window.indexedDB);
        } catch (D) {}
        e.ss = f;
        e.ts.deviceTime = n.getTime();
        e.ts.deviceEndTime = new Date().getTime();
        return this.tdencrypt(e);
    };
    this.collectSdk = function (n) {
        try {
            var e = this,
                f = !1,
                r = e.getLocal("BATQW722QTLYVCRD");
            if (null != r && void 0 != r && "" != r)
                try {
                    var k = JSON.parse(r),
                        g = new Date().getTime();
                    null != k &&
                    void 0 != k.t &&
                    "number" == typeof k.t &&
                    (12e5 >= g - k.t &&
                    void 0 != k.tk &&
                    null != k.tk &&
                    "" != k.tk &&
                    k.tk.startsWith("jdd")
                        ? ((e.deviceInfo.sdkToken = k.tk), (f = !0))
                        : void 0 != k.tk &&
                        null != k.tk &&
                        "" != k.tk &&
                        (e.deviceInfo.sdkToken = k.tk));
                } catch (m) {}
            r = !1;
            e.deviceInfo.isJdApp
                ? ((e.deviceInfo.clientVersion = navigator.userAgent.split(";")[2]),
                (r = 0 < e.compareVersion(e.deviceInfo.clientVersion, "7.0.2")) &&
                !f &&
                e.getJdSdkCacheToken(function (m) {
                    e.deviceInfo.sdkToken = m;
                    (null != m && "" != m && m.startsWith("jdd")) ||
                    e.getJdBioToken(n);
                }))
                : e.deviceInfo.isJrApp &&
                ((e.deviceInfo.clientVersion = navigator.userAgent.match(
                    /clientVersion=([^&]*)(&|$)/
                )[1]),
                (r = 0 < e.compareVersion(e.deviceInfo.clientVersion, "4.6.0")) &&
                !f &&
                e.getJdJrSdkCacheToken(function (m) {
                    e.deviceInfo.sdkToken = m;
                    (null != m && "" != m && m.startsWith("jdd")) ||
                    e.getJdJrBioToken(n);
                }));
            "function" == typeof n && n(e.deviceInfo);
        } catch (m) {}
    };
    this.compareVersion = function (n, e) {
        try {
            if (n === e) return 0;
            var f = n.split(".");
            var r = e.split(".");
            for (n = 0; n < f.length; n++) {
                var k = parseInt(f[n]);
                if (!r[n]) return 1;
                var g = parseInt(r[n]);
                if (k < g) break;
                if (k > g) return 1;
            }
        } catch (m) {}
        return -1;
    };
    this.isWKWebView = function () {
        return this.deviceInfo.userAgent.match(/supportJDSHWK/i) ||
        1 == window._is_jdsh_wkwebview
            ? !0
            : !1;
    };
    this.getErrorToken = function (n) {
        try {
            if (n) {
                var e = (n + "").match(/"token":"(.*?)"/);
                if (e && 1 < e.length) return e[1];
            }
        } catch (f) {}
        return "";
    };
    this.getJdJrBioToken = function (n) {
        var e = this;
        "undefined" != typeof JrBridge &&
        null != JrBridge &&
        "undefined" != typeof JrBridge._version &&
        (0 > e.compareVersion(JrBridge._version, "2.0.0")
            ? console.error(
                "\u6865\u7248\u672c\u4f4e\u4e8e2.0\u4e0d\u652f\u6301bio"
            )
            : JrBridge.callNative(
                {
                    type: e.bioConfig.type,
                    operation: e.bioConfig.operation,
                    biometricData: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                },
                function (f) {
                    try {
                        "object" != typeof f && (f = JSON.parse(f)),
                            (e.deviceInfo.sdkToken = f.token);
                    } catch (r) {
                        console.error(r);
                    }
                    null != e.deviceInfo.sdkToken &&
                    "" != e.deviceInfo.sdkToken &&
                    ((f = {
                        tk: e.deviceInfo.sdkToken,
                        t: new Date().getTime(),
                    }),
                        e.store("BATQW722QTLYVCRD", JSON.stringify(f)));
                }
            ));
    };
    this.getJdJrSdkCacheToken = function (n) {
        var e = this;
        try {
            "undefined" == typeof JrBridge ||
            null == JrBridge ||
            "undefined" == typeof JrBridge._version ||
            0 > e.compareVersion(JrBridge._version, "2.0.0") ||
            JrBridge.callNative(
                {
                    type: e.bioConfig.type,
                    operation: 5,
                    biometricData: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                },
                function (f) {
                    var r = "";
                    try {
                        "object" != typeof f && (f = JSON.parse(f)), (r = f.token);
                    } catch (k) {
                        console.error(k);
                    }
                    null != r &&
                    "" != r &&
                    "function" == typeof n &&
                    (n(r),
                    r.startsWith("jdd") &&
                    ((f = {
                        tk: r,
                        t: new Date().getTime(),
                    }),
                        e.store("BATQW722QTLYVCRD", JSON.stringify(f))));
                }
            );
        } catch (f) {}
    };
    this.getJdBioToken = function (n) {
        var e = this;
        n = JSON.stringify({
            businessType: "bridgeBiologicalProbe",
            callBackName: "_bioDeviceCb",
            params: {
                pin: "",
                jsonData: {
                    type: e.bioConfig.type,
                    operation: e.bioConfig.operation,
                    data: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                    biometricData: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                },
            },
        });
        e.isWKWebView()
            ? window.webkit.messageHandlers.JDAppUnite.postMessage({
                method: "notifyMessageToNative",
                params: n,
            })
            : window.JDAppUnite && window.JDAppUnite.notifyMessageToNative(n);
        window._bioDeviceCb = function (f) {
            try {
                var r = "object" == typeof f ? f : JSON.parse(f);
                if (void 0 != r && null != r && "0" != r.status) return;
                null != r.data.token &&
                void 0 != r.data.token &&
                "" != r.data.token &&
                (e.deviceInfo.sdkToken = r.data.token);
            } catch (k) {
                (f = e.getErrorToken(f)),
                null != f && "" != f && (e.deviceInfo.sdkToken = f);
            }
            null != e.deviceInfo.sdkToken &&
            "" != e.deviceInfo.sdkToken &&
            ((f = {
                tk: e.deviceInfo.sdkToken,
                t: new Date().getTime(),
            }),
                e.store("BATQW722QTLYVCRD", JSON.stringify(f)));
        };
    };
    this.getJdSdkCacheToken = function (n) {
        try {
            var e = this,
                f = JSON.stringify({
                    businessType: "bridgeBiologicalProbe",
                    callBackName: "_bioDeviceSdkCacheCb",
                    params: {
                        pin: "",
                        jsonData: {
                            type: e.bioConfig.type,
                            operation: 5,
                            data: {
                                bizId: e.bizId,
                                duraTime: e.bioConfig.duraTime,
                                interval: e.bioConfig.interval,
                            },
                            biometricData: {
                                bizId: e.bizId,
                                duraTime: e.bioConfig.duraTime,
                                interval: e.bioConfig.interval,
                            },
                        },
                    },
                });
            e.isWKWebView()
                ? window.webkit.messageHandlers.JDAppUnite.postMessage({
                    method: "notifyMessageToNative",
                    params: f,
                })
                : window.JDAppUnite && window.JDAppUnite.notifyMessageToNative(f);
            window._bioDeviceSdkCacheCb = function (r) {
                var k = "";
                try {
                    var g = "object" == typeof r ? r : JSON.parse(r);
                    if (void 0 != g && null != g && "0" != g.status) return;
                    k = g.data.token;
                } catch (m) {
                    k = e.getErrorToken(r);
                }
                null != k &&
                "" != k &&
                "function" == typeof n &&
                (n(k),
                k.startsWith("jdd") &&
                ((r = {
                    tk: k,
                    t: new Date().getTime(),
                }),
                    e.store("BATQW722QTLYVCRD", JSON.stringify(r))));
            };
        } catch (r) {}
    };
    this.store = function (n, e) {
        try {
            this.setCookie(n, e);
        } catch (f) {}
        try {
            window.localStorage && window.localStorage.setItem(n, e);
        } catch (f) {}
        try {
            window.sessionStorage && window.sessionStorage.setItem(n, e);
        } catch (f) {}
        try {
            window.globalStorage &&
            window.globalStorage[".localdomain"].setItem(n, e);
        } catch (f) {}
        try {
            this.db(n, _JdEid);
        } catch (f) {}
    };
    this.getLocal = function (n) {
        var e = {},
            f = null;
        try {
            var r = document.cookie.replace(
                new RegExp("(?:(?:^|.*;\\s*)" + n + "\\s*\\=\\s*([^;]*).*$)|^.*$"),
                "$1"
            );
            0 !== r.length && (e.cookie = r);
        } catch (g) {}
        try {
            window.localStorage &&
            null !== window.localStorage &&
            0 !== window.localStorage.length &&
            (e.localStorage = window.localStorage.getItem(n));
        } catch (g) {}
        try {
            window.sessionStorage &&
            null !== window.sessionStorage &&
            (e.sessionStorage = window.sessionStorage[n]);
        } catch (g) {}
        try {
            p.globalStorage &&
            (e.globalStorage = window.globalStorage[".localdomain"][n]);
        } catch (g) {}
        try {
            d &&
            "function" == typeof d.load &&
            "function" == typeof d.getAttribute &&
            (d.load("jdgia_user_data"), (e.userData = d.getAttribute(n)));
        } catch (g) {}
        try {
            E.indexedDbId && (e.indexedDb = E.indexedDbId);
        } catch (g) {}
        try {
            E.webDbId && (e.webDb = E.webDbId);
        } catch (g) {}
        try {
            for (var k in e)
                if (32 < e[k].length) {
                    f = e[k];
                    break;
                }
        } catch (g) {}
        try {
            if (null == f || "undefined" === typeof f || 0 >= f.length) f = u(n);
        } catch (g) {}
        return f;
    };
    this.createWorker = function () {
        if (window.Worker) {
            try {
                var n = new Blob(
                    [
                        "onmessage = function (event) {\n    var data = JSON.parse(event.data);\n    try {\n        var httpRequest;\n        try {\n            httpRequest = new XMLHttpRequest();\n        } catch (h) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Microsoft.XMLHTTP')\n            } catch (l) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml2.XMLHTTP')\n            } catch (r) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml3.XMLHTTP')\n            } catch (n) {}\n\n        if(data){\n            httpRequest['open']('POST', data.url, false);\n            httpRequest['setRequestHeader']('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');\n            httpRequest['onreadystatechange'] = function () {\n                if (4 === httpRequest['readyState'] && 200 === httpRequest['status']) {\n                    postMessage(httpRequest.responseText);\n                }\n            };\n            httpRequest['send'](data.data);\n        }\n\n    }catch (e){console.error(e);}\n};",
                    ],
                    {
                        type: "application/javascript",
                    }
                );
            } catch (e) {
                (window.BlobBuilder =
                    window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder),
                    (n = new BlobBuilder()),
                    n.append(
                        "onmessage = function (event) {\n    var data = JSON.parse(event.data);\n    try {\n        var httpRequest;\n        try {\n            httpRequest = new XMLHttpRequest();\n        } catch (h) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Microsoft.XMLHTTP')\n            } catch (l) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml2.XMLHTTP')\n            } catch (r) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml3.XMLHTTP')\n            } catch (n) {}\n\n        if(data){\n            httpRequest['open']('POST', data.url, false);\n            httpRequest['setRequestHeader']('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');\n            httpRequest['onreadystatechange'] = function () {\n                if (4 === httpRequest['readyState'] && 200 === httpRequest['status']) {\n                    postMessage(httpRequest.responseText);\n                }\n            };\n            httpRequest['send'](data.data);\n        }\n\n    }catch (e){console.error(e);}\n};"
                    ),
                    (n = n.getBlob());
            }
            try {
                this.worker = new Worker(URL.createObjectURL(n));
            } catch (e) {}
        }
    };
    this.reportWorker = function (n, e, f, r) {
        try {
            null != this.worker &&
            (this.worker.postMessage(
                JSON.stringify({
                    url: n,
                    data: e,
                    success: !1,
                    async: !1,
                })
            ),
                (this.worker.onmessage = function (k) {}));
        } catch (k) {}
    };
})();

function td_collect_exe() {
    _fingerprint_step = 8;
    var t = td_collect.collect();
    td_collect.collectSdk();
    var u = "string" === typeof orderId ? orderId : "",
        v = "undefined" !== typeof jdfp_pinenp_ext && jdfp_pinenp_ext ? 2 : 1;
    u = {
        pin: _jdJrTdCommonsObtainPin(v),
        oid: u,
        p: "https:" == document.location.protocol ? "s" : "h",
        fp: risk_jd_local_fingerprint,
        ctype: v,
        v: "2.7.10.4",
        f: "3",
    };
    try {
        (u.o = _CurrentPageUrl), (u.qs = _url_query_str);
    } catch (w) {}
    _fingerprint_step = 9;
    0 >= _JdEid.length &&
    ((_JdEid = td_collect.obtainLocal()), 0 < _JdEid.length && (_eidFlag = !0));
    u.fc = _JdEid;
    try {
        u.t = jd_risk_token_id;
    } catch (w) {}
    try {
        if ("undefined" != typeof gia_fp_qd_uuid && 0 <= gia_fp_qd_uuid.length)
            u.qi = gia_fp_qd_uuid;
        else {
            var x = _JdJrRiskClientStorage.jdtdstorage_cookie("qd_uid");
            u.qi = void 0 == x ? "" : x;
        }
    } catch (w) {}
    "undefined" != typeof jd_shadow__ &&
    0 < jd_shadow__.length &&
    (u.jtb = jd_shadow__);
    try {
        td_collect.deviceInfo &&
        void 0 != td_collect.deviceInfo &&
        null != td_collect.deviceInfo.sdkToken &&
        "" != td_collect.deviceInfo.sdkToken
            ? ((u.stk = td_collect.deviceInfo.sdkToken), (td_collect.isRpTok = !0))
            : (td_collect.isRpTok = !1);
    } catch (w) {
        td_collect.isRpTok = !1;
    }
    x = td_collect.tdencrypt(u);
    // console.log(u)
    return { a: x, d: t };
}

function _jdJrTdCommonsObtainPin(t) {
    var u = "";
    "string" === typeof jd_jr_td_risk_pin && 1 == t
        ? (u = jd_jr_td_risk_pin)
        : "string" === typeof pin
        ? (u = pin)
        : "object" === typeof pin &&
        "string" === typeof jd_jr_td_risk_pin &&
        (u = jd_jr_td_risk_pin);
    return u;
}

function getBody(userAgent, url = document.location.href) {
    navigator.userAgent = userAgent;
    let href = url;
    let choose = /((https?:)\/\/([^\/]+))(.+)/.exec(url);
    let [, origin, protocol, host, pathname] = choose;
    document.location.href = href;
    document.location.origin = origin;
    document.location.protocol = protocol;
    document.location.host = host;
    document.location.pathname = pathname;
    const JF = new JdJrTdRiskFinger();
    let fp = JF.f.get(function (t) {
        risk_jd_local_fingerprint = t;
        return t;
    });
    let arr = td_collect_exe();
    return { fp, ...arr };
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date(new Date().getTime()+new Date().getTimezoneOffset()*60*1000+8*60*60*1000);let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
