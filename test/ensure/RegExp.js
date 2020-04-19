/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: RegExp", () => {
    const pattern = "/[0-9a-f]{40}/i";
    const regex = /[0-9a-f]{40}/i;

    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: RegExp }), { foo: null });
        assert.deepStrictEqual(ensure({}, { foo: regex }), { foo: regex });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: RegExp } }),
            { foo: { bar: null } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: regex } }),
            { foo: { bar: regex } }
        );
    });

    it("should cast existing value to RegExp", () => {
        assert.deepStrictEqual(
            ensure({ foo: regex }, { foo: RegExp }),
            { foo: regex }
        );
        assert.deepStrictEqual(
            ensure({ foo: pattern }, { foo: RegExp }),
            { foo: regex }
        );
    });

    it("should cast existing value in sub-nodes to RegExp", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: pattern } }, { foo: { bar: RegExp } }),
            { foo: { bar: regex } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: "not a RegExp" }, { foo: RegExp });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a RegExp and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: "not a RegExp" } }, { foo: { bar: RegExp } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a RegExp and cannot be casted into one"
        );
    });
});