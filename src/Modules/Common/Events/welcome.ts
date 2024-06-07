import { EmbedFooterSeparator } from "@/Classes/EmbedFooterSeparator";
import Event from "@/Classes/Event";
import { Prisma } from "@/Services/prisma.service";
import { ChannelType, Colors, EmbedBuilder, Role } from "discord.js";
import moment from "moment";

export const WelcomeEvent = new Event<"guildMemberAdd">(
	"guildMemberAdd",
).setHandler(async (client, member) => {
	const channels = await Prisma.channelAssignment
		.findMany({
			where: { assignement: "WELCOME_MESSAGE" },
		})
		.then((channelsInDB) => {
			return channelsInDB.map((channel) => {
				return client.channels.cache.get(channel.channelId);
			});
		});

	const roles = await Prisma.roleAssignment
		.findMany({
			where: { assignement: "ADD_ON_GUILDMEMBER_ADD" },
		})
		.then((rolesInDB) => {
			return rolesInDB.map((role) => {
				return member.guild.roles.cache.get(role.roleId) || null;
			});
		});

	if (roles.length > 0) {
		const existingRoles = roles.filter((r) => r != null) as Role[];
		member.roles.add(existingRoles);
	}

	const user = await Prisma.user.findUnique({
		where: {
			id: member.id,
		},
	});

	const embedSeparator = new EmbedFooterSeparator(400, 5, Colors.Aqua);

	const embed = new EmbedBuilder()
		.setDescription(`Welcome to the server, ${member.toString()} !`)
		.setThumbnail(member.user.displayAvatarURL())
		.setColor(Colors.Aqua)
		.setImage("attachment://separator.png");

	if (user?.leave_date)
		embed.addFields([
			{
				name: "Welcome back !",
				value: `You were last here <t:${moment(
					user.leave_date,
				).unix()}:R>`,
				inline: true,
			},
			{
				name: "Times you left",
				value: user.leave_count.toString(),
				inline: true,
			},
		]);

	if (channels.length > 0)
		channels.forEach((channel) => {
			if (channel?.type != ChannelType.GuildText) return false;

			channel.send({
				files: [
					{
						attachment: embedSeparator.generateImage(),
						name: "separator.png",
					},
				],
				embeds: [embed],
			});
		});

	return true;
});
