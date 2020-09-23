/**
 * MainLogic.ts
 * 主逻辑
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

function getTime(): number {
    return Math.floor(new Date().getTime() / 1000); //请求时间,当前时间的秒数
}

function signature(content: string) {
    return sha1(USER + UKEY + content);
}

//标签说明：
//单标签:
//"<BR>"为换行,"<CUT>"为切刀指令(主动切纸,仅限切刀打印机使用才有效果)
//"<LOGO>"为打印LOGO指令(前提是预先在机器内置LOGO图片),"<PLUGIN>"为钱箱或者外置音响指令
//成对标签：
//"<CB></CB>"为居中放大一倍,"<B></B>"为放大一倍,"<C></C>"为居中,<L></L>字体变高一倍
//<W></W>字体变宽一倍,"<QR></QR>"为二维码,"<BOLD></BOLD>"为字体加粗,"<RIGHT></RIGHT>"为右对齐
//拼凑订单内容时可参考如下格式
//根据打印纸张的宽度，自行调整内容的格式，可参考下面的样例格式
const printContent = `
<CB>测试打印</CB><BR>
名称　　　　　 单价  数量 金额<BR>
--------------------------------<BR>
番　　　　　　 1.0    1   1.0<BR>
番茄　　　　　 10.0   10  10.0<BR>
番茄炒　　　　 10.0   100 100.0<BR>
番茄炒粉　　　 100.0  100 100.0<BR>
番茄炒粉粉　　 1000.0 1   100.0<BR>
番茄炒粉粉粉粉 100.0  100 100.0<BR>
番茄炒粉粉粉粉 15.0   1   15.0<BR>
备注：快点送到xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<BR>
--------------------------------<BR>
合计：xx.0元<BR>
送货地点：xxxxxxxxxxxxxxxxx<BR>
联系电话：138000000000<BR>
订餐时间：2011-01-06 19:30:10<BR><BR>
----------请扫描二维码----------
<QR>http://www.baidu.com</QR>
`;

@ccclass
export default class MainLogic extends cc.Component {
    addPrinter(sn: string, key: string, remark: string) {
        const snlist = `${sn}#${key}#${remark}`;
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

    print(sn: string) {
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

    send(data: any, callback: (data: any) => void) {
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
