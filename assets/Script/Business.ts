/**
 * Business.ts
 * 业务
 */
const { ccclass, property } = cc._decorator;

import { ItemInfo } from './DataModel';
import { ItemCell } from './ItemCell';
import { itemInfos } from './ItemInfo';
import { ListView } from './ListView';
import { ListViewCell } from './ListViewCell';
import { ListViewDelegate } from './ListViewDelegate';
import PrinterManager from './PrinterManager';
import { TitleCell } from './TitleCell';

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
桌号 ##号<BR>

产品种类　　　     单价     数量<BR>
--------------------------------<BR>
VV
--------------------------------<BR>
合计：$$元<BR>
<BR>
订餐时间：%%<BR><BR>
`;

const printLine = '番茄炒粉粉粉粉     1000.0   100 <BR>';

@ccclass
export default class Business extends ListViewDelegate {
    @property(PrinterManager)
    printerMgr: PrinterManager = null;

    resDict: { [key: string]: cc.SpriteFrame } = {};

    @property(ListView)
    listview: ListView = null;

    @property(cc.Prefab)
    titleCellPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    itemCellPrefab: cc.Prefab = null;

    @property([cc.Label])
    navLbls: cc.Label[] = [];

    curListIdx: number = 0;
    curTitle: string = '商品';
    itemList: ItemInfo[] = [];

    onLoad() {
        for (let index = 0; index < this.navLbls.length; index++) {
            const lbl = this.navLbls[index];
            const node = lbl.node;
            node.on(cc.Node.EventType.TOUCH_START, () => {
                node.color = cc.color(150, 150, 150);
            });
            node.on(cc.Node.EventType.TOUCH_END, () => {
                node.color = cc.color(220, 220, 220);
                this.turnList(index);
            });
            node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
                node.color = cc.color(220, 220, 220);
            });
        }

        cc.loader.loadResDir('items', cc.SpriteFrame, (error: Error, resource: any[], urls: string[]) => {
            for (let index = 0; index < resource.length; index++) {
                const frame = resource[index];
                const url = urls[index];
                const name = url.split('/')[1];
                this.resDict[name] = frame;
            }
            this.turnList(0);
        });
    }

    turnList(idx: number) {
        this.curListIdx = idx;
        for (const lbl of this.navLbls) {
            lbl.node.color = cc.color(220, 220, 220);
            lbl.node.resumeSystemEvents(true);
        }
        const lbl = this.navLbls[idx];
        this.curTitle = lbl.string;
        lbl.node.color = cc.color(222, 181, 75);
        lbl.node.pauseSystemEvents(true);
        const itemList = [];
        for (const itemInfo of itemInfos) {
            if (itemInfo.sort === idx) {
                itemList.push(itemInfo);
            }
        }
        this.itemList = itemList;
        this.listview.resetContent();
    }

    numberOfRows(listView: ListView): number {
        return Math.ceil(this.itemList.length / 3) + 1;
    }

    heightForRow(listView: ListView, rowIdx: number): number {
        if (rowIdx === 0) return 103;
        else return 355;
    }

    cellIdForRow(listView: ListView, rowIdx: number): string {
        if (rowIdx === 0) return 't';
        else return 'i';
    }
    createCellForRow(listView: ListView, rowIdx: number, cellId: string): ListViewCell {
        if (cellId === 't') {
            const cell = cc.instantiate(this.titleCellPrefab).getComponent(TitleCell);
            return cell;
        } else {
            const cell = cc.instantiate(this.itemCellPrefab).getComponent(ItemCell);
            cell.init();
            cell.onClickSub = this.onClickSubCell.bind(this);
            return cell;
        }
    }

    setCellForRow(listView: ListView, rowIdx: number, cell: ItemCell & TitleCell): void {
        if (rowIdx === 0) {
            cell.setData(this.curTitle);
        } else {
            const realRowIdx = (rowIdx - 1) * 3;
            this.setItemCellData(cell, 0, realRowIdx);
            this.setItemCellData(cell, 1, realRowIdx + 1);
            this.setItemCellData(cell, 2, realRowIdx + 2);
        }
    }

    setItemCellData(cell: ItemCell, sub: number, idx: number) {
        const data = this.itemList[idx];
        if (data) cell.setData(sub, idx, this.resDict[data.imgName], data.name, data.price);
        else cell.setData(sub, idx, null, null, 0);
    }

    onClickSubCell(dataIdx: number) {
        cc.log('click cell: ', dataIdx);
    }

    // -----------------------------------------------------------------

    addPrinter() {
        this.printerMgr.addPrinter();
    }

    print() {
        this.printerMgr.print(printContent);
    }
}
