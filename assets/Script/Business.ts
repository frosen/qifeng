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
import { ItemCellSub } from './ItemCellSub';
import FinalPanel from './FinalPanel';
import TableIdxCtrlr from './TableIdxCtrlr';
import TimeUpdater from './TimeUpdater';

//标签说明：
//单标签:
//"<BR>"为换行,"<CUT>"为切刀指令(主动切纸,仅限切刀打印机使用才有效果)
//"<LOGO>"为打印LOGO指令(前提是预先在机器内置LOGO图片),"<PLUGIN>"为钱箱或者外置音响指令
//成对标签：
//"<CB></CB>"为居中放大一倍,"<B></B>"为放大一倍,"<C></C>"为居中,<L></L>字体变高一倍
//<W></W>字体变宽一倍,"<QR></QR>"为二维码,"<BOLD></BOLD>"为字体加粗,"<RIGHT></RIGHT>"为右对齐
//拼凑订单内容时可参考如下格式
//根据打印纸张的宽度，自行调整内容的格式，可参考下面的样例格式
const BasePrintContent = `
桌号 ##号<BR>

产品种类　　　     单价     数量<BR>
--------------------------------<BR>
VV
--------------------------------<BR>
合计：$$元<BR>
<BR>
订餐时间：%%<BR><BR>
`;

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

    @property(cc.Prefab)
    subPrefab: cc.Prefab = null;

    @property(cc.Node)
    jumpBase: cc.Node = null;

    @property([cc.Label])
    navLbls: cc.Label[] = [];

    curListIdx: number = 0;
    curTitle: string = '商品';
    itemList: ItemInfo[] = [];

    selectedItems: { count: number; data: ItemInfo }[] = [];

    @property(cc.Button)
    confirm: cc.Button = null;

    @property(cc.Label)
    itemNumLbl: cc.Label = null;

    @property(FinalPanel)
    finalPanel: FinalPanel = null;

    @property(TableIdxCtrlr)
    tableIdxCtrlr: TableIdxCtrlr = null;

    @property(TimeUpdater)
    timer: TimeUpdater = null;

    @property(cc.Node)
    toastNode: cc.Node = null;

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

        this.confirm.node.on(cc.Node.EventType.TOUCH_END, this.onConfirm.bind(this));
        this.finalPanel.init(this);

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

    onClickSubCell(dataIdx: number, node: cc.Node) {
        const data = this.itemList[dataIdx];
        let has = false;
        for (const item of this.selectedItems) {
            if (item.data === data) {
                item.count++;
                has = true;
                break;
            }
        }
        if (!has) {
            this.selectedItems.push({ count: 1, data });
        }

        const subNode = cc.instantiate(this.subPrefab);
        const pos = node.convertToWorldSpaceAR(cc.v2(-540, -960));
        subNode.position = cc.v3(pos);
        this.jumpBase.addChild(subNode);
        cc.log('click cell: ', dataIdx, pos.x, pos.y);

        const sub = subNode.getComponent(ItemCellSub);
        sub.sp.spriteFrame = this.resDict[data.imgName];
        sub.itemName.string = data.name;
        sub.price.string = '￥' + String(data.price);

        subNode.runAction(
            cc.sequence(
                cc.spawn(cc.jumpTo(0.6, 300 - 20, -800 + 40, 400, 1), cc.scaleTo(0.6, 0.2)),
                cc.callFunc(() => {
                    setTimeout(() => {
                        subNode.removeFromParent();
                        subNode.destroy();
                    });
                })
            )
        );
    }

    // -----------------------------------------------------------------

    update() {
        this.checkSelectedItemNum();
    }

    checkSelectedItemNum() {
        let num = 0;
        for (const itemData of this.selectedItems) {
            num += itemData.count;
        }

        if (num === 0) {
            this.itemNumLbl.node.parent.opacity = 0;
        } else {
            this.itemNumLbl.string = String(num > 99 ? 99 : num);
            this.itemNumLbl.node.parent.opacity = 255;
        }
    }

    onConfirm() {
        this.finalPanel.show();
    }

    send() {
        let content = BasePrintContent;
        content = content.replace('##', String(this.tableIdxCtrlr.idx));
        content = content.replace('$$', String(this.getTotal()));
        content = content.replace('%%', this.timer.getCurTimeStr());
        content = content.replace('VV', this.getItemsStr());

        this.print(content);

        this.popToast('订单已提交，\n请您稍等一下，我们尽快为您准备~');

        this.clear();
    }

    getTotal() {
        let total = 0;
        for (const item of this.selectedItems) {
            total += item.count * item.data.price;
        }
        return total;
    }

    getItemsStr() {
        let str = '';
        for (const item of this.selectedItems) {
            let line = '';
            line += item.data.name;
            const spaceCount = 14 - this.getStringLen(item.data.name);
            for (let index = 0; index < spaceCount; index++) line += ' ';
            line += '     ';
            const priceStr = String(item.data.price);
            line += priceStr;
            line += priceStr.length === 1 ? '        ' : '       ';
            line += String(item.count);
            line += '<BR>\n';
            str += line;
        }
        return str;
    }

    getStringLen(str: string): number {
        let len = 0;
        for (let index = 0; index < str.length; index++) {
            if (str.charCodeAt(index) > 10000) len += 2;
            else len += 1;
        }
        return len;
    }

    clear() {
        this.selectedItems.length = 0;
    }

    popToast(str: string) {
        this.toastNode.getComponentInChildren(cc.Label).string = str;
        this.toastNode.stopAllActions();
        cc.tween(this.toastNode).to(0.3, { opacity: 255 }).delay(3).to(0.3, { opacity: 0 }).start();
    }

    // -----------------------------------------------------------------

    addPrinter() {
        this.printerMgr.addPrinter();
    }

    print(content: string) {
        cc.log('print: ', content);
        // this.printerMgr.print(content);
    }
}
