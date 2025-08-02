import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        return rejectWithValue('No token available');
      }

      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to get wishlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to add to wishlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to remove from wishlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to clear wishlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkWishlistItem = createAsyncThunk(
  'wishlist/checkWishlistItem',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        return { data: { isInWishlist: false } };
      }

      const response = await fetch(`${API_URL}/wishlist/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to check wishlist item');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlist = action.payload.data;
        state.items = wishlist.items || [];
        state.totalItems = wishlist.totalItems || 0;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlist = action.payload.data;
        state.items = wishlist.items || [];
        state.totalItems = wishlist.totalItems || 0;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlist = action.payload.data;
        state.items = wishlist.items || [];
        state.totalItems = wishlist.totalItems || 0;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlist = action.payload.data;
        state.items = wishlist.items || [];
        state.totalItems = wishlist.totalItems || 0;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Wishlist Item
      .addCase(checkWishlistItem.fulfilled, (state, action) => {
        // This is handled in the component that calls it
      })
      .addCase(checkWishlistItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;