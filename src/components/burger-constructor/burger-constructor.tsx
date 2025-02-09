import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/features/constructorSlice';
import {
  clearOrderData,
  getOrderModalData,
  getOrderRequest,
  makeOrderAndResetConstructor
} from '../../services/features/orderSlice';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/features/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(getConstructorItems);
  const user = useSelector(getUser);

  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      return navigate('/login');
    } else if (!constructorItems.bun || orderRequest) return;
    const orderData = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];
    dispatch(makeOrderAndResetConstructor(orderData));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
