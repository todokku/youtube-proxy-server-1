const router = require("express").Router();
const keyManager = require("../controllers/key_manager");

router.get("/status", (req, res) => {
    res.send({
        remainingQuota: keyManager.getTotalRemainingQuota(),
        human: keyManager.getQuotaStatus()
    });
});

module.exports = router;
