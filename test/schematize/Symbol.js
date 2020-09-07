/* global describe, it, BigInt */
const assert = require("assert");
const { schematize } = require("../..");

describe("schematize: Symbol", () => {
    it("should return as-is for existing properties of symbol type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: Symbol.for("Hello"), bar: Symbol.for("World") },
                { foo: Symbol, bar: Symbol }
            ),
            { foo: Symbol.for("Hello"), bar: Symbol.for("World") }
        );
    });

    it("should return as-is for existing sub-properties of symbol type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: Symbol.for("Hello World") } },
                { foo: { bar: Symbol } }
            ),
            { foo: { bar: Symbol.for("Hello World") } }
        );
    });

    it("should cast existing properties of non-symbol type to symbols", () => {
        assert.deepStrictEqual(
            schematize(
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
            schematize({ foo: { bar: "hello" } }, { foo: { bar: Symbol } }),
            { foo: { bar: Symbol.for("hello") } }
        );
    });

    it("should cast all elements in an array to symbols by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: ["hello", "world"] }, { foo: [Symbol] }),
            { foo: [Symbol.for("hello"), Symbol.for("world")] }
        );
    });

    it("should use `null` as default value for missing properties", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: Symbol }),
            { foo: null }
        );
        assert.deepStrictEqual(
            schematize({ foo: null }, { foo: Symbol }),
            { foo: null }
        );
    });

    it("should use the given symbols in the schema as default values", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: null },
                { foo: Symbol.for("Hello"), bar: Symbol.for("World") }
            ),
            { foo: Symbol.for("Hello"), bar: Symbol.for("World") }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: Symbol.for("nil") } }),
            { foo: { bar: Symbol.for("nil") } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: Symbol.for("nil") } }),
            { foo: { bar: Symbol.for("nil") } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: [Symbol] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: [Symbol.for("nil")] } }),
            { foo: { bar: [] } }
        );
    });
});
