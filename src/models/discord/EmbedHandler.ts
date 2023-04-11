import { EmbedBuilder } from "discord.js";
import AIEmbed from "./embeds/AIEmbed";
import ErrorEmbed from "./embeds/ErrorEmbed";
import iFunnyContentEmbed from "./embeds/iFunnyContentEmbed";
import iFunnyUserEmbed from "./embeds/iFunnyUserEmbed";

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
	 * Creates an embed for errors
	 */
	static error = ErrorEmbed;
	/**
	 * Creates an embed for iFunny Users
	 */
	static iFunnyUser = iFunnyUserEmbed;
	/**
	 * Creates an embed for iFunny Content
	 */
	static iFunnyContent = iFunnyContentEmbed;
	/**
	 * Shortcut to custom embeds with 0 default values
	 */
	static custom = EmbedBuilder;
}
