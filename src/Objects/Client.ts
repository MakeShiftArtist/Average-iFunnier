import {
	BitFieldResolvable,
	Client as DiscordClient,
	ClientOptions,
	Intents,
	IntentsString,
	MessageMentionOptions,
	User,
} from "discord.js";
import { Utility } from "../utils/util";
import Logger from "./Logger";

import SlashCommandHandler from "../Handlers/SlashCommandHandler";

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
export class Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
	/**
	 * The custom handler for slash commands
	 */
	public readonly commandHandler: SlashCommandHandler;

	/**
	 * Utility class for reducing repeated code
	 */
	public readonly util: Utility;

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

	/**
	 * The custom logger
	 */
	public readonly logger: Logger;

	protected _debug: boolean;

	/**
	 * Invite url for the support server
	 */
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

		this.util = new Utility(this);

		this.commandHandler = new SlashCommandHandler(this);

		this.logger = new Logger();

		this._debug = !!ClientConfig.debug;
		if (this._debug) this.logger.enable();

		this.on("ready", async (client) => {
			this.logger.info(`Client ready on ${client.user.tag} (${client.user.id})`);
			await this.commandHandler.loadAllCommands();
			this.commandHandler.REST.setToken(this.token!);
			await this.commandHandler.registerGuildsCommands();
			await this.commandHandler.registerGlobalCommands();
			await this.commandHandler.handleCommands();
			this.logger.info("Commands registered and listening!");
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
	 * Gets the primary owner of this bot\
	 * If a Team owns this bot, it will return the User object of the Team owner
	 */
	public async owner(): Promise<User | null> {
		return await this.users.fetch(process.env.OWNER_ID!);
	}

	/**
	 * Checks if a user is the owner of this bot.
	 * @param user User to check
	 * @returns boolean
	 */
	public async isOwner(user: User | string | number) {
		let id: string;
		if (user instanceof User) {
			id = user.id;
		} else if (typeof user === "number") {
			id = user.toString();
		} else if (typeof user === "string") {
			id = user;
		} else {
			return null;
		}
		return id === process.env.OWNER_ID;
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
