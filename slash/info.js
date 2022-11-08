const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  // Build quit command
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows info of current song"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs!");

    let bar = queue.createProgressBar({
      // Want to find for a single song, so queue: false
      queue: false,
      // Progress of song
      length: 19,
    });

    const song = queue.current;
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setThumbnail(song.thumbnail)
          .setDescription(
            `Current Song is [${song.title}](${song.url})\n\n` + bar
          ),
      ],
    });
  },
};
