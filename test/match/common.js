/* global describe, it */
const assert = require("assert");
const { match, Optional } = require("../..");

describe("match: common", () => {
    it("should pass for values in sub-nodes", () => {
        assert(match({ foo: { bar: "Hello, World!" } }, { foo: { bar: String } }));
    });

    it("should pass for user-defined types", () => {
        class A { }

        assert(match({ foo: new A() }, { foo: A }));
    });

    it("should fail for missing properties from the schema", () => {
        assert(!match({ foo: "Hello, World!" }, { foo: String, bar: Number }));
    });

    it("should fail for having extra properties outside the schema", () => {
        assert(!match({ foo: "Hello, World!", bar: 123 }, { foo: String }, true));
    });

    describe("Optional Fields", () => {
        it("should pass for the value that contains optional fields", () => {
            assert(match(
                { foo: "Hello, World!" },
                { foo: String, bar: Optional(Number) }
            ));
            assert(match(
                { foo: "Hello, World!", bar: 123 },
                { foo: String, bar: Optional(Number) }
            ));
        });

        it("should fail for having incorrect type of value", () => {
            assert(!match(
                { foo: "Hello, World!", bar: "Hi, World!" },
                { foo: String, bar: Optional(Number) }
            ));
        });
    });
});
