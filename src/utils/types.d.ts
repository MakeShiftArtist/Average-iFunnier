export type Dict = { [key: string]: any };

export type If<T extends boolean, A, B = null> = T extends true
	? A
	: T extends false
	? B
	: A | B;

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
