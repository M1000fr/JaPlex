import Event from "@/Classes/Event";
import Dotenv from "@/Utils/Dotenv";
import { logger } from "@/Utils/logger";
import { extendedClient } from "@/index";

export const HelloEvent = new Event<"ready">("ready").setHandler(async (client) => {
	logger.info(`[App] Logged in as ${client.user.tag}`);
	extendedClient.guild = await client.guilds.fetch(Dotenv.DISCORD_GUILD_ID);
	extendedClient.member = await extendedClient.guild.members.fetch(client.user.id);

	extendedClient.registerCommandsOnGuild(Dotenv.DISCORD_GUILD_ID);

	return true;
});
