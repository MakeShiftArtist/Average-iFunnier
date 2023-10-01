import Command from "../../../models/discord/Command";
import ifunny from "ifunny.ts";

export default new Command(
	{
		name: "basic",
		description: "Generates a new basic token and sends it privately",
		category: "ifunny",
	},
	async (bot, interaction) => {
		let length = interaction.options.getNumber("length", false) as
			| 112
			| 156
			| null;
		let clientId = interaction.options.getString("client_id", false);
		let clientSecret = interaction.options.getString("client_secret", false);

		await interaction.reply({
			ephemeral: true,
			embeds: [
				new bot.embeds.default(bot, {
					title: "Basic Token",
					description: `\`${bot.ifunny.util.createBasicAuth({
						length: length ? length : 112,
						clientId: clientId ? clientId : ifunny.DEFAULT_CONFIG.clientId,
						clientSecret: clientSecret
							? clientSecret
							: ifunny.DEFAULT_CONFIG.clientSecret,
					})}\``,
					timestamp: new Date(),
				}),
			],
		});
	}
)
	.addNumberOption((option) => {
		return option
			.setName("length")
			.setDescription("The length of the token to generate")
			.setRequired(true)
			.addChoices(
				{
					name: "112",
					value: 112,
				},
				{
					name: "156",
					value: 156,
				}
			);
	})
	.addStringOption((option) => {
		return option
			.setName("client_id")
			.setDescription("The client id to generate the token with")
			.setRequired(false);
	})
	.addStringOption((option) => {
		return option
			.setName("client_secret")
			.setDescription("The client secret to generate the token with")
			.setRequired(false);
	});
