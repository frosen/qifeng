/*
 * ItemCellSub.ts
 *
 * luleyan
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemCellSub extends cc.Component {
    @property(cc.Sprite)
    sp: cc.Sprite = null;
    @property(cc.Label)
    itemName: cc.Label = null;
    @property(cc.Label)
    price: cc.Label = null;
}
