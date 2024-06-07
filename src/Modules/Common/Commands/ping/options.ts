import { SlashCommandBuilder } from "discord.js";

export const pingCommandOptions = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong!")
	.addSubcommand((sub) =>
		sub
			.setName("broadcast")
			.setDescription("Replies with Pong with everyone mention!"),
	)
	.addSubcommand((sub) =>
		sub.setName("solo").setDescription("Replies with Pong!"),
	);
