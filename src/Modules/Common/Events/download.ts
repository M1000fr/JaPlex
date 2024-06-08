import Event from "@/Classes/Event";
import "@/Services/aria2c.service";
import {
	ActionRowBuilder,
	Colors,
	EmbedBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { Download } from "@/Classes/Download";
import { ProgressBar } from "@/Classes/progressBar";

export const downloadTorrentButtonEvent = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (client, interaction) => {
	if (!interaction.isButton()) return false;
	if (interaction.customId !== "download") return false;

	const message = await interaction.message.fetch();
	const embedData = message?.embeds[0];

	if (!embedData)
		return await interaction.reply({
			content: "Could not find embed",
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

	const modal = new ModalBuilder()
		.setTitle("Download Torrent")
		.setCustomId("downloadTorrent");

	const folderNameInput = new TextInputBuilder()
		.setCustomId("folderName")
		.setLabel("Folder Name")
		.setPlaceholder("Enter the folder name to download the torrent to")
		.setStyle(TextInputStyle.Short)
		.setRequired(true);

	const actionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			folderNameInput,
		);

	modal.addComponents(actionRow);

	await interaction.showModal(modal);

	client.once("interactionCreate", async (interaction) => {
		if (!interaction.isModalSubmit()) return;
		await interaction.deferUpdate();

		const folderName = interaction.fields.getTextInputValue("folderName");

		const download = new Download({
			url: downloadUrl,
			path: folderName,
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

			await interaction.editReply({
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

			await interaction.editReply({
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

			await interaction.editReply({
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

			await interaction.editReply({
				embeds: [embed],
				components: [],
			});
		});
	});
});
