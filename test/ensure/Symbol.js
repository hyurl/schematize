/* global describe, it, BigInt */
const assert = require("assert");
const { ensure } = require("../..");

describe("Symbol", () => {
    it("should ensure the default value", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Symbol }),
            { foo: null }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: Symbol.for("foo") }),
            { foo: Symbol.for("foo") }
        );
    });

    it("should ensure the default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Symbol } }),
            { foo: { bar: null } }
        );
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Symbol.for("foo") } }),
            { foo: { bar: Symbol.for("foo") } }
        );
    });

    it("should cast existing value to boolean", () => {
        assert.deepStrictEqual(
            ensure({ foo: Symbol.for("foo") }, { foo: Symbol }),
            { foo: Symbol.for("foo") }
        );
        assert.deepStrictEqual(
            ensure({ foo: "foo" }, { foo: Symbol }),
            { foo: Symbol.for("foo") }
        );
        assert.deepStrictEqual(
            ensure({ foo: 123 }, { foo: Symbol }),
            { foo: Symbol.for("123") }
        );

        if (typeof BigInt === "function") {
            assert.deepStrictEqual(
                ensure({ foo: BigInt(123) }, { foo: Symbol }),
                { foo: Symbol.for("123") }
            );
        }
    });

    it("should cast existing value in sub-nodes to symbol", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: "fooBar" } }, { foo: { bar: Symbol } }),
            { foo: { bar: Symbol.for("fooBar") } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: {} }, { foo: Symbol });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a symbol and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: {} } }, { foo: { bar: Symbol } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a symbol and cannot be casted into one"
        );
    });
});