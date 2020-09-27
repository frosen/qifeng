/*
 * ItemCell.ts
 *
 * luleyan
 */

import { ListViewCell } from './ListViewCell';
import { ItemCellSub } from './ItemCellSub';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemCell extends ListViewCell {
    @property(cc.Prefab)
    subPrefab: cc.Prefab = null;

    @property(cc.Node)
    sub0: cc.Node = null;
    @property(cc.Node)
    sub1: cc.Node = null;
    @property(cc.Node)
    sub2: cc.Node = null;

    subList: ItemCellSub[] = [];

    init() {
        const sub0 = cc.instantiate(this.subPrefab);
        sub0.parent = this.sub0;
        this.subList.push(sub0.getComponent(ItemCellSub));

        const sub1 = cc.instantiate(this.subPrefab);
        sub1.parent = this.sub1;
        this.subList.push(sub1.getComponent(ItemCellSub));

        const sub2 = cc.instantiate(this.subPrefab);
        sub2.parent = this.sub2;
        this.subList.push(sub2.getComponent(ItemCellSub));
    }

    setData0(frame: cc.SpriteFrame, name: string, price: number) {
        this.setData(0, frame, name, price);
    }

    setData1(frame: cc.SpriteFrame, name: string, price: number) {
        this.setData(1, frame, name, price);
    }

    setData2(frame: cc.SpriteFrame, name: string, price: number) {
        this.setData(2, frame, name, price);
    }

    setData(idx: number, frame: cc.SpriteFrame, name: string, price: number) {
        const sub = this.subList[idx];
        if (frame) {
            sub.node.opacity = 255;
            sub.node.scaleX = 1;
            sub.sp.spriteFrame = frame;
            sub.itemName.string = name;
            sub.price.string = '￥' + String(price);
        } else {
            sub.node.opacity = 0;
            sub.node.scaleX = 0;
        }
    }
}
