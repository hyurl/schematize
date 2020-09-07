/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const date = new Date();

describe("schematize: String", () => {
    it("should return as-is for existing properties of string type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: "Hello", bar: "World" },
                { foo: String, bar: String }
            ),
            { foo: "Hello", bar: "World" }
        );
    });

    it("should return as-is for existing sub-properties of string type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: "Hello World" } },
                { foo: { bar: String } }
            ),
            { foo: { bar: "Hello World" } }
        );
    });

    it("should cast existing properties of non-string type to strings", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: 123, bar: Symbol.for("id"), yes: true, no: false, date },
                { foo: String, bar: String, yes: String, no: String, date: String }
            ),
            {
                foo: "123",
                bar: "Symbol(id)",
                yes: "true",
                no: "false",
                date: date.toISOString()
            }
        );
    });

    it("should cast existing values in sub-node to strings", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: 123 } }, { foo: { bar: String } }),
            { foo: { bar: "123" } }
        );
    });

    it("should cast existing properties of compound-type to JSON strings", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { hello: "world" }, bar: [1, 2, 3] },
                { foo: String, bar: String }
            ),
            {
                foo: JSON.stringify({ hello: "world" }),
                bar: JSON.stringify([1, 2, 3]),
            }
        );
    });

    it("should cast all elements in an array to strings by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [1, 2, 3] }, { foo: [String] }),
            { foo: ["1", "2", "3"] }
        );
    });

    it("should create empty strings as default values for missing properties", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: String, bar: "" }),
            { foo: "", bar: "" }
        );
        assert.deepStrictEqual(
            schematize({ foo: null }, { foo: String }),
            { foo: "" }
        );
    });

    it("should use the given strings in the schema as default values", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: "Hello", bar: "World" }),
            { foo: "Hello", bar: "World" }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: String } }),
            { foo: { bar: "" } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: "" } }),
            { foo: { bar: "" } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: [String] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: [""] } }),
            { foo: { bar: [] } }
        );
    });
});
