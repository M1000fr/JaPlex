import { JackettResponse } from "@/Interfaces/Jackett/Response";
import axios, { AxiosInstance } from "axios";

export class JackettService {
	public api!: AxiosInstance;

	constructor({ apikey }: { apikey: string }) {
		this.api = axios.create({
			maxBodyLength: Infinity,
			baseURL: "https://jackett.m1000.fr/api/v2.0",
			params: { apikey },
		});
	}

	public async search({
		query,
		queryStrict = false,
		order,
	}: {
		query: string;
		queryStrict?: boolean;
		order: {
			seeders: "asc" | "desc";
		};
	}): Promise<JackettResponse> {
		var { data } = await this.api.get<JackettResponse>("/indexers/all/results", {
			params: { Query: query },
		});

		data.Results = data.Results.sort((a: any, b: any) => {
			return order.seeders === "asc" ? a.Seeders - b.Seeders : b.Seeders - a.Seeders;
		});

		if (queryStrict)
			data.Results = data.Results.filter((result: any) =>
				result.Title.toLowerCase().includes(query.toLowerCase()),
			);

		return data;
	}
}
