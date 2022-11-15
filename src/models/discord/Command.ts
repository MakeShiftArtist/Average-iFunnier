import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import AIClient from "../client/AIClient";
import AIError from "../errors/AIError";

/**
 * Callback for the execute function
 */
export type TExecuteCallback = (
	bot: AIClient,
	interaction: ChatInputCommandInteraction
) => Promise<void>;

/**
 * Callback for the autocomplete function
 */
export type TAutocompleteCallback = (
	bot: AIClient,
	interaction: AutocompleteInteraction
) => Promise<void>;

export interface ICommandConfig {
	name: string;
	description: string;
	category: TCommandCategory;
}

export enum ECommandCategory {
	GENERAL = "general",
	IFUNNY = "ifunny",
}

export type TCommandCategory = `${ECommandCategory}`;

/**
 * Represents a command instance
 * @extends SlashCommandBuilder
 */
export default class Command extends SlashCommandBuilder {
	readonly #execute_callback: TExecuteCallback;
	readonly #autocomplete_callback: TAutocompleteCallback;
	readonly #category: TCommandCategory;

	/**
	 * @param config.name Name of the command
	 * @param config.description Description of the command
	 * @param config.category Category of the command
	 * @param execute Execute callback for the command
	 */
	constructor(
		config: ICommandConfig,
		execute: TExecuteCallback,
		autocomplete?: TAutocompleteCallback
	) {
		if (!config.name) {
			throw new AIError("invalid_command", "name is a required argument");
		}
		if (!config.description) {
			throw new AIError("invalid_command", "description is a required argument");
		}

		super();
		this.#category = config.category ?? "general";
		this.setName(config.name).setDescription(config.description);
		this.#execute_callback = execute;
		this.#autocomplete_callback = autocomplete ??= (_bot, interaction) => interaction.respond([]);
	}

	/**
	 * The category of the command
	 */
	get category(): TCommandCategory {
		return this.#category;
	}

	/**
	 * Execute function for when a command is called
	 * @param bot Average iFunnier instance
	 * @param interaction Command interaction
	 */
	async execute(bot: AIClient, interaction: ChatInputCommandInteraction) {
		return await this.#execute_callback(bot, interaction);
	}

	/**
	 * Autocomplete callback for autocomplete options
	 * @param bot Bot instance for the
	 * @param interaction Autocomplete interaction
	 */
	async autocomplete(bot: AIClient, interaction: AutocompleteInteraction) {
		return await this.#autocomplete_callback(bot, interaction);
	}

	/**
	 * Check if a value is a Command instance
	 * @param command Command to check
	 * @returns command instanceof Command
	 */
	static isCommand(command: any): command is Command {
		return command instanceof Command;
	}
}
