/* global describe, it, BigInt */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

const date = new Date();

describe("ensure: BigInt", () => {
    it("should return as-is for existing properties of bigint type", () => {
        assert.deepStrictEqual(
            ensure({ foo: 123n }, { foo: BigInt }),
            { foo: 123n }
        );
    });

    it("should return as-is for existing sub-properties of bigint type", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: 123n } }, { foo: { bar: BigInt } }),
            { foo: { bar: 123n } }
        );
    });

    it("should cast existing properties of non-bigint type to bigints", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: 123, bar: "123", yes: true, no: false, date },
                { foo: BigInt, bar: BigInt, yes: BigInt, no: BigInt, date: BigInt }
            ),
            { foo: 123n, bar: 123n, yes: 1n, no: 0n, date: BigInt(date.valueOf()) }
        );
    });

    it("should cast all elements in an array to bigints by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: [1, "1", true, false] }, { foo: [BigInt] }),
            { foo: [1n, 1n, 1n, 0n] }
        );
    });

    it("should use `0n` as default value for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: BigInt, bar: 0n }),
            { foo: 0n, bar: 0n }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: BigInt }),
            { foo: 0n }
        );
    });

    it("should use the given bigint in the schema as default values", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: 1n, bar: -1n }),
            { foo: 1n, bar: -1n }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: BigInt } }),
            { foo: { bar: 0n } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: 0n } }),
            { foo: { bar: 0n } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [BigInt] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [0n] } }),
            { foo: { bar: [] } }
        );
    });
});