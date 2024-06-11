import Event from "@/Classes/Event";
import { tmdb } from "@/Services/tmdb.service";
import Dotenv from "@/Utils/Dotenv";

export const ShowSeasonAutocomplete = new Event<"interactionCreate">(
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
	if (!focus || focus.name != "season") return;

	const showID = interaction.options.getInteger("show_id", true);

	// Search for movies from TMDB
	const seasons = await tmdb.tvShows
		.details(showID, undefined, Dotenv.PLEX_LANGUAGE)
		.then((show) => show?.seasons);

	if (!seasons) return;

	// Limit to 25 seasons
	const options = seasons.map((season) => ({
		name: `${season.season_number}. ${season.name}`,
		value: season.season_number,
	}));

	interaction.respond(options);

	return true;
});
