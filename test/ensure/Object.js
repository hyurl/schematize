/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

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
                { foo: '{"hello":"world"}', bar: '["hello","world"]' },
                { foo: Object, bar: Object }
            ),
            {
                foo: { hello: "world" },
                bar: ["hello", "world"]
            }
        );
    });

    it("should cast existing properties of object-derivative to plain objects", () => {
        assert.deepStrictEqual(
            ensure({ foo: new A() }, { foo: Object }),
            { foo: { foo: "hello", bar: "world" } }
        );
    });

    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: Object }), { foo: {} });
        assert.deepStrictEqual(ensure({}, { foo: {} }), { foo: {} });
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
                { foo: ['{"hello":"world"}', '["hello","world"]'] },
                { foo: [Object] }
            ),
            { foo: [{ hello: "world" }, ["hello", "world"]] }
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

    it("should use the given objects in the schema as default values", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: null },
                { foo: {}, bar: { hello: "world" } }
            ),
            { foo: {}, bar: { hello: "world" } }
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

    it("should support top level array schemas", () => {
        assert.deepStrictEqual(
            ensure(
                [{ foo: '{"hello":"world"}' }, { foo: '["hello","world"]' }],
                [{ foo: Object }]
            ),
            [{ foo: { hello: "world" } }, { foo: ["hello", "world"] }]
        );
    });

    it("should throw proper error when casting failed on property", () => {
        let [err1] = doTry(() => ensure({ foo: "Hello, World!" }, { foo: Object }));
        let [err2] = doTry(() => ensure({ foo: { bar: "Hello, World!" } }, { foo: { bar: Object } }));
        let [err3] = doTry(() => ensure({ foo: [123] }, { foo: [Object] }));
        let [err4] = doTry(() => ensure([{ foo: true }], [{ foo: Object }]));
        let [err5] = doTry(() => ensure([{ foo: { bar: false } }], [{ foo: { bar: Object } }]));

        assert.strictEqual(
            String(err1),
            "TypeError: The value of 'foo' is not an Object and cannot be casted into one"
        );
        assert.strictEqual(
            String(err2),
            "TypeError: The value of 'foo.bar' is not an Object and cannot be casted into one"
        );
        assert.strictEqual(
            String(err3),
            "TypeError: The value of 'foo.0' is not an Object and cannot be casted into one"
        );
        assert.strictEqual(
            String(err4),
            "TypeError: The value of '0.foo' is not an Object and cannot be casted into one"
        );
        assert.strictEqual(
            String(err5),
            "TypeError: The value of '0.foo.bar' is not an Object and cannot be casted into one"
        );
    });
});