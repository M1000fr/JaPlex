import * as Djs from "discord.js";

export class CommandHandler {
	fn: (
		interaction: Djs.ChatInputCommandInteraction,
	) => Promise<boolean | string | Djs.BaseMessageOptions> | boolean | string;

	constructor(
		fn: (
			interaction: Djs.ChatInputCommandInteraction,
		) =>
			| Promise<boolean | string | Djs.BaseMessageOptions>
			| boolean
			| string,
	) {
		this.fn = fn;
	}
}
