# Schemaly

**Utilities to ensure object structures and perform pattern matching.**

For many reasons, an API may not return the data as what we want them to be. For
example, we expect a JSON response should have a `foo` property of `number` type,
however, the server provide it as a numeric `string`, or even worse it
doesn't exist at all, or is set `null`, which would cause the client to crash
if the exception is not handled well.

That's why **schemaly** comes in stage. It ensures the input or output data must
be of a certain structure based on the schema, which provides the ability to
auto-cast compatible values and provides default values when they're missing.

## Install

```sh
npm i @hyurl/schemaly
```

## Example

### ensure

```ts
import { ensure, Optional } from "@hyurl/schemaly";
import * as express from "express";


let AuthorSchema = {
    uid: Number,
    username: String,
    birthday: Optional(Date), // use 'Optional' to define an optional property
    isPopular: Boolean,
    contactInfo: { // child schema is supported and unlimited
        mobile: String,
        email: {
            personal: String,
            work: String
        }
    }
};

// Client-side example
(async () => {
    let res = await fetch("https://localhost/author/12345");

    if (res.ok) {
        // 'author' will be well-typed in TypeScript.
        let author = ensure(await res.json(), authorSchema);

        console.log(
            `${author.username} (${author.uid}) ${author.isPopular ? "is" : "isn't"} a popular writer.`);

        if (author.birthday) { // 'birthday' is optional, it could be missing
            console.log(`His birthday is ${author.birthday}.`);
        }
    }
})();

// Server-side example
(async () => {
    let app = express();

    app.get("/author/:uid", (req, res) => {
        // assume db is defined
        let author = await db.findOne({ uid: Number(req.params.uid) });

        if (author) {
            // At this point, we don't know what fields does 'author' has,
            // but that's no problem, `ensure()` will make sure that all the
            // fields we expected is presented in the outgoing response.
            res.send(ensure(author, AuthorSchema));
        }
    });

    app.listen(80);
})();
```

### match

```ts
import { match, Optional } from "@hyurl/schemaly";

let userSchema = { uid: Number, username: String, birthday: Optional(String) };
let res = await fetch(someLink);

if (res.ok) {
    let data = await res.json();

    // Assume the structure of the returning data from fetch(someLink) could be
    // in multiple forms, we could use `match()` to do pattern-matching.

    if (match(data, userSchema)) {
        // 'data' will be well-typed in TypeScript in the conditional block
        console.log(`${data.username} (${data.uid}), born on: ${data.birthday || "unknown"}`);
    } else if (match(data, { code: Number, data:  userSchema })) {
        let _data = data.data;

        console.log(`${_data.username} (${_data.uid}), born on: ${_data.birthday || "unknown"}`);
    } else if (match(data, { code: Number, reason: String })) {
        console.log(`Failed to fetch user: ${data.reason} (${data.code})`);
    }
}
```

## API

### ensure

```ts
/**
 * Makes sure the input object is restraint with the types defined in the schema
 * and automatically fills any property that is missing.
 * @param omitUntyped If set, those properties that are not specified in schema
 *  will be removed.
 */
function ensure<T>(obj: any, schema: T, omitUntyped?: boolean): OptionalStructured<T>;

/**
 * Makes sure the input array of objects is restraint with the types defined in
 * the schema and automatically fills any property that is missing.
 * @param schema For array of objects, the schema must be defined as an array
 *  with one element which sets the types for all objects in the input array.
 * @param omitUntyped If set, those properties that are not specified in the
 *  schema will be removed.
 */
function ensure<T>(arr: any[], schema: [T], omitUntyped?: boolean): OptionalStructured<T>[];
```

### match

```ts
/**
 * Performs a pattern matching on an object according to the given schema.
 * @param exactMatch If set, the object must only contain the properties that
 *  are presented in the schema.
 */
function match<T extends object>(
    obj: object,
    schema: T,
    exactMatch?: boolean
): obj is Structured<T>;

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
```

For more details about types, please check the [type definition](./src/types.ts).


## More On Ensure

### Default Values

For the `ensure()` function, by default, if you provide a type constructor in
the schema, when the specified property is missing, it will create a default
value to make sure the property always available (expect use
`Optional` wrapper). The default values of each types are:

- `String` => `''` (empty string)
- `Number` => `0`
- `BigInt` => `0n`
- `Boolean` => `false`
- `Object` => `{}` (empty plain object for plain object constructor)
- `Array` => `[]`
- `Date` => `new Date()` (The current date)
- `Map` => `new Map([])` (empty map)
- `Set` => `new Set([])` (empty set)
- `Buffer` => `Buffer.from([])` (empty buffer)

Other type constructors (include `Symbol` and user-define classes) are all set
`null` if the relevant property is missing.

Other than these, you can always by providing an instance value to the schema,
and it will be used as the default value of the property automatically.

*(NOTE: you can also set an instance value in the schema of `match()` function,
but it will be used for full-equality comparison.)*


### Auto-cast Types

When a property in the input data of the `ensure()` function isn't of the type
that defined in the schema, however, it is compatible to the type, or can
generate a similar representation, the value will be automatically casted into
an instance of the defined type.

For example:

```ts
let schema = { url: URL }; // 'url' is defined as a URL
let data = ensure({ url: "https://example.com" }, schema); // but provided a string

assert(data.url instanceof URL); // 'data.url' will be auto-casted to URL
```

The current casting rule is as the following:

- `String`
    - `Date` to ISO string
    - `Object` or `Array` to JSON string
    - `Symbol` in global registry, to string
    - any other types that are not functions or classes can be casted to strings

- `Number`
    - `BigInt` to its number equivalents
    - `String` that is numeric
    - `Date` to Unix timestamp in milliseconds
    - `true` to `1`
    - `false` to `0`

- `BigInt`
    - `Number` to its bigint equivalents
    - other types are similar to `Number`

- `Boolean`
    - `Number`/`BigInt`: `0`/`0n` to `false`, others to `1`
    - `String`
        - `/^([Tt]rue|[Yy]es|[Oo]n|1)$/` casted to `true`
        - `/^([Ff]alse|[Nn]o|[Oo]ff|0)$/` casted to `false`

- `Symbol`
    - `String` matches `/Symbol\(.*?\)/` or not, casted to global-scoped symbol

- `Object`
    - `Object` derivatives, create a shallow copy
    - `String` starts with `{` and ends with `}` will try to be parsed as JSON

- `Array`
    - `String`
        - starts with `[` and ends with `]` will try to be parsed as JSON
        - others will be split by `,`

- `Date`
    - `Number` used as Unix timestamp
    - `String` used as date-time string

- `URL`
    - `String` a valid URL string

- `RegExp`
    - `String` a valid RegExp literal

- `Map`
    - `Array` a valid Map entry

- `Set`
    - `Array`

- `Buffer`
    - `Uint8Array`
    - `ArrayBuffer`
    - `Array` that only contains numbers ranged from `0` - `255`

- `TypedArray`
    - any iterable object with numbers will try to be casted

- `Error`
    - `String` used as error message
    - `Object` with signature `{ name: string, message: string, stack?: string }`

*(NOTE: `match()` function doesn't support auto-casting.)*
