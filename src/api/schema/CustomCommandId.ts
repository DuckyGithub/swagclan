import * as zod from "zod";

export const CustomCommandRequestSchema = zod.object({
    name: zod.string().max(20, "Name must be less than 20 characters."),
    summary: zod.string().max(200, "Summary must be less than 200 characters."),
    tags: zod.array(
        zod.string().max(20, "Trigger must be less than 20 characters.")
    ),
    thumbnail: zod.string(),
    private: zod.boolean()
});

export type CustomCommandRequest = zod.infer<typeof CustomCommandRequestSchema>;
