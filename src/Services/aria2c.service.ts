import env from "@/Utils/Dotenv";
import { logger } from "@/Utils/logger";
import { Aria2RPC } from "node-aria2";

export const aria2 = new Aria2RPC({
	host: env.ARIA2C_HOST,
	port: parseInt(env.ARIA2C_PORT),
	secure: env.ARIA2C_SECURE == "true",
	secret: env.ARIA2C_SECRET,
	path: env.ARIA2C_PATH,
});

aria2
	.open()
	.then(() => {
		logger.info("[Aria2C] Connected");
	})
	.catch((err) => {
		logger.error("[Aria2C] Failed to connect", err);
	});
