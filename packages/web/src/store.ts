import {
  cellsName,
  cellsReducer,
  circleDrawerName,
  circleDrawerReducer,
  counterName,
  counterReducer,
  crudName,
  crudReducer,
  flightBookerName,
  flightBookerReducer,
  temperatureConverterName,
  temperatureConverterReducer,
  timerName,
  timerReducer,
} from '@7gui/state'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

const rootReducer = combineReducers({
  [counterName]: counterReducer,
  [temperatureConverterName]: temperatureConverterReducer,
  [flightBookerName]: flightBookerReducer,
  [timerName]: timerReducer,
  [crudName]: crudReducer,
  [circleDrawerName]: circleDrawerReducer,
  [cellsName]: cellsReducer,
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
type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
