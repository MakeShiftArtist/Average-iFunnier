import type AIEmbed from "../../../models/discord/embeds/AIEmbed";
import Command from "../../../models/discord/Command";
import AIError from "../../../models/errors/AIError";

export default new Command(
	{
		name: "user",
		description: "Fetches an iFunny user",
		category: "ifunny",
	},
	async (bot, interaction) => {
		const queryType = interaction.options.getSubcommand(true) as "nick" | "id";
		const query = interaction.options.getString("query", true);
		const user = await bot.ifunny.users.fetch(query, queryType === "nick");

		let embed: AIEmbed;

		if (!user) {
			embed = new bot.embeds.error(
				bot,
				new AIError(
					"invalid_user",
					`User with ${queryType} \`${query}\` not found.`
				)
			);
		} else {
			embed = new bot.embeds.iFunnyUser(bot, user);
		}

		interaction.reply({
			embeds: [embed],
		});
	}
)
	.addSubcommand((command) => {
		return command
			.setName("id")
			.setDescription("Fetch a user by id")
			.addStringOption((option) => {
				return option
					.setName("query")
					.setDescription("The id of the user you want to fetch")
					.setRequired(true);
			});
	})
	.addSubcommand((command) => {
		return command
			.setName("nick")
			.setDescription("Fetch a user by their nick")
			.addStringOption((option) => {
				return option
					.setName("query")
					.setDescription("The nick of the user you want to fetch")
					.setRequired(true);
			});
	});
