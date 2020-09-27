/**
 * Business.ts
 * 业务
 */
const { ccclass, property } = cc._decorator;

import { ItemCell } from './ItemCell';
import { itemInfos } from './ItemInfo';
import { ListView } from './ListView';
import { ListViewCell } from './ListViewCell';
import { ListViewDelegate } from './ListViewDelegate';
import PrinterManager from './PrinterManager';

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
export default class Business extends ListViewDelegate {
    @property(PrinterManager)
    printerMgr: PrinterManager = null;

    resDict: { [key: string]: cc.SpriteFrame } = {};

    @property(ListView)
    listview: ListView = null;

    @property(cc.Prefab)
    itemCellPrefab: cc.Prefab = null;

    onLoad() {
        cc.loader.loadResDir('items', cc.SpriteFrame, (error: Error, resource: any[], urls: string[]) => {
            for (let index = 0; index < resource.length; index++) {
                const frame = resource[index];
                const url = urls[index];
                const name = url.split('/')[1];
                this.resDict[name] = frame;
            }
            cc.log('^_^!....', this.resDict);
            this.listview.resetContent();
        });
    }

    numberOfRows(listView: ListView): number {
        return Math.ceil(itemInfos.length / 3);
    }

    cellIdForRow(listView: ListView, rowIdx: number): string {
        return 'i';
    }
    createCellForRow(listView: ListView, rowIdx: number, cellId: string): ListViewCell {
        const cell = cc.instantiate(this.itemCellPrefab).getComponent(ItemCell);
        cell.init();
        return cell;
    }

    setCellForRow(listView: ListView, rowIdx: number, cell: ItemCell): void {
        const realRowIdx = rowIdx * 3;
        const data0 = itemInfos[realRowIdx];
        const data1 = itemInfos[realRowIdx + 1];
        const data2 = itemInfos[realRowIdx + 2];
        if (data0) cell.setData0(this.resDict[data0.imgName], data0.name, data0.price);
        else cell.setData0(null, null, 0);
        if (data1) cell.setData1(this.resDict[data1.imgName], data1.name, data1.price);
        else cell.setData1(null, null, 0);
        if (data2) cell.setData2(this.resDict[data2.imgName], data2.name, data2.price);
        else cell.setData2(null, null, 0);
    }

    // -----------------------------------------------------------------

    addPrinter() {
        this.printerMgr.addPrinter();
    }

    print() {
        this.printerMgr.print(printContent);
    }
}
