import { CommandHandler } from "@/Classes/CommandHandler";
import { EmbedFooterSeparator } from "@/Classes/EmbedFooterSeparator";
import { Prisma } from "@/Services/prisma.service";
import { ChatInputCommandInteraction, Colors } from "discord.js";

export const AddGroupHandler = new CommandHandler(
	async (interaction: ChatInputCommandInteraction) => {
		const name = interaction.options.getString("name"),
			role = interaction.options.getRole("role"),
			priority = interaction.options.getInteger("priority");

		if (!name) return "No name provided";
		if (!role) return "No role provided";
		if (!priority) return "No priority provided";

		const group = await Prisma.group.findFirst({
			where: { name },
		});

		if (group) return "Group already exists";

		await Prisma.group.create({
			data: {
				name,
				priority,
				Role: {
					connectOrCreate: {
						where: { id: role.id },
						create: { id: role.id },
					},
				},
			},
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
					description: `Group \`${name}\` with priority \`${priority}\` and associated to <@&${role.id}>`,
				},
			],
		});

		return true;
	},
);
