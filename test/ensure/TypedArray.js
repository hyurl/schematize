/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: TypedArray", () => {
    it("should ensure default value", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Uint8Array }),
            { foo: Uint8Array.from([]) }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: Uint16Array }),
            { foo: Uint16Array.from([]) }
        );
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Uint32Array } }),
            { foo: { bar: Uint32Array.from([]) } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Int8Array.from([0, 1, 127]) } }),
            { foo: { bar: Int8Array.from([0, 1, 127]) } }
        );
    });

    it("should cast existing value to a TypedArray", () => {
        assert.deepStrictEqual(
            ensure({ foo: Uint8Array.from([0, 1, 255]) }, { foo: Uint8Array }),
            { foo: Uint8Array.from([0, 1, 255]) }
        );
        assert.deepStrictEqual(
            ensure({ foo: [0, 1, 255] }, { foo: Uint8Array }),
            { foo: Uint8Array.from([0, 1, 255]) }
        );
        assert.deepStrictEqual(
            ensure({ foo: new Set([0, 1, 127]) }, { foo: Int8Array }),
            { foo: Int8Array.from([0, 1, 127]) }
        );
    });

    it("should cast existing value in sub-nodes to a TypedArray", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: [0, 1, 255] } },
                { foo: { bar: Uint8Array } }
            ),
            { foo: { bar: Uint8Array.from([0, 1, 255]) } }
        );
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: new Set([0, 1, 127]) } },
                { foo: { bar: Int8Array } }
            ),
            { foo: { bar: Int8Array.from([0, 1, 127]) } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: 123 }, { foo: Uint8Array });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a(n) Uint8Array and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: 123 } }, { foo: { bar: Int8Array } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not an Int8Array and cannot be casted into one"
        );
    });
});