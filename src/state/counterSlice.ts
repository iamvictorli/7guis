import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  count: number;
}

export const initialState: CounterState = {
  count: 0,
} satisfies CounterState as CounterState;

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
  selectors: {
    selectCount: (state) => state.count,
  },
});

export const { selectCount } = counterSlice.selectors;

export const { increment } = counterSlice.actions;

export const COUNTER_REDUCER_NAME = counterSlice.name;

export default counterSlice.reducer;
