import { EmbedBuilder } from "discord.js";
import AIEmbed from "./embeds/AIEmbed";
import ErrorEmbed from "./embeds/ErrorEmbed";
import iFunnyContentEmbed from "./embeds/iFunnyContentEmbed";
import iFunnyUserEmbed from "./embeds/iFunnyUserEmbed";
import AboutEmbed from "./embeds/AboutEmbed";

/**
 * A utility class for building and handling Discord embeds
 */
export default class EmbedHandler {
	/**
	 * Creates an embed with some default values
	 * @alias default
	 */
	static embed = AIEmbed;
	/**
	 * Creates an embed with some default values
	 * @alias embed
	 */
	static default = EmbedHandler.embed;
	/**
	 * Default error embed
	 */
	static Error = ErrorEmbed;

	/**
	 * Namespace for iFunny-related embeds
	 */
	static iFunny = {
		/**
		 * Creates an embed for iFunny Users
		 */
		User: iFunnyUserEmbed,
		/**
		 * Creates an embed for iFunny Content
		 */
		Content: iFunnyContentEmbed,
	};

	/**
	 * Namespace for general embeds
	 */
	static General = {
		/**
		 * Creates an embed for the About page command
		 */
		About: AboutEmbed,
	};

	/**
	 * Namespace for custom embeds
	 */
	static Custom = {
		/**
		 * Shortcut to custom embeds with 0 default values
		 */
		create: EmbedBuilder,
	};
}
