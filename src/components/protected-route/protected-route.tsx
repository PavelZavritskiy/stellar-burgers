import React from 'react';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/features/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

type TProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: TProtectedProps): React.ReactNode => {
  const isAuthChecked = useSelector(getUserState).isAuthChecked;
  const user = useSelector(getUserState).user;
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthChecked) {
    return React.createElement('p', null, 'Загрузка...');
  }

  if (!onlyUnAuth && !user) {
    navigate('/login', { state: { from: location } });
    return null;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    navigate(from);
    return null;
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;

export const OnlyUnAuth = ({
  component
}: {
  component: React.ReactNode;
}): React.ReactNode =>
  React.createElement(ProtectedRoute, { onlyUnAuth: true, component });
