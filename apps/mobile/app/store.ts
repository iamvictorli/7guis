import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

// TODO: @7gui/state exports *, to just import @7gui/state
import {
  name as counterName,
  reducer as counterReducer,
} from '@7gui/state/dist/counterSlice'

const rootReducer = combineReducers({
  [counterName]: counterReducer,
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
