export type EntityMap<T> = {
  byId: Record<string, T>;
  allIds: string[];
};
