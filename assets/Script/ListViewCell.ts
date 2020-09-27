/*
 * ListViewCell.ts
 * 列表元素
 * luleyan
 */

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export class ListViewCell extends cc.Component {
    curCellIdx: number = -1;

    onLoad() {
        if (CC_EDITOR) {
            this.check();
            return;
        }

        this.node.on('click', this.onClick, this);
    }

    check() {
        // @ts-ignore
        cc.assert(this.node._prefab.root === this.node, 'cell脚本需要放在prefab的根节点');

        // @ts-ignore
        this.node.name = this.node._prefab.asset.name;
        // @ts-ignore
        const clsName = cc.js.getClassName(this.__proto__.constructor);
        // @ts-ignore
        cc.assert(this.node.name === clsName, 'cell的prefab要和class名称一致');

        this.node.anchorX = 0;
        this.node.anchorY = 1;
        this.node.width = 1080;
        if (this.node.height === 0) this.node.height = 200;
        this.node.x = 0;
        this.node.y = 0;

        this.checkBake();
    }

    checkBake() {
        let root = this.node.getChildByName('root');
        if (!root) {
            root = new cc.Node('root');
            root.parent = this.node;
            const widegt = root.addComponent(cc.Widget);
            widegt.isAlignTop = true;
            widegt.isAlignBottom = true;
            widegt.isAlignLeft = true;
            widegt.isAlignRight = true;
            widegt.top = 0;
            widegt.bottom = 0;
            widegt.left = 0;
            widegt.right = 0;
        }

        let bake = this.node.getChildByName('bake');
        if (!bake) {
            bake = new cc.Node('bake');
            bake.parent = this.node;
            const widegt = bake.addComponent(cc.Widget);
            widegt.isAlignTop = true;
            widegt.isAlignBottom = true;
            widegt.isAlignLeft = true;
            widegt.isAlignRight = true;
            widegt.top = 0;
            widegt.bottom = 0;
            widegt.left = 0;
            widegt.right = 0;
        }

        for (const child of this.node.children) {
            if (child !== root && child !== bake) {
                cc.error('cell根节点下只能有root和bake');
            }
        }
    }

    onClick() {}
}
