/**
 * An error to throw if it expects an integer but receives something else
 */
export class IntegerError extends TypeError {
	constructor(actual?: any) {
		super(`Expected an Integer but got ${actual}`);
	}
}

export default { IntegerError };
