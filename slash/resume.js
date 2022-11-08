const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  // Build resume command
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes music"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");
    queue.setPaused(false);
    await interaction.editReply("Resumed!");
  },
};
