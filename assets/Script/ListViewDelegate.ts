/*
 * ListViewDelegate.ts
 * 列表代理
 * luleyan
 */

const { ccclass, property } = cc._decorator;

import { ListView } from './ListView';
import { ListViewCell } from './ListViewCell';

@ccclass
export abstract class ListViewDelegate extends cc.Component {
    abstract numberOfRows(listView: ListView): number;
    heightForRow(listView: ListView, rowIdx: number): number {
        return 0;
    }

    abstract cellIdForRow(listView: ListView, rowIdx: number): string;
    abstract createCellForRow(listView: ListView, rowIdx: number, cellId: string): ListViewCell;
    abstract setCellForRow(listView: ListView, rowIdx: number, cell: ListViewCell): void;
}
