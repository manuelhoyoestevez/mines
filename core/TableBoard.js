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

    fillCelds(v) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.celds[i][j] = v;
            }
        }
    }

    toInteger(i, j) {
        return i * this.width + j;
    }

    toCoords(val) {
        return [Math.floor(val / this.width), Math.floor(val % this.width)];
    }

    disseminate(num, item, condition) {
        if (isNaN(num)) {
            throw new Error(`Not a Number: ${num}.` );
        }

        let assertCondition = 0;

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (condition(this.celds[i][j])) {
                    assertCondition++;
                }
            }
        }

        num = parseInt(num);

        if (num > assertCondition) {
            throw new Error(`Invalid number of items to disseminate: ${num}. Maximum number is ${assertCondition}` );
        }

        if (num === assertCondition) {
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (condition(this.celds[i][j])) {
                        this.celds[i][j] = item;
                    }
                }
            }
            return;
        }

        const total = this.height * this.width;
        const selectedCelds = [];

        for (let k = 0; k < num; k++) {
            let i, j, val = Math.floor(total * Math.random());

            do {
                val = (val + 1) % total;
                [i, j] = this.toCoords(val);

            } while (selectedCelds.indexOf(val) >= 0 || !condition(this.celds[i][j]));

            selectedCelds.push(val);
        }

        for (const val of selectedCelds) {
            const [i, j] = this.toCoords(val);
            this.celds[i][j] = item;
        }
    }
}
