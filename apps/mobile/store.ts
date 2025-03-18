import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import {
  name as counterName,
  reducer as counterReducer,
} from '@7guis/state/counterSlice'

const rootReducer = combineReducers({
  [counterName]: counterReducer,
})

type RootState = ReturnType<typeof rootReducer>

function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const store = setupStore({})

// export type AppStore = ReturnType<typeof setupStore>

type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
