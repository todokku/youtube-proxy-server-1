var keyQuotas = [];

function resetQuotas() {
    keyQuotas.forEach((keyQuota) => keyQuota.quota = 10000);
    setTimeout(resetQuotas, msUntilMidnight());
}

function msUntilMidnight() {
    var now = new Date();
    return now.getTime() - now.setHours(0,0,0,0);
}

module.exports.setKeys = function(keys) {
    keyQuotas = [];
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
    for(var i = 0; i < keyQuotas.length; i++) {
        if (keyQuotas[i].quota >= cost) {
            keyQuotas[i].quota -= cost;
            return keyQuotas[i].key;
        } 
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