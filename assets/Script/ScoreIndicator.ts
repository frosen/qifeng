/**
 * Business.ts
 * 业务
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreIndicator extends cc.Component {
    @property([cc.Label])
    scoreLbls: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLbls: cc.Label[] = [];

    scoreNums: number[] = [0, 0];
    totalScoreNums: number[] = [0, 0];

    onLoad() {
        this.scoreLbls[0].node.on(cc.Node.EventType.TOUCH_END, this.add0.bind(this));
        this.scoreLbls[1].node.on(cc.Node.EventType.TOUCH_END, this.add1.bind(this));
        this.totalScoreLbls[0].node.on(cc.Node.EventType.TOUCH_END, this.addTotal0.bind(this));
        this.totalScoreLbls[1].node.on(cc.Node.EventType.TOUCH_END, this.addTotal1.bind(this));
    }

    add0(idx: number) {
        this.scoreNums[0]++;
        this.resetUI();
    }

    rdc0(idx: number) {
        this.scoreNums[0]--;
        this.resetUI();
    }

    addTotal0(idx: number) {
        this.totalScoreNums[0]++;
        this.resetUI();
    }

    rdcTotal0(idx: number) {
        this.totalScoreNums[0]--;
        this.resetUI();
    }

    add1(idx: number) {
        this.scoreNums[1]++;
        this.resetUI();
    }

    rdc1(idx: number) {
        this.scoreNums[1]--;
        this.resetUI();
    }

    addTotal1(idx: number) {
        this.totalScoreNums[1]++;
        this.resetUI();
    }

    rdcTotal1(idx: number) {
        this.totalScoreNums[1]--;
        this.resetUI();
    }

    clear(idx: number) {
        this.scoreNums = [0, 0];
        this.totalScoreNums = [0, 0];
        this.resetUI();
    }

    private resetUI() {
        this.scoreLbls[0].string = String(this.scoreNums[0]);
        this.scoreLbls[1].string = String(this.scoreNums[1]);
        this.totalScoreLbls[0].string = String(this.totalScoreNums[0]);
        this.totalScoreLbls[1].string = String(this.totalScoreNums[1]);
    }
}
