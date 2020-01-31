# Youtube Cache Server

Node.js express server created to cache requests to YouTube. It is designed for personal use only and will not scale past a few users.

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

*If the total is 101 this doesn't mean a request is actually possible as this could from 4 keys none with enough to make a request individually.

#### Example 

```json
{
    "remainingQuota": 304,
    "human": "key1: 104\nkey2: 200"
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
