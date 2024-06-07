import { JackettIndexer } from "./Indexer";
import { JackettResult } from "./Result";

export interface JackettResponse {
	Results: JackettResult[];
	Indexers: JackettIndexer[];
}
