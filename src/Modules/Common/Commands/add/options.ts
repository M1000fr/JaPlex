import { SlashCommandBuilder } from "discord.js";

export const plexCommandOptions = new SlashCommandBuilder()
	.setName("plex")
	.setDescription("Plex related commands")
	.addSubcommandGroup((group) =>
		group
			.setName("movie")
			.setDescription("Movie related commands")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("add")
					.setDescription("Add a movie to Plex")
					.addStringOption((option) =>
						option
							.setName("title")
							.setDescription("Title of the movie")
							.setRequired(true)
							.setAutocomplete(true),
					)
					.addStringOption((option) =>
						option
							.setName("quality")
							.setDescription("Quality of the movie")
							.addChoices(
								{ name: "2160p", value: "2160p" },
								{ name: "1080p", value: "1080p" },
								{ name: "720p", value: "720p" },
							)
							.setRequired(false),
					),
			),
	)
	.addSubcommandGroup((group) =>
		group
			.setName("show")
			.setDescription("Show related commands")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("add")
					.setDescription("Add a show to Plex")
					.addIntegerOption((option) =>
						option
							.setName("show_id")
							.setDescription("Show ID from TMDB")
							.setAutocomplete(true)
							.setRequired(true),
					)
					.addIntegerOption((option) =>
						option
							.setName("season")
							.setDescription("Season number")
							.setAutocomplete(true)
							.setRequired(false),
					)
					.addIntegerOption((option) =>
						option
							.setName("episode")
							.setDescription("Episode number")
							.setAutocomplete(true)
							.setRequired(false),
					),
			),
	);
