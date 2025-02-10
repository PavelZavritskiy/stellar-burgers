import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import {
  ConstructorPage,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  Feed
} from '@pages';
import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/features/userSlice';
import { getIngredientsData } from '../../services/features/ingredientSlice';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');
  const orderNumber =
    feedMatch?.params.number || profileOrderMatch?.params.number;

  const onClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getIngredientsData());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={<OnlyAuth component={<OrderInfo />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:orderNumber'
            element={
              <Modal
                title={`#${orderNumber}`}
                onClose={onClose}
                children={<OrderInfo />}
              />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={onClose}
                children={<IngredientDetails />}
              />
            }
          />
          <Route
            path='/profile/orders/:orderNumber'
            element={
              <OnlyAuth
                component={
                  <Modal
                    title={`#${orderNumber}`}
                    onClose={onClose}
                    children={<OrderInfo />}
                  />
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
