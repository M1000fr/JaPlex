import { JackettClient } from "@/Classes/Jackett";
import Dotenv from "@/Utils/Dotenv";

export const JackettService = new JackettClient({
	apikey: Dotenv.JACKETT_API_KEY,
	baseURL: Dotenv.JACKETT_API_URL,
});
