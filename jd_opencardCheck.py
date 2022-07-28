#!/usr/bin/python3
# -*- coding: utf8 -*-
"""
# 注意！不支持青龙2.10.3以下版本
# 来自柒月
# 如果请求api.github.com失败请自行想办法，用拉库用的Github加速代理是没用的
# 青龙里面要有监控的Github仓库的拉库命令，通过监控Github仓库来查看是否有新的开卡脚本
# 如果发现新的开卡脚本则自动拉库并运行开卡脚本，如果发现已有多个相同开卡脚本时
# 且其中一个开卡脚本已经运行过了或者正在运行，之后更新的开卡脚本将不会再运行

# 填写要监控的GitHub仓库的 用户名/仓库名/分支/脚本关键词
# 监控多个仓库请用 & 隔开
export GitRepoHost="feverrun/my_scripts/main/jd_opencard"
# http代理，访问不了github的可以填上
export GitProxy="http://127.0.0.1:8080"
# 运行开卡脚本前禁用开卡脚本定时任务，不填则不禁用，保留原有定时
export opencardDisable="true"

version: 7.26.1
cron: */5 0-3 * * *
new Env('开卡更新检测')
"""

from time import sleep
from notify import send
import requests,json,os

# 显示日志
List=[]
def log(content):
    print(content)
    List.append(content)

# 读取青龙登录token
def qltoken():
    if os.path.exists("/ql/data"):
        path = "/ql/data"
    else:
        path = "/ql"
    with open(f"{path}/config/auth.json", 'rb') as json_file:
        authjson = json.load(json_file)
    if "token" in authjson:
        token = authjson["token"]
        return token
    else:
        log("青龙Token获取失败")
        return

# 检查版本
def qlversion():
    url = qlhost+"/system"
    rsp = session.get(url=url,headers=headers)
    jsons = rsp.json()
    if rsp.status_code == 200:
        if "data" in jsons:
            if "version" in jsons["data"]:
                v = jsons["data"]["version"].split(".")
                log("当前青龙版本："+jsons["data"]["version"])
                if int(v[0])<=2 and int(v[1])>=13: # 大于等于2.13.0，小于3.0.0
                    version = {"path":"/ql/data","api":"/subscriptions","id":"id"}
                elif int(v[0])<=2 and int(v[1])>=12: # 大于等于2.12.0，小于2.13.0
                    version = {"path":"/ql/data","api":"/crons","id":"id"}
                elif int(v[0])<=2 and int(v[1])>=11: # 大于等于2.11.0 小于2.12.0
                    version = {"path":"/ql","api":"/crons","id":"id"}
                elif int(v[0])<=2 and int(v[1])>=10 and int(v[2])>=3: # 大于等于2.10.3 小于2.11.0
                    version = {"path":"/ql","api":"/crons","id":"_id"}
                else:
                    log("青龙版本低于2.10.3，停止运行")
                    return False
            else:
                version = {"path":"/ql","api":"/crons","id":"_id"}
            return version
    else:
        log(f'请求青龙失败：{url}')
        if "message" in jsons:
            log(f'错误信息：{jsons["message"]}')
        return False

# 获取id
def qlcron(name,repopath):
    url = qlhost+"/crons?searchValue="+name
    if version["api"]=="/subscriptions" and repopath!="False":
        url = qlhost+version["api"]
    rsp = session.get(url=url, headers=headers)
    jsons = rsp.json()
    if rsp.status_code == 200:
        if len(jsons["data"]):
            if version["api"]=="/subscriptions" and repopath!="False":
                for x in jsons["data"]:
                    if x["alias"]== repopath:
                        log("获取任务成功："+x["name"])
                        return x["name"],[x[version["id"]]]
            else:
                cronID = jsons["data"][0][version["id"]]
                log("获取任务成功："+jsons["data"][0]["name"])
                return jsons["data"][0]["name"],[cronID]
        else:
            log(f"没有找到任务：{name}")
            return False,False
    else:
        log(f'请求青龙失败：{url}')
        if "message" in jsons:
            log(f'错误信息：{jsons["message"]}')
        return False,False

# 运行拉库命令
def qlrepo(scriptsName):
    # 检查仓库文件夹格式
    repopath = Repo[0]+"_"+Repo[1]
    if os.path.exists(path+"/scripts/"+repopath):
        if os.path.exists(path+"/scripts/"+repopath+"_"+Repo[2]):
            log(f"存在两个仓库：{repopath}和"+repopath+"_"+Repo[2])
            return
    else:
        repopath = repopath+"_"+Repo[2]
        if not os.path.exists(path+"/scripts/"+repopath):
            log(f"没有找到仓库：{repopath}")
            return
    url = qlhost+version["api"]+"/run"
    RepoName,RepoID = qlcron(GitRepo,repopath)
    if not RepoName:
        log(f"获取仓库任务信息失败：{GitRepo}")
        return
    # 检查仓库文件夹中是否有开卡脚本，没有就运行拉库命令
    rsp = session.put(url=url,headers=headers,data=json.dumps(RepoID))
    if rsp.status_code == 200:
        log(f"运行拉库任务：{RepoName}")
        ii=0
        scriptsFile = path+"/scripts/"+repopath+"/"+scriptsName
        while not os.path.exists(scriptsFile):
            if ii>=20:
                return
            sleep(1)
            ii+=1
        else:
            sleep(5)
            return True
    else:
        log(f'请求青龙失败：{url}')
        if "message" in rsp.json():
            log(f'错误信息：{rsp.json()["message"]}')
        return


# 运行开卡任务
def qltask(scriptsName):
    # 获取开卡任务信息
    TaskName,TaskID = qlcron(scriptsName,"False")
    if not TaskName:
        log(f"获取开卡任务信息失败：{scriptsName}")
        return
    # 禁用开卡任务
    if 'opencardDisable' in os.environ:
        Disable = os.environ['opencardDisable']
        if Disable=="true":
            url = qlhost+"/crons/disable"
            rsp = session.put(url=url,headers=headers,data=json.dumps(TaskID))
            if rsp.status_code == 200:
                log(f"禁用开卡任务：{TaskName}")
            else:
                log(f'请求青龙失败：{url}')
                if "message" in rsp.json():
                    log(f'错误信息：{rsp.json()["message"]}')
                return
    # 查找当前是否有多个同名开卡任务
    namename = TaskName.split(" ")
    if len(namename)>1:
        namename = namename[1]
    else:
        namename = namename[0]
    url = qlhost+"/crons?searchValue="+namename
    rsp = session.get(url=url, headers=headers).json()
    if len(rsp["data"])>1:
        log(f"找到多个任务：{namename}")
        # 查看任务是否运行过
        for a in rsp["data"]:
            xurl = qlhost+"/crons/"+str(a[version["id"]])
            xrsp = session.get(url=xurl, headers=headers).json()
            if "last_execution_time" in xrsp["data"]:
                if xrsp["data"]["last_execution_time"]!=0:
                    log("该任务曾运行："+xrsp["data"]["name"])
                    log("放弃运行任务："+TaskName)
                    return
                else:
                    log("从未运行任务："+xrsp["data"]["name"])
            else:
                log("从未运行任务："+xrsp["data"]["name"])
    # 运行开卡任务
    url = qlhost+"/crons/run"
    rsp = session.put(url=url,headers=headers,data=json.dumps(TaskID))
    if rsp.status_code == 200:
        log(f"运行开卡任务：{TaskName}")
    else:
        log(f'请求青龙失败：{url}')
        if "message" in rsp.json():
            log(f'错误信息：{rsp.json()["message"]}')

# 请求Github仓库获取目录树
def github():
    log(f"\n监控仓库：https://github.com/{GitRepo}")
    gitapi = f'https://api.github.com/repos/{GitRepo}/git/trees/{GitBranch}'
    rsp = session.get(url=gitapi,headers={"Content-Type":"application/json"},proxies=proxies)
    if rsp.status_code != 200:
        log(f'请求GitHub失败：{gitapi}')
        if "message" in rsp.json():
            log(f'错误信息：{rsp.json()["message"]}')
    else:
        # 只保存目录树中的开卡脚本的文件名信息
        tree = []
        for x in rsp.json()["tree"]:
            if Repo[3] in x["path"]:
                tree.append(x["path"])
        return tree

def check():
    state = False
    # 查看是否有tree_库名.json文件，没有则自动生成
    if not os.path.exists(f"{path}/scripts/tree_{Repo[0]}.json"):
        with open(f"{path}/scripts/tree_{Repo[0]}.json","w") as f:
            json.dump(tree,f)
        log(f"没有找到tree_{Repo[0]}.json文件！将自动生成")
    # 读取上一次保存的tree.json并与当前tree进行对比
    with open(f"{path}/scripts/tree_{Repo[0]}.json", 'rb') as json_file:
        tree_json = json.load(json_file)
    with open(f"{path}/scripts/tree_{Repo[0]}.json","w") as f:
        log(f"保存数据到tree_{Repo[0]}.json文件")
        json.dump(tree,f)
    for scriptsName in tree:
        if scriptsName not in tree_json:
            log(f"新增开卡脚本：{scriptsName}")
            repoPull = qlrepo(scriptsName) # 运行拉库任务
            if repoPull: # 运行脚本任务
                qltask(scriptsName)
            state = True
            break
    else:
        log("没有新增开卡脚本")
    return state

if 'GitRepoHost' in os.environ:
    RepoHost = os.environ['GitRepoHost'].split("&")
    proxies = {}
    if 'GitProxy' in os.environ:
        log("已设置HTTP代理，将通过代理访问api.github.com")
        proxies['https'] = os.environ['GitProxy']
    session = requests.session()
    qlhost = 'http://127.0.0.1:5700/api'
    token = qltoken()
    headers = {"Content-Type":"application/json","Authorization":"Bearer "+token}
    version = qlversion()
    path = version["path"]
    if path:
        for RepoX in RepoHost:
            Repo = RepoX.split("/")
            GitRepo = Repo[0]+"/"+Repo[1]
            GitBranch = Repo[2]
            tree = github() # 获取github仓库目录树
            state = check() # 检测有无开卡脚本更新并运行
            tt = '\n'.join(List)
            if state:
                send('开卡更新检测', tt)
else:
    log("请查看脚本注释后设置相关变量")