import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import {
  name as cellsName,
  reducer as cellsReducer,
} from '@7guis/state/cellsSlice'
import {
  name as circleDrawerName,
  reducer as circleDrawerReducer,
} from '@7guis/state/circleDrawerSlice'
import {
  name as counterName,
  reducer as counterReducer,
} from '@7guis/state/counterSlice'
import { name as crudName, reducer as crudReducer } from '@7guis/state/crudSlice'
import {
  name as flightBookerName,
  reducer as flightBookerReducer,
} from '@7guis/state/flightBookerSlice'
import {
  name as temperatureConverterName,
  reducer as temperatureConverterReducer,
} from '@7guis/state/temperatureConverterSlice'
import {
  name as timerName,
  reducer as timerReducer,
} from '@7guis/state/timerSlice'

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

type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
