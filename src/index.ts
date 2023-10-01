import AIClient from "./models/client/AIClient";
import dotenv from "dotenv";

// This allows you to easily configure multiple environment variables.
dotenv.config({
	path: `.env.${process.env.NODE_ENV}`,
});

const client = new AIClient({
	discord_token: process.env.DISCORD_TOKEN!,
	ifunny_basic: process.env.IFUNNY_BASIC!,
	ifunny_bearer: process.env.IFUNNY_BEARER!,
});

// This event is triggered by docker stop, and allows the bot to gracefully shutdown.
process.on("SIGTERM", () => {
	client.discord.destroy();
	process.exit(0);
});

client.on("ready", () => {
	client.logger.info(`Client logged in as ${client.discord.user?.tag}`);
});

client.start();
