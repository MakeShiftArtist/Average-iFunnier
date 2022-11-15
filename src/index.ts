import AIClient from "./models/client/AIClient";
import "dotenv/config";

const client = new AIClient({
	discord_token: process.env.DISCORD_TOKEN!,
	ifunny_basic: process.env.IFUNNY_BASIC!,
	ifunny_bearer: process.env.IFUNNY_BEARER!,
});

client.on("ready", () => {
	client.logger.info(`Client logged in as ${client.discord.user?.tag}`);
});

client.start();
