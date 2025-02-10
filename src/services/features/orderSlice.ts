import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { resetConstructorState } from '../../services/features/constructorSlice';

export const makeOrderAndResetConstructor = createAsyncThunk(
  'order/makeOrderAndReset',
  async (ingredients: string[], { dispatch }) => {
    const order = await orderBurgerApi(ingredients);
    dispatch(resetConstructorState());
    return order;
  }
);

interface IOrderState {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  order: TOrder | null;
  isLoading: boolean;
}

export const initialState: IOrderState = {
  orderModalData: null,
  orderRequest: false,
  order: null,
  isLoading: false
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<TOrder>): void => {
      state.order = action.payload;
    },
    clearOrderData: (state) => initialState
  },
  selectors: {
    getOrderState: (state: IOrderState) => state,
    getOrderModalData: (state: IOrderState) => state.orderModalData,
    getOrderRequest: (state: IOrderState) => state.orderRequest,
    getOrder: (state: IOrderState) => state.order,
    getIsLoading: (state: IOrderState) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrderAndResetConstructor.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
      })
      .addCase(makeOrderAndResetConstructor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.order = action.payload.order;
        state.orderModalData = action.payload.order;
      })
      .addCase(makeOrderAndResetConstructor.rejected, (state) => {
        state.isLoading = false;
        state.orderRequest = false;
      });
  }
});

export const { setOrder, clearOrderData } = orderSlice.actions;
export const {
  getOrderState,
  getOrderModalData,
  getOrderRequest,
  getOrder,
  getIsLoading
} = orderSlice.selectors;
