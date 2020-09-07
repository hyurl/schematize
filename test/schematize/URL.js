/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const url = "https://github.com/hyurl/utils";
const urlObj = new URL(url);

describe("schematize: URL", () => {
    it("should return as-is for existing properties of URL type", () => {
        assert.deepStrictEqual(
            schematize({ foo: urlObj }, { foo: URL }),
            { foo: urlObj }
        );
    });

    it("should return as-is for existing sub-properties of URL type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: urlObj } },
                { foo: { bar: URL } }
            ),
            { foo: { bar: urlObj } }
        );
    });

    it("should cast existing properties of non-url type to URL", () => {
        assert.deepStrictEqual(
            schematize({ foo: url }, { foo: URL }),
            { foo: urlObj }
        );
    });

    it("should cast existing values in sub-node to URLs", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: url } }, { foo: { bar: URL } }),
            { foo: { bar: urlObj } }
        );
    });

    it("should cast all elements in an array to URLs by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [url] }, { foo: [URL] }),
            { foo: [urlObj] }
        );
    });

    it("should use `null` as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: URL }), { foo: null });
    });

    it("should use the given url object as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: urlObj }), { foo: urlObj });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: URL } }),
            { foo: { bar: null } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: urlObj } }),
            { foo: { bar: urlObj } }
        );
    });
});
