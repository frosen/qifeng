/**
 * PrinterManager.ts
 * 打印机管理器
 */

const { ccclass, property } = cc._decorator;

// npm
import sha1 = require('sha1');
import qs = require('qs');

// 基础数据
const USER = '466041061@qq.com'; //必填，飞鹅云 www.feieyun.cn后台注册的账号名
const UKEY = '9D9L7DjcFtPLUsAr'; //必填，飞鹅云后台注册账号后生成的UKEY

const HOST = 'api.feieyun.cn'; //域名
const PORT = '80'; //端口
const PATH = '/Api/Open/'; //接口路径
const BURL = `http://${HOST}:${PORT}${PATH}`;

const sn = '921576976';
const key = 'bq8b48v6';
const nickname = 'QiFengPool';

function getTime(): number {
    return Math.floor(new Date().getTime() / 1000); //请求时间,当前时间的秒数
}

function signature(content: string) {
    return sha1(USER + UKEY + content);
}

@ccclass
export default class PrinterManager extends cc.Component {
    addPrinter() {
        const snlist = `${sn}#${key}#${nickname}`;
        const STIME = getTime();
        const postData = {
            user: USER, //账号
            stime: STIME, //当前时间的秒数，请求时间
            sig: signature(String(STIME)), //签名
            apiname: 'Open_printerAddlist', //不需要修改
            printerContent: snlist //添加的打印机信息
        };

        const content = qs.stringify(postData);
        this.send(content, (data: any) => {
            cc.log('add printer rzt: ', data);
        });
    }

    print(printContent: string) {
        const STIME = getTime();
        const postData = {
            user: USER, //账号
            stime: STIME, //当前时间的秒数，请求时间
            sig: signature(String(STIME)), //签名
            apiname: 'Open_printMsg', //不需要修改
            sn: sn, //打印机编号
            content: printContent, //打印内容
            times: '1' //打印联数,默认为1
        };

        const content = qs.stringify(postData);
        this.send(content, (data: any) => {
            cc.log('print rzt: ', data);
        });
    }

    private send(data: any, callback: (data: any) => void) {
        const httpRequest = cc.loader.getXMLHttpRequest();

        httpRequest.open('POST', BURL);
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        httpRequest.timeout = 100000;

        ['abort', 'error', 'timeout'].forEach(function (eventname) {
            httpRequest['on' + eventname] = function () {
                cc.log('****** http error! eventname:', eventname);
            };
        });

        httpRequest.onreadystatechange = function () {
            cc.log('readyState == ', httpRequest.readyState, httpRequest.status);

            if (4 === httpRequest.readyState && 200 === httpRequest.status) {
                let response = httpRequest.response;
                if (callback) callback(response);
            }
        };

        cc.log('HTTP url:', BURL);
        cc.log('HTTP send:', data);

        httpRequest.send(data);
    }
}
