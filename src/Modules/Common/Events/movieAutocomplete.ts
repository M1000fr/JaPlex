import Event from "@/Classes/Event";
import { tmdb } from "@/Services/tmdb.service";
import Dotenv from "@/Utils/Dotenv";

export const MovieAutocomplete = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (_client, interaction) => {
	if (
		!interaction?.isAutocomplete() ||
		interaction.commandName !== "plex" ||
		interaction.options.getSubcommand() !== "add" ||
		interaction.options.getSubcommandGroup() !== "movie"
	)
		return;

	// Get the focused option
	const focus = interaction.options.getFocused();
	if (!focus) return;

	// Search for movies from TMDB
	const movies = await tmdb.search.movies({
		query: focus,
		language: Dotenv.PLEX_LANGUAGE,
		include_adult: true,
	});
	if (!movies) return;

	// Limit to 25 movies
	const options = movies.results
		.map((movie) => ({
			name: movie.title,
			value: movie.title,
		}))
		.slice(0, 25);

	// Respond with the options
	interaction.respond(options);

	return true;
});
