import "@hyurl/utils/types";
import ensure from "./ensure";
import match from "./match";
import { Optional, OptionalOf } from "./utils";

export {
    ensure,
    match,
    Optional
}

export type Constructed<T> = {
    [P in keyof T]: (
        T[P] extends typeof String ? string :
        T[P] extends typeof Number ? number :
        T[P] extends typeof BigInt ? bigint :
        T[P] extends typeof Boolean ? boolean :
        T[P] extends typeof Symbol ? symbol :
        T[P] extends typeof Object ? object :
        T[P] extends typeof Buffer ? Buffer :
        T[P] extends OptionalOf<infer U> ? Constructed<U> :
        T[P] extends Constructor<infer R> ? R :
        T[P] extends Function ? T[P] :
        T[P] extends object ? Constructed<T[P]> :
        T[P]
    )
};
