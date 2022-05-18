import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import path from "node:path";
import type Client from "./Client";
import fs from "node:fs";
import { Collection } from "discord.js";
import { Cooldown } from "../utils/util";
import { Command } from "./Command";

/**
 * The path to the Commands folder
 */
const COMMANDS_PATH = path.join(path.dirname(__dirname), "Commands");

/**
 * Handler for slash commands to automate the process.
 */
export class SlashCommandHandler {
	public readonly REST: REST;
	/**
	 * The Command Collection
	 */
	public readonly commands = new Collection<string, Command>();

	/**
	 * The Client attached to the Handler
	 */
	public readonly client: Client;

	/**
	 * Cooldowns for commands
	 */
	public readonly cooldowns = new Collection<string, Cooldown>();

	constructor(client: Client) {
		this.client = client;

		this.REST = new REST({ version: "9" });

		if (this.client.token) this.REST.setToken(this.client.token);
	}

	get commandsArray() {
		return Array.from(this.commands.values());
	}

	get guildCommands() {
		return this.commandsArray.filter((cmd) => cmd.supportOnly);
	}

	get globalCommands() {
		return this.commandsArray.filter((cmd) => !cmd.supportOnly);
	}

	/**
	 * Gets a command by name of the command
	 * @param name Name of the command to find
	 * @returns The command object
	 */
	get(name: string) {
		const cmd = this.commands.get(name);
		return cmd || null;
	}

	/**
	 * Converts the commands to an array for REST operations
	 * @returns An array of command objects
	 */
	toArray() {
		return Array.from(this.commands.map((cmd) => cmd.toJSON()));
	}

	/**
	 * Loads all commands from the commands folder into the client.
	 */
	async loadAllCommands() {
		try {
			const commandFiles = fs
				.readdirSync(COMMANDS_PATH)
				.filter((file) => file.endsWith(".ts"));
			for (const file of commandFiles) {
				this.loadCommand(file);
			}
		} catch (error) {
			this.client.log("Error in loading all commands", error);
		}
	}

	/**
	 * Unloads all commands from the client.
	 */
	async unloadAllCommands() {
		this.commands.clear();
	}

	/**
	 * Unloads a command from the Client. Useful when updating the execute function.
	 * @param name Name of the command to unload
	 */
	async unloadCommand(name: string): Promise<this> {
		this.commands.filter(
			(command) => command.name.toLowerCase() !== name.toLowerCase()
		);
		return this;
	}

	/**
	 * Loads a command into the client's command collection
	 * @param name Name of the command
	 */
	async loadCommand(name: string) {
		try {
			const command: Command = (await import(`${COMMANDS_PATH}/${name}`)).default;

			this.client.log("Command loaded", command.slash);
			this.commands.set(command.name, command);
			this.client.log(`Command set ${command.name}`);
			return command;
		} catch (error) {
			this.client.log("Error loading command in loadCommand");
			if (!(error instanceof Error)) throw error;

			if (error.message.startsWith("Cannot find module")) {
				throw new Error(
					`Command ${name} does not exist, ${COMMANDS_PATH}/${name}`
				);
			} else throw error;
		}
	}

	/**
	 * Reloads a command into the client's command collection'
	 * @param name Name of the command
	 */
	async reloadCommand(name: string) {
		await this.unloadCommand(name);
		await this.loadCommand(name);
	}

	/**
	 * Sets the Client's bot token for slash commands
	 * @param token
	 */
	async setToken(token?: string) {
		this.REST.setToken(token ?? this.client.token!);
	}

	/**
	 * Registers all global slash commands
	 */
	async registerGuildsCommands() {
		if (this.client.supportServer) {
			const guildCommands = this.guildCommands.map((cmd) => cmd.toJSON());
			this.client.log(guildCommands);
			const resp = await this.REST.put(
				Routes.applicationGuildCommands(
					this.client.clientId,
					this.client.supportServer.guildId
				),
				{
					body: guildCommands,
				}
			);
			this.client.log(resp);
			this.client.log("Successfully registered guild commands");
		} else
			this.client.logger.warn(
				"Couldn't register guilds commands because the server is not set'"
			);
	}

	async registerGlobalCommands() {
		const globalCommands = this.globalCommands.map((cmd) => cmd.toJSON());

		await this.REST.put(Routes.applicationCommands(this.client.clientId), {
			body: globalCommands,
		});
	}

	/**
	 * Handles the commands for registered commands
	 */
	async handleCommands() {
		this.client.on("interactionCreate", async (interaction) => {
			if (interaction.isCommand()) {
				return this.get(interaction.commandName)!.execute(
					interaction,
					this.client
				);
			}
		});
	}
}

export default SlashCommandHandler;
