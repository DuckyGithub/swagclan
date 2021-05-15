import zod from "zod";
import { ErrorCode } from "../errors";
import { AppReqHandler } from "../index";
import { BadRequest } from "../responses";

class InvalidSchemaResponse extends BadRequest {
    constructor(public readonly info: any) {
        super(ErrorCode.BodyDoesNotMatchSchema);
    }
}

export function validateSchema<T extends zod.ZodType<any>>(
    schema: T
): AppReqHandler<zod.infer<T>, any> {
    return async function (req) {
        const result = await schema.safeParse(req.body);

        if (result.success === false) {
            throw new InvalidSchemaResponse(result.error);
        }
    };
}
