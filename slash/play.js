const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  // Build play command
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Load song from YouTube")
    // Search for song using keywords
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for song using keywords")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("Search keywords")
            .setRequired(true)
        )
    )
    // Search for song using YouTube URL
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Load song from YouTube URL")
        .addStringOption((option) =>
          option.setName("url").setDescription("Song's URL").setRequired(true)
        )
    )
    // Load YouTube playlist
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Load playlist from URL")
        .addStringOption.option((option) =>
          option
            .setName("url")
            .setDescription("Playlist's URL")
            .setRequired(true)
        )
    ),
  // Execute Code
  run: async ({ client, interaction }) => {
    // User must be in voice channel to call in bot
    if (!interaction.member.voice.channel)
      return interaction.editReply("Not in Voice Channel!");

    // Create queue from client
    const queue = await client.player.createQueue(interaction.guild);
    // If no queue connection, bot will connect to the user's channel
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new MessageEmbed();

    // Look at requested subcommand
    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");
      // Search on YouTube
      const result = await client.player.search(url, {
        requestedBy: interaction.player,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      // Song not found in array
      if (result.tracks.length === 0)
        return interaction.editReply("Song not found!");

      const song = result.tracks[0];
      // Add song to queue
      await queue.addTrack(song);
      // Specify what we added
      embed
        .setDescription(`**[${song.title}](${song.url})** is added to Queue!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      // Search on YouTube
      const result = await client.player.search(url, {
        requestedBy: interaction.player,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });
      // Playlist not found
      if (result.tracks.length === 0)
        return interaction.editReply("Playlist not found!");

      const playlist = result.playlist;
      // Add Playlist to queue
      await queue.addTracks(result.tracks);
      // Specify what we added
      embed
        .setDescription(
          `**[${result.tracks.length} songs from ${playlist.title}](${playlist.url})** are added to Queue!`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchterms");
      // Search
      const result = await client.player.search(url, {
        requestedBy: interaction.player,
        searchEngine: QueryType.AUTO,
      });
      // Song not found
      if (result.tracks.length === 0)
        return interaction.editReply("Song not found!");

      const song = result.tracks[0];
      // Add song to queue
      await queue.addTrack(song);
      // Specify what we added
      embed
        .setDescription(`**[${song.title}](${song.url})** is added to Queue!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }
    // Sent embed back to user
    if (!queue.playing) await queue.play();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
