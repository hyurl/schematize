/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

const entries = [["foo", "Hello"], ["bar", "World"]];
const map = new Map(entries);

describe("ensure: Map", () => {
    it("should return as-is for existing properties of Map type", () => {
        assert.deepStrictEqual(
            ensure({ foo: map }, { foo: Map }),
            { foo: map }
        );
    });

    it("should return as-is for existing sub-properties of Map type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: map } },
                { foo: { bar: Map } }
            ),
            { foo: { bar: map } }
        );
    });

    it("should cast existing properties of non-url type to Map", () => {
        assert.deepStrictEqual(
            ensure({ foo: entries }, { foo: Map }),
            { foo: map }
        );
    });

    it("should cast existing values in sub-node to Maps", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: entries } }, { foo: { bar: Map } }),
            { foo: { bar: map } }
        );
    });

    it("should cast all elements in an array to Maps by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: [entries] }, { foo: [Map] }),
            { foo: [map] }
        );
    });

    it("should use an empty map as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: Map }), { foo: new Map() });
    });

    it("should use the given map object as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: map }), { foo: map });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Map } }),
            { foo: { bar: new Map() } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: map } }),
            { foo: { bar: map } }
        );
    });
});