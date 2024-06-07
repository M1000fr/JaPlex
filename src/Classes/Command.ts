import { CommandPermissions } from "@/Interfaces/Commands";
import { logger } from "@/Utils/logger";
import * as Djs from "discord.js";
import { CommandHandler } from "./CommandHandler";
import { PermissionsService } from "@/Modules/Permissions/permissions.service";

export default class Command {
	declare name: string;
	declare options:
		| Djs.SlashCommandOptionsOnlyBuilder
		| Djs.SlashCommandSubcommandBuilder
		| Djs.SlashCommandSubcommandsOnlyBuilder
		| Djs.SlashCommandSubcommandGroupBuilder
		| Djs.SlashCommandSubcommandsOnlyBuilder
		| Omit<Djs.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	public handlers: Map<
		string,
		{
			permission?: CommandPermissions;
			handler: CommandHandler;
		}
	> = new Map();

	constructor(name: string, options: typeof Command.prototype.options) {
		this.name = name;
		this.options = options;
	}

	public setHandler({
		sub,
		subGroup,
		permission = { and: [], or: [] },
		handler,
	}: {
		sub?: string;
		subGroup?: string;
		permission?: CommandPermissions;
		handler: CommandHandler;
	}): this {
		const handlerName = `${this.name}${subGroup ? `.${subGroup}` : ""}${sub ? `.${sub}` : ""}`;

		this.handlers.set(handlerName, {
			permission,
			handler,
		});
		logger.info(`[Command] ${this.name}${sub ? `.${sub}` : ""} has been registered`);
		return this;
	}

	static async hasSuperiorGroupPriority({
		target,
		executor,
	}: {
		target: Djs.GuildMember;
		executor: Djs.GuildMember;
	}): Promise<boolean> {
		const targetHighestGroup = await PermissionsService.getMemberHighestGroup(target);
		const executorHighestGroup = await PermissionsService.getMemberHighestGroup(executor);

		return PermissionsService.hasGroupPriority(executorHighestGroup, targetHighestGroup);
	}
}
