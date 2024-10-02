// type for normalizing state shape
// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
export interface EntityMap<T> {
  byId: Record<string, T>
}

// if ordering matters, allIds should preserve the ordering since we are using push
export interface EntityMapOrdering<T> extends EntityMap<T> {
  allIds: string[]
}
