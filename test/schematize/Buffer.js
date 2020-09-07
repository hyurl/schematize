/* global describe, it */
const assert = require("assert");
const { schematize: schematize } = require("../..");

const entries = [0, 1, 255];
const buf = Buffer.from(entries);

describe("schematize: Buffer", () => {
    it("should return as-is for existing properties of Buffer type", () => {
        assert.deepStrictEqual(
            schematize({ foo: buf }, { foo: Buffer }),
            { foo: buf }
        );
    });

    it("should return as-is for existing sub-properties of Buffer type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: buf } },
                { foo: { bar: Buffer } }
            ),
            { foo: { bar: buf } }
        );
    });

    it("should cast existing properties of non-buffer type to Buffer", () => {
        assert.deepStrictEqual(
            schematize({
                arr: entries,
                str: "Hello, World!",
                uint8: Uint8Array.from([0, 1, 2, 3]),
                buf: new ArrayBuffer(8)
            }, {
                arr: Buffer,
                str: Buffer,
                uint8: Buffer,
                buf: Buffer
            }),
            {
                arr: buf,
                str: Buffer.from("Hello, World!"),
                uint8: Buffer.from(Uint8Array.from([0, 1, 2, 3])),
                buf: Buffer.from(new ArrayBuffer(8))
            }
        );
    });

    it("should cast existing values in sub-node to Buffers", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: entries } }, { foo: { bar: Buffer } }),
            { foo: { bar: buf } }
        );
    });

    it("should cast all elements in an array to Buffers by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [entries] }, { foo: [Buffer] }),
            { foo: [buf] }
        );
    });

    it("should use an empty Buffer as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: Buffer }), { foo: Buffer.from([]) });
    });

    it("should use the given set object as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: buf }), { foo: buf });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: Buffer } }),
            { foo: { bar: Buffer.from([]) } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: buf } }),
            { foo: { bar: buf } }
        );
    });
});
