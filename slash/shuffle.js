const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  // Build shuffle command
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles songs in queue"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");
    // Detroys queue, making bot leave voice
    queue.shuffle();
    await interaction.editReply(
      `The queue of ${queue.tracks.length} songs have been shuffled!`
    );
  },
};
