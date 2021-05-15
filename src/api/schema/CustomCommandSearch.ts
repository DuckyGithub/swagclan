import * as zod from "zod";

export const CustomCommandSearchRequestSchema = zod.object({
    page: zod.number().int().positive().optional(),
    tags: zod.array(zod.string()).max(5).optional()
});

export type CustomCommandSearchRequest = zod.infer<
    typeof CustomCommandSearchRequestSchema
>;
