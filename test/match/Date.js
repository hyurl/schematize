/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: Date", () => {
    it("should pass for Date values", () => {
        assert(match(
            { foo: new Date(), bar: new Date("1970-01-01T00:00:00.000Z") },
            { foo: Date, date: new Date(0) }));
    });

    it("should fail for non-Date values", () => {
        assert(!match({ foo: "1970-01-01T00:00:00.000Z" }, { foo: Date }));
    });
});
