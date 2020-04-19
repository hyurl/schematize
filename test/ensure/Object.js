/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Object", () => {
    class A {
        constructor() {
            this.foo = "hello";
            this.bar = "world";
        }
    }

    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: Object }), { foo: {} });
        assert.deepStrictEqual(ensure({}, { foo: {} }), { foo: {} });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: Object } }),
            { foo: { bar: {} } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: {} } }),
            { foo: { bar: {} } }
        );
    });

    it("should cast existing value to object", () => {
        assert.deepStrictEqual(
            ensure({ foo: { foo: "hello", bar: "world" } }, { foo: Object }),
            { foo: { foo: "hello", bar: "world" } }
        );
        assert.deepStrictEqual(
            ensure({ foo: new A() }, { foo: Object }),
            { foo: { foo: "hello", bar: "world" } }
        );
    });

    it("should cast existing value in sub-nodes to object", () => {
        assert.deepStrictEqual(
            ensure({ foo: { bar: new A() } }, { foo: { bar: Object } }),
            { foo: { bar: { foo: "hello", bar: "world" } } }
        );
    });

    it("should cast JSON string in object notation to object", () => {
        assert.deepStrictEqual(
            ensure({ foo: `{"bar":"Hello, World!"}` }, { foo: Object }),
            { foo: { bar: "Hello, World!" } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: "" }, { foo: Object });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not an Object and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: 123 } }, { foo: { bar: {} } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not an Object and cannot be casted into one"
        );
    });
});