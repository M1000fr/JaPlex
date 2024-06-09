import { plex } from "@/Services/plex.service";
import { tmdb } from "@/Services/tmdb.service";
import Dotenv from "@/Utils/Dotenv";
import { AppendToResponse, TvShowDetails } from "tmdb-ts";

/**
 * @example seasons list
 {
	index: number;
	name: string;
	availableToDownload: JackettResult;
    episodes: {
		index: number;
		name: string;
        onPlex: boolean;
		availableToDownload: JackettResult;
    }[];
  }[];
 */

export class Show {
	public static async fetchShowStatus({
		showDataTMDB,
	}: {
		showDataTMDB: AppendToResponse<TvShowDetails, undefined, "tvShow">;
	}) {}
}
const name = "How To Sell Drugs Online";

plex.search({ query: name, limit: 1, type: "show" }).then(
	async (plexSearch) => {
		const showDataTMDB = await tmdb.search
			.tvShows({
				query: name,
				language: Dotenv.PLEX_LANGUAGE,
			})
			.then(
				async (s) =>
					await tmdb.tvShows.details(
						s.results[0].id,
						undefined,
						Dotenv.PLEX_LANGUAGE,
					),
			);

		const showStatus = await Show.fetchShowStatus({
			showDataTMDB,
		});
	},
);
