/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

const entries = ["Hello", "World"];
const set = new Set(entries);

describe("ensure: Set", () => {
    it("should return as-is for existing properties of Set type", () => {
        assert.deepStrictEqual(
            ensure({ foo: set }, { foo: Set }),
            { foo: set }
        );
    });

    it("should return as-is for existing sub-properties of Set type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: set } },
                { foo: { bar: Set } }
            ),
            { foo: { bar: set } }
        );
    });

    it("should cast existing properties of non-set type to Set", () => {
        assert.deepStrictEqual(
            ensure({ foo: entries }, { foo: Set }),
            { foo: set }
        );
    });

    it("should cast existing values in sub-node to Sets", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: entries } }, { foo: { bar: Set } }),
            { foo: { bar: set } }
        );
    });

    it("should cast all elements in an array to Sets by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: [entries] }, { foo: [Set] }),
            { foo: [set] }
        );
    });

    it("should use an empty set as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: Set }), { foo: new Set() });
    });

    it("should use the given set object as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: set }), { foo: set });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Set } }),
            { foo: { bar: new Set() } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: set } }),
            { foo: { bar: set } }
        );
    });
});