/**
 * TimeUpdater.ts
 * 桌号管理
 */

const { ccclass, property } = cc._decorator;

const WeekNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

@ccclass
export default class TimeUpdater extends cc.Component {
    lbl: cc.Label = null;

    onLoad() {
        this.lbl = this.getComponent(cc.Label);
    }

    update(dt: number) {
        this.setTime();
    }

    setTime() {
        this.lbl.string = this.getCurTimeStr();
    }

    getCurTimeStr(): string {
        const d = new Date();
        const ymd = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
        const week = `${WeekNames[d.getDay()]}`;
        const hm = `${d.getHours()}:${d.getMinutes()}`;
        return `${ymd}  ${week}  ${hm}`;
    }
}
