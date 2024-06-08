import { PlexClient } from "@/Classes/Plex";
import Dotenv from "@/Utils/Dotenv";

export const plex = new PlexClient({
	apikey: Dotenv.PLEX_API_KEY,
	baseURL: Dotenv.PLEX_API_URL,
	language: Dotenv.PLEX_LANGUAGE,
});
