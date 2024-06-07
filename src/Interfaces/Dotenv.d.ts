export default interface Dotenv extends NodeJS.ProcessEnv {
	DATABASE_URL: string;

	DISCORD_TOKEN: string;
	DISCORD_GUILD_ID: string;

	JACKETT_API_KEY: string;
}
