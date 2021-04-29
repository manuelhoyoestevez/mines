import TableBoard from './TableBoard';
import GameInterface from './GameInterface';
import Celds from './Celds';

import {
    MINE,
    UNPRESSED,
    MARKED,
    TO_PRESS,
    TO_MARK
} from './constants.json';

class UserInterface {

    constructor(gameInterface, userTableBoard, processedTableBoard) {
        this.gameInterface = gameInterface;
        this.userTableBoard = userTableBoard;
        this.processedTableBoard = processedTableBoard;
        this.marked = 0;
        this.auto = false;
        this.reducerP = this.reducerP.bind(this);
        this.reducerM = this.reducerM.bind(this);
        this.reducerF = this.reducerF.bind(this);
        this.setToPress = this.setToPress.bind(this);
        this.setToMark = this.setToMark.bind(this);
    }

    get status() {
        return this.gameInterface.status;
    }

    get height() {
        return this.userTableBoard.height;
    }

    get width() {
        return this.userTableBoard.width;
    }

    get remain() {
        return this.gameInterface.mines - this.marked;
    }

    get celds() {
        return this.userTableBoard.celds;
    }

    markCeld(i, j) {
        const celd = this.userTableBoard.getCeld(i, j);

        if (celd === MARKED || celd === TO_MARK) {
            this.userTableBoard.setCeld(i, j, UNPRESSED);
            this.marked--;
            return true;
        }

        if (celd !== UNPRESSED) {
            return false;
        }

        this.userTableBoard.setCeld(i, j, MARKED);
        this.marked++;
        this.applyRules();
        return true;
    }

    pressCeld(i, j) {
        const celd = this.userTableBoard.getCeld(i, j);
        if (celd !== UNPRESSED && celd !== TO_PRESS) {
            return false;
        }

        this.gameInterface.pressCeld(i, j).forEach(([_i, _j, _v]) => this.userTableBoard.setCeld(_i, _j, _v));

        if (this.gameInterface.last === MINE) {
            this.marked++;
            this.userTableBoard.setCeld(i, j, MINE);
        }

        this.applyRules();
        return true;
    }

    applyRules() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.rule1([i, j]);
                this.rule2([i, j]);
            }
        }

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.rule1([i, j]);
                this.rule2([i, j]);
            }
        }
    }

    reducerP(arr, celd) {
        const val = this.v(celd);
        if (typeof val === 'number') {
            arr.push(celd);
        }

        return arr;
    }

    reducerM(arr, celd) {
        const val = this.v(celd);
        if (val === MARKED || val === TO_MARK || val === MINE) {
            arr.push(celd);
        }

        return arr;
    }

    reducerF(arr, celd) {
        const val = this.v(celd);
        if (typeof val !== 'undefined' && typeof val !== 'number' && val !== MARKED && val !== TO_MARK && val !== MINE) {
            arr.push(celd);
        }

        return arr;
    }

    isPlayable([i, j]) {
        if (this.processedTableBoard.getCeld(i, j)) {
            return false;
        }

        const value = this.gameInterface.getCeld(i, j);

        if (typeof value !== 'number' || value <= 0) {
            return false;
        }

        for(const adyacent of Celds.adyacents([i, j])) {
            if (this.v(adyacent) === UNPRESSED) {
                return true;
            }
        }

        this.processedTableBoard.setCeld(i, j, true);

        return false;
    }

    v([i, j]) {
        return this.userTableBoard.getCeld(i, j);
    }

    P(celd) {
        return Celds.adyacents(celd).reduce(this.reducerP, []);
    }

    p(celd) {
        return this.P(celd).length;
    }

    M(celd) {
        return Celds.adyacents(celd).reduce(this.reducerM, []);
    }

    m(celd) {
        return this.M(celd).length;
    }

    F(celd) {
        return Celds.adyacents(celd).reduce(this.reducerF, []);
    }

    f(celd) {
        return this.F(celd).length;
    }

    r(celd) {
        return this.v(celd) - this.m(celd);
    }

    setToPress([i, j]) {
        if (this.auto) {
            this.pressCeld(i, j);
        } else {
            this.userTableBoard.setCeld(i, j, TO_PRESS);
        }
    }

    setToMark([i, j]) {
        if (this.v([i ,j]) !== MINE) {
            this.marked++;
            this.userTableBoard.setCeld(i, j, TO_MARK);
        }
    }

    rule1(celd) {
        if (!this.isPlayable(celd)) {
            return;
        }

        const F = this.F(celd);
        const f = F.length;

        if (f <= 0) {
            return;
        }

        const v = this.v(celd);
        const m = this.m(celd);

        if (v === m + f) {
            const [i, j] = celd;
            this.processedTableBoard.setCeld(i, j, true);
            F.forEach(this.setToMark);
        } else if (v === m) {
            const [i, j] = celd;
            this.processedTableBoard.setCeld(i, j, true);
            F.forEach(this.setToPress);
        }
    }

    rule2(celd) {
        if (!this.isPlayable(celd)) {
            return;
        }

        Celds.confluents(celd).forEach(([i, j]) => {
            if (!this.isPlayable([i, j])) {
                return;
            }

            const FA = this.F(celd);
            const FB = this.F([i, j]);
            const fA = FA.length;
            const fB = FB.length;
            
            if (fA <= fB) {
                return;
            }
            
            if (!Celds.isContainedOrEqual(FB, FA)) {
                return;
            }

            const rA = this.r(celd);
            const rB = this.r([i, j]);

            if (rA === rB + fA - fB) {
                Celds.difference(FA, FB).forEach(this.setToMark);
            } else if (rA === rB) {
                Celds.difference(FA, FB).forEach(this.setToPress);
            }
        });
    }
}

UserInterface.generateFromGame = (gameInterface) => {
    const { height, width } = gameInterface;
    const userTableBoard = new TableBoard(height, width);
    userTableBoard.fillCelds(UNPRESSED);
    const processedTableBoard = new TableBoard(height, width);
    processedTableBoard.fillCelds(false);
    return new UserInterface(gameInterface, userTableBoard, processedTableBoard);
};

 export default UserInterface;
