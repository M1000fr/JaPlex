export interface PlexSearch {
	MediaContainer: MediaContainer;
}

export interface MediaContainer {
	size: number;
	Hub: Hub[];
}

export interface Hub {
	title: string;
	type: string;
	hubIdentifier: string;
	context: string;
	size: number;
	more: boolean;
	style: string;
	Metadata?: Metadaum[];
}

export interface Metadaum {
	librarySectionTitle: string;
	score: string;
	ratingKey: string;
	key: string;
	guid: string;
	slug: string;
	studio: string;
	type: string;
	title: string;
	librarySectionID: number;
	librarySectionKey: string;
	contentRating: string;
	summary: string;
	audienceRating: number;
	viewCount?: number;
	lastViewedAt?: number;
	year: number;
	tagline: string;
	thumb: string;
	art: string;
	duration: number;
	originallyAvailableAt: string;
	addedAt: number;
	updatedAt: number;
	audienceRatingImage: string;
	primaryExtraKey: string;
	Media: Medum[];
	Genre: Genre[];
	Country: Country[];
	Director: Director[];
	Writer: Writer[];
	Role: Role[];
	rating?: number;
	ratingImage?: string;
}

export interface Medum {
	id: number;
	duration: number;
	bitrate: number;
	width: number;
	height: number;
	aspectRatio: number;
	audioChannels: number;
	audioCodec: string;
	videoCodec: string;
	videoResolution: string;
	container: string;
	videoFrameRate: string;
	videoProfile: string;
	Part: Part[];
}

export interface Part {
	id: number;
	key: string;
	duration: number;
	file: string;
	size: number;
	container: string;
	hasThumbnail: string;
	videoProfile: string;
}

export interface Genre {
	tag: string;
}

export interface Country {
	tag: string;
}

export interface Director {
	tag: string;
}

export interface Writer {
	tag: string;
}

export interface Role {
	tag: string;
}
