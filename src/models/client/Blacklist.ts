import crypto from "crypto";
import { Collection, User as DiscordUser } from "discord.js";
import { User as iFunnyUser } from "ifunny.ts";

/**
 * Info about a blacklisted user
 */
export interface IBlacklistInfo {
	timestamp: number;
	reason: string;
	expires: boolean;
	expiresAt: number;
}

type UserIDResolvable = string | DiscordUser | iFunnyUser;

/**
 * Blacklist class to securely blacklist users from the bot
 * @extends Collection
 */
export default class Blacklist extends Collection<string, IBlacklistInfo> {
	constructor() {
		super();
	}

	/**
	 * Hashes a user id using sha256 hash
	 * @param user The user to blacklist
	 * @returns Hashed user ID
	 */
	public hash(user: UserIDResolvable): string {
		return crypto.createHash("sha256").update(this.resolveId(user)).digest("hex");
	}

	/**
	 * Resolves a user id
	 * @param user User or user id
	 * @returns User id
	 */
	protected resolveId(user: UserIDResolvable): string {
		if (typeof user === "string") return user;
		if (user instanceof DiscordUser || user instanceof iFunnyUser) return user.id;
		throw TypeError(`Expected: UserIDResolvable | Actual: ${user}`);
	}

	/**
	 * Sets a blacklist for a user
	 * @param user User to blacklist
	 * @param config Blacklist configuration
	 * @returns This instance for chaining
	 */
	public override set(user: UserIDResolvable, config: IBlacklistInfo): this {
		return super.set(this.hash(user), config);
	}

	/**
	 * Gets the blacklist configuration for a user
	 * @param user User or user id
	 * @returns Blacklist information if user is blacklisted, undefined otherwise
	 */
	public override get(user: UserIDResolvable): IBlacklistInfo | undefined {
		return super.get(this.hash(user));
	}

	/**
	 * Does the collection contain the user?
	 * @param user User to check if in collection
	 * @returns True if the user is in the collection, false otherwise
	 */
	public override has(user: UserIDResolvable) {
		return super.has(this.hash(user));
	}

	/**
	 * Does the collection contain all of the specified users?
	 * @param keys User or users to check if all are blacklisted
	 * @returns True if all are blacklisted, false otherwise
	 */
	public override hasAll(...keys: UserIDResolvable[]): boolean {
		return super.hasAll(...keys.map((key) => this.hash(key)));
	}

	/**
	 * Does the collection contain any of the specified users?
	 * @param keys User or users to check if any are blacklisted
	 * @returns true if any are blacklisted, false otherwise
	 */
	public override hasAny(...keys: UserIDResolvable[]): boolean {
		return super.hasAny(...keys.map((key) => this.hash(key)));
	}

	/**
	 * Deletes a user from the blacklist
	 * @param user User to unblacklist
	 * @returns True if the user was blacklisted, false otherwise
	 */
	public override delete(user: UserIDResolvable): boolean {
		return super.delete(this.hash(user));
	}
}
