require('dotenv').config();

const express = require('express');
const app = express();

global.SERVER_HOST = process.env.HOSTNAME || 'localhost';
global.SERVER_PORT = process.env.PORT || '3001';
global.API_KEY = process.env.API_KEY;
const keys = process.env.YOUTUBE_KEYS.split(",");

require('./controllers/key_manager').setKeys(keys);

global.STATUS = "Server starting";
global.API_KEY_CHECKER = (req, res, next) => {
    if (req.header("x-api-key") == API_KEY) next();
};

app.get("/alive", API_KEY_CHECKER, (req, res) => {
    res.sendStatus(200);
});

app.use("/api/v1", require("./routes/api"));

app.use("/youtube/v1", require("./routes/youtube"));

app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    const status = err.status || 500;
    if (status == 500) {
        console.error("Unhandled error during request");
        console.error(err);
    }
    res.status(status).send({ 'error': err });
});

app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Youtube cache server started at ${new Date().toISOString()} listening on ${SERVER_HOST}:${SERVER_PORT}`);
});