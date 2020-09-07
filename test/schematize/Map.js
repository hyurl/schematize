/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const entries = [["foo", "Hello"], ["bar", "World"]];
const map = new Map(entries);

describe("schematize: Map", () => {
    it("should return as-is for existing properties of Map type", () => {
        assert.deepStrictEqual(
            schematize({ foo: map }, { foo: Map }),
            { foo: map }
        );
    });

    it("should return as-is for existing sub-properties of Map type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: map } },
                { foo: { bar: Map } }
            ),
            { foo: { bar: map } }
        );
    });

    it("should cast existing properties of non-map type to Map", () => {
        assert.deepStrictEqual(
            schematize({ foo: entries }, { foo: Map }),
            { foo: map }
        );
    });

    it("should cast existing values in sub-node to Maps", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: entries } }, { foo: { bar: Map } }),
            { foo: { bar: map } }
        );
    });

    it("should cast all elements in an array to Maps by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [entries] }, { foo: [Map] }),
            { foo: [map] }
        );
    });

    it("should use an empty map as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: Map }), { foo: new Map() });
    });

    it("should use the given map object as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: map }), { foo: map });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: Map } }),
            { foo: { bar: new Map() } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: map } }),
            { foo: { bar: map } }
        );
    });
});
