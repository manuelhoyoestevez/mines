import constants from './constants.json';

const swap = obj => {
    const ret = {};

    for(const k in obj) {
        ret[obj[key]] = key;
    }
    return ret;
};

export default {
    constants,
    letters: swap(constants)
}