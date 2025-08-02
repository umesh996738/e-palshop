import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        return rejectWithValue('No token available');
      }

      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to get cart');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to add to cart');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update cart item');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to remove from cart');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to clear cart');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch(`${API_URL}/cart/coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to apply coupon');
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
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  appliedCoupon: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local cart operations for immediate UI updates
    addItemLocally: (state, action) => {
      const { product, quantity = 1, options = {} } = action.payload;
      
      const existingItem = state.items.find(item => 
        item.product._id === product._id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(options)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          selectedOptions: options,
          price: product.price,
          name: product.name,
          image: product.images[0]?.url || '',
        });
      }
    },
    removeItemLocally: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
    },
    updateItemQuantityLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.data;
        state.items = cart.items || [];
        state.totalItems = cart.totalItems || 0;
        state.subtotal = cart.subtotal || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.appliedCoupon = cart.appliedCoupon || null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.data;
        state.items = cart.items || [];
        state.totalItems = cart.totalItems || 0;
        state.subtotal = cart.subtotal || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.appliedCoupon = cart.appliedCoupon || null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.data;
        state.items = cart.items || [];
        state.totalItems = cart.totalItems || 0;
        state.subtotal = cart.subtotal || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.appliedCoupon = cart.appliedCoupon || null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.data;
        state.items = cart.items || [];
        state.totalItems = cart.totalItems || 0;
        state.subtotal = cart.subtotal || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.appliedCoupon = cart.appliedCoupon || null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.data;
        state.items = cart.items || [];
        state.totalItems = cart.totalItems || 0;
        state.subtotal = cart.subtotal || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.appliedCoupon = cart.appliedCoupon || null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.data;
        state.items = cart.items || [];
        state.totalItems = cart.totalItems || 0;
        state.subtotal = cart.subtotal || 0;
        state.tax = cart.tax || 0;
        state.shipping = cart.shipping || 0;
        state.total = cart.total || 0;
        state.appliedCoupon = cart.appliedCoupon || null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addItemLocally, removeItemLocally, updateItemQuantityLocally } = cartSlice.actions;
export default cartSlice.reducer;