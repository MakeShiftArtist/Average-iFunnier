import Command from "../../../models/discord/Command";
import type AIEmbed from "../../../models/discord/embeds/AIEmbed";
import { DEFAULT_PFP } from "../../../models/discord/embeds/iFunnyUserEmbed";
import AIError from "../../../models/errors/AIError";

export default new Command(
	{
		name: "profilepic",
		description: "Retrieves the full profile picture for a User",
		category: "ifunny",
	},
	async (bot, interaction) => {
		const queryType = interaction.options.getSubcommand(true) as "nick" | "id";
		const query = interaction.options.getString("query", true);
		const user = await bot.ifunny.users.fetch(query, queryType === "nick");

		let embed: AIEmbed = new bot.embeds.default(bot);

		if (!user) {
			embed = new bot.embeds.Error(
				bot,
				new AIError(
					"invalid_user",
					`User with ${queryType} \`${query}\` not found.`
				)
			);
		} else {
			embed
				.setAuthor({
					iconURL: user?.profilePhoto?.url ?? DEFAULT_PFP,
					name: user.nick,
					url: user.link,
				})
				.setImage(user.profilePhoto?.url ?? DEFAULT_PFP);
		}

		await interaction.reply({
			embeds: [embed],
		});
	}
)
	.addSubcommand((command) => {
		return command
			.setName("id")
			.setDescription("Fetch profile picture for a user by id")
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
			.setDescription("Fetch profile picture for a user by nick")
			.addStringOption((option) => {
				return option
					.setName("query")
					.setDescription("The nick of the user you want to fetch")
					.setRequired(true);
			});
	});
