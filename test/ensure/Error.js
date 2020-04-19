/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Error", () => {
    it("should ensure default value", () => {
        assert.deepStrictEqual(ensure({}, { foo: Error }), { foo: null });
        assert.deepStrictEqual(
            ensure({}, { foo: TypeError }),
            { foo: null }
        );

        const stxErr = new SyntaxError("invalid syntax");

        assert.deepStrictEqual(
            ensure({}, { foo: stxErr }),
            { foo: stxErr }
        );
    });

    it("should cast existing value to an Error", () => {
        let msg = "something went wrong";
        let err = new RangeError(msg);
        let errObj = {
            name: "RangeError",
            message: msg,
            stack: err.stack
        };

        assert.deepStrictEqual(
            ensure({ foo: err }, { foo: Error }),
            { foo: err }
        );

        let obj1 = ensure({ foo: msg }, { foo: Error });
        assert(obj1.foo instanceof Error);
        assert.strictEqual(obj1.foo.message, msg);

        let obj2 = ensure({ foo: msg }, { foo: EvalError });
        assert(obj2.foo instanceof EvalError);
        assert.strictEqual(obj2.foo.message, msg);

        let obj3 = ensure({ foo: errObj }, { foo: RangeError });
        assert(obj3.foo instanceof RangeError);
        assert.strictEqual(obj3.foo.name, "RangeError");
        assert.strictEqual(obj3.foo.message, msg);
        assert.strictEqual(obj3.foo.stack, err.stack);

        let obj4 = ensure({ foo: errObj }, { foo: Error });
        assert(obj3.foo instanceof RangeError);
        assert.strictEqual(obj4.foo.name, "RangeError");
        assert.strictEqual(obj4.foo.message, msg);
        assert.strictEqual(obj4.foo.stack, err.stack);
    });

    it("should throw proper error if cast failed", () => {
        let err;

        try {
            ensure({ foo: 123 }, { foo: URIError });
        } catch (e) {
            err = e;
        }

        assert.strictEqual(
            String(err),
            "TypeError: The value of 'foo' is not a(n) URIError and cannot be casted into one"
        );
    });
});