/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: Buffer", () => {
    it("should pass for Node.js Buffer", () => {
        assert(match(
            { foo: Buffer.from("Hello, World!"), bar: Buffer.from([1, 2, 3]) },
            { foo: Buffer, bar: Buffer.from([1, 2, 3]) }
        ));
    });

    it("should pass when comparing Node.js Buffer to Uint8Array", () => {
        assert(match(
            { foo: Buffer.from("Hello, World!") },
            { foo: Uint8Array }
        ));

        assert(match(
            { foo: Buffer.from([1, 2, 3]) },
            { foo: Uint8Array.from([1, 2, 3]) }
        ));
    });

    it("should fail when comparing Uint8Array to Node.js Buffer", () => {
        assert(!match(
            { foo: Uint8Array.from([1, 2, 3]) },
            { foo: Buffer }
        ));

        assert(!match(
            { bar: Uint8Array.from([4, 5, 6]) },
            { bar: Buffer.from([4, 5, 6]) }
        ));
    });

    it("should fail for non-Buffer values", () => {
        assert(!match({ foo: Uint8Array.from([1, 2, 3]) }, { foo: Buffer }));
        assert(!match(
            { foo: Buffer.from("Hello, World!") },
            { foo: Buffer.from([1, 2, 3]) }
        ));
    });
});
