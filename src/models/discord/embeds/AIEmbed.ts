import { EmbedBuilder } from "discord.js";

export default class AIEmbed extends EmbedBuilder {
	/**
	 * @param data Embed data to create embed with
	 */
	constructor(data: ConstructorParameters<typeof EmbedBuilder>[0]) {
		super(data);

		if (!data?.color) this.setColor("Yellow");
		if (!data?.timestamp) this.setTimestamp(new Date());
	}
}
