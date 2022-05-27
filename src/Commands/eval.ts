import type Client from "@Client";
import Command from "../Objects/Command";
import type { CommandInteraction, MessageEmbed } from "discord.js";
import { inspect } from "node:util";

export class Eval extends Command {
	constructor(client: Client) {
		super(client, "eval", "Eval command. Only can be used by the owner of the bot", {
			ownerOnly: true,
		});
		this.slash.addStringOption((option) => {
			return option
				.setName("code")
				.setDescription("The code to evaluate")
				.setRequired(true);
		});
	}

	async execute(client: Client, interaction: CommandInteraction) {
		client.logger.warn(
			`Executing eval ${interaction.user.tag} (${interaction.user.id})`
		);
		let embed: MessageEmbed;
		// Called by non-owner
		if (!(await client.isOwner(interaction.user.id))) {
			client.logger.warn(
				`EVAL called by user ${interaction.user.tag} (${interaction.user.id})`
			);
			embed = client.util.errorEmbed(
				"This command is owner only. How'd you even use this?"
			);
			await interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}
		let code = interaction.options.getString("code");
		// Code not supplied
		if (!code) {
			embed = client.util.errorEmbed("Code is a required parameter");
			client.logger.warn("Eval called without code. Code should be a required arg");
			await interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		// Remove token from code
		const regex = new RegExp(
			`${client.token}|TOKEN|process.env|client.token|child_process|regex`,
			"i"
		);
		if (regex.test(code)) {
			code = code.replace(regex, "null");
		}

		let result: string | Promise<string> | null;
		try {
			result = eval(code);
		} catch (err) {
			if (err instanceof Error) {
				result = err.message;
			}
			result = inspect(err, { depth: 0 });
		}
		if (result instanceof Promise) {
			result = await result;
		}
		if (typeof result !== "string") {
			result = inspect(result, { depth: 0 });
		}
		// remove token from output
		if (new RegExp(`${client.token!}`).test(result)) {
			client.logger.warn(
				`The BOT'S TOKEN was sent to ${interaction.user.tag} (${interaction.user.id})`
			);
		}

		let final = "```js\n" + result + "\n```";

		embed = client.util
			.embed("Eval")
			.addField("Input", "```js\n" + code.substring(0, 1012) + "\n```")
			.addField("Output", "```js\n" + result.substring(0, 1012) + "\n```");
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

export default Eval;
