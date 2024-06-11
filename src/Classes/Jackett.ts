import { JackettResponse } from "@/Interfaces/Jackett/Response";
import axios, { AxiosInstance } from "axios";

export class JackettClient {
	public api!: AxiosInstance;

	constructor({ apikey, baseURL }: { apikey: string; baseURL: string }) {
		this.api = axios.create({
			maxBodyLength: Infinity,
			baseURL,
			params: { apikey },
		});
	}

	public async search({
		query,
		queryStrict = false,
		order,
		quality,
		category,
	}: {
		query: string;
		queryStrict?: boolean;
		quality?: string | null;
		category?: number[];
		order: {
			seeders: "asc" | "desc";
		};
	}): Promise<JackettResponse> {
		var { data } = await this.api.get<JackettResponse>(
			"/indexers/all/results",
			{
				params: {
					Query: query,
					Category: category,
				},
			},
		);

		// Sort by seeders
		data.Results = data.Results.sort((a: any, b: any) => {
			return order.seeders === "asc"
				? a.Seeders - b.Seeders
				: b.Seeders - a.Seeders;
		});

		// Title must content the strictly query
		if (queryStrict)
			data.Results = data.Results.filter((result: any) =>
				result.Title.toLowerCase().includes(query.toLowerCase()),
			);

		// remove duplicates by size of the torrent
		const seen: { [key: string]: boolean } = {};

		data.Results = data.Results.filter((result) => {
			if (seen[result.Size + result.Title]) return false;
			seen[result.Size + result.Title] = true;
			return true;
		});

		// Filter by quality
		if (quality)
			data.Results = data.Results.filter((result: any) =>
				result.Title.toLowerCase().includes(quality.toLowerCase()),
			);

		return data;
	}
}
