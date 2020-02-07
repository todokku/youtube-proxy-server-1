const cacheData = {};

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;
const SHORT_LIFE = 6 * ONE_HOUR;
const LONG_LIFE = 7 * ONE_DAY;

function expired(key) {
    const expired = !(cacheData[key] && cacheData[key].maxAge <= new Date());
    if (expired) {
        cacheData[key] = null;
    }
    return expired;
}

module.exports.get = function(type, key) {
    if (expired(makeKey(type, key))) {
        return null;
    } else {
        return cacheData[makeKey(type, key)].data;
    }
}

module.exports.put = function(type, key, value, longLived) {
    const date = new Date();
    date.setTime(date.getTime() + longLived ? LONG_LIFE : SHORT_LIFE);
    cacheData[makeKey(type, key)] = {
        maxAge: date,
        data: value
    };
}

module.exports.contains = function(type, key) {
    return !expired(makeKey(type, key));
}

function makeKey(type, key) {
    return `${type}-${key}`;
}