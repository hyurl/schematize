# Schemaly

For many reasons, an API may not return the data as we want them to be. For
example, we expect a JSON response should have a `foo` property of `number` type,
however, the response provided it as a numeric `string`, or even worse it
didn't exist at all, or was set `null`, which would cause our program to crash
if not handled the exception well.

That's where **schemaly** comes in. It ensures the input data must be of a
certain structure based on the schema, and provides the ability to auto-cast
compatible values and provides default values when they're missing.