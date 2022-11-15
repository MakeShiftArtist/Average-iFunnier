import { EmbedBuilder } from "discord.js";
import AIEmbed from "./embeds/AIEmbed";
import ErrorEmbed from "./embeds/ErrorEmbed";
import iFunnyUserEmbed from "./embeds/iFunnyUserEmbed";

/**
 * Provides easy embed access
 */
export default class EmbedHandler {
	/**
	 * Standard AI Embed
	 * @alias default
	 */
	static embed = AIEmbed;
	/**
	 * Standard AI Embed
	 * @alias embed
	 */
	static default = EmbedHandler.embed;
	/**
	 * Error Embed
	 */
	static error = ErrorEmbed;
	/**
	 * iFunny User Embed
	 */
	static iFunnyUser = iFunnyUserEmbed;
	/**
	 * Short cut for Discord.EmbedBuilder
	 */
	static custom = EmbedBuilder;
}
