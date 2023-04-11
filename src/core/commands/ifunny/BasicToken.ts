import Command from "../../../models/discord/Command";

export default new Command(
	{
		name: "basic",
		description: "Generates a new basic token and sends it privately",
		category: "ifunny",
	},
	async (bot, interaction) => {
		await interaction.reply({
			ephemeral: true,
			embeds: [
				new bot.embeds.default(bot, {
					title: "Basic Token",
					description: `\`${bot.ifunny.util.createBasicAuth()}\``,
					timestamp: new Date(),
				}),
			],
		});
	}
);
