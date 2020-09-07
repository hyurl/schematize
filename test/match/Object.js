/* global describe, it */
const assert = require("assert");
const { match } = require("../..");

describe("match: Object", () => {
    it("should pass for an object", () => {
        assert(match({ foo: { hello: "world" } }, { foo: Object }));
    });

    it("should fail for having non-object values  or the object is not a direct instance of Object", () => {
        assert(!match({ foo: 123 }, { foo: Object }));
        assert(!match({ foo: [123] }, { foo: Object }));
        assert(!match({ foo: new Date() }, { foo: Object }));
    });
});
