/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const entries = [-126, 0, 127];
const arr = Int8Array.from(entries);

describe("schematize: TypedArray", () => {
    it("should return as-is for existing properties of Int8Array type", () => {
        assert.deepStrictEqual(
            schematize({ foo: arr }, { foo: Int8Array }),
            { foo: arr }
        );
    });

    it("should return as-is for existing sub-properties of Int8Array type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: arr } },
                { foo: { bar: Int8Array } }
            ),
            { foo: { bar: arr } }
        );
    });

    it("should cast existing properties of non-typed-array type to Int8Array", () => {
        assert.deepStrictEqual(
            schematize({ arr: entries }, { arr: Int8Array }),
            { arr }
        );
    });

    it("should cast existing values in sub-node to Int8Arrays", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: entries } }, { foo: { bar: Int8Array } }),
            { foo: { bar: arr } }
        );
    });

    it("should cast all elements in an array to Int8Arrays by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [entries] }, { foo: [Int8Array] }),
            { foo: [arr] }
        );
    });

    it("should use an empty Int8Array as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: Int8Array }), { foo: Int8Array.from([]) });
    });

    it("should use the given Int8Array object as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: arr }), { foo: arr });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: Int8Array } }),
            { foo: { bar: Int8Array.from([]) } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: arr } }),
            { foo: { bar: arr } }
        );
    });
});
