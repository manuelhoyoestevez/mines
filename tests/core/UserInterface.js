import chai from 'chai';
import TableBoard from '../../src/core/TableBoard';
import GameInterface from '../../src/core/GameInterface';
import UserInterface from '../../src/core/UserInterface';
import {
    STARTED,

    MINE,
    TO_MARK,
    TO_PRESS,
    MARKED,
    UNPRESSED,
} from '../../src/core/constants.json';

const X = TO_MARK, 
      Y = TO_PRESS,
      M = MARKED,
      U = UNPRESSED;

const assertGame = (userInterface, values, title) => {
    values.forEach((expected, k) => {
        const [i, j] = userInterface.tableBoard.toCoords(k);
        const actual = userInterface.v([i, j]);

        if (expected !== actual) {
            throw new Error(`${title}: Invalid game celd [${i}, ${j}]: expected: ${expected} Actual: ${actual}`)
        }

        chai.assert.equal(expected, actual);
    });
}

const generateGame1 = () => {
    const tableBoard1 = new TableBoard(3, 3, () => 0);

    tableBoard1.fillCelds(UNPRESSED);
    tableBoard1.setCeld(1, 0, MINE);
    tableBoard1.setCeld(2, 2, MINE);

    const tableBoard2 = new TableBoard(3, 3, () => 0);
    tableBoard2.fillCelds(UNPRESSED);

    const gameInterface = new GameInterface(tableBoard1, 2, STARTED);
    const userInterface = new UserInterface(gameInterface, tableBoard2);

    assertGame(userInterface, [
        U, U, U,
        U, U, U,
        U, U, U
    ], 'generateGame1');

    return userInterface;
};

const press = (userInterface, i, j, values) => {
    userInterface.pressCeld(i, j);
    assertGame(userInterface, values, `pressCeld(${i}, ${j})`);
}

const mark = (userInterface, i, j, values) => {
    userInterface.markCeld(i, j);
    assertGame(userInterface, values, `markCeld(${i}, ${j})`);
}

describe('UserInterface: ', () => {
    it('Case 1' ,() => {
        const userInterface = generateGame1();

        press(userInterface, 0, 0, [
            1, U, U,
            U, U, U,
            U, U, U
        ]);

        press(userInterface, 0, 1, [
            1, 1, Y,
            U, U, Y,
            U, U, U
        ]);

        press(userInterface, 0, 2, [
            1, 1, 0,
            X, 2, 1,
            Y, U, U
        ]);

        press(userInterface, 2, 0, [
            1, 1, 0,
            X, 2, 1,
            1, Y, U
        ]);

        press(userInterface, 2, 1, [
            1, 1, 0,
            X, 2, 1,
            1, 2, X
        ]);
    });

    it('Case 2' ,() => {
        const userInterface = generateGame1();

        press(userInterface, 0, 0, [
            1, U, U,
            U, U, U,
            U, U, U
        ]);

        press(userInterface, 0, 1, [
            1, 1, Y,
            U, U, Y,
            U, U, U
        ]);

        press(userInterface, 0, 2, [
            1, 1, 0,
            X, 2, 1,
            Y, U, U
        ]);

        press(userInterface, 2, 1, [
            1, 1, 0,
            X, 2, 1,
            Y, 2, X
        ]);

        press(userInterface, 2, 0, [
            1, 1, 0,
            X, 2, 1,
            1, 2, X
        ]);
    });

    it('Case 3' ,() => {
        const userInterface = generateGame1();

        press(userInterface, 1, 1, [
            U, U, U,
            U, 2, U,
            U, U, U
        ]);

        press(userInterface, 2, 0, [
            U, U, U,
            U, 2, U,
            1, U, U
        ]);

        press(userInterface, 2, 1, [
            Y, Y, Y,
            X, 2, U,
            1, 2, U
        ]);

        press(userInterface, 0, 2, [
            Y, 1, 0,
            X, 2, 1,
            1, 2, X
        ]);
    });

    it('Case 4' ,() => {
        const userInterface = generateGame1();

        mark(userInterface, 1, 0, [
            U, U, U,
            M, U, U,
            U, U, U
        ]);

        press(userInterface, 1, 1, [
            U, U, U,
            M, 2, U,
            U, U, U
        ]);

        press(userInterface, 2, 1, [
            Y, Y, Y,
            M, 2, U,
            U, 2, U
        ]);
    });
});
