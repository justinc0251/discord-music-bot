const Discord = require("discord.js");
const dotenv = require("dotenv");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { Player } = require("discord-player");

dotenv.config();
const TOKEN = process.env.TOKEN;

// node index.js load
const LOAD_SLASH = process.argv[2] == "load";

const CLIENT_ID = "";
const GUILD_ID = "";

// Allows to see what guild our bot is in
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES"],
});

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

let commands = [];

// Loads slash commands, only looks at files that end with .js
const slashFiles = fs
  .readdirSync("./slash")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

// Deploy slash commands using Rest API
if (LOAD_SLASH) {
  const rest = new REST({ version: "9" }).setToken(TOKEN);
  console.log("Slash commands deploying");
  // Generates a URL using the Client ID and Guild ID in order to deploy commands
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    .then(() => {
      console.log("Deploy Success");
      // Exit with success
      process.exit(0);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        // Exit with failure
        process.exit(1);
      }
    });
} else {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });
  client.on("interactionCreate", (interaction) => {
    async function handleCommand() {
      // Returns if input is not a command
      if (!interaction.isCommand()) return;
      // Run slash command
      const slashcmd = client.slashcommands.get(interaction.commandName);
      if (!slashcmd) interaction.reply("Command not found");

      // Gives bot more time to respond to slash command
      await interaction.deferReply();
      // Run command with client and interaction objects
      await slashcmd.run({ client, interaction });
    }
    handleCommand();
  });
  client.login(TOKEN);
}
