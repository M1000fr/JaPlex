import Command from "@/Classes/Command";

import { plexCommandOptions } from "./options";
import { addMovieHandler } from "./movie";

export const PlexCommand = new Command("plex", plexCommandOptions).setHandler({
	subGroup: "movie",
	sub: "add",
	permission: {
		or: ["CMDS_ALL"],
		and: ["CMDS_PLEX_ADD_MOVIE"],
	},
	handler: addMovieHandler,
});
