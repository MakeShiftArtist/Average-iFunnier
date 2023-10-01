import Command from "../../../models/discord/Command";

export default new Command(
	{
		name: "about",
		description: "Gives information about the bot",
		category: "info",
	},
	async (bot, interaction) => {
		const embed = new bot.embeds.General.About(bot);
		const user = await bot.ifunny.user();
		if (user) {
			embed.addFields([
				{
					name: "iFunny Bot",
					value: `Nick: \`${user.nick}\`\nId: \`${user.id}\``,
				},
			]);
		}

		await interaction.reply({
			embeds: [embed],
		});
	}
);
