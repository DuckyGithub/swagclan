import * as zod from "zod";

type Primitive = string | number | bigint | boolean | null | undefined;

type MapArr<C extends Primitive[]> = {
    [K in keyof C]: zod.ZodLiteral<C[K]>;
};

export function oneof<
    A extends Primitive,
    B extends Primitive,
    C extends Primitive[]
>(items: readonly [A, B, ...C]) {
    return zod.union(
        items.map((item) => zod.literal(item)) as [
            zod.ZodLiteral<A>,
            zod.ZodLiteral<B>,
            ...MapArr<C>
        ]
    );
}
