import { Dict } from "./util";

/**
 * Asynchronously waits for a specified amount of time
 * @param time The milliseconds to wait for
 * @returns A promise that is resolved when the timeout expires
 */
export async function sleep(time: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 *
 * @param claim Boolean to assert to be true
 * @param message Message to throw if the claim is false. Default: "Assertion false"
 */
export function assert(claim: boolean, message?: string): void {
	if (!claim) throw new Error(message ?? "Assertion false");
}

/**
 * Pretties a JavaScript object into JSON Data
 * @param data JavaScript object
 * @param replacer Callback to pass - null
 * @param indent Indent size of nested properties - 2
 * @returns JSON Data
 */
export function pretty(data: Dict, replacer = null, indent = 2) {
	return JSON.stringify(data, replacer, indent);
}

export default {
	sleep,
	assert,
	pretty,
};
