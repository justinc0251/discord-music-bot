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

  run: async ({ client, interaction }) => {
    // Get queue object
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return await interaction.editReply("No songs!");
    }

    // 10 Songs per page or 1 page at max if less than 10 songs in queue
    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    // Specify page
    // -1 to find first item in array
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages)
      return await interaction.editReply(`There are only ${totalPages} pages!`);
  },
};
