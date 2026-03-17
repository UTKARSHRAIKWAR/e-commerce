import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      const cart = action.payload || {};

      const items = cart.items || [];

      state.items = items;
      state.totalPrice = cart.total || 0;

      state.totalQuantity = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
    },

    clearCartLocal: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { setCart, clearCartLocal } = cartSlice.actions;

export default cartSlice.reducer;