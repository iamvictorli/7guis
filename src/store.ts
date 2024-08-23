import { configureStore, combineReducers } from '@reduxjs/toolkit'
import counterReducer, { COUNTER_REDUCER_NAME } from './state/counterSlice'
import temperatureConverterReducer, {
  TEMPERATURE_CONVERTER_REDUCER_NAME,
} from './state/temperatureConverterSlice'
import flightBookerReducer, {
  FLIGHT_BOOKER_REDUCER_NAME,
} from './state/flightBookerSlice'
import timerReducer, { TIMER_REDUCER_NAME } from './state/timerSlice'
import crudReducer, { CRUD_REDUCER_NAME } from './state/crudSlice'
import circleDrawerReducer, {
  CIRCLE_DRAWER_REDUCER_NAME,
} from './state/circleDrawerSlice'
import cellsReducer, { CELLS_REDUCER_NAME } from './state/cellsSlice'
import { useDispatch, useSelector } from 'react-redux'

const rootReducer = combineReducers({
  [COUNTER_REDUCER_NAME]: counterReducer,
  [TEMPERATURE_CONVERTER_REDUCER_NAME]: temperatureConverterReducer,
  [FLIGHT_BOOKER_REDUCER_NAME]: flightBookerReducer,
  [TIMER_REDUCER_NAME]: timerReducer,
  [CRUD_REDUCER_NAME]: crudReducer,
  [CIRCLE_DRAWER_REDUCER_NAME]: circleDrawerReducer,
  [CELLS_REDUCER_NAME]: cellsReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const store = configureStore({
  reducer: rootReducer,
})

export type AppStore = ReturnType<typeof setupStore>

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
