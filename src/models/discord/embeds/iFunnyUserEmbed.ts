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
			iconURL: user.profilePhoto?.url ?? DEFAULT_PFP,
			url: user.link,
		});
		this.setFooter({
			text: user.id,
		});
		this.setThumbnail(user.memeExperience.badgeUrl);
		if (user.coverUrl) this.setImage(user.coverUrl);
		try {
			this.setColor(
				user.nickColor
					? `#${user.nickColor}`
					: user.profilePhoto
					? `#${user.profilePhoto.bg_color}`
					: user.coverColor
					? `#${user.coverColor}`
					: "#FFFFFF"
			);
		} catch (error) {
			console.log(user.toJSON());
		}

		if (user.about) this.setDescription(user.about);
		const stats =
			`Total Posts: \`${user.totalPosts}\`\n` +
			`Original: \`${user.totalOriginalPosts}\`\n` +
			`Features: \`${user.totalFeatures}\`\n` +
			`Total Smiles: \`${user.totalSmiles}\`\n` +
			`Subscribers: \`${user.totalSubscribers}\`\n` +
			`Subscriptions: \`${user.totalSubscriptions}\``;

		this.addFields([
			{
				name: user.memeExperience.rank,
				value:
					`Days: \`${user.memeExperience.days}\`\n` +
					`Next Milestone: \`${user.memeExperience.nextMilestone}\` (\`${user.memeExperience.daysUntilNextMilestone}\` days left)`,
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
	return `Type: \`${ban.type}\`\nID: ${ban.id}\nExpires: ${time(ban.expiresIn, "R")}`;
}
