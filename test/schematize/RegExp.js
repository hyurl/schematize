/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const pattern = "/[0-9a-f]{40}/i";
const regex = /[0-9a-f]{40}/i;

describe("schematize: RegExp", () => {
    it("should return as-is for existing properties of RegExp type", () => {
        assert.deepStrictEqual(
            schematize({ foo: regex }, { foo: RegExp }),
            { foo: regex }
        );
    });

    it("should return as-is for existing sub-properties of RegExp type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: regex } },
                { foo: { bar: RegExp } }
            ),
            { foo: { bar: regex } }
        );
    });

    it("should cast existing properties of non-regexp type to RegExp", () => {
        assert.deepStrictEqual(
            schematize({ foo: pattern }, { foo: RegExp }),
            { foo: regex }
        );
    });

    it("should cast existing values in sub-node to RegExps", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: pattern } }, { foo: { bar: RegExp } }),
            { foo: { bar: regex } }
        );
    });

    it("should cast all elements in an array to URLs by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [pattern] }, { foo: [RegExp] }),
            { foo: [regex] }
        );
    });

    it("should use `null` as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: RegExp }), { foo: null });
    });

    it("should use the given regex object as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: regex }), { foo: regex });
    });

    it("should create default value in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: RegExp } }),
            { foo: { bar: null } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: regex } }),
            { foo: { bar: regex } }
        );
    });
});
