import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Methods from "./methods";
import Errors from "./errors";

export type Dict = { [key: string]: any };

/**
 * Cooldown object for storing cooldowns
 */
export interface Cooldown {
	/**
	 * Id of the cooldown type
	 */
	id: number;
	/**
	 * The command that is on cooldown
	 */
	command: string;
	/**
	 * The type of the cooldown
	 */
	type: "USER" | "CHANNEL" | "GUILD";
	/**
	 * How long (in ms) the cooldown lasts
	 */
	length: number;
}

/**
 * Utility class for reducing repeated code
 */
export class Utility {
	/**
	 * All methods in the methods file
	 */
	public static readonly Methods = Methods;

	/**
	 * All errors in the errors file
	 */
	public static readonly Errors = Errors;

	/**
	 * Shortcut for `new MessageEmbed()`
	 * @returns MessageEmbed object
	 */
	public static embed(): MessageEmbed {
		return new MessageEmbed();
	}

	/**
	 * Standard Error Embed with red color and timestamp
	 * @param title The title of the embed. Default: "An unknown error occured"
	 * @returns
	 */
	public static errorEmbed(title?: string): MessageEmbed {
		return this.embed()
			.setTitle(title ?? "An unknown error occurred")
			.setColor("RED")
			.setTimestamp();
	}

	/**
	 * Shortcut for `new SlashCommandBuilder()`
	 * @returns SlashCommandBuilder
	 */
	public static slash() {
		return new SlashCommandBuilder();
	}
}

export default Utility;
