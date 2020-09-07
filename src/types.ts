import "@hyurl/utils/types";

export type Structured<T> = {
    [P in keyof T]: (
        T[P] extends typeof String ? string :
        T[P] extends typeof Number ? number :
        T[P] extends typeof BigInt ? bigint :
        T[P] extends typeof Boolean ? boolean :
        T[P] extends typeof Symbol ? symbol :
        T[P] extends typeof Object ? object :
        T[P] extends typeof Buffer ? Buffer :
        T[P] extends OptionalOf<infer U> ? Structured<U> :
        T[P] extends Constructor<infer R> ? R :
        T[P] extends Function ? T[P] :
        T[P] extends object ? Structured<T[P]> :
        T[P]
    )
};

export type OptionalKeys<T> = {
    [K in keyof T]: T[K] extends OptionalOf<any> ? K : never;
}[keyof T];

export type OptionalStructured<T> = Optional<Structured<T>, OptionalKeys<T>>;

type iConstructor<T> = SymbolConstructor | BigIntConstructor | Constructor<T>;

export class OptionalOf<T> {
    constructor(readonly base: iConstructor<T>) { }
}

export function Optional<T>(base: iConstructor<T>): OptionalOf<T> {
    return new OptionalOf(base);
}
