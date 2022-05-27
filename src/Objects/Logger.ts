import { ISettingsParam, ILogObject, Logger as TSLog } from "tslog";
import fs from "node:fs";
import Util from "../utils/util";
import Emojis from "./Emojis";

type Transporter = (logObject: ILogObject) => void;

/**
 * Default function to save logs to a file in JSON format
 * @param logObject Logger object with all logger data
 */
function saveToFile(logObject: ILogObject) {
	const data = {
		date: logObject.date.toISOString(),
		level: logObject.logLevel,
		filePath: logObject.filePath,
		lineNumber: logObject.lineNumber,
		arguments: logObject.argumentsArray,
		message: `${logObject.argumentsArray.shift()}`,
	};

	// Info about the log itself
	const logInfo = `${data.date} ${data.level.toUpperCase()} ${data.filePath}:${
		data.lineNumber
	}`;

	// The message itself
	let message = data.message;
	if (data.arguments.length) {
		message += ` ${Util.pretty(data.arguments)}`;
	}
	fs.appendFileSync(".log", `${logInfo} ${message}\n`);
}

type LogLevel = "silly" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Custom logger with more functions
 */
export class Logger extends TSLog {
	public static LoggerTypes = ["hidden", "pretty", "json"] as const;

	public static readonly Emojis = Emojis;

	public static readonly LogLevels: LogLevel[] = [
		"silly",
		"trace",
		"debug",
		"info",
		"warn",
		"error",
		"fatal",
	];

	constructor(config?: ISettingsParam) {
		if (!config) config = {};
		if (!config?.type) config.type = Logger.LoggerTypes[0];
		if (!config.displayFilePath) config.displayFilePath = "hideNodeModulesOnly";
		if (!config.displayFunctionName) config.displayFunctionName = true;
		super(config);
		this.addTransport(saveToFile);
	}

	/**
	 * Adds a transport to all log levels automatically
	 * @param transport Transporter to attatch to the logger
	 * @param level Minimum log level to apply to the transport
	 */
	addTransport(transport: Transporter, level: LogLevel = "warn"): void {
		this.attachTransport(
			{
				silly: transport,
				trace: transport,
				debug: transport,
				info: transport,
				warn: transport,
				error: transport,
				fatal: transport,
			},
			level
		);
	}

	disable() {
		this.setType("hidden");
	}

	enable() {
		this.setType("pretty");
	}

	setType(type: "hidden" | "pretty" | "json") {
		this.setSettings({ type });
	}
}

export default Logger;
