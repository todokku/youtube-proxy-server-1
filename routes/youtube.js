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
                cache.put(type, searchTerm, data, true);
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
            console.error(`Error search type: ${type}   query: ${query}   reload: ${reload}`);
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

function page(type, id, page, forceReload, callback) {
    const key = id+page
    if (!forceReload && cache.contains(type, key)) {
        callback(null, cache.get(type, key));
    } else {
        youtube.page(type, id, page, (err, data) => {
            if (err) {
                callback(err);
            } else {
                cache.put(type, key, data, true);
                callback(null, data);
            }
        });
    }
}

router.get("/channel/:id/videos/:page", (req, res) => {
    const channelId = req.params.id;
    const pageNum = req.params.page;
    const reload = req.query.reload != undefined;
    page('channel', channelId, pageNum, reload, (err, data) => {
        if (err) {
            console.error(`Error getting page ${pageNum} for channel ${channelId}`);
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

router.get("/playlist/:id/videos/:page", (req, res) => {
    const playlistId = req.params.id;
    const pageNum = req.params.page;
    const reload = req.query.reload != undefined;
    page('playlist', playlistId, pageNum, reload, (err, data) => {
        if (err) {
            console.error(`Error getting page ${pageNum} for playlist ${playlistId}`);
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
