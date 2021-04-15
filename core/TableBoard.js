const checkDimension = dim => {
    const ret = parseInt(dim);

    if (isNaN(ret) || ret <= 0 || ret != dim) {
        throw new Error(`Invalid dimension: ${dim}. Dimension must be integer greater than 0` );
    }

    return ret;
};

export default class TableBoard {
    constructor(height, width) {
        this.width = checkDimension(width);
        this.height = checkDimension(height);
        this.celds = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            this.celds[i] = new Array(this.width);
        }
    }

    get coords() {
        const ret = [];

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                ret.push([i, j, this.celds[i][j]]);
            }
        }

        return ret;
    }

    getCeld(i, j) {
        if (i < 0 || i >= this.height || j < 0 || j >= this.width) {
            return undefined;
        }

        return this.celds[i][j];
    }

    setCeld(i, j, v) {
        if (i < 0 || i >= this.height || j < 0 || j >= this.width) {
            return false;
        }

        this.celds[i][j] = v;

        return true;
    }
}
