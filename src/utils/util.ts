import { Interaction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import ClientError from "../Errors/ClientError";
import Client from "../Objects/Client";
import { Dict } from "./types";

let instance: Utility;

export interface Duration {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

/**
 * Utility class for reducing repeated code
 */
export class Utility {
	constructor(public readonly client?: Client) {
		instance = this;
	}

	static get instance() {
		return instance;
	}

	/**
	 * Asynchronously waits
	 * @param ms Time in milliseconds to wait for
	 */
	public async sleep(ms: number): Promise<void> {
		return new Promise<void>((res) => setTimeout(res, ms));
	}

	/**
	 * Asserts a claim to be true
	 * @param claim Boolean to assert to be true
	 * @param message Message to throw if the claim is false. Default: "Assertion false"
	 */
	public assert(claim: boolean, message?: string): void {
		if (!claim) throw new Error(message ?? "Assertion false");
	}

	/**
	 * JSON.stringify but with the space set to 2 by default
	 */
	public static pretty(
		data: Dict,
		replacer: (string | number)[] | null = null,
		indent: number = 2
	) {
		return JSON.stringify(data, replacer, indent);
	}

	/**
	 * JSON.stringify but with the space set to 2 by default
	 */
	get pretty() {
		return Utility.pretty;
	}

	/**
	 * Shortcut for `new MessageEmbed()`
	 * @returns MessageEmbed object
	 */
	public static embed(title?: string): MessageEmbed {
		const embed = new MessageEmbed().setColor("YELLOW");
		if (title) embed.setTitle(title);
		return embed;
	}

	/**
	 * Shortcut for `new MessageEmbed()`
	 * @returns MessageEmbed object
	 */
	get embed() {
		return Utility.embed;
	}

	/**
	 * Shortcut for ClientError
	 */
	public get error() {
		return ClientError;
	}

	/**
	 * Standard Error Embed with red color and timestamp and author
	 * @param error The title of the error embed | The error message
	 * @returns
	 */
	public static errorEmbed(error?: string, interaction?: Interaction): MessageEmbed {
		const embed = this.embed()
			.setTitle(error ?? "An unknown error occurred")
			.setColor("RED")
			.setTimestamp();
		if (interaction) {
			const user = interaction.user;
			embed.setFooter({
				text: user.tag,
				iconURL: user.displayAvatarURL({ dynamic: true }),
			});
		}
		return embed;
	}

	public get errorEmbed() {
		return Utility.errorEmbed;
	}

	/**
	 * Shortcut for `new SlashCommandBuilder()`
	 * @returns SlashCommandBuilder
	 */
	public static slash() {
		return new SlashCommandBuilder();
	}

	/**
	 * Shortcut for `new SlashCommandBuilder()`
	 * @returns SlashCommandBuilder
	 */
	public get slash() {
		return Utility.slash;
	}

	/**
	 * Gets the duration of a timestamp in milliseconds
	 * @param time The unix time to calculate the duration of
	 */
	public static duration(time: number): Duration {
		const seconds = Math.floor((time / 1000) % 60);
		const minutes = Math.floor((time / (1000 * 60)) % 60);
		const hours = Math.floor((time / (1000 * 60 * 60)) % 60);
		const days = Math.floor((time / (1000 * 60 * 60 * 24)) % 60);
		return {
			seconds,
			minutes,
			hours,
			days,
		};
	}

	/**
	 * Gets the duration of a timestamp in milliseconds
	 */
	public get duration() {
		return Utility.duration;
	}

	public static uptime(client: Client): string {
		if (!client.isReady()) {
			throw new Error("Can't get uptime when Client is not ready");
		}
		const duration = this.duration(client.uptime);
		let uptime = "";
		if (duration.days) {
			uptime += `${duration.days} days `;
		}
		if (duration.hours) {
			uptime += `${duration.hours} hours `;
		}
		if (duration.minutes) {
			uptime += `${duration.minutes} minutes `;
		}
		if (duration.seconds) {
			uptime += `${duration.seconds} seconds `;
		}
		return uptime.trim();
	}
}

export default Utility;
