/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: URL", () => {
    const url = "https://github.com/hyurl/utils";
    const urlObj = new URL(url);

    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: URL }), { foo: null });
        assert.deepStrictEqual(ensure({}, { foo: urlObj }), { foo: urlObj });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: URL } }),
            { foo: { bar: null } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: urlObj } }),
            { foo: { bar: urlObj } }
        );
    });

    it("should cast existing value to URL", () => {
        assert.deepStrictEqual(
            ensure({ foo: urlObj }, { foo: URL }),
            { foo: urlObj }
        );
        assert.deepStrictEqual(
            ensure({ foo: url }, { foo: URL }),
            { foo: urlObj }
        );
    });

    it("should cast existing value in sub-nodes to URL", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: url } }, { foo: { bar: URL } }),
            { foo: { bar: urlObj } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: "not a URL" }, { foo: URL });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a(n) URL and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: "not a URL" } }, { foo: { bar: URL } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a(n) URL and cannot be casted into one"
        );
    });
});