import DiscordEvent from "../../models/discord/Event";

export default new DiscordEvent("ready", async (bot) => {
	await bot.register_commands();
});
