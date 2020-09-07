import "@hyurl/utils/types";
import { Structured, OptionalOf } from "./types";
import getGlobal from "@hyurl/utils/getGlobal";
import typeOf from "@hyurl/utils/typeOf";
import isEmpty from "@hyurl/utils/isEmpty";

// HACK, prevent throwing error when the runtime doesn't support these types.
var BigInt: BigIntConstructor = getGlobal("BigInt") || new Function() as any;
var Buffer: typeof global.Buffer = getGlobal("Buffer") || new Function() as any;

/**
 * Performs a pattern matching on an array according to the given schema.
 * @param schema For array of objects, the schema must be defined as an array
 *  with one element which sets the types for all objects in the input array.
 * @param exactMatch If set, the objects in the input array must only contain
 *  the properties that are presented in the schema.
 */
export default function match<T>(
    arr: any[],
    schema: [T],
    exactMatch?: boolean
): arr is Structured<T>[];
/**
 * Performs a pattern matching on an object according to the given schema.
 * @param exactMatch If set, the object must only contain the properties that
 *  are presented in the schema.
 */
export default function match<T extends object>(
    obj: object,
    schema: T,
    exactMatch?: boolean
): obj is Structured<T>;
export default function match<T extends object>(
    obj: any,
    schema: T,
    exactMatch = false
): obj is Structured<T> {
    if (obj === null ||
        typeof obj !== "object" ||
        (Array.isArray(obj) && !Array.isArray(schema))
    ) {
        return false;
    } else if (Array.isArray(schema)) {
        if (schema.length === 1) {
            if (Array.isArray(obj)) {
                return obj.every(o => isOf(o, schema[0]));
            } else {
                return false;
            }
        } else {
            throw new TypeError(
                "An array schema should only contain one element"
            );
        }
    }

    let schemaKeys = Reflect.ownKeys(schema);
    let actualKeys = Reflect.ownKeys(obj);

    if (exactMatch &&
        (actualKeys.length !== schemaKeys.length || actualKeys.some(
            key => !schemaKeys.includes(key)
        ))
    ) {
        return false;
    }

    if (!schemaKeys.every(key => {
        if (schema[key] instanceof OptionalOf) {
            return obj[key] === void 0
                || obj[key] === null
                || isOf(obj[key], schema[key].base);
        } else {
            return isOf(obj[key], schema[key]);
        }
    })) {
        return false;
    }

    return true;
}

function isOf(value: any, base: any): boolean {
    switch (base) {
        case String: return typeof value === "string";

        case Number: return typeof value === "number";

        case BigInt: return typeof value === "bigint";

        case Boolean: return typeof value === "boolean";

        case Symbol: return typeof value === "symbol";

        case Object: return typeOf(value) === Object; // must be plain object

        case Array: return Array.isArray(value);

        case Buffer: return Buffer.isBuffer(value);

        default: {
            let type = typeOf(base);

            if (type === "class") {
                return value instanceof base;
            } else if (type === Object || Array.isArray(base)) {
                if (isEmpty(base)) { // short-hand of Object `{}` and Array `[]`
                    return isOf(value, type);
                } else { // sub-schema
                    return match(value, base);
                }
            } else if ((type === Buffer || type === Uint8Array)
                && (Buffer.isBuffer(value))
                || (type === Uint8Array && typeOf(value) === Uint8Array)
            ) { // compare Buffer or Uint8Array
                return Buffer.compare(<any>value, base) === 0;
            } else if (type === RegExp && value instanceof RegExp) { // RegExp
                return String(value) === String(base);
            } else if (type === Date && value instanceof Date) { // Date
                return value.valueOf() === base.valueOf();
            } else if (type === "symbol" && typeOf(value) === "symbol") {
                // Use Symbol.keyFor will both compare their key and registry
                if (Symbol.keyFor(value) === Symbol.keyFor(base)) {
                    return String(value) === String(base);
                } else {
                    return false;
                }
            } else {
                // === cannot compare NaN, use Object.is;
                // Object.is cannot compare +0 and -0, use ===;
                return value === base || Object.is(value, base);
            }
        }
    }
}
