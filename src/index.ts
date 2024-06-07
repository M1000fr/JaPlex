if (process.env.NODE_ENV == "production") require("module-alias/register");

process.env.TZ = process.env.TZ || "";

import ExtendedClient from "@/Classes/ExtendedClient";
import { GatewayIntentBits } from "discord.js";

import * as Modules from "@/Modules";

export const extendedClient = new ExtendedClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

extendedClient.start();

extendedClient.loadModules(Object.values(Modules));
