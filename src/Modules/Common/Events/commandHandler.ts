import Event from "@/Classes/Event";
import { PermissionsService } from "@/Modules/Permissions/permissions.service";
import {
	BaseMessageOptions,
	Colors,
	EmbedBuilder,
	GuildMember,
} from "discord.js";

export const CommandHandlerEvent = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (client, interaction) => {
	if (!interaction.isChatInputCommand()) return false;

	for (const [_ModuleName, Module] of client.Modules) {
		for (const command of Module.Commands.filter(
			(command) => command.name === interaction.commandName,
		)) {
			try {
				var subCommand: string | null =
					interaction.options?.getSubcommand();

				var subGroupCommand: string | null =
					interaction.options?.getSubcommandGroup();
			} catch (error) {
				subCommand = null;
				subGroupCommand = null;
			}

			const commandHandlerName =
				command.name +
				(subGroupCommand ? `.${subGroupCommand}` : "") +
				(subCommand ? `.${subCommand}` : "");

			const commandProp = command.handlers.get(commandHandlerName);

			if (!commandProp) {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("・Command")
							.setColor(Colors.Red)
							.setDescription(
								`Command \`${commandHandlerName}\` not found`,
							),
					],
					ephemeral: true,
				});

				return false;
			}

			if (!commandProp.permission)
				return commandProp.handler.fn(interaction);

			if (!(interaction.member instanceof GuildMember)) return false;

			const userHasPermissions =
				await PermissionsService.userHasPermissions({
					member: interaction.member,
					permissions: commandProp.permission,
				});

			if (!userHasPermissions.hasPermission) {
				interaction.reply({
					content: `You don't have permission to use this command${userHasPermissions.missingPermissions.length > 0 ? `\nRequired permissions: \`${userHasPermissions.missingPermissions.join(", ")}\`` : ""}${userHasPermissions.orRequiredOnePermission.length > 0 ? `\nOr required one of: \`${userHasPermissions.orRequiredOnePermission.join(", ")}\`` : ""}`,
					ephemeral: true,
				});

				return false;
			}

			try {
				var handlerOutput = await commandProp.handler.fn(interaction);
			} catch (error) {
				interaction.reply({
					content: "An error occurred while executing the command",
					ephemeral: true,
				});

				console.error(error);

				return false;
			}

			if (handlerOutput === false) {
				!interaction.deferred
					? interaction.reply({
							content:
								"An error occurred while executing the command",
							ephemeral: true,
						})
					: interaction.editReply({
							content:
								"An error occurred while executing the command",
						});

				return false;
			} else if (typeof handlerOutput === "string") {
				!interaction.deferred
					? interaction.reply({
							content: `⚠️` + handlerOutput,
							ephemeral: true,
						})
					: interaction.editReply({ content: `⚠️` + handlerOutput });

				return false;
			} else if (typeof handlerOutput == "object") {
				!interaction.deferred
					? interaction.reply({
							ephemeral: true,
							...(handlerOutput as BaseMessageOptions),
						})
					: interaction.editReply({
							...(handlerOutput as BaseMessageOptions),
						});
				return true;
			} else {
				return true;
			}
		}
	}

	return true;
});
