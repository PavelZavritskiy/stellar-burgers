import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsData, getFeedState } from '../../services/features/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedState).orders;

  const handleGetFeeds = () => {
    dispatch(getFeedsData());
  };

  useEffect(() => {
    dispatch(getFeedsData());
  }, []);

  if (!orders?.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
