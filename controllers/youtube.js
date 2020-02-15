const request = require("request");
const keyManager = require("../controllers/key_manager");

const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3";

const CONVERTERS = {
    'channel': ((item) => {
        return {
            name: item.snippet.title,
            id: item.snippet.channelId,
            thumbnail: (item.snippet.thumbnails.medium || item.snippet.thumbnails.default).url
        };
    }),
    'playlist': ((item) => {
        return {
            name: item.snippet.title,
            id: item.id.playlistId,
            thumbnail: (item.snippet.thumbnails.medium || item.snippet.thumbnails.default).url,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle
        };
    }),
    'video': ((item) => {
        return {
            name: item.snippet.title,
            id: item.id.videoId,
            date: item.snippet.publishedAt,
            description: item.snippet.description,
            thumbnail: (item.snippet.thumbnails.medium || item.snippet.thumbnails.default).url,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle
        };
    })
}

module.exports.page = function(type, id, page, callback) {
    apiRequest('search', type, CONVERTERS[type], true, null, `&${type}Id=${id}&pageToken=${page}`, callback);
}

module.exports.search = function(type, searchTerm, callback) {
    apiRequest('search', type, CONVERTERS[type], false, searchTerm, '', callback);
} 

module.exports.searchChannelVideos = function (channelId, page, callback) {
    var params = `&videoDimension=2d&order=date&channelId=${channelId}`;
    if (page) {
        params += `&pageToken=${page}`;
    }
    apiRequest('search','video', CONVERTERS['video'], true, null, params, callback);
}

module.exports.searchPlaylistVideos = function (playlistId, page, callback) {
    var params = `&playlistId=${playlistId}`;
    if (page) {
        params += `&pageToken=${page}`;
    }
    apiRequest('playlistItems', 'video', CONVERTERS['video'], true, null, params, callback);
}

function apiRequest(section, type, converter, paged, searchTerm, extraParams, callback) {
    performRequest(section, type, converter, paged, searchTerm, extraParams, [], callback);
}

function performRequest(section, type, converter, paged, searchTerm, extraParams, previousErrors, callback) {
    const key = keyManager.getNextKey(100);
    if (key == null) {
        callback({
            quotaEmpty: true,
            message: "No remaining quota",
            previousErrors: previousErrors
        });
        return;
    }
    var url = `${YOUTUBE_URL}/${section}?part=snippet&type=${type}&key=${key}&maxResults=50&safeSearch=none${extraParams}`;
    if (searchTerm) {
        url += `&q=${encodeURI(searchTerm)}`;
    }
    request(url, (err, resp, body) => {
        if (err) {
            callback(err);
        } else {
            if (resp.statusCode == 200) {
                var resp = JSON.parse(body);
                var data = (resp.items || []).map((item) => {
                    return converter(item);
                });
                if (paged) {
                    data = {
                        videos: data,
                        nextPage: resp.nextPageToken
                    }
                }
                callback(null, data);
            } else if (resp.statusCode == 403 || resp.statusCode == 429) {
                keyManager.markAsExpired(key);
                const error = {
                    keyExpired: true,
                    message: "Key has expired",
                    key: key,
                    serverResp: `${resp.statusCode} ${resp.statusMessage}`
                };
                performRequest(section, type, converter, paged, searchTerm, extraParams, previousErrors.concat([error]), callback);
            } else {
                callback(err);
            }
        }
    });
}
