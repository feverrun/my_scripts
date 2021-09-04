# -*- coding: utf-8 -*
'''
cron: 15 */6 * * * wskey.py
new Env('wskey转换');
'''

import base64
import http.client
import json
import os
import sys

try:
    import requests
except Exception as e:
    print(e, "\n缺少requests模块, 请执行命令：pip3 install requests\n")
    sys.exit(1)
os.environ['no_proxy'] = '*'
requests.packages.urllib3.disable_warnings()


def ql_login():
    path = '/ql/config/auth.json'
    if os.path.isfile(path):
        with open(path, "r") as file:
            auth = file.read()
            file.close()
        auth = json.loads(auth)
        username = auth["username"]
        password = auth["password"]
        token = auth["token"]
        if token == '':
            url = "http://127.0.0.1:5700/api/login"
            payload = {"username": username, "password": password}
            headers = {'Content-Type': 'application/json'}
            res = requests.post(url=url, headers=headers, data=payload, verify=False)
            token = json.loads(res.text)['token']
            return token
        else:
            return token
    else:
        print("没有发现auth文件, 你这是青龙吗???")
        sys.exit(0)


def get_wskey():
    if "JD_WSCK" in os.environ:
        wskey_list = os.environ['JD_WSCK'].split('&')
        if len(wskey_list) > 0:
            return wskey_list
        else:
            print("JD_WSCK变量未启用")
            sys.exit(1)
    else:
        print("未添加JD_WSCK变量")
        sys.exit(0)


def get_ck():
    if "JD_COOKIE" in os.environ:
        ck_list = os.environ['JD_COOKIE'].split('&')
        if len(ck_list) > 0:
            return ck_list
        else:
            print("JD_COOKIE变量未启用")
            sys.exit(1)
    else:
        print("未添加JD_COOKIE变量")
        sys.exit(0)


def check_ck(ck):
    url = 'https://wq.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder'
    headers = {'Cookie': ck, 'Referer': 'https://home.m.jd.com/myJd/home.action',
               'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1', }
    res = requests.get(url=url, headers=headers, verify=False, timeout=30)
    if res.status_code == 200:
        code = int(json.loads(res.text)['retcode'])
        pin = ck.split(";")[1]
        if code == 0:
            print(pin, "状态正常\n")
            return True
        else:
            print(pin, "状态失效\n")
            return False
    else:
        return False


def getToken(wskey):
    headers = {'cookie': wskey,
               'User-Agent': 'okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1440x3007;os/11;network/wifi;',
               'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'charset': 'UTF-8',
               'accept-encoding': 'br,gzip,deflate'}
    params = {'functionId': 'genToken', 'clientVersion': '10.1.2', 'client': 'android', 'uuid': uuid, 'st': st,
              'sign': sign, 'sv': sv}
    url = 'https://api.m.jd.com/client.action'
    data = 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fplogin.m.jd.com%252Fcgi-bin%252Fm%252Fthirdapp_auth_page%253Ftoken%253DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%2526client_type%253Dandroid%2526appid%253D879%2526appup_type%253D1%22%7D&'
    res = requests.post(url=url, params=params, headers=headers, data=data, verify=False)
    res_json = json.loads(res.text)
    tokenKey = res_json['tokenKey']
    return appjmp(wskey, tokenKey)


def appjmp(wskey, tokenKey):
    headers = {
        'User-Agent': 'okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1440x3007;os/11;network/wifi;',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3', }
    params = {'tokenKey': tokenKey,
              'to': 'https://plogin.m.jd.com/cgi-bin/m/thirdapp_auth_page?token=AAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg',
              'client_type': 'android', 'appid': 879, 'appup_type': 1, }
    url = 'https://un.m.jd.com/cgi-bin/app/appjmp'
    res = requests.get(url=url, headers=headers, params=params, verify=False, allow_redirects=False)
    res_set = res.cookies.get_dict()
    pt_key = 'pt_key=' + res_set['pt_key']
    pt_pin = 'pt_pin=' + res_set['pt_pin']
    jd_ck = str(pt_key) + ';' + str(pt_pin) + ';'
    wskey = wskey.split(";")[0]
    if 'fake' in pt_key:
        print(wskey, "wskey状态失效\n")
        return False, jd_ck
    else:
        print(wskey, "wskey状态正常\n")
        return True, jd_ck


def get_sign():
    url = 'https://hellodns.coding.net/p/sign/d/jsign/git/raw/master/sign'
    res = requests.get(url=url, verify=False, timeout=20)
    sign_list = json.loads(res.text)
    svv = sign_list['sv']
    stt = sign_list['st']
    suid = sign_list['uuid']
    jign = sign_list['sign']
    return svv, stt, suid, jign


def boom():
    url = 'https://hellodns.coding.net/p/sign/d/jsign/git/raw/master/boom'
    res = requests.get(url=url, verify=False, timeout=60)
    ex = int(res.text)
    if ex != 0:
        print("Check Failure")
        print("--------------------\n")
        sys.exit(0)
    else:
        print("Verification passed")
        print("--------------------\n")


def serch_ck(pin):
    pin2 = pin.replace('%', '%5C%25')
    conn = http.client.HTTPConnection("127.0.0.1", 5700)
    payload = ''
    headers = {'Authorization': 'Bearer ' + token}
    url = '/api/envs?searchValue={0}'.format(pin2)
    conn.request("GET", url, payload, headers)
    res = json.loads(conn.getresponse().read())
    if len(res['data']) == 0:
        print(pin, "检索失败\n")
        return False, 1
    elif len(res['data']) > 1:
        print(pin, "Pin存在重复, 取第一条\n")
        key = res['data'][0]['value']
        eid = res['data'][0]['_id']
        return True, key, eid
    else:
        print(pin, "检索成功\n")
        key = res['data'][0]['value']
        eid = res['data'][0]['_id']
        return True, key, eid


def ql_update(eid, n_ck):
    url = 'http://127.0.0.1:5700/api/envs'
    data = {"name": "JD_COOKIE", "value": n_ck, "_id": eid}
    data = json.dumps(data)
    res = json.loads(s.put(url=url, data=data).text)
    if res['data']['status'] == 1:
        ql_enable(eid)


def ql_enable(eid):
    url = 'http://127.0.0.1:5700/api/envs/enable'
    data = '["{0}"]'.format(eid)
    res = json.loads(s.put(url=url, data=data).text)
    if res['code'] == 200:
        print("账号启用成功")
        print("--------------------\n")
        return True
    else:
        print("账号启用失败")
        print("--------------------\n")
        return False


def ql_disable(eid):
    url = 'http://127.0.0.1:5700/api/envs/disable'
    data = '["{0}"]'.format(eid)
    res = json.loads(s.put(url=url, data=data).text)
    if res['code'] == 200:
        print("账号禁用成功")
        print("--------------------\n")
        return True
    else:
        print("账号禁用失败")
        print("--------------------\n")
        return False


def ql_insert(i_ck):
    data = [{"value": i_ck, "name": "JD_COOKIE"}]
    data = json.dumps(data)
    url = 'http://127.0.0.1:5700/api/envs'
    s.post(url=url, data=data)
    print("账号添加完成")
    print("--------------------\n")


if __name__ == '__main__':
    boom()
    sv, st, uuid, sign = get_sign()
    token = ql_login()
    s = requests.session()
    s.headers.update({"authorization": "Bearer " + str(token)})
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    wslist = get_wskey()
    for ws in wslist:
        wspin = ws.split(";")[0]
        if "pin" in wspin:
            wspin = "pt_" + wspin
            return_serch = serch_ck(wspin)
            if return_serch[0]:
                jck = str(return_serch[1])
                if not check_ck(jck):
                    return_ws = getToken(ws)
                    if return_ws[0]:
                        nt_key = str(return_ws[1])
                        print("wskey转换成功\n")
                        eid = return_serch[2]
                        ql_update(eid, nt_key)
                    else:
                        print(ws, "wskey失效\n")
                        eid = return_serch[2]
                        print("禁用账号", wspin)
                        ql_disable(eid)
                else:
                    print(wspin, "账号有效")
                    print("--------------------\n")
            else:
                print("wskey未生成pt_key\n")
                return_ws = getToken(ws)
                if return_ws[0]:
                    nt_key = str(return_ws[1])
                    print("wskey转换成功\n")
                    ql_insert(nt_key)
        else:
            print("WSKEY格式错误\n--------------------\n")
    print("执行完成\n--------------------")
    sys.exit(0)
