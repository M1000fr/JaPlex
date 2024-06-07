import Event from "@/Classes/Event";
import "@/Services/aria2c.service";
import { aria2 } from "@/Services/aria2c.service";
import {
	ActionRowBuilder,
	Colors,
	Embed,
	EmbedBuilder,
	Message,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import moment from "moment";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function downloadTorrent(
	downloadUrl: string,
	folderName: string,
	message: Message,
	messageEmbed: Embed,
	type: "Movie" | "TV Show",
) {
	const dir = `/mnt/media/${type === "Movie" ? "Movies" : "Shows"}/${folderName}`;

	aria2
		.call("addUri", [downloadUrl], { dir })
		.then(async (res) => {
			await message.edit({
				embeds: [
					{
						author: messageEmbed.author!,
						color: Colors.Orange,
						description: `Downloading torrent`,
					},
				],
				components: [],
			});

			const t1 = moment();

			await wait(1000);

			const torrentFileStatus = await aria2.call("tellStatus", res);

			const fetchTorrentContentsStatusInterval: NodeJS.Timeout =
				setInterval(async () => {
					const filesStatus = await aria2.call(
						"tellStatus",
						torrentFileStatus.followedBy[0],
					);

					if (filesStatus.status == "error") {
						await message.edit({
							embeds: [
								{
									author: messageEmbed.author!,
									color: Colors.Red,
									description: filesStatus.errorMessage,
								},
							],
							components: [],
						});

						return clearInterval(
							fetchTorrentContentsStatusInterval,
						);
					} else if (filesStatus.seeder == "true") {
						await message.edit({
							embeds: [
								{
									author: messageEmbed.author!,
									color: Colors.Green,
									description: `Downloaded torrent`,
									fields: [
										{
											name: "🕒 Time Taken",
											value: `${moment().diff(t1, "seconds")} seconds`,
											inline: true,
										},
										{
											name: "📁 Folder",
											value: dir,
											inline: true,
										},
									],
								},
							],
							components: [],
						});

						// remove the torrent from aria2
						await aria2.call("remove", filesStatus.gid);

						return clearInterval(
							fetchTorrentContentsStatusInterval,
						);
					}

					const embedDownload = new EmbedBuilder({
						author: messageEmbed.author!,
						color: Colors.Orange,
						description: `Downloading torrent`,
					});

					const filesFields = filesStatus.files.map(
						(file: {
							completedLength: string;
							length: string;
							path: string;
						}) => ({
							name: file.path.split("/").pop(),
							value:
								Math.round(
									(Number(file.completedLength) /
										Number(file.length)) *
										100,
								).toString() + "%",
						}),
					);

					embedDownload.addFields(filesFields);

					await message.edit({
						embeds: [embedDownload],
						components: [],
					});
				}, 2500);
		})
		.catch(async (err) => {
			console.error(err);
			await message.edit({
				embeds: [
					{
						description: `Failed to download torrent`,
						color: Colors.Red,
					},
				],
				components: [],
			});
		});
}

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
		downloadTorrent(downloadUrl, folderName, message, embedData, "Movie");
	});
});
