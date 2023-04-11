import AIClient from "../../client/AIClient";
import AIError from "../../errors/AIError";
import AIEmbed from "./AIEmbed";

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
