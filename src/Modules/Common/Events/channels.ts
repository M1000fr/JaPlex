import Event from "@/Classes/Event";
import { Prisma } from "@/Services/prisma.service";
import Dotenv from "@/Utils/Dotenv";
import {
	ChannelType,
	Collection,
	NonThreadGuildBasedChannel,
} from "discord.js";

export const RegisterChannelsOnInit = new Event<"ready">("ready").setHandler(
	async (client) => {
		const guild = await client.guilds.fetch(Dotenv.DISCORD_GUILD_ID);
		if (!guild) return false;

		const channels = (await guild.channels.fetch()) as Collection<
			string,
			NonThreadGuildBasedChannel
		>;

		const channelsAlreadyRegistered = await Prisma.channel.findMany();

		const channelsToRegister = channels
			.filter((channel) => {
				return !channelsAlreadyRegistered.some(
					(channelAlreadyRegistered) =>
						channelAlreadyRegistered.id === channel.id,
				);
			})
			.map((channel) => {
				return {
					id: channel?.id,
				};
			});

		if (channelsToRegister.length === 0) return false;

		await Prisma.channel.createMany({
			data: channelsToRegister,
			skipDuplicates: true,
		});
	},
);

export const RegisterChannelsOnCreate = new Event<"channelCreate">(
	"channelCreate",
).setHandler(async (client, channel) => {
	if (channel.guild.id != Dotenv.DISCORD_GUILD_ID) return false;

	const alreadyRegistered = await Prisma.channel
		.findFirst({
			where: {
				id: channel.id,
			},
		})
		.then((c) => !!c);

	if (!alreadyRegistered)
		await Prisma.channel.create({ data: { id: channel.id } });
});

export const UnregisterChannelOnDelete = new Event<"channelDelete">(
	"channelDelete",
).setHandler(async (client, channel) => {
	if (channel.type == ChannelType.DM) return false;
	if (channel.guild.id != Dotenv.DISCORD_GUILD_ID) return false;

	const notRegistered = await Prisma.channel
		.findFirst({
			where: {
				id: channel.id,
			},
		})
		.then((c) => !c);

	if (!notRegistered)
		await Prisma.channel.delete({ where: { id: channel.id } });
});
