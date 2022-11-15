import { BanSmall } from "ifunny.ts";
import { User } from "ifunny.ts";
import AIEmbed from "./AIEmbed";
import { time } from "discord.js";

export default class iFunnyUserEmbed extends AIEmbed {
	readonly #user: User;
	constructor(user: User) {
		super({});
		this.#user = user;
		this.setAuthor({
			name: user.nick,
			iconURL: user.profile_photo?.url,
			url: user.link,
		});
		this.setFooter({
			text: user.id,
		});
		this.setThumbnail(user.profile_photo?.url ?? null);
		if (user.cover_url) this.setImage(user.cover_url);
		this.setColor(user.nick_color ? `#${user.nick_color}` : "#FFFFFF");

		this.setDescription(user.about);
		const stats =
			`Total Posts: \`${user.total_posts}\`\n` +
			`Original: \`${user.total_original_posts}\`\n` +
			`Features: \`${user.total_features}\`\n` +
			`Total Smiles: \`${user.total_smiles}\`\n` +
			`Subscribers: \`${user.total_subscribers}\`\n` +
			`Subscriptions: \`${user.total_subscriptions}\``;

		this.addFields([
			{
				name: "Stats",
				value: stats,
			},
		]);
		if (user.bans.length > 0) {
			this.addFields([
				{
					name: "Bans",
					value: user.bans.map((ban) => banString(ban)).join("\n"),
				},
			]);
		}
	}

	get user() {
		return this.#user;
	}
}

function banString(ban: BanSmall): string {
	return `Type: \`${ban.type}\`\nID: ${ban.id}\nExpires: ${time(ban.expires_in, "R")}`;
}
