/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: Boolean", () => {
    it("should pass for boolean values", () => {
        assert(match({ foo: true, bar: false }, { foo: Boolean, bar: false }));
    });

    it("should fail for non-boolean values", () => {
        assert(!match({ foo: 1 }, { foo: Boolean }));
        assert(!match({ foo: false }, { foo: true }));
    });
});
