import { CommandHandler } from "@/Classes/CommandHandler";
import { EmbedFooterSeparator } from "@/Classes/EmbedFooterSeparator";
import { Prisma } from "@/Services/prisma.service";
import { ChatInputCommandInteraction, Colors } from "discord.js";

export const ListGroupPermissionsHandler = new CommandHandler(
	async (interaction: ChatInputCommandInteraction) => {
		const id = interaction.options.getNumber("id");
		if (!id) return "No ID provided";

		const group = await Prisma.group.findUnique({
			where: { id },
			include: {
				Permissions: true,
			},
		});

		if (!group) return "Group not found";

		const embedSeparator = new EmbedFooterSeparator(400, 5, Colors.Yellow);

		await interaction.reply({
			files: [
				{
					attachment: embedSeparator.generateImage(),
					name: "separator.png",
				},
			],
			embeds: [
				{
					title: `Permissions of group \`${group.name}\``,
					color: Colors.Yellow,
					image: {
						url: "attachment://separator.png",
					},
					description: group.Permissions.map(
						(permission) => "- " + permission.name,
					).join("\n"),
				},
			],
		});

		return true;
	},
);
