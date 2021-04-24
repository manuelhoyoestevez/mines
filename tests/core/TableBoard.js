import chai from 'chai';
import TableBoard from '../../src/core/TableBoard';

const DEFAULT_VALUE = 'DEFAULT_VALUE';
const OTHER_VALUE = 'OTHER_VALUE';

describe('TableBoard: ', () => {
    it('Invalid width 1' ,() => {
        chai.assert.throws(
            () => new TableBoard(1, -3),
            'Invalid dimension: -3. Dimension must be integer greater than 0'
        );
    });

    it('Invalid heigth 1' ,() => {
        chai.assert.throws(
            () => new TableBoard(-1, 3),
            'Invalid dimension: -1. Dimension must be integer greater than 0'
        );
    });

    it('Invalid width 2' ,() => {
        chai.assert.throws(
            () => new TableBoard(1, 'three'),
            'Invalid dimension: three. Dimension must be integer greater than 0'
        );
    });

    it('Invalid heigth 2' ,() => {
        chai.assert.throws(
            () => new TableBoard('one', 3),
            'Invalid dimension: one. Dimension must be integer greater than 0'
        );
    });

    it('Happy path' ,() => {
        const tableBoard = new TableBoard('4', 5);

        chai.assert.equal(tableBoard.getCeld(2, 3), undefined);
        chai.assert.equal(tableBoard.getCeld(-2, 3), undefined);
        chai.assert.equal(tableBoard.getCeld(2, 30), undefined);

        tableBoard.fillCelds(DEFAULT_VALUE);

        chai.assert.equal(tableBoard.count(DEFAULT_VALUE), 20);
        chai.assert.equal(tableBoard.getCeld(2, 3), DEFAULT_VALUE);
        chai.assert.equal(tableBoard.getCeld(-2, 3), undefined);
        chai.assert.equal(tableBoard.getCeld(2, 30), undefined);

        tableBoard.setCeld(1, 3, OTHER_VALUE);

        chai.assert.equal(tableBoard.count(DEFAULT_VALUE), 19);
        chai.assert.equal(tableBoard.count(OTHER_VALUE), 1);
        chai.assert.equal(tableBoard.getCeld(1, 3), OTHER_VALUE);
        chai.assert.equal(tableBoard.getCeld(2, 3), DEFAULT_VALUE);
        chai.assert.equal(tableBoard.getCeld(2, 30), undefined);

        tableBoard.setCeld(1, 30, OTHER_VALUE);

        chai.assert.equal(tableBoard.count(DEFAULT_VALUE), 19);
        chai.assert.equal(tableBoard.count(OTHER_VALUE), 1);
        chai.assert.equal(tableBoard.getCeld(1, 3), OTHER_VALUE);
        chai.assert.equal(tableBoard.getCeld(2, 3), DEFAULT_VALUE);
        chai.assert.equal(tableBoard.getCeld(1, 30), undefined);
    });


    it('CoordsAndIntegers' ,() => {
        const tableBoard = new TableBoard(3, 4);

        chai.assert.equal(tableBoard.toInteger(1, 3), 7);
        chai.assert.deepStrictEqual(tableBoard.toCoords(7), [1, 3]);

        chai.assert.equal(tableBoard.toInteger(14, 37), 93);
        chai.assert.equal(tableBoard.toInteger(23, 1), 93);
        chai.assert.deepStrictEqual(tableBoard.toCoords(93), [23, 1]);
    });
});