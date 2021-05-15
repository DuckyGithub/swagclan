import * as zod from "zod";

export const CustomCommandVersionRequestSchema = zod.object({
    version: zod.string(),
    trigger: zod
        .string()
        .regex(
            /^[\w-]{1,32}$/,
            "Name must be less than 32 characters and may only contain A-Z, a-z and -."
        ),
    config: zod.record(
        zod.object({
            name: zod.string(),
            description: zod.string(),
            type: zod.string(),
            initial: zod.any()
        })
    ),
    params: zod.array(
        zod.object({
            name: zod.string(),
            description: zod.string(),
            type: zod.string(),
            required: zod.boolean()
        })
    ),
    variables: zod.record(
        zod.object({
            name: zod.string(),
            type: zod.string()
        })
    ),
    actions: zod.record(
        zod.object({
            type: zod.string(),
            rule: zod.string(),
            parent: zod.string().optional(),
            next: zod.string().optional(),
            fields: zod.record(
                zod.object({
                    type: zod.string(),
                    id: zod.string()
                })
            )
        })
    ),
    first: zod.string()
});

export type CustomCommandVersionRequest = zod.infer<
    typeof CustomCommandVersionRequestSchema
>;
