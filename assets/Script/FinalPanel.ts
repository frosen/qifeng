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

@ccclass
export default class FinalPanel extends ListViewDelegate {
    @property(cc.Button)
    btn: cc.Button = null;

    @property(ListView)
    listView: ListView = null;

    @property(cc.Label)
    totalStr: cc.Label = null;

    business: Business = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
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

    // -----------------------------------------------------------------

    numberOfRows(listView: ListView): number {
        return this.business.selectedItems.length;
    }

    cellIdForRow(listView: ListView, rowIdx: number): string {
        return 'i';
    }

    createCellForRow(listView: ListView, rowIdx: number, cellId: string): ListViewCell {
        return null;
    }

    setCellForRow(listView: ListView, rowIdx: number, cell: any): void {}
}
