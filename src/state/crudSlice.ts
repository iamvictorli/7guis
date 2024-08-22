import {
  PayloadAction,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import type { EntityMap } from "./types";

interface Name {
  name: string;
  surname: string;
  id: string;
}

export interface CRUDState {
  names: EntityMap<Name>;
  nameInput: string;
  surnameInput: string;
  prefix: string;
  nameSelectedId: string;
}

const initialState: CRUDState = {
  // normalizing state shape
  // https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
  names: {
    byId: {},
    allIds: [],
  },
  nameInput: "",
  surnameInput: "",
  prefix: "",
  nameSelectedId: "",
} satisfies CRUDState as CRUDState;

export const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    nameCreated: {
      reducer: (state, action: PayloadAction<Name>) => {
        const name = action.payload;
        state.names.byId[name.id] = name;
        state.names.allIds.push(name.id);
        state.nameSelectedId = name.id;
      },
      prepare: (nameProps: Omit<Name, "id">) => {
        const id = nanoid();
        return {
          payload: {
            id,
            ...nameProps,
          },
        };
      },
    },
    nameUpdated: (state, action: PayloadAction<Name>) => {
      const name = action.payload;
      if (state.names.byId[name.id]) {
        state.names.byId[name.id] = name;
      }
    },
    nameDeleted: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      delete state.names.byId[idToDelete];

      const index = state.names.allIds.findIndex((id) => id === idToDelete);
      if (index !== -1) state.names.allIds.splice(index, 1);

      // select first name of name list
      const newNameSelectedIndex = (state.nameSelectedId =
        state.names.allIds.length > 0 ? state.names.allIds[0] : "");

      state.nameInput =
        newNameSelectedIndex === ""
          ? ""
          : state.names.byId[newNameSelectedIndex].name;
      state.surnameInput =
        newNameSelectedIndex === ""
          ? ""
          : state.names.byId[newNameSelectedIndex].surname;
      state.nameSelectedId = newNameSelectedIndex;
    },
    nameSelected: (state, action: PayloadAction<string>) => {
      state.nameSelectedId = action.payload;
      state.nameInput = state.names.byId[action.payload].name;
      state.surnameInput = state.names.byId[action.payload].surname;
    },
    prefixChanged: (state, action: PayloadAction<string>) => {
      state.prefix = action.payload;
    },
    nameInputChanged: (state, action: PayloadAction<string>) => {
      state.nameInput = action.payload;
    },
    surnameInputChanged: (state, action: PayloadAction<string>) => {
      state.surnameInput = action.payload;
    },
  },
  selectors: {
    selectCRUDState: (state) => state,
    selectNames: (state) => state.names,
    selectNameById: (state, id: string) => state.names.byId[id],
    selectPrefix: (state) => state.prefix,
  },
});

export const { selectCRUDState, selectNames, selectNameById, selectPrefix } =
  crudSlice.selectors;

// createSelector to memoize selector when we use array operations like map and filter, which return new array references
// https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
export const selectFilteredNameIds = createSelector(
  [selectNames, selectPrefix],
  (names, prefix) => {
    const nameIds = names.allIds;
    return nameIds.filter((nameId) => {
      const name = names.byId[nameId];
      return name.name.includes(prefix) || name.surname.includes(prefix);
    });
  }
);

export const {
  nameCreated,
  nameUpdated,
  nameDeleted,
  nameSelected,
  prefixChanged,
  nameInputChanged,
  surnameInputChanged,
} = crudSlice.actions;

export const CRUD_REDUCER_NAME = crudSlice.name;

export default crudSlice.reducer;
