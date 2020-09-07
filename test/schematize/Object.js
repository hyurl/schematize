/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

class A {
    constructor() {
        this.foo = "hello";
        this.bar = "world";
    }
}

describe("schematize: Object", () => {
    it("should return as-is for existing properties of object type", () => {
        assert.deepStrictEqual(
            schematize({ foo: {}, bar: { foo: {} } }, { foo: Object, bar: {} }),
            { foo: {}, bar: { foo: {} } }
        );
    });

    it("should return as-is for existing sub-properties of object type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: { hello: "world" } } },
                { foo: { bar: Object } }
            ),
            { foo: { bar: { hello: "world" } } }
        );
    });

    it("should cast existing properties of non-object type to objects", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: '{"hello":"world"}' },
                { foo: Object }
            ),
            { foo: { hello: "world" } }
        );
    });

    it("should cast existing properties of object-derivative to plain objects", () => {
        assert.deepStrictEqual(
            schematize({ foo: new A() }, { foo: Object }),
            { foo: { foo: "hello", bar: "world" } }
        );
    });

    it("should cast existing values in sub-node to objects", () => {
        assert.deepStrictEqual(
            schematize({ foo: { bar: '{"hello":"world"}' } }, { foo: { bar: Object } }),
            { foo: { bar: { hello: "world" } } }
        );
    });

    it("should cast all elements in an array to objects by array schema", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: ['{"hello":"world"}'] },
                { foo: [Object] }
            ),
            { foo: [{ hello: "world" }] }
        );
    });

    it("should use empty object as default value for missing properties", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: Object }),
            { foo: {} }
        );
        assert.deepStrictEqual(
            schematize({ foo: null }, { foo: Object }),
            { foo: {} }
        );
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: Object } }),
            { foo: { bar: {} } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: {} } }),
            { foo: { bar: {} } }
        );
    });

    it("should create empty arrays for array schemas", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: [Object] }),
            { foo: [] }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: [{}] } }),
            { foo: { bar: [] } }
        );
    });
});
