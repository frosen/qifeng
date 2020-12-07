/**
 * TableIdxCtrlr.ts
 * 桌号管理
 */

const { ccclass, property } = cc._decorator;

const SAVE_KEY = 'tableIdx';

@ccclass
export default class TableIdxCtrlr extends cc.Component {
    lbl: cc.Label = null;

    @property(cc.Node)
    panel: cc.Node = null;

    idx: number = 1;

    touching: boolean = false;

    onLoad() {
        this.lbl = this.getComponent(cc.Label);

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.touching = true;
        });

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.touching = false;
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.touching = false;
        });

        const savedIdx = cc.sys.localStorage.getItem(SAVE_KEY);

        if (!savedIdx) {
            this.popChangePanel();
        } else {
            this.idx = savedIdx;
            this.closePanel();
            this.lbl.string = String(this.idx);
        }
    }

    touchingTime: number = 0;

    update(dt: number) {
        if (this.touching) {
            this.touchingTime += dt;
            if (this.touchingTime > 2) {
                this.popChangePanel();
                this.touching = false;
            }
        } else this.touchingTime = 0;
    }

    popChangePanel() {
        this.panel.opacity = 255;
        this.panel.scaleX = 1;
        this.lbl.string = String(this.idx);
    }

    closePanel() {
        this.panel.opacity = 0;
        this.panel.scaleX = 0;
    }

    addIdx() {
        this.idx = Math.min(this.idx + 1, 99);
        this.lbl.string = String(this.idx);
        cc.sys.localStorage.setItem(SAVE_KEY, this.idx);
    }

    rdcIdx() {
        this.idx = Math.max(this.idx - 1, 1);
        this.lbl.string = String(this.idx);
        cc.sys.localStorage.setItem(SAVE_KEY, this.idx);
    }
}
