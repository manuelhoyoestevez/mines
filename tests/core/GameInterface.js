import chai from 'chai';
import TableBoard from '../../src/core/TableBoard';
import GameInterface from '../../src/core/GameInterface';
import {
    READY,
    STARTED,
    MINE,
    TO_MARK,
    TO_PRESS,
    MARKED,
    UNPRESSED,
} from '../../src/core/constants.json';

const X = MINE, 
      U = UNPRESSED;

const assertGame = (gameInterface, values, title) => {
    values.forEach((expected, k) => {
        const [i, j] = gameInterface.tableBoard.toCoords(k);
        const actual = gameInterface.tableBoard.getCeld(i, j);

        if (expected !== actual) {
            throw new Error(`${title}: Invalid game celd [${i}, ${j}]: expected: ${expected} Actual: ${actual}`)
        }

        chai.assert.equal(expected, actual);
    });
}

const generateGame3x4 = () => {
    const tableBoard = new TableBoard(3, 4, () => 0);
    tableBoard.fillCelds(UNPRESSED);
    tableBoard.setCeld(1, 0, MINE);
    tableBoard.setCeld(2, 2, MINE);
    const gameInterface = new GameInterface(tableBoard, 2, STARTED);

    assertGame(gameInterface, [
        U, U, U, U,
        X, U, U, U,
        U, U, X, U
    ], 'generateGame3x4');

    return gameInterface;
};

const press = (gameInterface, i, j, values, expected) => {
    const actual = gameInterface.pressCeld(i, j);
    assertGame(gameInterface, values, `pressCeld(${i}, ${j})`);
    chai.assert.deepStrictEqual(actual, expected);
}

describe('GameInterface: ', () => {
    it('generateGame3x4' ,() => {
        const gameInterface = generateGame3x4();

        press(gameInterface, 0, 0, [
            1, U, U, U,
            X, U, U, U,
            U, U, X, U
        ], [
            [ 0, 0, 1 ]
        ]);

        press(gameInterface, 0, 3, [
            1, 1, 0, 0,
            X, 2, 1, 1,
            U, U, X, U
        ], [
            [ 0, 3, 0 ],
            [ 0, 2, 0 ],
            [ 0, 1, 1 ],
            [ 1, 1, 2 ],
            [ 1, 2, 1 ],
            [ 1, 3, 1 ]
        ]);

        press(gameInterface, 1, 0, [
            1, 1, 0, 0,
            X, 2, 1, 1,
            U, U, X, U
        ], [

        ]);
    });
});
