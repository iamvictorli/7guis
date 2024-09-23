// type for normalizing state shape
// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
// changed allIds to an object (acts as a hashset), to easily add and remove ids, constant time operation instead of linear time operation
export interface EntityMap<T> {
  byId: Record<string, T>
  allIds: Record<string, string>
}
