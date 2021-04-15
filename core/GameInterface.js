import TableBoard from './TableBoard';
import adyacentCelds from './adyacents';

// Game statuses
const WON = 'WON';
const LOST = 'LOST';
const READY = 'READY';
const STARTED = 'STARTED';

// Celd statuses
const MINE = 'MINE';
const UNPRESSED = 'UNPRESSED';

class GameInterface {
    constructor(table, mines) {
        this.table = table;

        this.status = READY;
        this.pressedCelds = 0;
        this.targetCelds = this.table.width * this.table.height;

        for (let i = 0; i < this.table.height; i++) {
            for (let j = 0; j < this.table.width; j++) {
                this.table.setCeld(i, j, UNPRESSED);
            }
        }

        mines.forEach(([i, j]) => {
            if (this.table.getCeld(i, j) === UNPRESSED) {
                this.table.setCeld(i, j, MINE);
                this.targetCelds--;
            }
        });
    }

    getCeld(i, j) {
        const celd = this.table.getCeld(i, j);
        switch(celd) {
            case MINE:
            case UNPRESSED:
                return UNPRESSED;
        }
        return celd;
    }

    pressCeld(i, j) {
        const celd = this.table.getCeld(i, j);

        if (MINE === celd) {
            this.status = LOST;
            return 0;
        }

        if (UNPRESSED !== celd) {
            return 0;
        }

        this.status = STARTED;
        this.pressedCelds++;

        if (this.pressedCelds === this.targetCelds) {
            this.status = WON;
        }

        const adyacents = adyacentCelds(i, j);

        const val = adyacents.reduce((acc, [_i, _j]) => acc + MINE === this.table.getCeld(_i, _j) ? 1 : 0, 0);

        this.table.setCeld(i, j, val);

        if (val === 0) {
            return adyacents.reduce((acc, [_i, _j]) => acc + this.pressCeld(_i, _j), 1);
        }
        
        return 1;
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
        throw new Error(`Bad mines number. Mines: [1, ${total}]`);
    }

    if (mines >= total) {
        throw new Error(`Too many mines. Mines: [1, ${total}]`);
    }

    const table = new TableBoard(height, width);
    const minesNumbers = [];
    const minesGame = [];

    for(let k = 0; k < mines; k++) {
        let val = Math.floor(total * Math.random());

        do {
            val = (val + 1) % total;
        } while (minesNumbers.indexOf(val) >= 0);

        minesNumbers.push(val);
        minesGame.push([Math.floor(val / width), Math.floor(val % width)]);
    }

    return new GameInterface(table, minesGame);
};

export default GameInterface;