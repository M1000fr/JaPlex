import { JackettAttribute } from "./Attribute";

export interface JackettResult {
	Title: string;
	TitleLong: string;
	CategoryDesc: string;
	Indexer: string;
	Size: string;
	Seeders: number;
	Peers: number;
	Link: string;
	Guid: string;
	PublishDate: string;
	Comments: string;
	Category: number;
	Grabs: number;
	Description: string;
	DownloadVolumeFactor: number;
	UploadVolumeFactor: number;
	MinimumRatio: number;
	MinimumSeedTime: number;
	DownloadUrl: string;
	InfoHash: string;
	BlackholeLink: string;
	Attributes: JackettAttribute[];
}
