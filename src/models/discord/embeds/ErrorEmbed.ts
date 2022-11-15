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
	constructor(error: AIError) {
		super({});
		this.setColor("Red").setTitle(error.code).setDescription(error.message);
	}
}
