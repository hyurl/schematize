export const _type = Symbol("type");

type iConstructor<T> = SymbolConstructor | BigIntConstructor | Constructor<T>;
export type OptionalOf<T> = { [_type]: iConstructor<T>, optional: true, exact?: boolean };
export type ExactOf<T> = { [_type]: iConstructor<T>, exact: true };

export type ReadonlyFor<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>;

export type OptionalKeys<T> = {
    [K in keyof T]: T[K] extends OptionalOf<any> ? K : never;
}[keyof T];

export function Optional<T>(type: iConstructor<T> | ExactOf<T>): OptionalOf<T> {
    if (type[_type] && type["exact"]) {
        return { [_type]: type[_type], optional: true, exact: true };
    } else {
        return { [_type]: <any>type, optional: true };
    }
}

export function Exact<T>(type: iConstructor<T>): ExactOf<T> {
    return { [_type]: type, exact: true };
}