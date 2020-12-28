/**
 * FinalPanel.ts
 *
 * luleyan
 */

const { ccclass, property } = cc._decorator;

import { ListView } from './ListView';
import Business from './Business';
import { ListViewDelegate } from './ListViewDelegate';
import { ListViewCell } from './ListViewCell';
import { FinalCell } from './FinalCell';

@ccclass
export default class FinalPanel extends ListViewDelegate {
    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    @property(ListView)
    listView: ListView = null;

    @property(cc.Label)
    totalStr: cc.Label = null;

    @property(cc.Prefab)
    finalCellPrefab: cc.Prefab = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    pop: cc.Node = null;

    @property(cc.Node)
    popConfirm: cc.Node = null;

    @property(cc.Node)
    popBack: cc.Node = null;

    business: Business = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.hide();
        });

        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.hide();
        });

        this.btn.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.business.selectedItems.length <= 0) {
                this.business.popToast('好像并没有商品呀\n请再确认下哈');
                return;
            }

            this.pop.scaleX = 1;
            this.pop.opacity = 255;
        });

        this.popConfirm.on(cc.Node.EventType.TOUCH_END, () => {
            this.business.send();

            this.pop.scaleX = 0;
            this.pop.opacity = 0;
            this.hide();
        });

        this.popBack.on(cc.Node.EventType.TOUCH_END, () => {
            this.pop.scaleX = 0;
            this.pop.opacity = 0;
        });
    }

    init(business: Business) {
        this.business = business;
    }

    show() {
        this.node.scaleX = 1;
        this.node.opacity = 255;
        this.listView.resetContent();

        this.mask.stopAllActions();
        cc.tween(this.mask).to(0.3, { opacity: 125 }).start();
    }

    hide() {
        this.node.scaleX = 0;
        this.node.opacity = 0;

        this.mask.stopAllActions();
        cc.tween(this.mask).to(0.3, { opacity: 0 }).start();
    }

    update() {
        if (this.node.scaleX > 0) {
            let total = 0;
            for (const itemData of this.business.selectedItems) {
                total += itemData.count * itemData.data.price;
            }
            this.totalStr.string = '总价：￥' + String(total);
        }
    }

    // -----------------------------------------------------------------

    numberOfRows(listView: ListView): number {
        return this.business.selectedItems.length;
    }

    cellIdForRow(listView: ListView, rowIdx: number): string {
        return 'i';
    }

    createCellForRow(listView: ListView, rowIdx: number, cellId: string): ListViewCell {
        const cell = cc.instantiate(this.finalCellPrefab).getComponent(FinalCell);
        cell.addCallback = this.add.bind(this);
        cell.rdcCallback = this.rdc.bind(this);
        cell.delCallback = this.del.bind(this);
        return cell;
    }

    setCellForRow(listView: ListView, rowIdx: number, cell: FinalCell): void {
        cell.setData(this.business.selectedItems[rowIdx]);
    }

    add(idx: number) {
        const item = this.business.selectedItems[idx];
        item.count = Math.min(9, item.count + 1);
        this.listView.resetContent(true);
    }

    rdc(idx: number) {
        const item = this.business.selectedItems[idx];
        item.count = Math.max(1, item.count - 1);
        this.listView.resetContent(true);
    }

    del(idx: number) {
        const items = this.business.selectedItems;
        items.splice(idx, 1);
        this.listView.resetContent(true);
    }
}
