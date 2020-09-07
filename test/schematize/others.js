/* global describe, it */
const assert = require("assert");
const { schematize, Optional } = require("../..");

describe("schematize: Other Types", () => {
    it("should schematize the value of functions", () => {
        let fn1 = () => { };
        let fn2 = function () { };

        assert.deepStrictEqual(schematize({}, { foo: fn1 }), { foo: fn1 });
        assert.deepStrictEqual(schematize({}, { foo: fn2 }), { foo: fn2 });
        assert.deepStrictEqual(
            schematize({ foo: fn1, bar: fn2 }, { foo: fn1, bar: Function }),
            { foo: fn1, bar: fn2 }
        );
    });

    it("should schematize the value of user-defined types", () => {
        class A { }

        const a = new A();

        assert.deepStrictEqual(schematize({}, { foo: A }), { foo: null });
        assert.deepStrictEqual(schematize({}, { foo: a }), { foo: a });
        assert.deepStrictEqual(schematize({ foo: a }, { foo: A }), { foo: a });
    });
});

describe("schematize: Optional Fields", () => {
    it("should schematize the object that contains optional fields", () => {
        assert.deepStrictEqual(
            schematize({}, { foo: String, bar: Optional(Number) }),
            { foo: "" }
        );
        assert.deepStrictEqual(
            schematize({foo: "123"}, { foo: Optional(Number) }),
            { foo: 123 }
        );
    });
});
