/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: BigInt", () => {
    it("should pass for numbers", () => {
        assert(match(
            { foo: 123, bar: 456, foo2: -0, bar2: NaN },
            { foo: Number, bar: 456, foo2: 0, bar2: NaN }
        ));
    });

    it("should fail for non-numbers", () => {
        assert(!match({ foo: "123" }, { foo: Number }));
    });
});
