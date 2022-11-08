const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  // Build pause command
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses music"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");
    queue.setPaused(true);
    await interaction.editReply("Paused!");
  },
};
