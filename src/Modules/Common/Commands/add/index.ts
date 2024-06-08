import { Book } from "@/Classes/Book";
import Command from "@/Classes/Command";
import { CommandHandler } from "@/Classes/CommandHandler";
import { JackettService } from "@/Services/jackett.service";

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
} from "discord.js";

import { plexCommandOptions } from "./options";

const qualityRegex = /\b(?:4K|[0-9]{3,4}p)\b/i;

export const PlexCommand = new Command("plex", plexCommandOptions).setHandler({
	subGroup: "movie",
	sub: "add",
	permission: {
		or: ["CMDS_ALL"],
		and: [],
	},
	handler: new CommandHandler(async (interaction) => {
		await interaction.deferReply();

		const title = interaction.options.getString("title", true),
			quality = interaction.options.getString("quality", false);

		const search = await JackettService.search({
			query: title,
			order: { seeders: "desc" },
			queryStrict: false,
			quality,
		});

		if (search.Results.length === 0) {
			await interaction.editReply("No results found");
			return true;
		}

		const book = new Book({ authorId: interaction.user.id });

		search.Results.forEach((result) => {
			const RowAction =
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId(`download`)
						.setLabel("Download")
						.setStyle(ButtonStyle.Success),
				);

			const quality = qualityRegex.exec(result.Title);

			book.addPage({
				embeds: [
					{
						description: result.Description,
						color: Colors.Blue,
						author: {
							name: result.Title,
							url: result.Details,
						},
						fields: [
							{
								name: "🙍 Seeders",
								value: result.Seeders.toString(),
								inline: true,
							},
							{
								name: "📏 Size",
								value:
									// Convert bytes to GB and round to 2 decimal places
									`${(result.Size / 1024 / 1024 / 1024).toFixed(2)} GB`,
								inline: true,
							},
							{
								name: "📽️ Quality",
								value: quality ? quality[0] : "Unknown",
								inline: true,
							},
							{
								name: "🔗 Torrent Download Link",
								value: `[Click here](${result.Link})`,
							},
						],
					},
				],
				components: [RowAction],
			});
		});

		const bookPages = book.buildPages();

		const reply = await interaction.editReply(bookPages.first()!),
			replyMessage = await reply.fetch();

		book.register(replyMessage.id);

		return true;
	}),
});
