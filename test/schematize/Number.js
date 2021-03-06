/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const date = new Date();

describe("schematize: Number", () => {
    it("should return as-is for existing properties of number type", () => {
        assert.deepStrictEqual(
            schematize({ foo: 123 }, { foo: Number }),
            { foo: 123 }
        );
    });

    it("should return as-is for existing sub-properties of number type", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: 123 } }, { foo: { bar: Number } }),
            { foo: { bar: 123 } }
        );
    });

    it("should cast existing properties of non-number type to numbers", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: "123", yes: true, no: false, date },
                { foo: Number, yes: Number, no: Number, date: Number }
            ),
            { foo: 123, yes: 1, no: 0, date: date.valueOf() }
        );
    });

    it("should cast existing values in sub-node to numbers", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: "123" } }, { foo: { bar: Number } }),
            { foo: { bar: 123 } }
        );
    });

    it("should cast all elements in an array to numbers by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: ["1", true, false] }, { foo: [Number] }),
            { foo: [1, 1, 0] }
        );
    });

    it("should use `0` as default value for missing properties", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: Number, bar: 0 }),
            { foo: 0, bar: 0 }
        );
        assert.deepStrictEqual(
            schematize({ foo: null }, { foo: Number }),
            { foo: 0 }
        );
    });

    it("should use the given numbers in the schema as default values", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: 1, bar: -1 }),
            { foo: 1, bar: -1 }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: Number } }),
            { foo: { bar: 0 } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: 0 } }),
            { foo: { bar: 0 } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: [Number] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: [0] } }),
            { foo: { bar: [] } }
        );
    });
});
