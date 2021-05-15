import { CustomCommandTypeLike } from "../types";

export class BadArgument extends Error {
    constructor(
        public readonly expected: CustomCommandTypeLike,
        public readonly got: string
    ) {
        super("Could not parse command argument '" + got + "' as a " + expected.typeName + ".");
    }
}
