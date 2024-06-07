import { CommandHandler } from "@/Classes/CommandHandler";
import { EmbedFooterSeparator } from "@/Classes/EmbedFooterSeparator";
import { Prisma } from "@/Services/prisma.service";
import { ChatInputCommandInteraction, Colors } from "discord.js";

export const DeleteGroupHandler = new CommandHandler(
	async (interaction: ChatInputCommandInteraction) => {
		const id = interaction.options.getNumber("id");

		if (!id) return "No name provided";

		const group = await Prisma.group.findUnique({
			where: { id },
		});

		if (!group) return "Group not found";

		await Prisma.group.delete({
			where: { id },
		});

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
					color: Colors.Purple,
					image: {
						url: "attachment://separator.png",
					},
					description: `Group \`${group.name}\` with priority \`${group.priority}\` and associated to <@&${group.roleId}> has been deleted`,
				},
			],
		});

		return true;
	},
);
