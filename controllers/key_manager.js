var keyQuotas = [];

function resetQuotas() {
    keyQuotas.forEach((keyQuota) => keyQuota.quota = 10000);
    setTimeout(resetQuotas, msUntilKeyRegen());
}

function msUntilKeyRegen() {
    const RESET_HOUR = 8;
    const now = new Date();

    var resetTime = new Date();
    resetTime.setHours(RESET_HOUR, 0, 0, 0);
    if (now.getHours() >= RESET_HOUR) {
        resetTime.setHours(resetTime.getHours() + 24);
    }

    return resetTime.getTime() - now.getTime();
}

module.exports.msUntilKeyRegen = msUntilKeyRegen;

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