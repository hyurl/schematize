/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Buffer", () => {
    const entries = [0, 1, 255];
    const buf = Buffer.from(entries);

    it("should ensure default value", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Buffer }),
            { foo: Buffer.from([]) }
        );
        assert.deepStrictEqual(ensure({}, { foo: buf }), { foo: buf });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Buffer } }),
            { foo: { bar: Buffer.from([]) } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: buf } }),
            { foo: { bar: buf } }
        );
    });

    it("should cast existing value to Buffer", () => {
        assert.deepStrictEqual(
            ensure({ foo: buf }, { foo: Buffer }),
            { foo: buf }
        );
        assert.deepStrictEqual(
            ensure({ foo: entries }, { foo: Buffer }),
            { foo: buf }
        );
        assert.deepStrictEqual(
            ensure(
                { foo: "Hello, World!" },
                { foo: Buffer }
            ),
            { foo: Buffer.from("Hello, World!") }
        );
        assert.deepStrictEqual(
            ensure(
                { foo: Uint8Array.from(entries) },
                { foo: Buffer }
            ),
            { foo: Buffer.from(entries) }
        );
        assert.deepStrictEqual(
            ensure(
                { foo: Uint8Array.from(entries).buffer },
                { foo: Buffer }
            ),
            { foo: Buffer.from(entries) }
        );
    });

    it("should cast existing value in sub-nodes to Buffer", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: entries } }, { foo: { bar: Buffer } }),
            { foo: { bar: buf } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: 123 }, { foo: Buffer });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a Buffer and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: 123 } }, { foo: { bar: Buffer } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a Buffer and cannot be casted into one"
        );
    });
});