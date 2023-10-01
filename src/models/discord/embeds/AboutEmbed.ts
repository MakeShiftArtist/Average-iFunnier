import AIClient from "../../client/AIClient";
import AIEmbed from "./AIEmbed";
import packageJson from "../../../../package.json";

const description = `Thank you for taking the time to check out this bot! This bot is free to use, and is not affiliated with iFunny.,
`;

export default class AboutEmbed extends AIEmbed {
	constructor(client: AIClient) {
		super(client, {
			title: "About",
			description: description,
		});

		// Versions
		const versions = [
			["Bot:", "`" + packageJson.version + "`"],
			["Node.js:", "`" + process.version + "`"],
			["Discord.js:", "`" + packageJson.dependencies["discord.js"] + "`"],
			["iFunny.ts:", "`" + packageJson.dependencies["ifunny.ts"] + "`"],
			["TypeScript:", "`" + packageJson.devDependencies["typescript"] + "`"],
		];
		this.addFields([
			{
				name: "Versions",
				value: versions.map((v) => v.join(" ")).join("\n"),
			},
		]);
	}
}
