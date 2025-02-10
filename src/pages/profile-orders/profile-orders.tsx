import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import {
  getOrdersData,
  getOrdersState
} from '../../services/features/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getOrdersState).orders;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersData());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
