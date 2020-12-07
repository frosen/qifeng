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

    business: Business = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.hide();
        });

        this.btn.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.business.send();
            this.hide();
        });

        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.hide();
        });
    }

    init(business: Business) {
        this.business = business;
    }

    show() {
        this.node.scaleX = 1;
        this.node.opacity = 255;
        this.listView.resetContent();
    }

    hide() {
        this.node.scaleX = 0;
        this.node.opacity = 0;
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
        return cc.instantiate(this.finalCellPrefab).getComponent(FinalCell);
    }

    setCellForRow(listView: ListView, rowIdx: number, cell: FinalCell): void {
        cc.log('STORM cc ^_^ >>>> ', rowIdx);
        cell.setData(this.business.selectedItems[rowIdx]);
    }
}
