import { HttpError } from "./HttpError";
import { ErrorCode } from "../../errors";

export class BadRequest extends HttpError {
    constructor(details: ErrorCode) {
        super(400, "The JSON body passed in was invalid.", details);
    }
}
