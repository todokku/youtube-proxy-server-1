# Youtube Proxy Server

Node.js express server created to proxy requests to YouTube using rotating keys. It is designed for personal use only and will not scale past a few users.

## Environment Variables

| Name | Type | Comment | Default |
| --- | --- | --- | --- |
| HOSTNAME | String | Address of server, used by dokku to forward connection | `localhost` |
| PORT | String | Port of server, used by dokku to forward connection | `3001` |
| YOUTUBE_KEYS | String | Comma separated list of YouTube API keys, these are rotated on each use | N/A |
| API_KEY | String | The API key needed to use this server | N/A |

## Endpoints

### GET /status

Get the quota status

#### Response

| Field | Type | Comment |
| --- | --- | --- |
| remaining | Integer | Total remaining quota from all keys* |
| human | String | A human readable description of remaining quotas |

*If the total is 101 this doesn't mean a request is actually possible as this could from 2 or more keys none with enough to make a request individually.

#### Example 

```json
{
    "remainingQuota": 304,
    "human": "key1: 104\nkey2: 200"
}
```

### /search/:type

| Param | Type | Comment |
| --- | --- | --- |
| type | String | Must be 'channel', 'playlist' or 'video' |

| Query | Type | Comment |
| --- | --- | --- |
| q | String | Search term |
| page | String | Page token |

#### Response

| Field | Type | Comment |
| --- | --- | --- |
| list | Array<Video | Channel | Playlist> | List of search results |
| nextPage | String | Page token for next page |

##### Channel

| Field | Type | Comment |
| --- | --- | --- |
| id | String | YouTube ID of channel |
| name | String | Channel Title |
| thumbnail | String | URL of YouTube channel thumbnail (high or med quality) |

##### Video

| Field | Type | Comment |
| --- | --- | --- |
| id | String | YouTube ID of video |
| channelId | String | Channel ID |
| channelTitle | String | Channel Title |
| title | String | Video name |
| thumbnail | String | URL of YouTube thumbnail (high or med quality) |
| description | String | Video description |
| date | String | Video publish date |

##### Playlist

| Field | Type | Comment |
| --- | --- | --- |
| id | String | YouTube ID of playlist |
| name | String | Playlist name |
| channelId | String | Channel ID |
| channelTitle | String | Channel Title |
| thumbnail | String | URL of YouTube thumbnail (high or med quality) |

#### Example 

```json
{
    "list": [
        {
            "title": "Example Video",
            "id": "grjytegdg",
            "thumbnail": "https://youtube.com/media/5hjhrtjhe",
            "channelId": "j75erhethr",
            "channelTitle": "Example Channel"
        }
    ],
    "nextPage": "d7fgfg3g"
}
```

## License


   Copyright 2020 Ray Britton

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
