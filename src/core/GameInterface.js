import TableBoard from './TableBoard';
import adyacentCelds from './adyacents';

// Game statuses
const WON = 'WON';
const LOST = 'LOST';
const READY = 'READY';
const STARTED = 'STARTED';

// Celd statuses
const MINE = 'MINE';
const PRESSED = 'PRESSED';
const UNPRESSED = 'UNPRESSED';

const pushAll = (arr, plus) => {
    plus.forEach(e => arr.push(e));
    return arr;
};

class GameInterface {
    constructor(tableBoard, mines) {
        this.tableBoard = tableBoard;
        this.status = READY;
        this.last = null;
        this.mines = mines;
        this.pressedCelds = 0;
        this.targetCelds = this.tableBoard.width * this.tableBoard.height - this.mines;
    }

    getCeld(i, j) {
        const celd = this.tableBoard.getCeld(i, j);
        switch(celd) {
            case MINE:
                return this.status === LOST ? MINE : UNPRESSED;
            case UNPRESSED:
                return UNPRESSED;
        }
        return celd;
    }

    pressCeld(i, j) {
        const celd = this.tableBoard.getCeld(i, j);

        if (this.status === READY) {
            this.tableBoard.setCeld(i, j, PRESSED);
            this.tableBoard.disseminate(this.mines, MINE, celd => celd === UNPRESSED);
            this.status = STARTED;
        }

        if (MINE === celd) {
            this.status = LOST;
            this.last = celd;
            return [];
        }

        if (UNPRESSED !== celd) {
            this.last = celd;
            return [];
        }

        this.pressedCelds++;

        if (this.pressedCelds === this.targetCelds) {
            this.status = WON;
        }

        const adyacents = adyacentCelds(i, j);

        const val = adyacents.reduce((acc, [_i, _j]) => acc + (MINE === this.tableBoard.getCeld(_i, _j) ? 1 : 0), 0);

        this.tableBoard.setCeld(i, j, val);

        this.last = val;

        const ret = [[i, j, val]];

        return val > 0 ? ret : adyacents.reduce((arr, [_i, _j]) => pushAll(arr, this.pressCeld(_i, _j)), ret);
    }
}

GameInterface.generateGame = (height, width, mines) => {
    if (height <= 0) {
        throw new Error(`Bad height: '${height}'`);
    }

    if (width <= 0) {
        throw new Error(`Bad width: '${width}'`);
    }

    const total = height * width;

    if (mines <= 0) {
        throw new Error(`Bad mines number. Mines: [1, ${total - 1}]`);
    }

    if (mines >= total) {
        throw new Error(`Too many mines. Mines: [1, ${total - 1}]`);
    }

    const tableBoard = new TableBoard(height, width);

    tableBoard.fillCelds(UNPRESSED);

    return new GameInterface(tableBoard, mines);
};

GameInterface.generateTestGame = () => {
    const tableBoard = new TableBoard(3, 4);

    tableBoard.fillCelds(UNPRESSED);
    tableBoard.setCeld(1, 1, MINE);

    return new GameInterface(tableBoard, 0);
};

export default GameInterface;
