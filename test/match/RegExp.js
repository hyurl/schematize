/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: RegExp", () => {
    it("should pass for regular expressions", () => {
        assert(match(
            { foo: /a-z/, bar: /[a-z]+/i },
            { foo: RegExp, date: /[a-z]+/i }
        ));
    });

    it("should fail for non-RegExp values", () => {
        assert(!match({ foo: "/[a-z]+/i" }, { foo: RegExp }));
        assert(!match({ foo: "/[a-z]+/i" }, { foo: /[a-z]+/i }));
    });
});
