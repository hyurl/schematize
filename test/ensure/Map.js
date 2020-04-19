/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Map", () => {
    const entries = [["foo", "Hello"], ["bar", "World"]];
    const map = new Map(entries);

    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: Map }), { foo: new Map() });
        assert.deepStrictEqual(ensure({}, { foo: map }), { foo: map });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: Map } }),
            { foo: { bar: new Map() } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: map } }),
            { foo: { bar: map } }
        );
    });

    it("should cast existing value to Map", () => {
        assert.deepStrictEqual(
            ensure({ foo: map }, { foo: Map }),
            { foo: map }
        );
        assert.deepStrictEqual(
            ensure({ foo: entries }, { foo: Map }),
            { foo: map }
        );
    });

    it("should cast existing value in sub-nodes to Map", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: entries } }, { foo: { bar: Map } }),
            { foo: { bar: map } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: "not a Map" }, { foo: Map });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a Map and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: [1, 2, 3] } }, { foo: { bar: Map } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a Map and cannot be casted into one"
        );
    });
});