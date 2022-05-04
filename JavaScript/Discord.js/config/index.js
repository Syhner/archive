const dotenv = require('dotenv');
const path = require('path');

// Use the .env file in the same directory as this file
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  ownerId: process.env.OWNER_ID,
  mongoUri: process.env.MONGO_URI,
};
