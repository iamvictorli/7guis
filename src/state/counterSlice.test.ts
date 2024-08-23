import { expect, test } from "vitest";
import reducer, { initialState, increment } from "./counterSlice";

test("should increment", () => {
  expect(reducer(initialState, increment())).toEqual({ count: 1 });
});
