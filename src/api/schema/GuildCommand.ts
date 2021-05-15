import * as zod from "zod";

export const GuildCommandRegisterRequestSchema = zod.object({
    command_id: zod.string(),
    command_version: zod.string(),
    enabled: zod.boolean(),
    timeout: zod.number(),
    config: zod.record(zod.any()),
    permissions: zod.array(
        zod.object({
            type: zod.string(),
            id: zod.string(),
            disallow: zod.boolean()
        })
    )
});

export type GuildCommandRegisterRequest = zod.infer<
    typeof GuildCommandRegisterRequestSchema
>;

export const GuildCommandUpdateRequestSchema = GuildCommandRegisterRequestSchema.omit(
    {
        command_id: true
    }
);

export type GuildCommandUpdateRequest = zod.infer<
    typeof GuildCommandUpdateRequestSchema
>;
