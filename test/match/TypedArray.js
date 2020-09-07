/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: typedArray", () => {
    it("should pass for TypedArray", () => {
        assert(match(
            { foo: Uint8Array.from([1, 2, 3]) },
            { foo: Uint8Array }
        ));
    });

    it("should pass for Uint8Array instance as schema", () => {
        assert(match(
            { foo: Uint8Array.from([1, 2, 3]) },
            { foo: Uint8Array.from([1, 2, 3]) }
        ));
    });

    it("should fail for other TypedArray instance as schema", () => {
        assert(!match(
            { foo: Int8Array.from([1, 2, 3]) },
            { foo: Int8Array.from([1, 2, 3]) }
        ));
    });

    it("should fail for non-TypedArray values", () => {
        assert(!match(
            { foo: [1, 2, 3] },
            { foo: Int8Array.from([1, 2, 3]) }
        ));
    });
});
