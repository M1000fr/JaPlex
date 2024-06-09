import Event from "@/Classes/Event";
import { tmdb } from "@/Services/tmdb.service";
import Dotenv from "@/Utils/Dotenv";

export const ShowAutocomplete = new Event<"interactionCreate">(
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
	const focus = interaction.options.getFocused();
	if (!focus) return;

	// Search for movies from TMDB
	const shows = await tmdb.search.tvShows({
		query: focus,
		language: Dotenv.PLEX_LANGUAGE,
		include_adult: true,
	});
	if (!shows) return;

	// Limit to 25 movies
	const options = shows.results
		.map((movie) => ({
			name:
				movie.name.length > 95
					? movie.name.slice(0, 95) + "..."
					: movie.name,
			value: movie.id,
		}))
		.slice(0, 25);

	// Respond with the options
	interaction.respond(options);

	return true;
});
