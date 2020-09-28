/*
 * TitleCell.ts
 *
 * luleyan
 */

import { ListViewCell } from './ListViewCell';

const { ccclass, property } = cc._decorator;

@ccclass
export class TitleCell extends ListViewCell {
    @property(cc.Label)
    title: cc.Label = null;

    setData(title: string) {
        this.title.string = '———— ' + title + ' ————';
    }
}
