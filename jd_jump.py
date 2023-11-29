"""
new Env('jd转码');
2 2 29 2 * jd_jump.py
https://t.me/proenvc
by:环境 (感谢nolan提供的接口)
"""

import os
import requests
import json
import sys


code = ''
def printf(p):
    print(p)
    sys.stdout.flush()

def jdCode():
    max_try = 30
    for i in range(max_try):
        try:
            jd_jump_code = os.getenv('jd_jump_code') if os.getenv('jd_jump_code') else code
            if jd_jump_code == '':
                printf('jd_jump_code 未设置退出执行！！！')
                return
            headers = {"Content-Type": "application/json"}
            data = {"code": jd_jump_code}
            res = requests.post('https://api.nolanstore.cc/JComExchange', headers=headers, json=data, timeout=5)
            if res.status_code == 200:
                res = json.loads(res.text)
                if res['code'] == '0' and res['data']['jumpUrl']:
                    printf(f"跳转地址: {res['data']['jumpUrl']}")
                    return res['data']['jumpUrl']
                return res
        except Exception as e:
            pass
    printf(f'接口重试达到{max_try}次, 退出执行！')
    sys.exit()

if __name__ == '__main__':
    jdCode()