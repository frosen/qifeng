/**
 * PageCtrlr.ts
 * 页面管理
 */

const { ccclass, property } = cc._decorator;

const WeekNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

@ccclass
export default class TimeUpdater extends cc.Component {
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
