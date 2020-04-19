/* global describe, it */
const assert = require("assert");
const { ensure } = require("../..");

describe("ensure: Other Types", () => {
    it("should ensure default value of functions", () => {
        let fn1 = () => { };
        let fn2 = function () { };

        assert.deepStrictEqual(
            ensure({}, { foo: fn1, bar: fn2 }),
            { foo: fn1, bar: fn2 }
        );
    });

    it("should ensure the value of user-defined types", () => {
        class A { }

        const a = new A;

        assert.deepStrictEqual(ensure({}, { foo: A }), { foo: null });
        assert.deepStrictEqual(ensure({}, { foo: a }), { foo: a });
        assert.deepStrictEqual(ensure({ foo: a }, { foo: A }), { foo: a });
    });
});