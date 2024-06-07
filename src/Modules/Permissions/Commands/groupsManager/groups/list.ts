import { CommandHandler } from "@/Classes/CommandHandler";
import { EmbedFooterSeparator } from "@/Classes/EmbedFooterSeparator";
import { Prisma } from "@/Services/prisma.service";
import { ChatInputCommandInteraction, Colors } from "discord.js";

export const ListGroupsHandler = new CommandHandler(
	async (interaction: ChatInputCommandInteraction) => {
		const groups = await Prisma.group.findMany({
			orderBy: {
				priority: "desc",
			},
		});

		if (groups.length === 0) return "No groups found";

		const embedSeparator = new EmbedFooterSeparator(400, 5, Colors.Purple);

		await interaction.reply({
			files: [
				{
					attachment: embedSeparator.generateImage(),
					name: "separator.png",
				},
			],
			embeds: [
				{
					title: "Groups",
					color: Colors.Purple,
					image: {
						url: "attachment://separator.png",
					},
					description: groups
						.map(
							(group) =>
								`- \`${group.name}#${group.id}\` priority \`${group.priority}\` associated to <@&${group.roleId}>`,
						)
						.join("\n"),
				},
			],
		});

		return true;
	},
);
