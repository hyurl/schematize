/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

class A {
    constructor() {
        this.foo = "hello";
        this.bar = "world";
    }
}

describe("ensure: Object", () => {
    it("should return as-is for existing properties of object type", () => {
        assert.deepStrictEqual(
            ensure({ foo: {}, bar: { foo: {} } }, { foo: Object, bar: {} }),
            { foo: {}, bar: { foo: {} } }
        );
    });

    it("should return as-is for existing sub-properties of object type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: { hello: "world" } } },
                { foo: { bar: Object } }
            ),
            { foo: { bar: { hello: "world" } } }
        );
    });

    it("should cast existing properties of non-object type to objects", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: '{"hello":"world"}' },
                { foo: Object }
            ),
            { foo: { hello: "world" } }
        );
    });

    it("should cast existing properties of object-derivative to plain objects", () => {
        assert.deepStrictEqual(
            ensure({ foo: new A() }, { foo: Object }),
            { foo: { foo: "hello", bar: "world" } }
        );
    });

    it("should cast existing values in sub-node to objects", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: '{"hello":"world"}' } }, { foo: { bar: Object } }),
            { foo: { bar: { hello: "world" } } }
        );
    });

    it("should cast all elements in an array to objects by array schema", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: ['{"hello":"world"}'] },
                { foo: [Object] }
            ),
            { foo: [{ hello: "world" }] }
        );
    });

    it("should use empty object as default value for missing properties", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: Object }),
            { foo: {} }
        );
        assert.deepStrictEqual(
            ensure({ foo: null }, { foo: Object }),
            { foo: {} }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Object } }),
            { foo: { bar: {} } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: {} } }),
            { foo: { bar: {} } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            ensure({}, { foo: [Object] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: [{}] } }),
            { foo: { bar: [] } }
        );
    });
});