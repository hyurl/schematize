/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Set", () => {
    const entries = ["Hello", "World"];
    const set = new Set(entries);

    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: Set }), { foo: new Set() });
        assert.deepStrictEqual(ensure({}, { foo: set }), { foo: set });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Set } }),
            { foo: { bar: new Set() } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: set } }),
            { foo: { bar: set } }
        );
    });

    it("should cast existing value to Set", () => {
        assert.deepStrictEqual(
            ensure({ foo: set }, { foo: Set }),
            { foo: set }
        );
        assert.deepStrictEqual(
            ensure({ foo: entries }, { foo: Set }),
            { foo: set }
        );
    });

    it("should cast existing value in sub-nodes to Set", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: entries } }, { foo: { bar: Set } }),
            { foo: { bar: set } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: "not a Set" }, { foo: Set });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a Set and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: 123 } }, { foo: { bar: Set } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a Set and cannot be casted into one"
        );
    });
});