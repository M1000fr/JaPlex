export interface TellStatus {
	bitfield: string;
	completedLength: string;
	connections: string;
	dir: string;
	downloadSpeed: string;
	errorCode: string;
	errorMessage: string;
	files: File[];
	followedBy?: string[];
	gid: string;
	numPieces: string;
	pieceLength: string;
	seeder?: string;
	status: "active" | "waiting" | "paused" | "error" | "complete" | "removed";
	totalLength: string;
	uploadLength: string;
	uploadSpeed: string;
}

export interface File {
	completedLength: string;
	index: string;
	length: string;
	path: string;
	selected: string;
	uris: string[];
}
