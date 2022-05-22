import Command from "../Objects/Command";

export default new Command(
	"ping",
	"Pings the bot and receives response time",
	async (client, interaction) => {
		const embed = client.util
			.embed()
			.setTitle("Pong!")
			.setColor("YELLOW")
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
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
	},
	{
		devOnly: true,
	}
);
