/* global describe, it */
const assert = require("assert");
const { schematize } = require("../..");

const date = new Date();

describe("schematize: Date", () => {
    it("should return as-is for existing properties of Date type", () => {
        assert.deepStrictEqual(
            schematize({ foo: date }, { foo: Date }),
            { foo: date }
        );
    });

    it("should return as-is for existing sub-properties of Date type", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: date } },
                { foo: { bar: Date } }
            ),
            { foo: { bar: date } }
        );
    });

    it("should cast existing properties of non-date type to Dates", () => {
        assert.deepStrictEqual(
            schematize({ foo: date.toISOString() }, { foo: Date }),
            { foo: date }
        );
        assert.deepStrictEqual(
            schematize({ foo: date.valueOf() }, { foo: Date }),
            { foo: date }
        );
    });

    it("should cast existing values in sub-node to Dates", () => {
        assert.deepStrictEqual(
            schematize(
                { foo: { bar: date.toISOString() } },
                { foo: { bar: Date } }
            ),
            { foo: { bar: date } }
        );
        assert.deepStrictEqual(
            schematize({ foo: { bar: date.valueOf() } }, { foo: { bar: Date } }),
            { foo: { bar: date } }
        );
    });

    it("should cast all elements in an array to Dates by array schema", () => {
        assert.deepStrictEqual(
            schematize({ foo: [date.toISOString(), date.valueOf()] }, { foo: [Date] }),
            { foo: [date, date] }
        );
    });

    it("should use the current date as default value for missing properties", () => {
        assert(schematize({}, { foo: Date }).foo instanceof Date);
    });

    it("should use the given date as the default value for missing properties", () => {
        assert.deepStrictEqual(schematize({}, { foo: date }), { foo: date });
    });

    it("should create default values in sub-nodes", () => {
        assert.deepStrictEqual(
            schematize({ foo: {} }, { foo: { bar: date } }),
            { foo: { bar: date } }
        );
        assert.deepStrictEqual(
            schematize({}, { foo: { bar: date } }),
            { foo: { bar: date } }
        );
    });
});
