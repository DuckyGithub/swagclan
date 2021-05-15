import { HttpResponse } from "../Response";
import { ErrorCode } from "../../errors";

export class HttpError extends HttpResponse {
    constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly details: ErrorCode
    ) {
        super(code);
    }
}
