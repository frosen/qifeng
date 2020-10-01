/**
 * PageCtrlr.ts
 * 页面管理
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PageCtrlr extends cc.Component {
    @property(cc.Node)
    page2: cc.Node = null;

    showPage2() {
        this.page2.opacity = 255;
        this.page2.scaleX = 1;
    }

    closePage2() {
        this.page2.opacity = 0;
        this.page2.scaleX = 0;
    }
}
