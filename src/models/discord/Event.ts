import AIClient from "../client/AIClient";
import { ClientEvents } from "discord.js";

export type TEventCallback<K extends keyof ClientEvents> = (
	bot: AIClient,
	...args: ClientEvents[K]
) => Promise<void>;

/**
 * Represents a Discord Event
 */
export default class DiscordEvent<Name extends keyof ClientEvents = keyof ClientEvents> {
	readonly #name: Name;
	readonly #callback: TEventCallback<Name>;
	public once: boolean;

	/**
	 * @param name Name of the event
	 * @param callback Callback to fire when event is emitted
	 * @param once Should the event only execute once? (Default: `false`)
	 */
	constructor(name: Name, callback: TEventCallback<Name>, once: boolean = false) {
		this.#name = name;
		this.once = once;
		this.#callback = callback;
	}

	/**
	 * Name of the event
	 */
	get name(): Name {
		return this.#name;
	}

	/**
	 * Execute the callback for the event
	 * @param bot Average iFunnier instance
	 */
	async execute(...bot: Parameters<TEventCallback<Name>>) {
		return this.#callback(...bot);
	}

	/**
	 * Type guard a value to be a DiscordEvent
	 * @param event Value to check
	 * @returns event instanceof DiscordEvent
	 */
	static isEvent(event: any): event is DiscordEvent {
		return event instanceof DiscordEvent;
	}
}
