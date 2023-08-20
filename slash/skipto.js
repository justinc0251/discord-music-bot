const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  // Build skip command
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to specified song")
    .addNumberOption((option) =>
      option
        .setName("tracknumber")
        .setDescription("Track to skip to")
        .setMinValue(1)
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");

    const trackNum = interaction.options.getNumber("tracknumber");
    if (trackNum > queue.tracks.length)
      return await interaction.editReply("Track number not found");

    // -1 to find correct spot in array
    queue.skipTo(trackNum - 1);
    await interaction.editReply(`Skipped to track number ${trackNum}`);
  },
};
