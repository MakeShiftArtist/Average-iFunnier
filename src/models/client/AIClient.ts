import { Client as Discord, Collection, IntentsBitField, Interaction } from "discord.js";
import { Client as iFunny } from "ifunny.ts";
import { EventEmitter as EventEmitter3 } from "eventemitter3";
import { readdir } from "fs/promises";
import { REST, Routes } from "discord.js";
import AIError from "../errors/AIError";
import Blacklist from "./Blacklist";
import Command from "../discord/Command";
import DiscordEvent from "../discord/Event";
import EmbedHandler from "../discord/EmbedHandler";
import ErrorEmbed from "../discord/embeds/ErrorEmbed";
import Logger from "./Logger";
import type winston from "winston";

export interface AIClientConfig {
	discord_token: string;
	discord_guild?: string;
	ifunny_bearer: string;
	ifunny_basic: string;
}

export interface AIClientEvents {
	ready: (client: AIClient) => Promise<void>;
	commandsLoaded: (client: AIClient) => Promise<void>;
	eventsLoaded: (client: AIClient) => Promise<void>;
	error: (error: AIError, interaction: Interaction) => Promise<void>;
}

/**
 * The main bot instance that interacts with both discord and iFunny
 * @extends EventEmitter3
 */
export default class AIClient extends EventEmitter3<AIClientEvents> {
	readonly #discord: Discord;
	readonly #ifunny: iFunny;
	readonly #discord_token: string;

	readonly #logger = Logger;

	readonly #blacklist: Blacklist;

	readonly #commands = new Collection<string, Command>();

	readonly #events = new Collection<string, DiscordEvent>();

	readonly #config: AIClientConfig;

	constructor(config: AIClientConfig) {
		super();

		this.#config = config;

		this.#blacklist = new Blacklist();
		this.#discord_token = config.discord_token;
		this.#discord = new Discord({
			intents: IntentsBitField.Flags.Guilds,
		});
		this.#ifunny = new iFunny({
			basic: config.ifunny_basic,
			bearer: config.ifunny_bearer,
		});

		this.on("error", async (error, interaction) => {
			if (interaction.isRepliable()) {
				interaction.reply({
					ephemeral: true,
					embeds: [new ErrorEmbed(this, error)],
				});
			}

			this.logger.error(`${error.name}: ${error.message}`);
		});
	}

	get config() {
		return this.#config;
	}

	/**
	 * Collection of commands indexed by their name
	 */
	get commands(): Collection<string, Command> {
		return this.#commands;
	}

	/**
	 * Collection of events indexed by their name
	 */
	get events(): Collection<string, DiscordEvent> {
		return this.#events;
	}

	/**
	 * Discord.js Client
	 */
	get discord(): Discord {
		return this.#discord;
	}

	/**
	 * iFunny.ts Client
	 */
	get ifunny(): iFunny {
		return this.#ifunny;
	}

	/**
	 * Collection of blacklisted users
	 */
	get blacklist(): Blacklist {
		return this.#blacklist;
	}

	/**
	 * Winston Logger instance
	 */
	get logger(): winston.Logger {
		return this.#logger;
	}

	/**
	 * Shortcut for commonly used embeds
	 */
	get embeds(): typeof EmbedHandler {
		return EmbedHandler;
	}

	/**
	 * Start the bot
	 */
	public async start(): Promise<this> {
		await this.load_commands();
		await this.load_events();
		await this.#discord.login(this.#discord_token);
		await this.#ifunny.login(); // verifies the client's token is valid
		this.emit("ready", this);
		return this;
	}

	/**
	 * Load command files for the Client
	 */
	public async load_commands(): Promise<this> {
		for (const category of await readdir("./src/core/commands")) {
			for (const commandFile of await readdir(`./src/core/commands/${category}`)) {
				const command: { default: Command } = (
					await import(`../../core/commands/${category}/${commandFile}`)
				).default;

				if (!Command.isCommand(command)) {
					throw new TypeError(
						`Error registering commands. Expected: Command | Actual: ${command}`
					);
				}
				this.commands.set(command.name, command);
				this.logger.info(`Loaded command: ${category}/${command.name}`);
			}
		}
		this.emit("commandsLoaded", this);
		return this;
	}

	/**
	 * Load events into the Client
	 */
	public async load_events(): Promise<this> {
		for (const file of await readdir("./src/core/events/")) {
			const event = await require(`../../core/events/${file}`).default;
			if (!DiscordEvent.isEvent(event)) {
				throw new TypeError(
					`Error registering events. Expected: DiscordEvent | Actual: ${event}`
				);
			}
			this.events.set(event.name, event);
			if (event.once) {
				this.discord.once(event.name, (...args) => event.execute(this, ...args));
			} else {
				this.discord.on(event.name, (...args) => {
					event.execute(this, ...args);
				});
			}
			this.logger.info(`Registered Event: ${event.name}`);
		}
		this.emit("eventsLoaded", this);
		return this;
	}

	public async register_commands(): Promise<this> {
		if (!this.discord.isReady() || !this.discord.application) {
			throw new AIError(
				"invalid_client",
				"Client attempted to register commands before being ready"
			);
		}

		const rest = new REST({
			version: "10",
		}).setToken(this.config.discord_token);

		this.logger.info("Registering commands via REST...");

		await rest.put(Routes.applicationCommands(this.discord.application.id), {
			body: this.commands.clone().map((command) => command.toJSON()),
		});

		return this;
	}
}
