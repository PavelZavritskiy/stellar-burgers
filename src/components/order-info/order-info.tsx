import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsState } from '../../services/features/ingredientSlice';
import {
  getOrderByNumber,
  getOrdersState
} from '../../services/features/ordersSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const { orderNumber } = useParams<{ orderNumber: string }>();
  const numericOrderNumber = Number(orderNumber);
  const orderData = useSelector(getOrdersState).order;
  const ingredients: TIngredient[] =
    useSelector(getIngredientsState).ingredients;

  useEffect(() => {
    if (!isNaN(numericOrderNumber)) {
      dispatch(getOrderByNumber(numericOrderNumber));
    }
  }, [numericOrderNumber, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
