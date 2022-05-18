import {
	BitFieldResolvable,
	Client as DiscordClient,
	ClientOptions,
	Collection,
	Intents,
	IntentsString,
	MessageMentionOptions,
	Team,
	User,
} from "discord.js";
import { Utility } from "../utils/util";
import Logger from "./Logger";

import SlashCommandHandler from "./SlashCommandHandler";

interface SupportServer {
	inviteURL: string;
	guildId: string;
}

/**
 * Config for the custom Client
 */
export interface ClientConfig extends ClientOptions {
	/**
	 * Should the Client use the default settings if not provided?
	 */
	useDefaults?: boolean;
	/**
	 * Is the Client in debug mode?
	 */
	debug?: boolean;
	/**
	 * The bot's support server url
	 */
	supportServer?: SupportServer | null;
	/**
	 * The Client's application Id for slash commands
	 */
	clientId: string;
}

/**
 * Custom Discord Client
 */
export class Client extends DiscordClient {
	/**
	 * The custom handler for slash commands
	 */
	public readonly commandHandler: SlashCommandHandler;

	/**
	 * Utility class for reducing repeated code
	 */
	public readonly util: typeof Utility;

	/**
	 * The Client's application Id for slash commands
	 */
	public readonly clientId: string;

	/**
	 * The default mentions to parse if not provided
	 */
	public static readonly defaultMentions: MessageMentionOptions = {
		parse: ["users", "roles"],
		repliedUser: false,
	};

	/**
	 * Default intent to use if not provided
	 */
	public static readonly defaultIntents: BitFieldResolvable<IntentsString, number> = [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_PRESENCES,
	];

	public readonly logger: Logger;

	protected _debug: boolean;

	public supportServer: SupportServer | null;

	constructor(ClientConfig: ClientConfig) {
		if (!ClientConfig) throw new Error("ClientConfig is required");

		if (!ClientConfig?.clientId) {
			throw new Error("clientId is required. You can find this in the Dev Portal");
		}

		if (!ClientConfig.allowedMentions && !!ClientConfig.useDefaults) {
			ClientConfig.allowedMentions = Client.defaultMentions;
		}

		if (!ClientConfig.intents) {
			ClientConfig.intents = Client.defaultIntents;
		}

		super(ClientConfig);

		this.clientId = ClientConfig.clientId;

		this.supportServer = ClientConfig?.supportServer ?? null;

		this.util = Utility;

		this.commandHandler = new SlashCommandHandler(this);

		this.logger = new Logger();

		this._debug = !!ClientConfig.debug;
		if (this._debug) this.logger.enable();

		this.on("ready", async () => {
			await this.commandHandler.loadAllCommands();
			this.commandHandler.REST.setToken(this.token!);
			await this.commandHandler.registerGuildsCommands();
			await this.commandHandler.handleCommands();
			await this.commandHandler.registerGuildsCommands();
			this.logger.debug("Commands registered and listening!");
		});
	}

	/**
	 * Is the Client in Debug mode?
	 */
	public get debug() {
		return !!this._debug;
	}

	public set debug(value: boolean) {
		this._debug = !!value;
		if (this._debug) this.logger.enable();
		else this.logger.disable();
	}

	/**
	 * A logger that logs items to the console if {@link debug} is true
	 * @param args Args to pass into Logger.debug
	 */
	public log(...args: unknown[]): void {
		if (this.debug) this.logger.debug(...args);
	}

	/**
	 * Returns the Team object for this client if it exists, otherwise returns null
	 */
	public get team(): Team | null {
		const teamMembers = this.application?.owner;
		if (teamMembers instanceof Team) return teamMembers;
		else return null;
	}

	/**
	 * Gets the primary owner of this bot\
	 * If a Team owns this bot, it will return the User object of the Team owner
	 */
	public get owner(): User | null {
		const owner = this.application?.owner;
		if (owner instanceof Team) {
			return owner.owner?.user ?? null;
		} else return owner ?? null;
	}

	/**
	 * Shuts the bot down completely and destroys the Client
	 * @returns The bots token if it exists, otherwise returns null
	 */
	public async shutdown(): Promise<string | null> {
		this.destroy();
		return this.token;
	}

	/**
	 * Restarts the client by destroying it and relogging in.
	 * @returns Bot token
	 */
	public async restart(): Promise<string> {
		await this.shutdown();
		return await this.login();
	}

	/**
	 * Override to Discord.Client.login\
	 * If no token is supplied, it uses the `process.env.DISCORD_IFUNNY_TOKEN`
	 * @param token Bot token
	 * @returns Bot token
	 */
	public override async login(token?: string): Promise<string> {
		return super.login(token ?? process.env.DISCORD_TOKEN);
	}
}

export default Client;
