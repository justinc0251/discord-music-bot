const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

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
    if (!queue) return await interaction.editReply("No songs!");

    // 10 Songs per page or 1 page at max if less than 10 songs in queue
    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    // Specify page
    // -1 to find first item in array
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages)
      return await interaction.editReply(`There are only ${totalPages} pages!`);

    // Display queue
    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        // Backslash backticks to display in codeblock format
        return `${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title}`;
      })
      // Joins array of songs
      .join("\n");

    const currentSong = queue.current;
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**Currently Playing**\n` +
              (currentSong
                ? `\`[${currentSong.duration}]\` ${currentSong.title}`
                : "None") +
              `\n**Queue**\n${queueString}`
          )
          .setFooter({
            // Page previously set to correct spot in array
            // So +1 to display actual page number
            text: `Page ${page + 1} out of ${totalPages}`,
          })
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
