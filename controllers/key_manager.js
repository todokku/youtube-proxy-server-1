var keyQuotas = [];
var keyIdx = 0;

function nextKeyIdx() {
    keyIdx++;
    if (keyIdx >= keyQuotas.length) {
        keyIdx = 0;
    }
}

function resetQuotas() {
    keyQuotas.forEach((keyQuota) => keyQuota.quota = 10000);
    setTimeout(resetQuotas, msUntilMidnight());
}

function msUntilMidnight() {
    var now = new Date();
    return now.getTime() - now.setHours(0,0,0,0);
}

module.exports.setKeys = function(keys) {
    for (const key of keys) {
        keyQuotas.push({
            key: key,
            quota: 10000
        });
    }
    resetQuotas();
}

module.exports.getTotalRemainingQuota = function() {
    return keyQuotas.map((keyQuota) => keyQuota.quota).reduce((acc, value) => acc + value);
}

module.exports.getNextKey = function(cost) {
    nextKeyIdx();
    const startingIdx = keyIdx;

    while (startingIdx != keyIdx) {
        if (keyQuotas[keyIdx].quota >= cost) {
            keyQuotas[keyIdx].quota -= cost;
            return keyQuotas[keyIdx].key;
        } 
        nextKeyIdx();
    }
    return null;
}

module.exports.getQuotaStatus = function() {
    return keyQuotas.map((keyQuota, idx) => `${idx}: ${keyQuota.quota}`).join('\n');
}

module.exports.markAsExpired = function(key) {
    console.error("KEY EXPIRED: " + key);
    const idx = keyQuotas.findIndex((keyQuota) => keyQuota.key == key);
    keyQuotas[idx].quota = 0;
}