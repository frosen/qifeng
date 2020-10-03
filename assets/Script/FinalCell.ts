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

    itemData: { count: number; data: ItemInfo } = null;

    onLoad() {
        super.onLoad();
        if (CC_EDITOR) return;

        this.addBtn.node.on('click', this.onAdd.bind(this));
        this.rdcBtn.node.on('click', this.onRdc.bind(this));
    }

    setData(itemData: { count: number; data: ItemInfo }) {
        this.itemData = itemData;
        this.nameLbl.string = itemData.data.name;
        this.priceLbl.string = '￥' + String(itemData.data.price);
        this.countLbl.string = String(itemData.count);
    }

    onAdd() {
        let newCount = this.itemData.count + 1;
        newCount = Math.min(newCount, 9);
        this.itemData.count = newCount;
        this.setData(this.itemData);
    }

    onRdc() {
        let newCount = this.itemData.count - 1;
        newCount = Math.max(newCount, 0);
        this.itemData.count = newCount;
        this.setData(this.itemData);
    }
}
