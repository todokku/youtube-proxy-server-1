const router = require("express").Router();
const cache = require("../controllers/cache");
const youtube = require("../controllers/youtube");

function search(type, searchTerm, forceReload, callback) {
    if (!forceReload && cache.contains(type, searchTerm)) {
        callback(null, cache.get(type, searchTerm));
    } else {
        youtube.search(type, searchTerm, (err, data) => {
            if (err) {
                callback(err);
            } else {
                cache.put(searchTerm, data, true);
                callback(null, data);
            }
        });
    }
}

router.get("/search/:type", (req, res) => {
    const query = req.query.q;
    const type = req.params.type;
    const reload = req.query.reload != undefined;
    if (query == undefined || query == "") {
        res.status(400).send({
            error: true,
            message: "No query specified"
        });
        return;
    }
    if (type != 'channel' && type != 'playlist' && type != 'video') {
        res.status(400).send({
            error: true,
            message: "Invalid type"
        });
        return;
    }
    search(type, query, reload, (err, data) => {
        if (err) {
            console.error("Error search");
            console.error(err);
            if (err.quotaEmpty) {
                res.sendStatus(429);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.send(data);
        }
    });
});

module.exports = router;
