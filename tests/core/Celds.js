import chai from 'chai';
import celds from '../../src/core/Celds';

const adyacents = [[4,7], [5,7], [6,7], [4,8], [6,8], [4,9], [5,9], [6,9]];
const confluents = [[3,6], [3,7], [3,8], [3,9], [3,10], [4,6], [4,10], [5,6], [5,10], [6,6], [6,10], [7,6], [7,7], [7,8], [7,9], [7,10], [4,7], [5,7], [6,7], [4,8], [6,8], [4,9], [5,9], [6,9]];

describe('Celds: ', () => {
    it('adyacents',  () => chai.assert.deepStrictEqual(celds.adyacents([5,8]), adyacents));
    it('confluents', () => chai.assert.deepStrictEqual(celds.confluents([5,8]), confluents));
    it('isIn',       () => chai.assert.equal(celds.isIn([5, 10], confluents), true));
    it('isNotIn',    () => chai.assert.equal(celds.isIn([15, 10], confluents), false));

    it('isContainedOrEqual', () => chai.assert.equal(
        celds.isContainedOrEqual(
            [[1, 3], [3, 3]],
            [[1, 3], [2, 3], [3, 3]]
        ), true)
    );

    it('isContainedOrEqual', () => chai.assert.equal(
        celds.isContainedOrEqual(
            [[1, 3], [2, 3], [3, 3]],
            [[1, 3], [3, 3]]
        ), false)
    );

    it('adyacentsAreContainedOrEqualThanAdyacents', () => chai.assert.equal(
        celds.isContainedOrEqual(adyacents, adyacents), true)
    );

    it('adyacentsAreContainedOrEqualThanConfluents', () => chai.assert.equal(
        celds.isContainedOrEqual(adyacents, confluents), true)
    );

    it('difference', () => chai.assert.deepStrictEqual(
        celds.difference(
            [[1, 3], [2, 3], [3, 3]],
            [[1, 3], [3, 3]],
        ), [[2, 3]])
    );

    it('differenceBetweenConfluentsAndAdyacents', () => chai.assert.deepStrictEqual(
        celds.difference(confluents, adyacents), [[3,6], [3,7], [3,8], [3,9], [3,10], [4,6], [4,10], [5,6], [5,10], [6,6], [6,10], [7,6], [7,7], [7,8], [7,9], [7,10]])
    );

    it('differenceBetweenAdyacentsAndConfluents', () => chai.assert.deepStrictEqual(
        celds.difference(adyacents, confluents), [])
    );
});
