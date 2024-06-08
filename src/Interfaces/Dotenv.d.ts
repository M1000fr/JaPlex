export default interface Dotenv extends NodeJS.ProcessEnv {
	DATABASE_URL: string;

	DISCORD_TOKEN: string;
	DISCORD_GUILD_ID: string;

	JACKETT_API_URL: string;
	JACKETT_API_KEY: string;

	TMDB_API_KEY: string;

	ARIA2C_HOST: string;
	ARIA2C_PORT: string;
	ARIA2C_SECRET: string;
	ARIA2C_PATH: string;
	ARIA2C_DOWNLOAD_PATH: string;
	ARIA2C_SECURE: string;
}
