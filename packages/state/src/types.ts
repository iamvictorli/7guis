// type for normalizing state shape
// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
// changed allIds to an object (acts as a hashset), to easily add and remove ids, constant time operation instead of linear time operation
// if ordering matters, allIds should be an array instead an object
export interface EntityMap<T> {
  byId: Record<string, T>
  allIds: Record<string, string>
}
