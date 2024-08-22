import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TemperatureConverterState {
  fahrenheit: string;
  celcius: string;
}

const initialState: TemperatureConverterState = {
  fahrenheit: "",
  celcius: "",
} satisfies TemperatureConverterState as TemperatureConverterState;

export const temperatureConverterSlice = createSlice({
  name: "temperature-converter",
  initialState,
  reducers: {
    fahrenheitChanged: (state, action: PayloadAction<string>) => {
      state.fahrenheit = action.payload;
      state.celcius =
        action.payload === ""
          ? ""
          : ((parseFloat(action.payload) - 32) * (5 / 9)).toString();
    },
    celciusChanged: (state, action: PayloadAction<string>) => {
      state.celcius = action.payload;
      state.fahrenheit =
        action.payload === ""
          ? ""
          : (parseFloat(action.payload) * (9 / 5) + 32).toString();
    },
  },
  selectors: {
    selectTemperatures: (state) => state,
  },
});

export const { selectTemperatures } = temperatureConverterSlice.selectors;

export const { fahrenheitChanged, celciusChanged } =
  temperatureConverterSlice.actions;

export const TEMPERATURE_CONVERTER_REDUCER_NAME =
  temperatureConverterSlice.name;

export default temperatureConverterSlice.reducer;
