/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

const date = new Date();

describe("ensure: String", () => {
    it("should return as-is for existing properties of string type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: "Hello", bar: "World" },
                { foo: String, bar: String }
            ),
            { foo: "Hello", bar: "World" }
        );
    });

    it("should return as-is for existing sub-properties of string type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: "Hello World" } },
                { foo: { bar: String } }
            ),
            { foo: { bar: "Hello World" } }
        );
    });

    it("should cast existing properties of non-string type to strings", () => {
        assert.deepStrictEqual(
            ensure(
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
            ensure({ foo: { bar: 123 } }, { foo: { bar: String } }),
            { foo: { bar: "123" } }
        );
    });

    it("should cast existing properties of compound-type to JSON strings", () => {
        assert.deepStrictEqual(
            ensure(
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
            ensure({ foo: [1, 2, 3] }, { foo: [String] }),
            { foo: ["1", "2", "3"] }
        );
    });

    it("should create empty strings as default values for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: String, bar: "" }),
            { foo: "", bar: "" }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: String }),
            { foo: "" }
        );
    });

    it("should use the given strings in the schema as default values", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: "Hello", bar: "World" }),
            { foo: "Hello", bar: "World" }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: String } }),
            { foo: { bar: "" } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: "" } }),
            { foo: { bar: "" } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [String] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [""] } }),
            { foo: { bar: [] } }
        );
    });

    it("should throw proper error when casting failed on property", () => {
        let [err1] = doTry(() => ensure({ foo: () => { } }, { foo: String }));
        let [err2] = doTry(() => ensure({ foo: { bar: () => { } } }, { foo: { bar: String } }));
        let [err3] = doTry(() => ensure({ foo: [Symbol("id")] }, { foo: [String] }));
        let [err4] = doTry(() => ensure([{ foo: () => { } }], [{ foo: String }]));
        let [err5] = doTry(() => ensure([{ foo: { bar: () => { } } }], [{ foo: { bar: String } }]));

        assert.strictEqual(
            String(err1),
            "TypeError: The value of 'foo' is not a string and cannot be casted into one"
        );
        assert.strictEqual(
            String(err2),
            "TypeError: The value of 'foo.bar' is not a string and cannot be casted into one"
        );
        assert.strictEqual(
            String(err3),
            "TypeError: The value of 'foo.0' is not a string and cannot be casted into one"
        );
        assert.strictEqual(
            String(err4),
            "TypeError: The value of '0.foo' is not a string and cannot be casted into one"
        );
        assert.strictEqual(
            String(err5),
            "TypeError: The value of '0.foo.bar' is not a string and cannot be casted into one"
        );
    });
});