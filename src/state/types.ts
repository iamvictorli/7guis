export interface EntityMap<T> {
  byId: Record<string, T>
  allIds: string[]
}
