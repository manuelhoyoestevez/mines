import TableBoard from './TableBoard';
import GameInterface from './GameInterface';
import Celds from './Celds';

// Game statuses
const WON = 'WON';
const LOST = 'LOST';
const READY = 'READY';
const STARTED = 'STARTED';

// Celd statuses
const MINE = 'MINE';
const UNPRESSED = 'UNPRESSED';

// Extended celd statuses
const MARKED = 'MARKED';
const TO_PRESS = 'TO_PRESS';
const TO_MARK = 'TO_MARK';

class UserInterface {

    constructor(gameInterface, tableBoard) {
        this.gameInterface = gameInterface;
        this.tableBoard = tableBoard;
        this.marked = 0;
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
        return this.tableBoard.height;
    }

    get width() {
        return this.tableBoard.width;
    }

    get remain() {
        return this.gameInterface.mines - this.marked;
    }

    get celds() {
        return this.tableBoard.celds;
    }

    markCeld(i, j) {
        const celd = this.tableBoard.getCeld(i, j);

        if (celd === MARKED || celd === TO_MARK) {
            this.tableBoard.setCeld(i, j, UNPRESSED);
            this.marked--;
            return true;
        }

        if (celd !== UNPRESSED) {
            return false;
        }

        this.tableBoard.setCeld(i, j, MARKED);
        this.marked++;
        this.applyRules();
        return true;
    }

    pressCeld(i, j) {
        const celd = this.tableBoard.getCeld(i, j);
        if (celd !== UNPRESSED && celd !== TO_PRESS) {
            return false;
        }

        this.gameInterface.pressCeld(i, j).forEach(([_i, _j, _v]) => this.tableBoard.setCeld(_i, _j, _v));

        if (this.gameInterface.last === MINE) {
            this.marked++;
            this.tableBoard.setCeld(i, j, MINE);
        }

        this.applyRules();
        return true;
    }

    applyRules() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.rule2([i, j]);
                this.rule1([i, j]);
            }
        }

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.rule2([i, j]);
                this.rule1([i, j]);
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
        if (typeof this.gameInterface.getCeld(i, j) !== 'number') {
            return false;
        }

        for(const celd of Celds.adyacents([i, j])) {
            if (this.v(celd) === UNPRESSED) {
                return true;
            }
        }

        return false;
    }

    v([i, j]) {
        return this.tableBoard.getCeld(i, j);
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
        //this.tableBoard.setCeld(i, j, TO_PRESS);
        this.pressCeld(i, j);
    }

    setToMark([i, j]) {
        if (this.v([i ,j]) !== MINE) {
            this.marked++;
            this.tableBoard.setCeld(i, j, TO_MARK);
        }
    }

    rule1(celd) {
        if (this.isPlayable(celd)) {
            if (this.v(celd) === this.m(celd)) {
                this.F(celd).forEach(this.setToPress);
            }
        }
    }

    rule2(celd) {
        if (this.isPlayable(celd)) {
            const F = this.F(celd);
            const f = F.length;
            if (f > 0 && this.v(celd) === this.m(celd) + f) {
                F.forEach(this.setToMark);
            }
        }
    }

    rule3(celd) {
        if (this.isPlayable(celd)) {
            Celds.confluents(celd).forEach(([i, j]) => {
                if (!this.isPlayable([i, j])) {
                    return;
                }

                const FA = this.F(celd);
                const FB = this.F([i, j]);
                
                if (FA.length <= FB.length) {
                    return;
                }
                
                if (!Celds.isContainedOrEqual(FB, FA)) {
                    return;
                }

                const rA = this.r(celd);
                const rB = this.r([i, j]);

                if (rA !== rB) {
                    return;
                }

                Celds.difference(rA, rB).forEach(this.setToPress);
            });
        }
    }
}

UserInterface.generateTestGame = () => {
    const tableBoard = new TableBoard(3, 4);
    tableBoard.fillCelds(UNPRESSED);
    const gameInterface = GameInterface.generateTestGame();
    return new UserInterface(gameInterface, tableBoard);
}

UserInterface.generateGame = (height, width, mines) => {
    const tableBoard = new TableBoard(height, width);
    tableBoard.fillCelds(UNPRESSED);
    const gameInterface = GameInterface.generateGame(height, width, mines);
    return new UserInterface(gameInterface, tableBoard);
};

 export default UserInterface;
