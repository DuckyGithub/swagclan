import { HttpError } from "./HttpError";
import { ErrorCode } from "../../errors";

export class Conflict extends HttpError {
    constructor(details: ErrorCode) {
        super(409, "The resource could not be overwritten.", details);
    }
}
