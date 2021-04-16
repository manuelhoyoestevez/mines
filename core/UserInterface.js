import TableBoard from './TableBoard';
import GameInterface from './GameInterface';
//import adyacentCelds from './adyacents';

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

//const isUnpressed = celd => celd === UNPRESSED || celd === TO_PRESS || celd === TO_MARK;

class UserInterface {

    constructor(gameInterface, tableBoard) {
        this.gameInterface = gameInterface;
        this.tableBoard = tableBoard;
        this.marked = 0;
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
        const celds = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            celds[i] = new Array(this.width);

            for (let j = 0; j < this.width; j++) {
                celds[i][j] = this.getCeld(i, j);
            }
        }

        return celds;
    }

    getCeld(i, j) {
        const celd = this.gameInterface.getCeld(i, j);

        if (celd !== UNPRESSED) {
            return celd;
        }

        return this.tableBoard.getCeld(i, j);
    }

    markCeld(i, j) {
        if (this.tableBoard.getCeld(i, j) === MARKED) {
            this.tableBoard.setCeld(i, j, UNPRESSED);
            this.marked--;
            return true;
        }

        if (this.gameInterface.getCeld(i, j) !== UNPRESSED) {
            return false;
        }

        this.tableBoard.setCeld(i, j, MARKED);
        this.marked++;
        return true;
    }

    pressCeld(i, j) {
        return this.gameInterface.pressCeld(i, j);
    }

    /////////////////////////////////////////////////////////

    // Descubierta y no agotada
    isPlayable(i, j) {
        if (this.tableBoard.getCeld(i, j) === MARKED) {
            return false;
        }

        if (this.gameInterface.getCeld(i, j) === UNPRESSED) {
            return false;
        }

        for(const [_i, _j] of adyacentCelds(i, j)) {
            if (isUnpressed(this.celd(_i, _j))) {
                return true;
            }
        }

        return false;
    }

    findPlayable() {

    }

    // Entero
    getValue(i, j) {
        return this.gameInterface.getCeld(i, j);
    }


    // Conjunto
    getAdyacents(i, j) {

    }

    // Conjunto
    getMarked(i, j) {

    }

    // Conjunto
    getFree(i, j) {

    }

    // Entero
    getRemaining(i, j) {
        return this.getValue(i, j) - this.getMarked(i, j).length;
    }
}

UserInterface.generateGame = (height, width, mines) => {
    const tableBoard = new TableBoard(height, width);
    tableBoard.fillCelds(UNPRESSED);
    const gameInterface = GameInterface.generateGame(height, width, mines);
    return new UserInterface(gameInterface, tableBoard);
};

 export default UserInterface;
