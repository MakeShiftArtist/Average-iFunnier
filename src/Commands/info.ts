import Command from "../Objects/Command";
import type { CommandInteraction, MessageEmbed } from "discord.js";
import type Client from "../Objects/Client";
import data from "../../package.json";
import Utility from "../utils/util";

const DISCORD_VERSION = data.dependencies["discord.js"].slice(1);
const BOT_VERSION = data.version;

async function botInfo(client: Client<true>, interaction: CommandInteraction) {
	const uptime = Utility.uptime(client);

	const embed = client.util
		.embed(`${client.user.tag}`)
		.setDescription(data.description)
		.addField(
			"Versions",
			`**Bot:** \`${BOT_VERSION}\`\n**Discord.js:** \`${DISCORD_VERSION}\``
		)
		.addField("Uptime", `${uptime}`);
	await interaction.reply({ embeds: [embed] });
}

async function userInfo(client: Client<true>, interaction: CommandInteraction) {
	const user = interaction.options.getUser("user");
	const embed = client.util
		.embed("info user command")
		.setDescription(user?.tag ?? interaction.user.tag);
	await interaction.reply({ embeds: [embed] });
}

async function serverInfo(client: Client<true>, interaction: CommandInteraction) {
	let embed: MessageEmbed;
	if (!interaction.inGuild()) {
		embed = client.util.errorEmbed("This is not a guild");
	} else {
		const guild = interaction.guild!;
		embed = client.util
			.embed(guild!.name)
			.addField("Members", guild.memberCount.toString())
			.addField("Roles", (await guild.roles.fetch()).size.toString());
	}

	await interaction.reply({ embeds: [embed] });
}

export class Info extends Command {
	constructor(client: Client) {
		super(client, "info", "Info about a the bot, a user, or the server");
		this.slash
			.addSubcommand((subcmd) => {
				return subcmd
					.setName("bot")
					.setDescription("Returns information about the bot");
			})
			.addSubcommand((subcmd) => {
				return subcmd
					.setName("server")
					.setDescription("Returns information about a the SupportServer");
			})
			.addSubcommand((subcmd) => {
				return subcmd
					.setName("user")
					.setDescription("Returns information about a user")
					.addUserOption((option) => {
						return option
							.setName("user")
							.setDescription("The user to get info about. Default: You");
					});
			});
	}

	async execute(client: Client, interaction: CommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "server":
				await serverInfo(client, interaction);
				break;
			case "user":
				await userInfo(client, interaction);
				break;
			case "bot":
			default:
				await botInfo(client, interaction);
				break;
		}
	}
}

export default Info;
