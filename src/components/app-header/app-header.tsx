import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/features/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(getUserState).user?.name;

  return <AppHeaderUI userName={user} />;
};
