/**
 * Utility emojis
 */
export enum UTIL {
	SUCCESS = "\u2714\uFE0F", // âī¸
	TRACE = "\uD83D\uDCD2", // đ
	DEBUG = "\uD83D\uDC1E", // đ
	INFO = "\u2139\uFE0F", // âšī¸
	WARN = "\u26A0\uFE0F", // â ī¸
	ERROR = "\u2757", // â
	FATAL = "\uD83D\uDED1", // đ
}

/**
 * iFunny specific emojis from iFunny Node API server
 */
export enum IFUNNY {
	NEW_LOGO = "<:new_logo:976187021875879946>",
	OLD_LOGO = "<:old_logo:976184252553109594> ",
	FEATURED = "<:featured:976184252523741184>",
	SMILE = "<:ifunny_smile:976184252125306891>",
	UNSMILE = "<:ifunny_unsmile:976184252527960155>",
	TOP_COMMENT = "<:top_comment:976184252334997595>",
	WATERMARK = "<:watermark:976184252477616178>",
}

/**
 * Class of Emojis used in the bot at some point
 */
export class Emoji {
	public static readonly UTIL = UTIL;

	public static readonly IFUNNY = IFUNNY;
}

export default Emoji;
