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
    scoreLblUps: cc.Label[] = [];

    @property([cc.Label])
    scoreLblDowns: cc.Label[] = [];

    @property([cc.Label])
    scoreLblUp2s: cc.Label[] = [];

    @property([cc.Label])
    scoreLblDown2s: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLbls: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLblUps: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLblDowns: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLblUp2s: cc.Label[] = [];

    @property([cc.Label])
    totalScoreLblDown2s: cc.Label[] = [];

    scoreNums: number[] = [0, 0];
    totalScoreNums: number[] = [0, 0];

    onLoad() {
        this.setBtn(
            this.scoreBtns[0],
            this.scoreNums,
            0,
            this.scoreLblUps[0],
            this.scoreLblDowns[0],
            this.scoreLblUp2s[0],
            this.scoreLblDown2s[0]
        );
        this.setBtn(
            this.scoreBtns[1],
            this.scoreNums,
            1,
            this.scoreLblUps[1],
            this.scoreLblDowns[1],
            this.scoreLblUp2s[1],
            this.scoreLblDown2s[1]
        );
        this.setBtn(
            this.totalScoreBtns[0],
            this.totalScoreNums,
            0,
            this.totalScoreLblUps[0],
            this.totalScoreLblDowns[0],
            this.totalScoreLblUp2s[0],
            this.totalScoreLblDown2s[0]
        );
        this.setBtn(
            this.totalScoreBtns[1],
            this.totalScoreNums,
            1,
            this.totalScoreLblUps[1],
            this.totalScoreLblDowns[1],
            this.totalScoreLblUp2s[1],
            this.totalScoreLblDown2s[1]
        );

        this.scoreLblUps.forEach(v => (v.node.parent.opacity = 0));
        this.scoreLblDowns.forEach(v => (v.node.parent.opacity = 0));
        this.totalScoreLblUps.forEach(v => (v.node.parent.opacity = 0));
        this.totalScoreLblDowns.forEach(v => (v.node.parent.opacity = 0));
        this.scoreLblUp2s.forEach(v => (v.node.parent.opacity = 0));
        this.scoreLblDown2s.forEach(v => (v.node.parent.opacity = 0));
        this.totalScoreLblUp2s.forEach(v => (v.node.parent.opacity = 0));
        this.totalScoreLblDown2s.forEach(v => (v.node.parent.opacity = 0));

        this.resetUI();
    }

    setBtn(node: cc.Node, nums: number[], idx: number, up1: cc.Label, down1: cc.Label, up2: cc.Label, down2: cc.Label) {
        let done: boolean = false;
        node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            done = false;
        });
        node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (done) return;
            if (this.running) return;
            const curY = event.getLocationY();
            const startY = event.getStartLocation().y;
            const dis = curY - startY;
            if (dis > 100) {
                done = true;
                const old = nums[idx];
                nums[idx] = Math.min(nums[idx] + 1, 99);
                this.resetUI(1, old, nums[idx], up1, down1, up2, down2);
            } else if (dis < -100) {
                done = true;
                const old = nums[idx];
                nums[idx] = Math.max(nums[idx] - 1, 0);
                this.resetUI(-1, old, nums[idx], up1, down1, up2, down2);
            }
        });
    }

    clear(idx: number) {
        if (this.running) return;
        this.scoreNums[0] = 0;
        this.scoreNums[1] = 0;
        this.totalScoreNums[0] = 0;
        this.totalScoreNums[1] = 0;
        this.resetUI(0);
    }

    running: boolean = false;

    private resetUI(
        dir: number = 0,
        oldN: number = 0,
        newN: number = 0,
        up1: cc.Label = null,
        down1: cc.Label = null,
        up2: cc.Label = null,
        down2: cc.Label = null
    ) {
        if (oldN !== newN) {
            const time = 0.1;
            if (dir > 0) {
                up1.node.parent.opacity = 255;
                up1.node.parent.scaleY = 1;
                up1.string = String(oldN);

                up2.node.parent.opacity = 255;
                up2.node.parent.scaleY = 0;
                up2.string = String(newN);

                down1.node.parent.opacity = 255;
                down1.node.parent.scaleY = 1;
                down1.string = String(newN);

                down2.node.parent.opacity = 255;
                down2.node.parent.scaleY = 1;
                down2.string = String(oldN);

                this.running = true;

                cc.tween(down2.node.parent).to(time, { scaleY: 0 }).start();
                cc.tween(up2.node.parent)
                    .delay(time)
                    .to(time, { scaleY: 1 })
                    .call(() => {
                        up1.node.parent.opacity = 0;
                        up2.node.parent.opacity = 0;
                        down1.node.parent.opacity = 0;
                        down2.node.parent.opacity = 0;
                        this.running = false;
                    })
                    .start();
            } else if (dir < 0) {
                up1.node.parent.opacity = 255;
                up1.node.parent.scaleY = 1;
                up1.string = String(newN);

                up2.node.parent.opacity = 255;
                up2.node.parent.scaleY = 1;
                up2.string = String(oldN);

                down1.node.parent.opacity = 255;
                down1.node.parent.scaleY = 1;
                down1.string = String(oldN);

                down2.node.parent.opacity = 255;
                down2.node.parent.scaleY = 0;
                down2.string = String(newN);

                this.running = true;

                cc.tween(up2.node.parent).to(time, { scaleY: 0 }).start();
                cc.tween(down2.node.parent)
                    .delay(time)
                    .to(time, { scaleY: 1 })
                    .call(() => {
                        up1.node.parent.opacity = 0;
                        up2.node.parent.opacity = 0;
                        down1.node.parent.opacity = 0;
                        down2.node.parent.opacity = 0;
                        this.running = false;
                    })
                    .start();
            }
        }

        this.scoreLbls[0].string = String(this.scoreNums[0]);
        this.scoreLbls[1].string = String(this.scoreNums[1]);
        this.totalScoreLbls[0].string = String(this.totalScoreNums[0]);
        this.totalScoreLbls[1].string = String(this.totalScoreNums[1]);
    }
}
