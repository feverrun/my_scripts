# 学习使用
### 全网最稳定助力池
### 只支持青龙拉取  (建议服务器通过docker安装青龙)
#### 青龙环境搭建教程
https://github.com/feverrun/my_scripts/wiki/%E9%9D%92%E9%BE%99%E6%90%AD%E5%BB%BA%E6%95%99%E7%A8%8B
```
ql repo https://github.com/feverrun/my_scripts.git "jd_|jx_|jddj|getCookie|getJDCookie" "backUp" "^(jd|JD|JS)[^_]|USER|sendNotify|utils"
```
## 只收不混跑多个集成库的，号越多越好
**你们青龙所在车头优先，非车头随机**

**拉库后安装好依赖无需做额外配置**

## 加入助力池
[点此加入](https://t.me/proenv) 联系我加入白名单 

## 定时更新库
任务名:   myScripts

定时 :    1 * * * *

任务 :
```
ql repo https://github.com/feverrun/my_scripts.git "jd_|jx_|jddj|getCookie|getJDCookie" "backUp" "^(jd|JD|JS)[^_]|USER|sendNotify|utils"
```

### 长久活动(已接入助力池)
```
东东农场
种豆得豆
京东萌宠
东东工厂
惊喜工厂
京东健康
惊喜财富岛   (优先内部)
闪购盲盒
京喜牧场    (优先内部)
```

### 临时活动(已接入助力池)
```
惊喜领取88      (优先内部) - 活动结束
锦鲤红包        (优先内部)
5G超级盲盒      
城城分金        (优先内部) - 活动结束
手机狂欢城活动   (优先内部) - 活动结束     
```

## nodejs模块安装
### 方法一: 进入青龙容器安装依赖
```
npm install -g png-js
npm install -g date-fns
npm install -g axios
npm install -g dotenv
npm install -g got
npm install -g crypto-js
npm install -g md5
npm install -g ts-md5
npm install -g tslib
npm install -g @types/node
npm install -g requests
npm install -g tough-cookie
npm install -g jsdom
npm install -g download
npm install -g tunnel
npm install -g ws
npm install -g js-base64
npm install -g qrcode-terminal
```
### 方法二：进入青龙后台安装依赖
依赖管理》NodeJs》添加依赖》选择自动拆分，把以下内容全部复制到名称里，之后点击确定
```
png-js
date-fns
axios
dotenv
got
crypto-js
md5
ts-md5
tslib
@types/node
requests
tough-cookie
jsdom
download
tunnel
ws
js-base64
qrcode-terminal
```