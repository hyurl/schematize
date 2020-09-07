import "@hyurl/utils/types";
import { Constructed } from ".";
import { OptionalKeys, OptionalOf } from "./utils";
import { isIterable } from "check-iterable";
import isVoid from "@hyurl/utils/isVoid";
import typeOf, { TypeNames } from "@hyurl/utils/typeOf";
import getGlobal from "@hyurl/utils/getGlobal";
import isSubClassOf from "@hyurl/utils/isSubClassOf";
import isEmpty from "@hyurl/utils/isEmpty";
import define from "@hyurl/utils/define";

// HACK, prevent throwing error when the runtime doesn't support these types.
var BigInt: BigIntConstructor = getGlobal("BigInt") || new Function() as any;
var URL: typeof globalThis.URL = getGlobal("URL") || new Function() as any;
var Buffer: typeof global.Buffer = getGlobal("Buffer") || new Function() as any;

type ConstructedObject<T> = Optional<Constructed<T>, OptionalKeys<T>>;

/**
 * Make sure the input array of objects is restraint with the types defined in
 * the schema and automatically fills any properties that is missing.
 * @param schema For array of objects, the schema must be defined as an array
 *  with one element which sets the types for all objects in the input array.
 * @param omitUntyped If set, those properties that are not specified in schema
 *  will be removed.
 */
export default function ensure<T>(
    arr: any[],
    schema: [T],
    omitUntyped?: boolean
): ConstructedObject<T>[];
/**
 * Make sure the input object is restraint with the types defied in the schema
 * and automatically fills any properties that is missing.
 * @param obj 
 * @param schema 
 * @param omitUntyped If set, those properties that are not specified in schema
 *  will be removed.
 */
export default function ensure<T>(
    obj: any,
    schema: T,
    omitUntyped?: boolean
): ConstructedObject<T>;
export default function ensure<T>(obj: any, schema: T = null, omitUntyped = false) {
    return makeSure("", obj, schema, omitUntyped);
}

function makeSure<T>(
    field: string,
    value: any,
    schema: T,
    omitUntyped: boolean
): any {
    if (value === null) {
        return null;
    } else if (Array.isArray(schema)) {
        if (schema.length === 1) {
            if (Array.isArray(value)) {
                if (typeOf(schema[0]) === Object && !isEmpty(schema[0])) {
                    return value.map((o, i) => makeSure(
                        field ? `${field}.${i}` : String(i),
                        o,
                        schema[0],
                        omitUntyped
                    ));
                } else {
                    return value.map((o, i) => cast(
                        field ? `${field}.${i}` : String(i),
                        o,
                        schema[0],
                        omitUntyped
                    ));
                }
            } else {
                throwTypeError(field, "Array");
            }
        } else if (!isEmpty(field)) {
            throw new TypeError(
                `The array schema of '${field}' should only contain one element`
            );
        } else {
            throw new TypeError(
                "An array schema should only contain one element"
            );
        }
    } else if (typeof value !== "object" || Array.isArray(value)) {
        throwTypeError(field, "Object");
    }

    let result = Reflect.ownKeys(<any>schema).reduce((result, prop) => {
        let _value = cast(
            field ? `${field}.${String(prop)}` : String(prop),
            value[prop], // value
            (<any>schema)[prop], // constructor or default value
            omitUntyped
        );

        if (_value !== void 0)
            result[prop] = _value;

        return result;
    }, <any>{});

    if (!omitUntyped) {
        Reflect.ownKeys(value).forEach(prop => {
            if (!(prop in result)) {
                result[prop] = value[prop];
            }
        });
    }

    return result;
}

function isMapEntries(value: any) {
    return Array.isArray(value)
        && value.every(e => Array.isArray(e) && e.length === 2);
}

function couldBeBufferInput(value: any) {
    return typeof value === "string"
        || value instanceof Uint8Array
        || value instanceof ArrayBuffer
        || (typeof SharedArrayBuffer === "function" &&
            value instanceof SharedArrayBuffer)
        || (Array.isArray(value) && value.every(
            e => typeof e === "number" && e >= 0 && e <= 255
        ));
}

function isTypedArrayCtor(type: any): type is Uint8ArrayConstructor {
    return typeOf(type) === "class"
        && typeOf(type.from) === "function"
        && /(Big)?(Ui|I)nt(8|16|32|64)(Clamped)?Array$/.test(type.name);
}

function isErrorCtor(type: any): type is Constructor<Error> {
    return typeOf(type) === "class"
        && type === Error || isSubClassOf(type, Error);
}

function throwTypeError(
    field: string,
    type: string
) {
    let label: string;

    if (/^[AEIO]/i.test(type)) {
        label = "an " + type;
    } else if (/^U/.test(type)) {
        label = "a(n) " + type;
    } else {
        label = "a " + type;
    }

    let msg = isEmpty(field)
        ? `The value must be ${label}`
        : `The value of '${field}' is not ${label} and cannot be casted into one`;

    throw new TypeError(msg);
}

function getHandles(
    type: TypeNames | Constructor<any> | typeof BigInt | typeof Symbol,
    base: any,
    value: any
): [(type: TypeNames | Constructor<any>) => any, any, string?] {
    if ((type === Object || Array.isArray(base)) && !isEmpty(base)) {
        return null;
    } else if (type === "class" || base === BigInt || base === Symbol) {
        type = base;
        base = void 0;
    }

    switch (type) {
        case "string":
        case String: return [type => {
            if (value instanceof Date) {
                return value.toISOString();
            } else if (type === Object
                || type === "arguments"
                || Array.isArray(value)
            ) {
                return JSON.stringify(value);
            } else if (type === "symbol") {
                if (Symbol.keyFor(value) !== void 0) {
                    return String(value);
                }
            } else if (type !== "function" && type !== "class") {
                return String(value);
            }
        }, base || "", "string"];

        case "number":
        case Number: return [type => {
            let num: number;

            if (type === "number") {
                return value;
            } else if (type === "string" && !isNaN(num = Number(value))) {
                return num;
            } else if (value instanceof Date) {
                return value.valueOf();
            } else if (value === true) {
                return 1;
            } else if (value === false) {
                return 0;
            }
        }, base || 0, "number"];

        case "bigint":
        case BigInt: return [type => {
            let num: number;

            if (type === "bigint") {
                return value;
            } else if (type === "number") {
                return BigInt(value);
            } else if (type === "string" && !isNaN(num = Number(value))) {
                return BigInt(num);
            } else if (value instanceof Date) {
                return BigInt(value.valueOf());
            } else if (value === true) {
                return BigInt(1);
            } else if (value === false) {
                return BigInt(0);
            }
        }, base || BigInt(0), "bigint"];

        case "boolean":
        case Boolean: return [type => {
            if (type === "boolean") {
                return value;
            } else if (type === "number" || type === "bigint") {
                return Number(value) === 0 ? false : true;
            } else if (type === "string") {
                value = value.trim();

                if (/^([Tt]rue|[Yy]es|[Oo]n|1)$/.test(value)) {
                    return true;
                } else if (/^([Ff]alse|[Nn]o|[Oo]ff|0)$/.test(value)) {
                    return false;
                }
            }
        }, base || false, "boolean"];

        case "symbol":
        case Symbol: return [type => {
            if (type === "symbol") {
                return value;
            } else if (type === "string") {
                if (/Symbol\(.*?\)/.test(value)) {
                    return Symbol.for(value.slice(7, -1));
                } else {
                    return Symbol.for(value);
                }
            }
        }, base || null, "symbol"];

        case Object: return [type => {
            if (type === Object) {
                return value;
            } else if (typeof value === "object") {
                return { ...value };
            } else if (type === "string"
                && value[0] === "{"
                && value[value.length - 1] === "}"
            ) {
                return JSON.parse(value);
            }
        }, () => <any>{}, "Object"];

        case Array: return [type => {
            if (Array.isArray(value)) {
                return value;
            } else if (type === "string") {
                if (value[0] === "[" && value[value.length - 1] === "]") {
                    return JSON.parse(value);
                } else {
                    return (<string>value).split(/\,\s*/);
                }
            } else if (isIterable(value)) {
                return Array.from(value);
            }
        }, () => <any[]>[], "Array"];

        case Date: return [type => {
            if (value instanceof Date) {
                return value;
            } else if (type === "string" || type === "number") {
                let date = new Date(value);

                if (String(date) !== "Invalid Date") {
                    return date;
                }
            }
        }, base || (() => new Date())];

        case URL: return [type => {
            if (value instanceof URL) {
                return value;
            } else if (type === "string") {
                return new URL(value);
            }
        }, base || null];

        case RegExp: return [type => {
            if (value instanceof RegExp) {
                return value;
            } else if (type === "string") {
                value = value.trim();
                let end: number;

                if (value[0] === "/" && (end = value.lastIndexOf("/")) >= 2) {
                    let flags: string = value.slice(end + 1);

                    if (isEmpty(flags) || /^[gimuys]+$/.test(flags)) {
                        return new RegExp(value.slice(1, end), flags);
                    }
                }
            }
        }, base || null];

        case Map: return [() => {
            if (value instanceof Map) {
                return value;
            } else if (isMapEntries(value)) {
                return new Map(value);
            }
        }, base || (() => new Map())];

        case Set: return [() => {
            if (value instanceof Set) {
                return value;
            } else if (Array.isArray(value)) {
                return new Set(value);
            }
        }, base || (() => new Set())];

        case Buffer: return [() => {
            if (Buffer.isBuffer(Buffer)) {
                return value;
            } else if (couldBeBufferInput(value)) {
                return Buffer.from(value);
            }
        }, base || (() => Buffer.from([]))];
    }
}

function cast(
    field: string,
    value: any,
    base: any,
    omitUntyped: boolean,
): any {
    let exists = !isVoid(value);

    if (base instanceof OptionalOf) {
        if (!exists) {
            return void 0;
        } else {
            base = base.base;
        }
    }

    let type = typeOf(base);
    let handles = getHandles(type, base, value);

    if (!isEmpty(handles)) {
        let [handle, defaultValue, label] = handles;
        let _type: TypeNames | Constructor<any>;

        if (exists) {
            let result: any;

            try {
                result = handle(typeOf(value));
            } catch (e) { }

            if (result === void 0) {
                throwTypeError(field, label || (<Constructor<any>>base).name);
            } else {
                return result;
            }
        } else if ((_type = <TypeNames>typeOf(defaultValue)) === "function") {
            return defaultValue();
        } else if (_type === "class") {
            return new defaultValue();
        } {
            return defaultValue;
        }
    } else if (type === "class") {
        if (isTypedArrayCtor(base)) {
            if (exists) {
                if (value instanceof base) {
                    return value;
                } else if (isIterable(value)) {
                    try {
                        return base.from(value);
                    } catch (e) { }
                }

                throwTypeError(field, base.name);
            } else {
                return base.from([]);
            }
        } else if (exists && isErrorCtor(base)) {
            let _type: string;

            if (value instanceof base) {
                return value;
            } else if ((_type = typeof value) === "string") {
                return new base(value);
            } else if (_type === "object"
                && typeof value["name"] === "string"
                && typeof value["message"] === "string"
            ) {
                let err = Object.create(
                    (getGlobal(value["name"]) || base).prototype
                );

                define(err, "message", value["message"], false, true);

                if (err.name !== value["name"])
                    define(err, "name", value["name"], false, true);

                if (typeof value["stack"] === "string")
                    define(err, "stack", value["stack"], false, true);

                return err;
            }

            throwTypeError(field, base.name);
        } else if (exists) {
            if (value instanceof base) {
                return value;
            } else {
                throwTypeError(field, (<Constructor<any>>base).name);
            }
        } else {
            return null;
        }
    } else if (type === Object || Array.isArray(base)) { // sub-schema
        if (exists) {
            return makeSure(field, value, base, omitUntyped);
        } else {
            return makeSure(
                field,
                cast(field, void 0, type, omitUntyped), // create sub-node
                base,
                omitUntyped
            );
        }
    } else {
        return exists ? value : base;
    }
}
