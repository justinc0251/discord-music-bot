const { SlashCommandBuilder } = require("@discordjs/builders");

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
};
