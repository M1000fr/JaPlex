import {
	Client,
	ClientOptions,
	Guild,
	GuildMember,
	REST,
	Routes,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import Module from "./Module";
import Dotenv from "@/Utils/Dotenv";
import { logger } from "@/Utils/logger";

export default class ExtendedClient<
	Ready extends boolean = boolean,
> extends Client<Ready> {
	public Modules: Map<string, Module> = new Map();
	public Rest = new REST({ version: "9" }).setToken(Dotenv.DISCORD_TOKEN);
	public guild!: Guild;
	public member!: GuildMember;

	constructor(clientOptions: ClientOptions) {
		super(clientOptions);
	}

	public loadModules(modules: Module[], skipEvents: boolean = false): void {
		for (const module of modules) {
			this.Modules.set(module.name, module);
			module.init(this, skipEvents);
			logger.info(
				`[${module.name}] Module loaded ${skipEvents ? "without events" : ""}`,
			);
		}

		logger.info("[Modules] All modules have been loaded");
	}

	public start(): this {
		this.login(Dotenv.DISCORD_TOKEN);
		return this;
	}

	public async registerCommandsOnGuild(
		guildId: string,
	): Promise<boolean | string | unknown> {
		const commandsOptions: (
			| SlashCommandOptionsOnlyBuilder
			| SlashCommandSubcommandBuilder
			| SlashCommandSubcommandsOnlyBuilder
			| SlashCommandSubcommandGroupBuilder
			| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
		)[] = [];

		this.Modules.forEach((module) => {
			commandsOptions.push(
				...module.Commands.map((command) => command.options),
			);
		});

		try {
			await this.Rest.put(
				Routes.applicationGuildCommands(
					this.user?.id as string,
					guildId,
				),
				{
					body: commandsOptions,
				},
			);
			logger.info(`[Client] All commands have been registered`);
			return true;
		} catch (error) {
			logger.error(`[Client] Error while registering commands: ${error}`);
			return error;
		}
	}
}
