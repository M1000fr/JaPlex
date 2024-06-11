import Event from "@/Classes/Event";
import { tmdb } from "@/Services/tmdb.service";

export const ShowSeasonEpisodeAutocomplete = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (_client, interaction) => {
	if (
		!interaction?.isAutocomplete() ||
		interaction.commandName !== "plex" ||
		interaction.options.getSubcommandGroup() !== "show" ||
		interaction.options.getSubcommand() !== "add"
	)
		return;

	// Get the focused option
	const focus = interaction.options.getFocused(true);
	if (!focus || focus.name != "episode") return;

	const showID = interaction.options.getInteger("show_id", true),
		seasonNumber = interaction.options.getInteger("season", false);

	if (!seasonNumber) return false;

	// Search for movies from TMDB
	const episodes = await tmdb.tvShows
		.season(showID, seasonNumber)
		.then((season) => season?.episodes);

	if (!episodes) return;

	// Limit to 25 episodes
	const options = episodes.map((season) => ({
		name: `${season.episode_number}. ${season.name}`,
		value: season.episode_number.toString(),
	}));

	interaction.respond(options);

	return true;
});
