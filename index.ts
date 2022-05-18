import Client from "./src/Objects/Client";
import dotenv from "dotenv";
dotenv.config();

const config = {
	intents: Client.defaultIntents,
	clientId: process.env.CLIENT_ID!,
	supportServer: {
		inviteURL: process.env.SUPPORT_URL!,
		guildId: process.env.GUILD_ID!,
	},
};

const client = new Client(config);

client.login(process.env.DISCORD_TOKEN);
