/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");
const { default: doTry } = require("dotry");

describe("ensure: common", () => {
    it("should support top level array schemas", () => {
        assert.deepStrictEqual(
            ensure([{ foo: "Hello, World!" }, { foo: 123 }], [{ foo: String }]),
            [{ foo: "Hello, World!" }, { foo: "123" }]
        );

        assert.deepStrictEqual(
            ensure([{ foo: "123" }, { foo: "456" }], [{ foo: Number }]),
            [{ foo: 123 }, { foo: 456 }]
        );

        assert.deepStrictEqual(
            ensure([{ foo: 1 }, { foo: 0 }], [{ foo: Boolean }]),
            [{ foo: true }, { foo: false }]
        );

        assert.deepStrictEqual(
            ensure([{ foo: Symbol.for("foo") }, { foo: "foo" }], [{ foo: Symbol }]),
            [{ foo: Symbol.for("foo") }, { foo: Symbol.for("foo") }]
        );

        assert.deepStrictEqual(
            ensure(
                [{ foo: '{"hello":"world"}' }],
                [{ foo: Object }]
            ),
            [{ foo: { hello: "world" } }]
        );

        assert.deepStrictEqual(
            ensure(
                [{ foo: '["hello","world"]' }, { foo: "Hello, World" }],
                [{ foo: Array }]
            ),
            [{ foo: ["hello", "world"] }, { foo: ["Hello", "World"] }]
        );
    });

    it("should throw proper error when casting failed on property", () => {
        let [err1] = doTry(() => ensure({ foo: () => { } }, { foo: String }));
        let [err2] = doTry(() => ensure({ foo: { bar: () => { } } }, { foo: { bar: Number } }));
        let [err3] = doTry(() => ensure({ foo: [Symbol("id")] }, { foo: [Boolean] }));
        let [err4] = doTry(() => ensure([{ foo: () => { } }], [{ foo: Symbol }]));
        let [err5] = doTry(() => ensure([{ foo: { bar: () => { } } }], [{ foo: { bar: Object } }]));

        assert.strictEqual(
            String(err1),
            "TypeError: The value of 'foo' is not a string and cannot be casted into one"
        );
        assert.strictEqual(
            String(err2),
            "TypeError: The value of 'foo.bar' is not a number and cannot be casted into one"
        );
        assert.strictEqual(
            String(err3),
            "TypeError: The value of 'foo.0' is not a boolean and cannot be casted into one"
        );
        assert.strictEqual(
            String(err4),
            "TypeError: The value of '0.foo' is not a symbol and cannot be casted into one"
        );
        assert.strictEqual(
            String(err5),
            "TypeError: The value of '0.foo.bar' is not an Object and cannot be casted into one"
        );
    });
});