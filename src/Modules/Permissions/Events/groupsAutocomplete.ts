import Event from "@/Classes/Event";
import { Prisma } from "@/Services/prisma.service";

export const GroupsAutocomplete = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (_client, interaction) => {
	if (!interaction.isAutocomplete() || interaction.commandName !== "groups")
		return;

	const focus = interaction.options.getFocused();

	const groups = await Prisma.group.findMany({
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

	if (!groups) return;

	await interaction.respond(
		groups.map((group) => ({
			name: group.id + ". " + group.name,
			value: group.id.toString(),
		})),
	);

	return true;
});
