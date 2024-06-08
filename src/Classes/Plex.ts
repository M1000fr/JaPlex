import { PlexSearch } from "@/Interfaces/Plex/Search";
import axios, { AxiosInstance } from "axios";

export class PlexClient {
	public api!: AxiosInstance;

	constructor({
		apikey,
		baseURL,
		language,
	}: {
		apikey: string;
		baseURL: string;
		language?: string;
	}) {
		this.api = axios.create({
			maxBodyLength: Infinity,
			baseURL,
			headers: {
				Accept: "application/json",
				"X-Plex-Token": apikey,
				"X-Plex-Language": language || "en",
			},
		});
	}

	public async search({ query, limit }: { query: string; limit: number }) {
		const { data } = await this.api.get<PlexSearch>("/hubs/search", {
			params: {
				query,
				limit,
			},
		});

		return data;
	}
}
