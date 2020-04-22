/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

const entries = [-126, 0, 127];
const arr = Int8Array.from(entries);

describe("ensure: TypedArray", () => {
    it("should return as-is for existing properties of Int8Array type", () => {
        assert.deepStrictEqual(
            ensure({ foo: arr }, { foo: Int8Array }),
            { foo: arr }
        );
    });

    it("should return as-is for existing sub-properties of Int8Array type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: arr } },
                { foo: { bar: Int8Array } }
            ),
            { foo: { bar: arr } }
        );
    });

    it("should cast existing properties of non-typed-array type to Int8Array", () => {
        assert.deepStrictEqual(
            ensure({ arr: entries }, { arr: Int8Array }),
            { arr }
        );
    });

    it("should cast existing values in sub-node to Int8Arrays", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: entries } }, { foo: { bar: Int8Array } }),
            { foo: { bar: arr } }
        );
    });

    it("should cast all elements in an array to Int8Arrays by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: [entries] }, { foo: [Int8Array] }),
            { foo: [arr] }
        );
    });

    it("should use an empty Int8Array as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: Int8Array }), { foo: Int8Array.from([]) });
    });

    it("should use the given Int8Array object as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: arr }), { foo: arr });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Int8Array } }),
            { foo: { bar: Int8Array.from([]) } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: arr } }),
            { foo: { bar: arr } }
        );
    });
});