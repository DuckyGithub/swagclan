import { HttpError } from "./HttpError";
import { ErrorCode } from "../../errors";

export class InternalServerError extends HttpError {
    constructor(details: ErrorCode) {
        super(
            500,
            "An internal server error occurred while processing your request.",
            details
        );
    }
}
