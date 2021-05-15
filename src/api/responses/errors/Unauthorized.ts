import { HttpError } from "./HttpError";
import { ErrorCode } from "../../errors";

export class Unauthorized extends HttpError {
    constructor(details: ErrorCode) {
        super(
            401,
            "You do not have valid authorization to access this resource.",
            details
        );
    }
}
