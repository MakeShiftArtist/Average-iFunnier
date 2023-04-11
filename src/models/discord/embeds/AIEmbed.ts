import { EmbedBuilder } from "discord.js";
import type AIClient from "../../client/AIClient";

/**
 * AIEmbed class for embeds created by the bot
 * @extends EmbedBuilder
 *
 * @example
 * ```ts
 * const embed = new AIEmbed(client, {
 * 	title: "This is a title",
 * 	description: "This is a description",
 * 	color: "Red",
 * });
 * await interaction.reply({ embeds: [embed] });
 * ```
 */
export default class AIEmbed extends EmbedBuilder {
	#client: AIClient;
	/**
	 * Creates an AIEmbed
	 * @param client The bot client that created this embed
	 * @param data Embed data to create embed with
	 */
	constructor(client: AIClient, data?: ConstructorParameters<typeof EmbedBuilder>[0]) {
		super(data ?? {});
		this.#client = client;

		if (!data?.color) this.setColor("Yellow");
		if (!data?.timestamp) this.setTimestamp(new Date());
	}

	/**
	 * The bot client that created this embed
	 */
	get client(): AIClient {
		return this.#client;
	}
}
