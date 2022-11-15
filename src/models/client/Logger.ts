import { info } from "console";
import winston from "winston";

const CONSOLE_FORMAT = winston.format.combine(
	winston.format.colorize({
		level: true,
	}),
	winston.format.printf(({ level, message }) => {
		return `${level} ${message}`;
	})
);

const FILE_FORMAT = winston.format.combine(
	winston.format.json({ circularValue: "[Circular]" }),
	winston.format.timestamp(),
	winston.format.printf(({ timestamp, level, message }) => {
		return `${timestamp} ${level.toUpperCase()}: ${message}`;
	})
);

export default winston.createLogger({
	transports: [
		new winston.transports.Console({
			level: "debug",
			format: CONSOLE_FORMAT,
		}),

		new winston.transports.File({
			level: "error",
			filename: "error.log",
			format: FILE_FORMAT,
		}),
	],
});
