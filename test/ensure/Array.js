/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Array", () => {
    it("should return as-is for existing properties of array type", () => {
        assert.deepStrictEqual(
            ensure({ foo: [1, 2, 3] }, { foo: Array }),
            { foo: [1, 2, 3] }
        );
    });

    it("should return as-is for existing sub-properties of array type", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: [1, 2, 3] } }, { foo: { bar: Array } }),
            { foo: { bar: [1, 2, 3] } }
        );
    });

    it("should cast existing properties of non-array type to arrays", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: '["hello","world"]', bar: "Hello,World" },
                { foo: Array, bar: Array }
            ),
            { foo: ["hello", "world"], bar: ["Hello", "World"] }
        );
    });

    it("should cast existing values in sub-node to arrays", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: '["hello","world"]' } }, { foo: { bar: Array } }),
            { foo: { bar: ["hello", "world"] } }
        );
    });

    it("should cast all elements in an array to arrays by array schema", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: ['["hello","world"]', "Hello,World"] },
                { foo: [Array] }
            ),
            { foo: [["hello", "world"], ["Hello", "World"]] }
        );
    });

    it("should use empty array as default value for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Array }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: [] }),
            { foo: [] }
        );
    });

    it("should create default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Array } }),
            { foo: { bar: [] } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [] } }, { foo: { bar: [] } }),
            { foo: { bar: [] } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [Array] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [[]] } }),
            { foo: { bar: [] } }
        );
    });
});