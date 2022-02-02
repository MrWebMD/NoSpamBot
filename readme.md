# NoSpam Discord Bot

![No Spam discord bot logo](https://i.imgur.com/dRI2bdJ_d.webp)

NoSpam is a discord bot for taking action against spam on discord community servers. It is capable of detecting duplicate messages, spam links mentioning @here. It is extensible and welcome to modifications and additions.

## Installation

Navigate to the root folder of the project and use the node package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install all node dependencies.

```bash
npm install
```

## Environment
This bot requires that a file named `.env` exists in the root directory of the project. Create a file named `.env` located at `/NoSpamBot/.env`. Next, replace the contents of the file with the template below.

```
TOKEN=REPLACE-WITH-YOUR-DISCORD-BOT-TOKEN
```
Once you've saved this, your environment is all set up!

## Usage
```
node index.js
```

## Settings

##### client.status 

The bots discord activity status when online

##### cache.maxAge

Time in milliseconds that messages stay cached. The longer that time is the more messages the bot will consider for spam within a time period.

##### cache.whitelistedChannels
Array of channel Ids that the bot will completely ignore. This is helpful for private channels, Announcement channels, staff channels, member only channels, and bot channels. 

##### cache.whitelistedRoles
Array of role Ids that the bot will ignore. An example of something to use there is staff and admin roles. The bot will have to do less work.

##### cache.whitelistedUsers
Array of user Ids that the bot will ignore. These users are generally good, upstanding citizens who can be trusted to not spam.


## Module Settings
### duplicates 🤖

This module tags "DUPLICATE" to any message that appears more than once (as specified in settings.hjson). 

##### MODULE_TAG: "DUPLICATE"
Used internally to categorized messages by the type of spam. Messages that run through this module carry the "DUPLICATE" tag by default.

##### maxDuplicatesPerUser

Limit of similar messages a user can send per `cache.maxAge` time before all of those messages get marked as spam.
##### maxDuplicatesFromAnywhere

No matter who sends the message, if there are this many messages within the `cache.maxAge` time period containing the same content, they will all be flagged as spam.

- - - -

### mentionsEveryoneWithLinks🤖

This module tags "EVERYONEWITHLINKS" to any message that mentions everyone and also contains a link. Announcement channels and staff memebers should be whitelisted for best results. Often times, new self bot users will join with no roles and immediate @ everyone with a link.

##### MODULE_TAG: "EVERYONEWITHLINKS"

Used internally to categorized messages by the type of spam. Messages that run through this module carry the "EVERYONEWITHLINKS" tag by default.

- - - -

### linkSpray 🤖

Any messages that have the tag from the duplicates module that also contains a link will be considered as a link spray attack and immediately quarantined. 

##### MODULE_TAG: "LINKSPRAY"

Used internally to categorized messages by the type of spam. Messages that run through this module carry the "LINKSPRAY" tag by default.

## License
[MIT](https://choosealicense.com/licenses/mit/)