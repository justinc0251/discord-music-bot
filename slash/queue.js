const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  // Build queue command
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display Queue")
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription("Page number of Queue")
        .setMinValue(1)
    ),
};
