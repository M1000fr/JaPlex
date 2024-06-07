import Event from "@/Classes/Event";
import { Prisma } from "@/Services/prisma.service";

export const PermissionsAutocomplete = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (_client, interaction) => {
	if (
		!interaction.isAutocomplete() ||
		interaction.commandName !== "permissions"
	)
		return;

	const focus = interaction.options.getFocused();

	const permissions = await Prisma.permission.findMany({
		where: {
			name: {
				contains: focus,
			},
		},
		orderBy: {
			name: "asc",
		},
		take: 10,
	});

	if (!permissions) return;

	await interaction.respond(
		permissions.map((permission) => ({
			name: permission.id + ". " + permission.name,
			value: permission.id.toString(),
		})),
	);

	return true;
});
