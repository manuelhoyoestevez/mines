import TableBoard from './TableBoard';
import GameInterface from './GameInterface';
import adyacentCelds from './adyacents';

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
        if (this.tableBoard.getCeld(i, j) === MARKED) {
            this.tableBoard.setCeld(i, j, UNPRESSED);
            this.marked--;
            this.applyRules();
            return true;
        }

        if (this.tableBoard.getCeld(i, j) !== UNPRESSED) {
            return false;
        }

        this.tableBoard.setCeld(i, j, MARKED);
        this.marked++;
        this.applyRules();
        return true;
    }

    pressCeld(i, j) {
        this.gameInterface.pressCeld(i, j).forEach(([_i, _j, _v]) => this.tableBoard.setCeld(_i, _j, _v));
        this.applyRules();
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

    // Descubierta y no agotada
    isPlayable([i, j]) {
        if (typeof this.gameInterface.getCeld(i, j) !== 'number') {
            return false;
        }

        for(const celd of adyacentCelds(i, j)) {
            if (this.v(celd) === UNPRESSED) {
                return true;
            }
        }

        return false;
    }

    v([i, j]) {
        return this.tableBoard.getCeld(i, j);
    }

    P([i, j]) {
        return adyacentCelds(i, j).reduce((arr, celd) => {
            if (typeof this.v(celd) === 'number') {
                arr.push(celd);
            }

            return arr;
        }, []);
    }

    p(celd) {
        return this.P(celd).length;
    }

    M([i, j]) {
        return adyacentCelds(i, j).reduce((arr, celd) => {
            const v = this.v(celd);
            if (v === MARKED || v === TO_MARK) {
                arr.push(celd);
            }

            return arr;
        }, []);
    }

    m(celd) {
        return this.M(celd).length;
    }

    F([i, j]) {
        return adyacentCelds(i, j).reduce((arr, celd) => {
            const val = this.v(celd);

            if (typeof val !== 'undefined' && typeof val !== 'number' && val !== MARKED && val !== TO_MARK) {
                arr.push(celd);
            }

            return arr;
        }, []);
    }

    f(celd) {
        return this.F(celd).length;
    }

    r(celd) {
        return this.v(celd) - this.m(celd);
    }

    setToPress([i, j]) {
        this.tableBoard.setCeld(i, j, TO_PRESS);
    }

    setToMark([i, j]) {
        this.marked++;
        this.tableBoard.setCeld(i, j, TO_MARK);
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
