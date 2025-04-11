export {
  type Cell,
  cellChanged,
  initialState as cellsInitialState,
  name as cellsName,
  reducer as cellsReducer,
  type CellsState,
  selectCellMatrix,
  selectColumnLabels,
} from './cellsSlice'

export {
  type Circle,
  circleAdded,
  initialState as circleDrawerInitialState,
  name as circleDrawerName,
  reducer as circleDrawerReducer,
  type CircleDrawerState,
  circleSelected,
  circleUpdated,
  deselect,
  radiusChanged,
  redo,
  selectCircleById,
  selectCircleIds,
  selectRedoDisabled,
  selectUI as selectUICircleDrawer,
  selectUndoDisabled,
  undo,
} from './circleDrawerSlice'

export {
  initialState as counterInitialState,
  name as counterName,
  reducer as counterReducer,
  type CounterState,
  increment,
  selectCount,
} from './counterSlice'

export {
  initialState as crudInitialState,
  name as crudName,
  reducer as crudReducer,
  type CRUDState,
  type Name,
  nameCreated,
  nameDeleted,
  nameInputChanged,
  nameSelected,
  nameUpdated,
  searchChanged,
  selectFilteredNameRecords,
  selectNameRecords,
  selectUI as selectUICrud,
  surnameInputChanged,
} from './crudSlice'

export {
  dateChanged,
  initialState as flightBookerInitialState,
  name as flightBookerName,
  reducer as flightBookerReducer,
  type FlightBookerState,
  type FlightTrip,
  flightTypeChanged,
  selectFlightBookerState,
  selectIsBookableFlight,
} from './flightBookerSlice'

export * from './hooks'

export * from './store'

export {
  selectTemperatures,
  temperatureChanged,
  type TemperatureConverterState,
  initialState as temperatureInitialState,
  name as temperatureName,
  reducer as temperatureReducer,
} from './temperatureConverterSlice'

export {
  durationChanged,
  nowChanged,
  selectDuration,
  selectElapsedMs,
  initialState as timerInitialState,
  name as timerName,
  reducer as timerReducer,
  timerReset,
  type TimerState,
} from './timerSlice'
