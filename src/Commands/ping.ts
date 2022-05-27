import Client from "@Client";
import Command from "../Objects/Command";
import { CommandInteraction } from "discord.js";

export class Ping extends Command {
	constructor(client: Client) {
		super(
			client,
			"ping",
			"Returns the bot's response time and the websocket latency"
		);
	}

	async execute(client: Client, interaction: CommandInteraction) {
		const embed = client.util
			.embed()
			.setTitle("Pong!")
			.setColor("YELLOW")
			.setTimestamp();

		await interaction.reply({ embeds: [embed], fetchReply: true });
		if (interaction.inCachedGuild()) {
			const msg = await interaction.fetchReply();
			embed.setDescription(
				`Bot Latency: \`${
					msg.createdTimestamp - interaction.createdTimestamp
				}ms\`\nWebSocket Latency: \`${interaction.client.ws.ping}ms\``
			);
			interaction.editReply({ embeds: [embed] });
			return;
		}
		client.logger.warn("Ping failed due to channel not being cached", interaction);
	}
}

export default Ping;
