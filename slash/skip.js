const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  // Build skip command
  data: new SlashCommandBuilder().setName("skip").setDescription("Skips song"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");
    // Skips current song
    const currentSong = queue.current;
    queue.skip();
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${currentSong.title} skipped!`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
