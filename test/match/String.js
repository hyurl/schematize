/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: String", () => {
    it("should pass for strings", () => {
        assert(match({ foo: "Hello, World!" }, { foo: String }));
    });

    it("should fail for non-strings", () => {
        assert(!match({ foo: 123 }, { foo: String }));
    });
});
