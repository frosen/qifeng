/*
 * FinalCell.ts
 *
 * luleyan
 */

import { ListViewCell } from './ListViewCell';
import { ItemInfo } from './DataModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class FinalCell extends ListViewCell {
    @property(cc.Label)
    nameLbl: cc.Label = null;

    @property(cc.Label)
    priceLbl: cc.Label = null;

    @property(cc.Label)
    countLbl: cc.Label = null;

    @property(cc.Button)
    addBtn: cc.Button = null;

    @property(cc.Button)
    rdcBtn: cc.Button = null;

    @property(cc.Button)
    delBtn: cc.Button = null;

    addCallback: (idx: number) => void = null;
    rdcCallback: (idx: number) => void = null;
    delCallback: (idx: number) => void = null;

    onLoad() {
        super.onLoad();
        if (CC_EDITOR) return;

        this.addBtn.node.on('click', this.onAdd.bind(this));
        this.rdcBtn.node.on('click', this.onRdc.bind(this));
        this.delBtn.node.on('click', this.onDel.bind(this));
    }

    setData(itemData: { count: number; data: ItemInfo }) {
        this.nameLbl.string = itemData.data.name;
        this.priceLbl.string = '￥' + String(itemData.data.price);
        this.countLbl.string = String(itemData.count);
    }

    onAdd() {
        this.addCallback(this.curCellIdx);
    }

    onRdc() {
        this.rdcCallback(this.curCellIdx);
    }

    onDel() {
        this.delCallback(this.curCellIdx);
    }
}
