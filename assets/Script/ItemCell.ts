import Business from './Business';
/*
 * ItemCell.ts
 *
 * luleyan
 */

import { ListViewCell } from './ListViewCell';

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

    init() {}

    setData0(frame: cc.SpriteFrame, name: string, price: number) {}

    setData1(frame: cc.SpriteFrame, name: string, price: number) {}

    setData2(frame: cc.SpriteFrame, name: string, price: number) {}
}
