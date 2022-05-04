# CS50 Bot

## Video Demo: https://www.youtube.com/watch?v=KrBaFJhWysw

## Description:

This project is a bot which uses the [Discord.js](https://discord.js.org/) library to interact with the [Discord API](https://discord.com/developers/docs) to respond to text based commands, and also events emitted by activity on Discord. Guilds/servers are places in Discord where multiple users can join.

The project is written in Node.js (a JavaScript runtime). The bot is initiated by running the start script (using npm start in the terminal), which runs the index.js file. There is also a development script (using npm run dev) in the package.json file which is useful for development as it restarts the application whenever a change is detected in the project directory.

This project uses linting with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with their respective config files in the root directory, however these files have been renamed away from dotfiles as the CS50 codespace does not allow creation of dotfiles.

All config variables are located in the /config directory, in order to centralize any variables which may be required somewhere in the code. In this directory would be a .env file (which would be included in the .gitignore file), so that private information does not get leaked, such as the bot's API token, or the username and password used to connect to the cloud-based database. Then this information can be used in an exported, structured object in /config/index.js to be used elsewhere in the project, by utilizing the 'dotenv' npm package.

/models contains exported mongoose (an ODM for MongoDB) models that are used in other files to validate and structure input before it is saved to the database.

/commands contains Discord slash commands, grouped by directory in order to organize files, /events contains event listeners which will run certain files of code, grouped by the event which is being listened to.

/util contains a file for connecting to the database, as well as other utility files.

## /index.js

After connecting to the NoSQL database (MongoDB), a client instance is created with specified intents (groups of events which the bot will listen to, specified to avoid excess bandwidth usage). Then the commands and events are loaded, before logging in to Discord with a private token.

### /util/load-files

This is a helper file for loading files based on a glob pattern, and is utilized by the load-commands and load-events files in the same directory.

### /util/load-commands

After retrieving the files in the commands directory, an API call is made to register the slash commands. Slash commands can be registered globally to the client (takes a long time, makes the command accessible wherever the bot is accessible), or to a specific guild (very fast, makes the command accessible in a single guild - good for testing).

Because of this, the file checks if it's in a production environment (indicated when the NODE_ENV environment variable is set to production), and only registers the slash commands globally if this is the case. Otherwise the commands are registered to the single guild, which is the testing guild in this case.

### /util/load-events

Registers event listeners based on files in the /events directory

### /commands

Files in this directory are utilized when using slash commands, as can be seen in the [project video](https://www.youtube.com/watch?v=KrBaFJhWysw). An approach was taken to apply functional programming principles where possible, and to set `ephemeral: true` (makes the bot response only visible to the person using the command) to replies which do not directly concern other members. Input is validated using the @discordjs/builders package, and further validation is sometimes performed in the execute method of certain commands (the code which runs when the command is executed).

### /events/guildMemberAdd/welcome.js

(the interactionCreate event is emitted whenever user joins the guild)

Greets new members by making a call to the database and using the message previously supplied by the guild owner when using the /welcome command - if this exists.

### /events/interactionCreate/command-handler.js

(the interactionCreate event is emitted whenever a message is sent in a guild channel)

Applies additional restrictions to commands (e.g. checking if the user using the command is the guild owner, or checking is the command has been used in a guild, if these requirements are specified in the command), before executing the appropriate command. Includes an error handler to reply to the user in case of any error.

### /events/interactionCreate/log-interaction.js

Logs interactions that were emitted - for debugging purposes.

### /events/ready/log-ready.js

(the ready event is emitted once the client has connected to Discord)

Logs once the bot is connected to Discord after logging in - for debugging purposes.

### /events/ready/set-permissions.js

Certain commands have a default permission of `false` - meaning no one can use them. This file uses the Discord API to apply permissions to certain commands (including these default permission `false` commands), in order to allow certain users access to these otherwise unusable commands. Currently, this is only used to let the bot owner use the /setpresence command.

This code is only executed after the client emits the 'ready' event, since the client object is needed in order to set these permissions by using command ids, which are only available after the client has successfully connected to Discord.
