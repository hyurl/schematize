import "@hyurl/utils/types";

type iConstructor<T> = SymbolConstructor | BigIntConstructor | Constructor<T>;

export type OptionalKeys<T> = {
    [K in keyof T]: T[K] extends OptionalOf<any> ? K : never;
}[keyof T];

export class OptionalOf<T> {
    constructor(readonly base: iConstructor<T>) { }
}

export function Optional<T>(base: iConstructor<T>): OptionalOf<T> {
    return new OptionalOf(base);
}
