/* global describe, it, BigInt */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

describe("Symbol", () => {
    it("should return as-is for existing properties of symbol type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: Symbol.for("Hello"), bar: Symbol.for("World") },
                { foo: Symbol, bar: Symbol }
            ),
            { foo: Symbol.for("Hello"), bar: Symbol.for("World") }
        );
    });

    it("should return as-is for existing sub-properties of symbol type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: Symbol.for("Hello World") } },
                { foo: { bar: Symbol } }
            ),
            { foo: { bar: Symbol.for("Hello World") } }
        );
    });

    it("should cast existing properties of non-symbol type to symbols", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: "hello", bar: "Symbol(hello)" },
                { foo: Symbol, bar: Symbol }
            ),
            {
                foo: Symbol.for("hello"),
                bar: Symbol.for("hello")
            }
        );
    });

    it("should cast existing values in sub-node to symbols", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: "hello" } }, { foo: { bar: Symbol } }),
            { foo: { bar: Symbol.for("hello") } }
        );
    });

    it("should cast all elements in an array to symbols by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: ["hello", "world"] }, { foo: [Symbol] }),
            { foo: [Symbol.for("hello"), Symbol.for("world")] }
        );
    });

    it("should use `null` as default value for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Symbol }),
            { foo: null }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: Symbol }),
            { foo: null }
        );
    });

    it("should use the given symbols in the schema as default values", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: null },
                { foo: Symbol.for("Hello"), bar: Symbol.for("World") }
            ),
            { foo: Symbol.for("Hello"), bar: Symbol.for("World") }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Symbol.for("nil") } }),
            { foo: { bar: Symbol.for("nil") } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Symbol.for("nil") } }),
            { foo: { bar: Symbol.for("nil") } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [Symbol] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [Symbol.for("nil")] } }),
            { foo: { bar: [] } }
        );
    });

    it("should support top level array schemas", () => {
        assert.deepStrictEqual(
            ensure([{ foo: Symbol.for("foo") }, { foo: "foo" }], [{ foo: Symbol }]),
            [{ foo: Symbol.for("foo") }, { foo: Symbol.for("foo") }]
        );
    });

    it("should throw proper error when casting failed on property", () => {
        let [err1] = doTry(() => ensure({ foo: () => { } }, { foo: Symbol }));
        let [err2] = doTry(() => ensure({ foo: { bar: () => { } } }, { foo: { bar: Symbol } }));
        let [err3] = doTry(() => ensure({ foo: [123] }, { foo: [Symbol] }));
        let [err4] = doTry(() => ensure([{ foo: () => { } }], [{ foo: Symbol }]));
        let [err5] = doTry(() => ensure([{ foo: { bar: () => { } } }], [{ foo: { bar: Symbol } }]));

        assert.strictEqual(
            String(err1),
            "TypeError: The value of 'foo' is not a symbol and cannot be casted into one"
        );
        assert.strictEqual(
            String(err2),
            "TypeError: The value of 'foo.bar' is not a symbol and cannot be casted into one"
        );
        assert.strictEqual(
            String(err3),
            "TypeError: The value of 'foo.0' is not a symbol and cannot be casted into one"
        );
        assert.strictEqual(
            String(err4),
            "TypeError: The value of '0.foo' is not a symbol and cannot be casted into one"
        );
        assert.strictEqual(
            String(err5),
            "TypeError: The value of '0.foo.bar' is not a symbol and cannot be casted into one"
        );
    });
});