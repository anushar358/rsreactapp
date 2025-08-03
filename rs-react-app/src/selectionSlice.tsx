import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
  selectedItems: number[];
}

const initialState: SelectionState = {
  selectedItems: [],
};
const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedItems.includes(id)) {
        // remove if already selected
        state.selectedItems = state.selectedItems.filter((item) => item !== id);
      } else {
        // add if not selected
        state.selectedItems.push(id);
      }
    },
    clearSelection: (state) => {
      state.selectedItems = [];
    },
    selectAll: (state, action: PayloadAction<number[]>) => {
      state.selectedItems = action.payload; // overwrite with all IDs
    },
  },
});

export const { toggleItem, clearSelection, selectAll } = selectionSlice.actions;
export default selectionSlice.reducer;
