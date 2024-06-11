import { CommandHandler } from "@/Classes/CommandHandler";
import { JackettResult } from "@/Interfaces/Jackett/Result";
import { JackettService } from "@/Services/jackett.service";
import { tmdb } from "@/Services/tmdb.service";
import Dotenv from "@/Utils/Dotenv";
import { Episode, SeasonDetails } from "tmdb-ts";

interface EpisodesInterface {
	index: number;
	torrents: JackettResult[];
}

interface SeasonsInterface {
	index: number;
	torrents?: JackettResult[];
	episodes?: EpisodesInterface[];
}

export const addShowHandler = new CommandHandler(async (interaction) => {
	await interaction.deferReply();

	const ShowID = interaction.options.getInteger("show_id", true),
		Season = interaction.options.getInteger("season", false),
		Episode = interaction.options.getInteger("episode", false);

	// get the show data
	const showData = await tmdb.tvShows.details(
		ShowID,
		undefined,
		Dotenv.PLEX_LANGUAGE,
	);

	// if show is not found, reply with an error message
	if (!showData) {
		await interaction.reply({
			content: "Show not found!",
			ephemeral: true,
		});
		return false;
	}

	let seasonData!: SeasonDetails, episodeData!: Episode;

	// if season is specified, get the season data
	if (Season) {
		seasonData = await tmdb.tvShows.season(ShowID, Season);

		if (!seasonData) {
			await interaction.reply({
				content: "Season not found!",
				ephemeral: true,
			});
			return false;
		}
	}

	// if episode is specified, get the episode data
	if (Episode) {
		const e = seasonData?.episodes.find(
			(episode) => episode.episode_number === Episode,
		);

		if (!e) {
			await interaction.reply({
				content: "Episode not found!",
				ephemeral: true,
			});
			return false;
		} else episodeData = e;
	}

	// get show torrent availables
	const torrents = await JackettService.search({
		query: showData.name,
		order: {
			seeders: "desc",
		},
		category: [5000, 5050, 5060, 5070, 5080],
	});

	const availableSeasonsCount = showData.seasons.length - 1;
	let torrentsSeasonParsed: SeasonsInterface[] = [];

	// The torrents must be sorted into torrentsSeasonParsed
	// If no season and no episode is specified, we create a regex that retrieves all torrents of all seasons, e.g., S01, S02, ..., but without the episodes: S01E01, S01E02, ...
	// Then, we add the torrents of each season into torrentsSeasonParsed
	// If a season is specified, we create a regex that retrieves all torrents of the specified season, e.g., S01., but without the episodes: S01E01, S01E02, ...
	// Then, we add the torrents of the specified season into torrentsSeasonParsed
	// If a season and an episode are specified, we create a regex that retrieves all torrents of the specified episode, e.g., S01E01
	// Then, we add the torrents of the specified episode into torrentsSeasonParsed
	for (let i = 0; i <= availableSeasonsCount; i++) {
		let regexIntergalSeason = new RegExp(
			`S${i.toString().padStart(2, "0")}(?!E\\d{2})`,
			"i",
		);

		const torrentsIntegralSeasons = torrents.Results.filter((torrent) =>
			regexIntergalSeason.test(torrent.Title),
		);

		let regexEpisodesSeason = new RegExp(
			`S${i.toString().padStart(2, "0")}E\\d{2}`,
			"i",
		);

		const torrentsEpisodesSeason = torrents.Results.filter((torrent) =>
			regexEpisodesSeason.test(torrent.Title),
		);

		torrentsSeasonParsed.push({
			index: i,
			torrents: torrentsIntegralSeasons,
			episodes: torrentsEpisodesSeason.reduce((acc, torrent) => {
				const episodeNumber = parseInt(
					torrent.Title.match(/E(\d{2})/)?.[1] || "",
				);

				if (episodeNumber) {
					const episodeIndex = acc.findIndex(
						(e) => e.index === episodeNumber,
					);

					if (episodeIndex === -1) {
						acc.push({
							index: episodeNumber,
							torrents: [torrent],
						});
					} else {
						acc[episodeIndex].torrents.push(torrent);
					}
				}

				return acc;
			}, [] as EpisodesInterface[]),
		});
	}

	const seasonRequestTorrents = torrentsSeasonParsed.find(
			(season) => season.index === Season,
		)?.torrents,
		episodeRequestTorrents = torrentsSeasonParsed
			.find((season) => season.index === Season)
			?.episodes?.find((episode) => episode.index === Episode)?.torrents;

	return {
		content: `Show: ${showData.name}\nIntegral Show Torrents:\n${torrents.Results.slice(
			0,
			3,
		)
			.map((torrent) => `\`${torrent.Title}\``)
			.join("\n")}\n${
			Season
				? `\nSeason Torrents:\n${seasonRequestTorrents
						?.slice(0, 3)
						.map((torrent) => `\`${torrent.Title}\``)
						.join("\n")}`
				: ""
		}\n${
			Season && Episode
				? `\nEpisode Torrents:\n${episodeRequestTorrents
						?.slice(0, 3)
						.map((torrent) => `\`${torrent.Title}\``)
						.join("\n")}`
				: ""
		}`,
	};
});
