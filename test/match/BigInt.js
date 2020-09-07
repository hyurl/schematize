/* global describe, it, BigInt */
const assert = require("assert");
const { match } = require("../..");

describe("match: BigInt", () => {
    it("should pass for BigInt values", () => {
        assert(match({ foo: 123n, bar: 456n }, { foo: BigInt, bar: 456n }));
    });

    it("should fail for non-BigInt values", () => {
        assert(!match({ foo: 123 }, { foo: BigInt }));
        assert(!match({ foo: 123n }, { foo: 456n }));
    });
});
