/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: Symbol", () => {
    it("should pass for symbols", () => {
        assert(match(
            { foo: Symbol("foo"), bar: Symbol.for("bar"), foo2: Symbol("foo2") },
            { foo: Symbol, bar: Symbol.for("bar"), foo2: Symbol("foo2") }
        ));
    });

    it("should fail for non-symbols", () => {
        assert(!match({ foo: "foo" }, { foo: Symbol }));
    });

    it("should fail when comparing a local symbol to global symbol", () => {
        assert(!match({ foo: Symbol("foo") }, { foo: Symbol.for("foo") }));
        assert(!match({ foo: Symbol.for("foo") }, { foo: Symbol("foo") }));
    });
});
