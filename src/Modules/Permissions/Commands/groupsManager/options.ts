import { SlashCommandBuilder } from "discord.js";

export const groupsCommandOptions = new SlashCommandBuilder()
	.setName("groups")
	.setDescription("Manage groups of permissions")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("create")
			.setDescription("Create a new group")
			.addStringOption((option) =>
				option
					.setName("name")
					.setDescription("The name of the group")
					.setRequired(true),
			)
			.addRoleOption((option) =>
				option
					.setName("role")
					.setDescription("The role associated to the group")
					.setRequired(true),
			)
			.addIntegerOption((option) =>
				option
					.setName("priority")
					.setDescription("The priority of the group")
					.setRequired(true),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("delete")
			.setDescription("Delete a group")
			.addNumberOption((option) =>
				option
					.setName("id")
					.setDescription("The ID of the group")
					.setRequired(true)
					.setAutocomplete(true),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("list").setDescription("List all groups"),
	)
	.addSubcommandGroup((subcommandGroup) =>
		subcommandGroup
			.setName("permissions")
			.setDescription("Manage permissions of a group")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("list")
					.setDescription("List all permissions of a group")
					.addNumberOption((option) =>
						option
							.setName("id")
							.setDescription("The ID of the group")
							.setRequired(true)
							.setAutocomplete(true),
					),
			),
	);
