/**
 * Business.ts
 * 业务
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreIndicator extends cc.Component {
    @property([cc.Node])
    scoreBtns: cc.Node[] = [];

    @property([cc.Node])
    totalScoreBtns: cc.Node[] = [];

    @property([cc.Label])
    scoreLbls: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLbls: cc.Label[] = [];

    scoreNums: number[] = [0, 0];
    totalScoreNums: number[] = [0, 0];

    onLoad() {
        this.setBtn(this.scoreBtns[0], this.scoreNums, 0);
        this.setBtn(this.scoreBtns[1], this.scoreNums, 1);
        this.setBtn(this.totalScoreBtns[0], this.totalScoreNums, 0);
        this.setBtn(this.totalScoreBtns[1], this.totalScoreNums, 1);
        this.resetUI();
    }

    setBtn(node: cc.Node, nums: number[], idx: number) {
        let done: boolean = false;
        node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            done = false;
        });
        node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            console.log('STORM done ', done, idx);
            if (done) return;
            const curY = event.getLocationY();
            const startY = event.getStartLocation().y;
            const dis = curY - startY;
            console.log('STORM ^_^ dis ', dis, idx);
            if (dis > 100) {
                done = true;
                nums[idx] = Math.min(nums[idx] + 1, 99);
                this.resetUI();
            } else if (dis < -100) {
                done = true;
                nums[idx] = Math.max(nums[idx] - 1, 0);
                this.resetUI();
            }
        });
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
