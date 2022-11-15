/**
 * Represents an error thrown by the Bot
 * @extends Error
 */
export default class AIError extends Error {
	readonly #code: string;
	/**
	 * @param code Error code
	 * @param message Message for the error with additional information
	 */
	constructor(code: string, message: string) {
		super(message);
		this.#code = code;
	}

	/**
	 * Error code
	 */
	get code() {
		return this.#code;
	}

	override get name() {
		return `${this.constructor.name} - ${this.#code}`;
	}
}
