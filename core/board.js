const MINE = 'MINE';
const UNPRESSED = 'UNPRESSED';

const checkDimension = dim => {
    const ret = parseInt(dim);

    if (isNaN(ret) || ret <= 0 || ret != dim) {
        throw new Error(`Invalid dimension: ${dim}. Dimension must be integer greater than 0` );
    }

    return ret;
};

class Board {
    constructor(width, height, mines) {
        this.width = checkDimension(width);
        this.height = checkDimension(height);

        this.status = 'blank'; // started, won, lost
        this.celds = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            this.celds[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.celds[i][j] = UNPRESSED;
            }
        }

        mines.forEach(({i, j}) => {
            this.celds[i][j] = MINE;
        });
    }

    celd(i, j) {
        if (i < 0 || i >= this.width || j < 0 || j >= this.height) {
            return undefined;
        }
        return this.celd[i][j];
    }

    press(i, j) {
        const celd = this.celd(i, j);

        if (celd !== UNPRESSED) {
            return celd;
        }

        let ret = 0;

        if (this.celd(i - 1, j - 1) === MINE) {
            ret++;
        }

        if (this.celd(i, j - 1) === MINE) {
            ret++;
        }

        if (this.celd(i + 1, j - 1) === MINE) {
            ret++;
        }

        if (this.celd(i - 1, j) === MINE) {
            ret++;
        }

        if (this.celd(i + 1, j) === MINE) {
            ret++;
        }

        if (this.celd(i - 1, j + 1) === MINE) {
            ret++;
        }

        if (this.celd(i, j + 1) === MINE) {
            ret++;
        }

        if (this.celd(i + 1, j + 1) === MINE) {
            ret++;
        }

        this.celds[i][j] = ret;

        return ret;
    }
}

export default Board;