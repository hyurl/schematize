/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");
const pick = require("@hyurl/utils/pick").default;

const err = new Error("Something went wrong");
const errObj = pick(err, ["name", "message", "stack"]);

describe("ensure: Error", () => {
    it("should return as-is for existing properties of Error type", () => {
        assert.deepStrictEqual(
            ensure({ foo: err }, { foo: Error }),
            { foo: err }
        );
    });

    it("should return as-is for existing properties of Error-derivative type", () => {
        const err = new SyntaxError("Illegal syntax");

        assert.deepStrictEqual(
            ensure({ foo: err }, { foo: Error }),
            { foo: err }
        );
    });

    it("should return as-is for existing sub-properties of Date type", () => {
        assert.deepStrictEqual(
            ensure(
                { foo: { bar: err } },
                { foo: { bar: Error } }
            ),
            { foo: { bar: err } }
        );
    });


    it("should cast existing properties of non-error type to Errors", () => {
        let err1 = ensure({ foo: errObj }, { foo: Error }).foo;
        let err2 = ensure(
            { foo: { name: "SyntaxError", message: "Illegal syntax" } },
            { foo: Error }
        ).foo;
        let err3 = ensure({ foo: "Invalid type" }, { foo: TypeError }).foo;

        assert(err1 instanceof Error);
        assert.strictEqual(err1.name, "Error");
        assert.strictEqual(err1.message, "Something went wrong");
        assert.strictEqual(err1.stack, err.stack);

        assert(err2 instanceof SyntaxError);
        assert.strictEqual(err2.name, "SyntaxError");
        assert.strictEqual(err2.message, "Illegal syntax");

        assert(err3 instanceof TypeError);
        assert.strictEqual(err3.name, "TypeError");
        assert.strictEqual(err3.message, "Invalid type");
    });

    it("should cast existing values in sub-node to Dates", () => {
        let err = ensure({ foo: { bar: errObj } }, { foo: { bar: Error } }).foo.bar;

        assert(err instanceof Error);
        assert.strictEqual(err.name, "Error");
        assert.strictEqual(err.message, "Something went wrong");
        assert.strictEqual(err.stack, err.stack);
    });
});