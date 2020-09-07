/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: Array", () => {
    it("should pass for an array", () => {
        assert(match({ foo: ["Hello", "World", 123, true] }, { foo: [] }));
    });

    it("should pass for an array of strings", () => {
        assert(match({ foo: ["Hello", "World"] }, { foo: [String] }));
    });

    it("should fail for having non-string values by a schema of strings", () => {
        assert(!match({ foo: ["Hello", "World", 123] }, { foo: [String] }));
    });
});
