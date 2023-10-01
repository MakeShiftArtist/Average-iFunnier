import Command from "../../../models/discord/Command";
import type AIEmbed from "../../../models/discord/embeds/AIEmbed";
import AIError from "../../../models/errors/AIError";

const url_regex = new RegExp("([a-z0-9]{8,9})", "i");
export default new Command(
	{
		name: "content",
		description: "Retrieve content by ID or url",
		category: "ifunny",
	},
	async (bot, interaction) => {
		const query = interaction.options.getString("query", true);
		let id: string;
		if (query.length === 8 || query.length === 9) {
			id = query;
		} else {
			id = query.match(url_regex)?.[0]!;
			bot.logger.debug(query.match(url_regex));
		}
		const content = await bot.ifunny.content.fetch(id);

		let embed: AIEmbed;
		if (!content) {
			embed = new bot.embeds.Error(
				bot,
				new AIError("invalid_content", `\`${query}\` not found.`)
			);
		} else {
			embed = new bot.embeds.iFunny.Content(bot, content);
		}

		await interaction.reply({ embeds: [embed] });
	}
).addStringOption((option) => {
	return option
		.setName("query")
		.setDescription("The id or url of the content")
		.setRequired(true);
});
