/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

describe("ensure: Boolean", () => {
    it("should return as-is for existing properties of boolean type", () => {
        assert.deepStrictEqual(
            ensure({ foo: true, bar: false }, { foo: Boolean, bar: Boolean }),
            { foo: true, bar: false }
        );
    });

    it("should return as-is for existing sub-properties of number type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: true }, bar: { foo: false } },
                { foo: { bar: Boolean }, bar: { foo: Boolean } }
            ),
            { foo: { bar: true }, bar: { foo: false } }
        );
    });

    it("should cast existing properties of non-boolean type to numbers", () => {
        let schema = {
            a: Boolean,
            b: Boolean,
            c: Boolean,
            d: Boolean,
            e: Boolean,
            f: Boolean,
            g: Boolean,
            h: Boolean
        };

        assert.deepStrictEqual(
            ensure(
                {
                    a: 1,
                    b: "1",
                    c: "true",
                    d: "True",
                    e: "yes",
                    f: "Yes",
                    g: "on",
                    h: "On"
                },
                schema
            ),
            {
                a: true,
                b: true,
                c: true,
                d: true,
                e: true,
                f: true,
                g: true,
                h: true
            }
        );

        assert.deepStrictEqual(
            ensure(
                {
                    a: 0,
                    b: "0",
                    c: "false",
                    d: "False",
                    e: "no",
                    f: "No",
                    g: "off",
                    h: "Off"
                },
                schema
            ),
            {
                a: false,
                b: false,
                c: false,
                d: false,
                e: false,
                f: false,
                g: false,
                h: false
            }
        );
    });

    it("should cast existing values in sub-nodes to booleans", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: 1 } }, { foo: { bar: Boolean } }),
            { foo: { bar: true } }
        );
    });

    it("should cast all elements in an array to boolean by array schema", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: [1, 0, "1", "0", "true", "false", "yes", "no"] },
                { foo: [Boolean] }
            ),
            { foo: [true, false, true, false, true, false, true, false] }
        );
    });

    it("should use `false` as default value for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Boolean }),
            { foo: false }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: Boolean }),
            { foo: false }
        );
    });

    it("should use the given numbers in the schema as default values", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: true, bar: false }),
            { foo: true, bar: false }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Boolean } }),
            { foo: { bar: false } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: false } }),
            { foo: { bar: false } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [Boolean] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [false] } }),
            { foo: { bar: [] } }
        );
    });

    it("should support top level array schemas", () => {
        assert.deepStrictEqual(
            ensure([{ foo: 1 }, { foo: 0 }], [{ foo: Boolean }]),
            [{ foo: true }, { foo: false }]
        );
    });

    it("should throw proper error when casting failed on properties", () => {
        let [err1] = doTry(() => ensure({ foo: "abc" }, { foo: Boolean }));
        let [err2] = doTry(() => ensure({ foo: { bar: "abc" } }, { foo: { bar: Boolean } }));
        let [err3] = doTry(() => ensure({ foo: ["abc"] }, { foo: [Boolean] }));
        let [err4] = doTry(() => ensure([{ foo: "abc" }], [{ foo: Boolean }]));
        let [err5] = doTry(() => ensure([{ foo: { bar: "abc" } }], [{ foo: { bar: Boolean } }]));

        assert.deepStrictEqual(
            String(err1),
            "TypeError: The value of 'foo' is not a boolean and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err2),
            "TypeError: The value of 'foo.bar' is not a boolean and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err3),
            "TypeError: The value of 'foo.0' is not a boolean and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err4),
            "TypeError: The value of '0.foo' is not a boolean and cannot be casted into one"
        );
        assert.deepStrictEqual(
            String(err5),
            "TypeError: The value of '0.foo.bar' is not a boolean and cannot be casted into one"
        );
    });
});