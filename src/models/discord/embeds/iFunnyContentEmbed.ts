import { DEFAULT_PFP } from "./iFunnyUserEmbed";
import AIEmbed from "./AIEmbed";
import type { Content } from "ifunny.ts";
import type AIClient from "../../client/AIClient";

export default class iFunnyContentEmbed extends AIEmbed {
	#content: Content;
	constructor(client: AIClient, content: Content) {
		super(client, {});
		this.#content = content;

		this.setImage(content.thumbnail.x640_url)
			.setTitle(content.fixed_title)
			.setFooter({ text: "Created at" })
			.setTimestamp(content.created_at);

		this.setAuthor({
			name: content.author?.nick ?? "Unregistered User",
			iconURL: content.author?.photo?.url ?? DEFAULT_PFP,
			url: content.link,
		});
	}

	get content() {
		return this.#content;
	}
}
