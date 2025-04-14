import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice.js';
import productReducer from '../reducers/productSlice.js';


export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
  },
});


