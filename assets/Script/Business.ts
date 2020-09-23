import MainLogic from './MainLogic';

/**
 * Business.ts
 * 业务
 */
const { ccclass, property } = cc._decorator;

const sn = '921576976';
const key = 'bq8b48v6';
const nickname = 'QiFengPool';

@ccclass
export default class Business extends cc.Component {
    @property(MainLogic)
    mainLogic: MainLogic = null;

    addPrinter() {
        this.mainLogic.addPrinter(sn, key, nickname);
    }

    print() {
        this.mainLogic.print(sn);
    }
}
