import { time } from "discord.js";
import AIEmbed from "./AIEmbed";
import type { BanSmall } from "ifunny.ts";
import type { User } from "ifunny.ts";
import type AIClient from "../../client/AIClient";

export const DEFAULT_PFP = "https://i.ibb.co/6gTSDGC/Default-PFP.png";

export default class iFunnyUserEmbed extends AIEmbed {
	readonly #user: User;
	/**
	 * @param client The bot client that created this embed
	 * @param user The user to create embed with
	 */
	constructor(client: AIClient, user: User) {
		super(client, {});
		this.#user = user;
		this.setAuthor({
			name: user.nick,
			iconURL: user.profile_photo?.url ?? DEFAULT_PFP,
			url: user.link,
		});
		this.setFooter({
			text: user.id,
		});
		this.setThumbnail(user.meme_experience.badge_url);
		if (user.cover_url) this.setImage(user.cover_url);
		try {
			this.setColor(
				user.nick_color
					? `#${user.nick_color}`
					: user.profile_photo
					? `#${user.profile_photo.bg_color}`
					: user.cover_color
					? `#${user.cover_color}`
					: "#FFFFFF"
			);
		} catch (error) {
			console.log(user.toJSON());
		}

		if (user.about) this.setDescription(user.about);
		const stats =
			`Total Posts: \`${user.total_posts}\`\n` +
			`Original: \`${user.total_original_posts}\`\n` +
			`Features: \`${user.total_features}\`\n` +
			`Total Smiles: \`${user.total_smiles}\`\n` +
			`Subscribers: \`${user.total_subscribers}\`\n` +
			`Subscriptions: \`${user.total_subscriptions}\``;

		this.addFields([
			{
				name: user.meme_experience.rank,
				value:
					`Days: \`${user.meme_experience.days}\`\n` +
					`Next Milestone: \`${user.meme_experience.next_milestone}\` (\`${user.meme_experience.days_until_next_milestone}\` days left)`,
			},
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

/**
 * Converts a ban to a string
 * @param ban The ban to convert
 * @returns A string representation of the ban
 * @example
 * banString({
 * 	type: "ban",
 * 	id: "123456789",
 * 	expires_in: "1d",
 * }) => "Type: \`ban\`\nID: 123456789\nExpires: 1 day ago"
 */
function banString(ban: BanSmall): string {
	return `Type: \`${ban.type}\`\nID: ${ban.id}\nExpires: ${time(ban.expires_in, "R")}`;
}
