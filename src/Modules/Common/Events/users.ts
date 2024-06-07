import Event from "@/Classes/Event";
import { Prisma } from "@/Services/prisma.service";
import Dotenv from "@/Utils/Dotenv";
import moment from "moment";

export const RegisterUsersOnInit = new Event<"ready">("ready").setHandler(
	async (client) => {
		const guild = await client.guilds.fetch(Dotenv.DISCORD_GUILD_ID);
		if (!guild) return false;

		const members = await guild.members.fetch();

		const users = await Prisma.user.findMany();

		const usersToRegister = members
			.filter((member) => {
				return !users.some((user) => user.id === member.id);
			})
			.map((member) => {
				return {
					id: member.id,
				};
			});

		await Prisma.user.createMany({
			data: usersToRegister,
			skipDuplicates: true,
		});
	},
);

export const UpdateUserOnLeave = new Event<"guildMemberRemove">(
	"guildMemberRemove",
).setHandler(async (client, member) => {
	const user = await Prisma.user.findUnique({
		where: {
			id: member.id,
		},
	});

	if (!user) return false;

	await Prisma.user.update({
		where: {
			id: member.id,
		},
		data: {
			leave_date: moment().toISOString(),
			leave_count: user.leave_count + 1,
		},
	});
});
