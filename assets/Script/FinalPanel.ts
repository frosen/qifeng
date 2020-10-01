/**
 * FinalPanel.ts
 *
 * luleyan
 */

import { ListView } from './ListView';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanilPanel extends cc.Component {
    @property(cc.Button)
    btn: cc.Button = null;

    @property(ListView)
    listView: ListView = null;

    @property(cc.Label)
    totalStr: cc.Label = null;

    onLoad() {}
}
