class Celds {
    adyacents([i, j]) {
        return [
            [i - 1, j - 1],
            [i    , j - 1],
            [i + 1, j - 1],
            [i - 1, j    ],
            [i + 1, j    ],
            [i - 1, j + 1],
            [i    , j + 1],
            [i + 1, j + 1],
        ];
    }

    confluents([i, j]) {
        return [
            [i - 2, j - 2],
            [i - 2, j - 1],
            [i - 2, j    ],
            [i - 2, j + 1],
            [i - 2, j + 2],
            [i - 1, j - 2],
            [i - 1, j + 2],
            [i    , j - 2],
            [i    , j + 2],
            [i + 1, j - 2],
            [i + 1, j + 2],
            [i + 2, j - 2],
            [i + 2, j - 1],
            [i + 2, j    ],
            [i + 2, j + 1],
            [i + 2, j + 2],
        ].concat(this.adyacents([i, j]));
    }

    isIn([iB, jB], setA) {
        return setA.find(([iA, jA]) => iA === iB && jA === jB) !== undefined;
    }

    isContainedOrEqual(setB, setA) {
        for(const celdB of setB) {
            if (!this.isIn(celdB, setA)) {
                return false;
            }
        }

        return true;
    }

    difference(setA, setB) {
        return setA.filter(celdA => !this.isIn(celdA, setB));
    }
}

export default new Celds();
