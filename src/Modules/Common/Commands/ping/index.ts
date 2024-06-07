import Command from "@/Classes/Command";
import { pingCommandOptions } from "./options";
import { CommandHandler } from "@/Classes/CommandHandler";

export const PingCommand = new Command("ping", pingCommandOptions)
	.setHandler({
		sub: "broadcast",
		permission: {
			or: ["CMDS_ALL"],
			and: ["CMDS_PING_BROADCAST"],
		},
		handler: new CommandHandler((interaction) => {
			interaction.reply(
				`Pong! ${interaction.guild?.roles.everyone.toString()}`,
			);
			return true;
		}),
	})
	.setHandler({
		sub: "solo",
		handler: new CommandHandler((interaction) => {
			interaction.reply("Pong!");
			return true;
		}),
	});
