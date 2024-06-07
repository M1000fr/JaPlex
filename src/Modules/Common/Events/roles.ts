import Event from "@/Classes/Event";
import { Prisma } from "@/Services/prisma.service";
import Dotenv from "@/Utils/Dotenv";

export const RegisterRolesOnInit = new Event<"ready">("ready").setHandler(
	async (client) => {
		const guild = await client.guilds.fetch(Dotenv.DISCORD_GUILD_ID);
		if (!guild) return false;

		const roles = await guild.roles.fetch();

		const rolesAlreadyRegistered = await Prisma.role.findMany();

		const rolesToRegister = roles
			.filter((role) => {
				return !rolesAlreadyRegistered.some(
					(rolesAlreadyRegistered) =>
						role.id === rolesAlreadyRegistered.id,
				);
			})
			.map((role) => {
				return {
					id: role.id,
				};
			});

		await Prisma.role.createMany({
			data: rolesToRegister,
			skipDuplicates: true,
		});
	},
);

export const RegisterRoleOnCreate = new Event<"roleCreate">(
	"roleCreate",
).setHandler(async (client, role) => {
	if (role.guild.id != Dotenv.DISCORD_GUILD_ID) return false;

	const alreadyRegistered = await Prisma.role
		.findFirst({
			where: {
				id: role.id,
			},
		})
		.then((role) => !!role);

	if (!alreadyRegistered) await Prisma.role.create({ data: { id: role.id } });
});

export const UnregisterRoleOnDelete = new Event<"roleDelete">(
	"roleDelete",
).setHandler(async (client, role) => {
	if (role.guild.id != Dotenv.DISCORD_GUILD_ID) return false;

	const notRegistered = await Prisma.role
		.findFirst({
			where: {
				id: role.id,
			},
		})
		.then((role) => !role);

	if (!notRegistered) await Prisma.role.delete({ where: { id: role.id } });
});
