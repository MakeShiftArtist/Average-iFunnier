import { Interaction, User, Client as DiscordClient, If } from "discord.js";
import Client from "../Objects/Client";

export interface ClientErrorConfig {
	message?: string;
}

/**
 * Error base for the Client
 */
export class ClientError extends Error {
	/**
	 * Config passed into the constructor
	 */
	public readonly config: ClientErrorConfig;
	/**
	 * The interaction that caused the error, if any
	 */
	public readonly interaction: Interaction;
	/**
	 * The client attatched to the error
	 */
	public readonly client: Client;
	/**
	 * The user that caused the error, if any
	 */
	public readonly user: User | null;

	constructor(
		client: Client,
		interaction: Interaction,
		config: ClientErrorConfig = {}
	) {
		const msg = config.message ?? "An unknown error occurred";
		super(msg);
		this.message = msg;
		this.config = config;
		this.interaction = interaction;
		this.client = client;
		this.user = this.interaction.user ?? null;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default ClientError;
