const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
  // Build pause command
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops Current Song!"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return await interaction.editReply("No song!");
    }

    const loopOpt = interaction.options.getString("Loop option");
    if (loopOpt === "on") {
      const OnSuccess = queue.setRepeatMode(QueueRepeatMode.TRACK);
      await interaction.editReply(OnSuccess ? "Looping song!" : "Looping failed");
    } else if (loopOpt === "off") {
     const OffSuccess = queue.setRepeatMode(QueueRepeatMode.OFF);
      await interaction.editReply(OffSuccess ? "Looping off!" : "Could not turn off");
    } else {
      await interaction.editReply("Invalid option!");
    }
  },
};
