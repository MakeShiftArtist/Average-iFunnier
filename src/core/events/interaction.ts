import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import AIClient from "../../models/client/AIClient";
import DiscordEvent from "../../models/discord/Event";
import AIError from "../../models/errors/AIError";

// TODO: Check if the command is valid ONCE instead of for each interaction type

export default new DiscordEvent("interactionCreate", async (bot, interaction) => {
	if (interaction.isChatInputCommand()) {
		return chatInputCommand(bot, interaction);
	} else if (interaction.isAutocomplete()) {
		return autocomplete(bot, interaction);
	}
	bot.emit(
		"error",
		new AIError("unknown_interaction", interaction.type.toString()),
		interaction
	);
});

async function chatInputCommand(bot: AIClient, interaction: ChatInputCommandInteraction) {
	const command = bot.commands.get(interaction.commandName);
	if (!command) {
		bot.emit(
			"error",
			new AIError(
				"invalid_command",
				`Couldn't find command with name: ${interaction.commandName}`
			),
			interaction
		);
		return;
	}

	command.execute(bot, interaction);
}

async function autocomplete(bot: AIClient, interaction: AutocompleteInteraction) {
	const command = bot.commands.get(interaction.commandName);
	if (!command) {
		bot.emit(
			"error",
			new AIError(
				"invalid_command",
				`Couldn't find command with name: ${interaction.commandName}`
			),
			interaction
		);
		return;
	}
	command.autocomplete(bot, interaction);
}
