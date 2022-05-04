import useLoggedUser from '../hooks/useLoggedUser';
import ReviewsContainer from './ReviewsContainer';

const MyReviews = () => {
  const { user, fetchMore } = useLoggedUser({ fetchReviews: true, first: 10 });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <ReviewsContainer
      reviews={user?.reviews}
      onEndReach={onEndReach}
      fromMyReviews
    />
  );
};

export default MyReviews;
