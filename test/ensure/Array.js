/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Array", () => {
    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: Array }), { foo: [] });
        assert.deepStrictEqual(ensure({}, { foo: [] }), { foo: [] });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Array } }),
            { foo: { bar: [] } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [] } }, { foo: { bar: [] } }),
            { foo: { bar: [] } }
        );
    });

    it("should cast existing value to array", () => {
        assert.deepStrictEqual(
            ensure({ foo: [1, 2, 3] }, { foo: [] }),
            { foo: [1, 2, 3] }
        );
        assert.deepStrictEqual(
            ensure({ foo: "Hello, World!" }, { foo: Array }),
            { foo: "Hello, World!".split("") }
        );
        assert.deepStrictEqual(
            ensure({ foo: new Set([1, 2, 3]) }, { foo: [] }),
            { foo: [1, 2, 3] }
        );
        assert.deepStrictEqual(
            ensure({ foo: Uint8Array.from([1, 2, 3]) }, { foo: [] }),
            { foo: [1, 2, 3] }
        );
    });

    it("should cast existing value in sub-nodes to array", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: "Hello, World!" } }, { foo: { bar: [] } }),
            { foo: { bar: "Hello, World!".split("") } }
        );
    });

    it("should cast JSON string in array notation to array", () => {
        assert.deepStrictEqual(
            ensure({ foo: `["hello","world"]` }, { foo: Array }),
            { foo: ["hello", "world"] }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: 123 }, { foo: Array });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not an Array and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: 123 } }, { foo: { bar: [] } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not an Array and cannot be casted into one"
        );
    });
});