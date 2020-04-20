/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

const url = "https://github.com/hyurl/utils";
const urlObj = new URL(url);

describe("ensure: URL", () => {
    it("should return as-is for existing properties of Date type", () => {
        assert.deepStrictEqual(
            ensure({ foo: urlObj }, { foo: URL }),
            { foo: urlObj }
        );
    });

    it("should return as-is for existing sub-properties of Date type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: urlObj } },
                { foo: { bar: URL } }
            ),
            { foo: { bar: urlObj } }
        );
    });

    it("should cast existing properties of non-url type to URL", () => {
        assert.deepStrictEqual(
            ensure({ foo: url }, { foo: URL }),
            { foo: urlObj }
        );
    });

    it("should cast existing values in sub-node to URLs", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: url } }, { foo: { bar: URL } }),
            { foo: { bar: urlObj } }
        );
    });

    it("should cast all elements in an array to URLs by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: [url] }, { foo: [URL] }),
            { foo: [urlObj] }
        );
    });

    it("should use `null` as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: URL }), { foo: null });
    });

    it("should use the given url object as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: urlObj }), { foo: urlObj });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: URL } }),
            { foo: { bar: null } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: urlObj } }),
            { foo: { bar: urlObj } }
        );
    });
});