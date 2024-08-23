// type for normalizing state shape
// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
export interface EntityMap<T> {
  byId: Record<string, T>
  allIds: string[]
}
