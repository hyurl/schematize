/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

const date = new Date();

describe("ensure: Number", () => {
    it("should return as-is for existing properties of number type", () => {
        assert.deepStrictEqual(
            ensure({ foo: 123 }, { foo: Number }),
            { foo: 123 }
        );
    });

    it("should return as-is for existing sub-properties of number type", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: 123 } }, { foo: { bar: Number } }),
            { foo: { bar: 123 } }
        );
    });

    it("should cast existing properties of non-number type to numbers", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: "123", yes: true, no: false, date },
                { foo: Number, yes: Number, no: Number, date: Number }
            ),
            { foo: 123, yes: 1, no: 0, date: date.valueOf() }
        );
    });

    it("should cast existing values in sub-node to numbers", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: "123" } }, { foo: { bar: Number } }),
            { foo: { bar: 123 } }
        );
    });

    it("should cast all elements in an array to numbers by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: ["1", true, false] }, { foo: [Number] }),
            { foo: [1, 1, 0] }
        );
    });

    it("should use `0` as default value for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Number, bar: 0 }),
            { foo: 0, bar: 0 }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: Number }),
            { foo: 0 }
        );
    });

    it("should use the given numbers in the schema as default values", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: 1, bar: -1 }),
            { foo: 1, bar: -1 }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Number } }),
            { foo: { bar: 0 } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: 0 } }),
            { foo: { bar: 0 } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [Number] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [0] } }),
            { foo: { bar: [] } }
        );
    });

    it("should support top level array schemas", () => {
        assert.deepStrictEqual(
            ensure([{ foo: "123" }, { foo: "456" }], [{ foo: Number }]),
            [{ foo: 123 }, { foo: 456 }]
        );
    });

    it("should throw proper error when casting failed on properties", () => {
        let [err1] = doTry(() => ensure({ foo: "abc" }, { foo: Number }));
        let [err2] = doTry(() => ensure({ foo: { bar: "abc" } }, { foo: { bar: Number } }));
        let [err3] = doTry(() => ensure({ foo: ["abc"] }, { foo: [Number] }));
        let [err4] = doTry(() => ensure([{ foo: "abc" }], [{ foo: Number }]));
        let [err5] = doTry(() => ensure([{ foo: { bar: "abc" } }], [{ foo: { bar: Number } }]));

        assert.deepStrictEqual(
            String(err1),
            "TypeError: The value of 'foo' is not a number and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err2),
            "TypeError: The value of 'foo.bar' is not a number and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err3),
            "TypeError: The value of 'foo.0' is not a number and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err4),
            "TypeError: The value of '0.foo' is not a number and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err5),
            "TypeError: The value of '0.foo.bar' is not a number and cannot be casted into one"
        );
    });
});