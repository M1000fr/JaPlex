import { TellStatus } from "@/Interfaces/Aria2c/tellStatus";
import { aria2 } from "@/Services/aria2c.service";
import { wait } from "@/Utils/wait";
import { EventEmitter } from "events";

export class Download extends EventEmitter<{
	start: [TellStatus];
	error: [TellStatus];
	seeded: [TellStatus];
	downloading: [TellStatus];
	finished: [TellStatus];
}> {
	public url: string;
	public torrentId!: string;
	public torrentStatus!: TellStatus;

	public contentId!: string;
	public content: any;
	public contentStatus!: TellStatus;
	public contentFilesStatus!: {
		path: string;
		totalFilesLength: number;
		completedFilesLength: number;
		pourcentage: number;
	}[];
	public totalPourcentage: number = 0;
	public finished: boolean = false;

	public path: string;
	public serverPath: string;
	public fileStatusInterval!: NodeJS.Timeout;

	public refreshRate: number = 2500;

	public seedAfterDownload: boolean = false;

	constructor({
		url,
		path,
		refreshRate,
		seedAfterDownload,
	}: {
		url: string;
		path: string;
		refreshRate: number;
		seedAfterDownload: boolean;
	}) {
		super();
		this.url = url;
		this.path = path;
		this.serverPath = `/mnt/media/Movies/${path}`;
		// this.serverPath = `/mnt/media/${path}`;
		this.refreshRate = refreshRate;
		this.seedAfterDownload = seedAfterDownload;
	}

	async start() {
		try {
			this.torrentId = (await aria2.call("addUri", [this.url], {
				dir: this.serverPath,
			})) as string;

			// Trying to get the status of the download of the torrent
			await wait(1000);
			this.torrentStatus = await aria2.call("tellStatus", this.torrentId);

			// Checking if the download of the torrent is followed by another download
			// if so, we wait for the download of the content to start
			while (
				this.torrentStatus.files[0].path == "" &&
				!this.torrentStatus.followedBy
			) {
				await wait(1000);
				this.torrentStatus = await aria2.call(
					"tellStatus",
					this.torrentId,
				);
			}

			// Trying to get the status of the download of the content
			// If the torrent is the content, we set the contentId to the torrentId
			this.contentId = this.torrentStatus.followedBy
				? this.torrentStatus.followedBy[0]
				: this.torrentId;

			this.content = await aria2.call("tellStatus", this.contentId);

			this.emit("start", this.content);
			this.startMonitorDownload(this.content);
		} catch (err) {
			console.error(err);
		}
	}

	private async startMonitorDownload(torrentFileStatus: TellStatus) {
		this.fileStatusInterval = setInterval(async () => {
			this.contentStatus = await aria2.call("tellStatus", this.contentId);

			// If the download of the content has an error status, we emit the error event
			// and remove the download
			if (this.contentStatus.status == "error") {
				this.emit("error", this.contentStatus);
				this.stopMonitorDownload();
				return;
			}

			// If the download of the content has in seeder status, we emit the seeded event
			// and remove the seed if the seedAfterDownload is set to false
			if (this.contentStatus.seeder == "true" && this.finished) {
				if (!this.seedAfterDownload) this.stopMonitorDownload();
				else this.emit("seeded", this.contentStatus);
				return;
			}

			// Calculating the total length of the files
			this.contentFilesStatus = this.contentStatus.files.map((file) => ({
				path: file.path,
				totalFilesLength: Number(file.length),
				completedFilesLength: Number(file.completedLength),
				pourcentage:
					Math.round(
						(Number(file.completedLength) / Number(file.length)) *
							100,
					) || 0,
			}));

			// Calculating the total pourcentage of all the files
			this.totalPourcentage =
				Math.round(
					this.contentFilesStatus.reduce(
						(acc, file) => acc + file.pourcentage,
						0,
					) / this.contentFilesStatus.length,
				) || 0;

			// If the download of the content is completed, we emit the finished event
			this.finished = this.contentFilesStatus.every(
				(file) => file.pourcentage == 100,
			);

			if (this.finished) this.emit("finished", this.contentStatus);
			else this.emit("downloading", this.contentStatus);
		}, this.refreshRate);
	}

	private async stopMonitorDownload() {
		await aria2.call("remove", this.contentId).catch(() => {});
		clearInterval(this.fileStatusInterval);
	}
}
