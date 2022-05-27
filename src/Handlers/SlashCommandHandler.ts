import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import path from "node:path";
import type Client from "../Objects/Client";
import fs from "node:fs";
import { Collection, CommandInteraction, Interaction } from "discord.js";
import { Cooldown } from "../utils/types";
import Command from "@Command";
import ClientError from "../Errors/ClientError";

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

	get allCommands() {
		return Array.from(this.commands.values());
	}

	get guildCommands() {
		return this.allCommands.filter(
			(cmd) => cmd.supportOnly || cmd.devOnly || cmd.ownerOnly
		);
	}

	get globalCommands() {
		return this.allCommands.filter((cmd) => !cmd.supportOnly);
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
			//this.client.logger.debug("commandFiles", commandFiles);
			for (let file of commandFiles) {
				//this.client.logger.debug("filename", file);
				await this.loadCommand(file);
			}
		} catch (error) {
			this.client.logger.error("Error in loading all commands", error);
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
			let cmd: new () => Command = require(`${COMMANDS_PATH}\\${name}`).default;
			const command = new cmd();
			//this.client.logger.info("Command loaded", command.name);
			this.commands.set(command.name, command);

			return command;
		} catch (error) {
			this.client.logger.error(`Error loading command (${name}) in loadCommand`);
			if (!(error instanceof Error)) throw error;

			if (error.message.startsWith("Cannot find module")) {
				throw error;
				/* throw new Error(
					`Command ${name} does not exist, ${COMMANDS_PATH}/${name}`
				); */
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
			const guildCommands = this.allCommands.map((cmd) => cmd.toJSON());
			//this.client.logger.info("Guild commands", guildCommands);
			await this.REST.put(
				Routes.applicationGuildCommands(
					this.client.clientId,
					this.client.supportServer.guildId
				),
				{
					body: guildCommands,
				}
			);

			this.client.logger.info("Successfully registered guild commands");
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
		this.client.logger.info("Successfully registered global commands");
	}

	/**
	 * Handles the commands for registered commands
	 */
	async handleCommands() {
		this.client.on("interactionCreate", async (interaction) => {
			//this.client.logger.debug("interaction created");
			if (!interaction.isCommand()) return;

			const command = this.get(interaction.commandName);
			if (!command) {
				this.client.logger.error(
					`${interaction.commandName} does not exist. but was called`,
					interaction
				);
				return;
			}
			if (
				command.ownerOnly &&
				interaction.user.id !== (await this.client.owner())?.id
			) {
				this.client.logger.debug(`${await this.client.owner()}`);
				const embed = this.client.util.errorEmbed(
					"You must be a bot owner to use this command"
				);
				await interaction.reply({
					embeds: [embed],
				});
				return;
			}
			await command.execute(this.client, interaction);
		});
	}

	async checkPermissions(interaction: CommandInteraction, command: Command) {
		if (
			command.ownerOnly &&
			interaction.user.id !== (await this.client.owner())?.id
		) {
			const error = new ClientError(this.client, interaction, {
				message: "You must be a bot owner to use this command",
			});
			const embed = this.client.util
				.errorEmbed(error.message)
				.setDescription("You must be the owner of this bot to use this command");

			await interaction.reply({
				embeds: [embed],
			});
			return false;
		}
	}
}

export default SlashCommandHandler;
