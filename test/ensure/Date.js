/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

const date = new Date();

describe("ensure: Date", () => {
    it("should ensure default value", () => {
        assert(ensure({}, { foo: Date }).foo instanceof Date);
        assert.deepStrictEqual(ensure({}, { foo: date }), { foo: date });
    });

    it("should ensure default value in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: date } }),
            { foo: { bar: date } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: date } }),
            { foo: { bar: date } }
        );
    });

    it("should cast existing value to Date", () => {
        assert.deepStrictEqual(
            ensure({ foo: date }, { foo: Date }),
            { foo: date }
        );
        assert.deepStrictEqual(
            ensure({ foo: date.toISOString() }, { foo: Date }),
            { foo: date }
        );
        assert.deepStrictEqual(
            ensure({ foo: date.valueOf() }, { foo: Date }),
            { foo: date }
        );
    });

    it("should cast existing value to Date", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: date.toISOString() } },
                { foo: { bar: Date } }
            ),
            { foo: { bar: date } }
        );
        assert.deepStrictEqual(
            ensure({ foo: { bar: date.valueOf() } }, { foo: { bar: Date } }),
            { foo: { bar: date } }
        );
    });

    it("should throw proper error if casting failed", () => {
        let err;

        try {
            ensure({ foo: "not a date" }, { foo: Date });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a Date and cannot be casted into one"
        );
    });

    it("should throw proper error if casting failed in sub-nodes", () => {
        let err;

        try {
            ensure({ foo: { bar: "not a date" } }, { foo: { bar: Date } });
        } catch (e) {
            err = e;
        }

        assert.deepStrictEqual(
            String(err),
            "TypeError: The value of 'foo.bar' is not a Date and cannot be casted into one"
        );
    });
});