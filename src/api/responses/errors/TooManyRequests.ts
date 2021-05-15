import { HttpError } from "./HttpError";
import { ErrorCode } from "../../errors";

export class TooManyRequests extends HttpError {
    constructor(details: ErrorCode) {
        super(429, "Too many requests.", details);
    }
}
