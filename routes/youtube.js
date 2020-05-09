const router = require("express").Router();
const youtube = require("../controllers/youtube");

function search(type, searchTerm, pageToken, callback) {
    youtube.search(type, searchTerm, pageToken, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

router.get("/search/:type", (req, res) => {
    const query = req.query.q;
    const type = req.params.type;
    const pageToken = req.query.page;
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
    search(type, query, pageToken, (err, data) => {
        if (err) {
            console.error(`Error search type: ${type}   query: ${query}   pageToken: ${pageToken}`);
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

function page(type, id, page, callback) {
    youtube.page(type, id, page, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

router.get("/channel/:id/videos", (req, res) => {
    const channelId = req.params.id;
    const pageToken = req.query.page;
    page('channel', channelId, pageToken, (err, data) => {
        if (err) {
            console.error(`Error getting page ${pageToken} for channel ${channelId}`);
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

router.get("/channel/:id", (req, res) => {
    const channelId = req.params.id;
    youtube.singleChannel(channelId, (err, data) => {
        if (err) {
            console.error(`Error getting channel ${channelId}`);
            console.error(err);
            res.sendStatus(500);
        } else {
            res.send(data);
        }
    });
});

router.get("/video/:id", (req, res) => {
    const videoId = req.params.id;
    youtube.singleVideo(videoId, (err, data) => {
        if (err) {
            console.error(`Error getting video ${videoId}`);
            console.error(err);
            res.sendStatus(500);
        } else {
            res.send(data);
        }
    });
});

router.get("/playlist/:id/videos", (req, res) => {
    const playlistId = req.params.id;
    const pageToken = req.query.page;
    page('playlist', playlistId, pageToken, (err, data) => {
        if (err) {
            console.error(`Error getting page ${pageToken} for playlist ${playlistId}`);
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
