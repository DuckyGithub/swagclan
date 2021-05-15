import { HttpResponse } from "./Response";

export class SuccessNoContent extends HttpResponse {
    constructor() {
        super(204);
    }

    toJSON() {
        return "";
    }
}
