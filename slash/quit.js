const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  // Build quit command
  data: new SlashCommandBuilder()
    .setName("quit")
    .setDescription("Quit bot and clear queue"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");
    // Detroys queue, making bot leave voice
    queue.destroy();
  },
};
