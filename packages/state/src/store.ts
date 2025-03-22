import { combineReducers, configureStore } from '@reduxjs/toolkit'

import {
  name as cellsName,
  reducer as cellsReducer,
} from './cellsSlice'
import {
  name as circleDrawerName,
  reducer as circleDrawerReducer,
} from './circleDrawerSlice'
import {
  name as counterName,
  reducer as counterReducer,
} from './counterSlice'
import { name as crudName, reducer as crudReducer } from './crudSlice'
import {
  name as flightBookerName,
  reducer as flightBookerReducer,
} from './flightBookerSlice'
import {
  name as temperatureConverterName,
  reducer as temperatureConverterReducer,
} from './temperatureConverterSlice'
import {
  name as timerName,
  reducer as timerReducer,
} from './timerSlice'

const rootReducer = combineReducers({
  [counterName]: counterReducer,
  [temperatureConverterName]: temperatureConverterReducer,
  [flightBookerName]: flightBookerReducer,
  [timerName]: timerReducer,
  [crudName]: crudReducer,
  [circleDrawerName]: circleDrawerReducer,
  [cellsName]: cellsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const store = setupStore({})

export type AppStore = ReturnType<typeof setupStore>

export type AppDispatch = typeof store.dispatch
