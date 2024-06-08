import { Download } from "@/Classes/Download";
import Event from "@/Classes/Event";
import { ProgressBar } from "@/Classes/progressBar";
import "@/Services/aria2c.service";
import { Colors, EmbedBuilder } from "discord.js";
import path from "node:path";

export const downloadTorrentButtonEvent = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (client, interaction) => {
	if (!interaction.isButton()) return false;
	if (interaction.customId !== "download") return false;

	const message = await interaction.message.fetch();
	if (message.interaction?.user.id != interaction.member?.user.id)
		return false;

	const embedData = message?.embeds[0],
		title = embedData?.fields.find((field) =>
			field.name.toLowerCase().includes("title"),
		)?.value;

	if (!embedData || !title)
		return await interaction.reply({
			content: "Could not find data from embed",
			ephemeral: true,
		});

	const downloadFieldUrl = embedData.fields.find((field) =>
			field.name
				.toLowerCase()
				.includes("Torrent Download Link".toLocaleLowerCase()),
		)?.value,
		downloadUrl = downloadFieldUrl?.match(/\(([^)]+)\)/)?.[1];

	if (!downloadUrl)
		return await interaction.reply({
			content: "Could not find download link",
			ephemeral: true,
		});

	const download = new Download({
		url: downloadUrl,
		dir: path.join("/Movies", title),
		refreshRate: 2500,
		seedAfterDownload: false,
	});

	download.start();

	const embed = new EmbedBuilder();

	download.on("start", async () => {
		embed
			.setTitle(
				download.torrentStatus?.files[0].path.split("/").pop() ||
					"`Unknown file name`",
			)
			.setDescription("Download started")
			.setColor(Colors.Blue);

		await message.edit({
			embeds: [embed],
			components: [],
		});
	});

	download.on("downloading", async () => {
		const progressBars = download.contentFilesStatus.map((file) => {
			const progressBar = new ProgressBar(
				file.path.split("/").pop() || "Unknown file name",
				file.totalFilesLength,
			);

			progressBar.update(file.completedFilesLength);

			return progressBar.toString();
		});

		embed
			.setTitle(
				download.torrentStatus?.files[0].path.split("/").pop() ||
					"`Unknown file name`",
			)
			.setDescription(
				`Downloading\n\`\`\`${progressBars.join("\n")}\`\`\``,
			)
			.setColor(Colors.Orange);

		await message.edit({
			embeds: [embed],
			components: [],
		});
	});

	download.on("finished", async () => {
		embed
			.setTitle(
				download.torrentStatus?.files[0].path.split("/").pop() ||
					"`Unknown file name`",
			)
			.setDescription("Download finished")
			.setColor(Colors.Green);

		await message.edit({
			embeds: [embed],
			components: [],
		});
	});

	download.on("error", async (status) => {
		embed
			.setTitle(
				download.torrentStatus?.files[0].path.split("/").pop() ||
					"`Unknown file name`",
			)
			.setDescription(
				`An error occurred\n\`\`\`${status.errorMessage}\`\`\``,
			)
			.setColor(Colors.Red);

		await message.edit({
			embeds: [embed],
			components: [],
		});
	});
});
