import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlists: [],
  currentWishlist: null,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlists: (state, action) => {
      state.wishlists = action.payload;
    },
    setCurrentWishlist: (state, action) => {
      state.currentWishlist = action.payload;
    },
    addWishlist: (state, action) => {
      state.wishlists.push(action.payload);
    },
    updateWishlist: (state, action) => {
      const index = state.wishlists.findIndex(w => w._id === action.payload._id);
      if (index !== -1) {
        state.wishlists[index] = action.payload;
      }
      if (state.currentWishlist?._id === action.payload._id) {
        state.currentWishlist = action.payload;
      }
    },
    removeWishlist: (state, action) => {
      state.wishlists = state.wishlists.filter(w => w._id !== action.payload);
      if (state.currentWishlist?._id === action.payload) {
        state.currentWishlist = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setWishlists,
  setCurrentWishlist,
  addWishlist,
  updateWishlist,
  removeWishlist,
  setLoading,
  setError,
  clearError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selectors
export const selectWishlists = (state) => state.wishlist.wishlists;
export const selectCurrentWishlist = (state) => state.wishlist.currentWishlist;
export const selectDefaultWishlist = (state) => 
  state.wishlist.wishlists.find(w => w.isDefault);
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;