import { CommandInteraction, Permissions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Utility from "../utils/util";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import Client from "./Client";

export interface CommandConfig {
	description?: string | null;
	category?: string | null;
	adminsOnly?: boolean;
	devOnly?: boolean;
	supportOnly?: boolean;
	ownerOnly?: boolean;
	hasCooldown?: boolean;
	cooldownDuration?: number;
	hidden?: boolean;
	disabled?: boolean;
	memberPerms?: Permissions;
	botPerms?: Permissions;
}

export type CommandCallback = (
	interaction: CommandInteraction,
	client: Client
) => Promise<void> | void;

/**
 * Represents a Command for the bot
 */
export class Command {
	/**
	 * The name of the command. Required on initialization
	 */
	public readonly name: string;
	/**
	 * Command description
	 */
	public readonly description: string;
	/**
	 * What category does the command belong to?
	 */
	public readonly category: string | null;
	/**
	 * Is the command for the support server only?
	 */
	public readonly supportOnly: boolean;
	/**
	 * Is the command for developers only?
	 */
	public readonly devOnly: boolean;
	/**
	 * Is the command for the Bot Owner only
	 */
	public readonly ownerOnly: boolean;
	/**
	 * Is the command for Admins only?
	 */
	public readonly adminsOnly: boolean;
	/**
	 * Does the command have a cooldown?
	 */
	public readonly hasCooldown: boolean;
	/**
	 * How long is the command cooldown?
	 */
	public readonly cooldownDuration: number;
	/**
	 * Should the command be hidden from the help menu?
	 */
	public hidden: boolean;
	/**
	 * Is the command disabled? Won't run
	 */
	public disabled: boolean;
	/**
	 * What permissions does the member need to run this command?
	 */
	public readonly memberPerms: Permissions;
	/**
	 * What permissions does the bot need to run this command?
	 */
	public readonly botPerms: Permissions;

	protected _slash_command: SlashCommandBuilder | null;

	protected _callback: CommandCallback;

	constructor(
		name: string,
		description: string,
		callback: CommandCallback,
		config?: CommandConfig
	) {
		if (!name) throw new Error("Command initialized without a name");
		this.name = name;
		if (!description) throw new Error("Command initialized without a description");
		this.description = description;
		this._callback = callback;
		this.category = config?.category ?? null;
		this.adminsOnly = config?.adminsOnly ?? false;
		this.devOnly = config?.devOnly ?? false;
		this.ownerOnly = config?.ownerOnly ?? false;
		this.supportOnly = config?.supportOnly ?? (this.ownerOnly || this.devOnly);
		this.hasCooldown = config?.hasCooldown ?? false;
		this.cooldownDuration = config?.cooldownDuration ?? 0;
		this.hidden = config?.hidden ?? this.devOnly;
		this.disabled = config?.disabled ?? false;
		this.memberPerms = config?.memberPerms ?? new Permissions(Permissions.DEFAULT);
		if (this.adminsOnly) this.memberPerms.add(Permissions.FLAGS.ADMINISTRATOR);
		this.botPerms = config?.botPerms ?? new Permissions(Permissions.DEFAULT);

		this._slash_command = null;
	}

	/**
	 * Gets the slash command builder for this command
	 */
	get slash(): SlashCommandBuilder {
		return this._slash_command ?? this.build();
	}

	/**
	 * Shortcut for `this.slash.options`
	 */
	get options() {
		return this.slash.options;
	}

	/**
	 * Builds the command as a slash command object
	 */
	build(): SlashCommandBuilder {
		const slash = Utility.slash().setName(this.name).setDescription(this.description);
		this._slash_command = slash;
		return slash;
	}

	toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		return this.slash.toJSON() as RESTPostAPIApplicationCommandsJSONBody;
	}

	async execute(interaction: CommandInteraction, client: Client) {
		return await this._callback(interaction, client);
	}
}

export default Command;
