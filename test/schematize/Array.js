/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

describe("schematize: Array", () => {
    it("should return as-is for existing properties of array type", () => {
        assert.deepStrictEqual(
            schematize({ foo: [1, 2, 3] }, { foo: Array }),
            { foo: [1, 2, 3] }
        );
    });

    it("should return as-is for existing sub-properties of array type", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: [1, 2, 3] } }, { foo: { bar: Array } }),
            { foo: { bar: [1, 2, 3] } }
        );
    });

    it("should cast existing properties of non-array type to arrays", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: '["hello","world"]', bar: "Hello,World" },
                { foo: Array, bar: Array }
            ),
            { foo: ["hello", "world"], bar: ["Hello", "World"] }
        );
    });

    it("should cast existing values in sub-node to arrays", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: '["hello","world"]' } }, { foo: { bar: Array } }),
            { foo: { bar: ["hello", "world"] } }
        );
    });

    it("should cast all elements in an array to arrays by array schema", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: ['["hello","world"]', "Hello,World"] },
                { foo: [Array] }
            ),
            { foo: [["hello", "world"], ["Hello", "World"]] }
        );
    });

    it("should use empty array as default value for missing properties", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: Array }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            schematize({ foo: null }, { foo: [] }),
            { foo: [] }
        );
    });

    it("should create default value in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: Array } }),
            { foo: { bar: [] } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: [] } }),
            { foo: { bar: [] } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: [Array] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: [[]] } }),
            { foo: { bar: [] } }
        );
    });
});
