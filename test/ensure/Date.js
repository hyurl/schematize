/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

const date = new Date();

describe("ensure: Date", () => {
    it("should return as-is for existing properties of Date type", () => {
        assert.deepStrictEqual(
            ensure({ foo: date }, { foo: Date }),
            { foo: date }
        );
    });

    it("should return as-is for existing sub-properties of Date type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: date } },
                { foo: { bar: Date } }
            ),
            { foo: { bar: date } }
        );
    });

    it("should cast existing properties of non-string type to strings", () => {
        assert.deepStrictEqual(
            ensure({ foo: date.toISOString() }, { foo: Date }),
            { foo: date }
        );
        assert.deepStrictEqual(
            ensure({ foo: date.valueOf() }, { foo: Date }),
            { foo: date }
        );
    });

    it("should cast existing values in sub-node to Dates", () => {
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

    it("should cast all elements in an array to Dates by array schema", () => {
        assert.deepStrictEqual(
            ensure({ foo: [date.toISOString(), date.valueOf()] }, { foo: [Date] }),
            { foo: [date, date] }
        );
    });

    it("should use the current date as default value for missing properties", () => {
        assert(ensure({}, { foo: Date }).foo instanceof Date);
    });

    it("should use the given date as the default value for missing properties", () => {
        assert.deepStrictEqual(ensure({}, { foo: date }), { foo: date });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            ensure({ foo: {} }, { foo: { bar: date } }),
            { foo: { bar: date } }
        );
        assert.deepStrictEqual(
            ensure({}, { foo: { bar: date } }),
            { foo: { bar: date } }
        );
    });
});