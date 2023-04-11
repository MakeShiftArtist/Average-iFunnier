import AIEmbed from "./AIEmbed";
import type AIClient from "../../client/AIClient";
import type AIError from "../../errors/AIError";

/**
 * Represents an Error embed to send to discord
 * @extends AIEmbed
 */
export default class ErrorEmbed extends AIEmbed {
	/**
	 * @param error The error to
	 */
	constructor(client: AIClient, error: AIError) {
		super(client, {});
		this.setColor("Red").setTitle(error.code).setDescription(error.message);
	}
}
