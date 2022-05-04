import { useParams } from 'react-router-native';
import { View } from 'react-native';

import ReviewsContainer from '../ReviewsContainer';
import RepositoryItem from './RepositoryItem';
import useRepository from '../../hooks/useRepository';
import useReviews from '../../hooks/useReviews';
import Text from '../Text';

const ItemSeparator = () => <View style={{ height: 10 }} />;

const RepositoryInfo = ({ id }) => {
  const { repository, loading } = useRepository(id);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <RepositoryItem item={repository} renderButton />
      <ItemSeparator />
    </>
  );
};

const SingleRepository = () => {
  const { id } = useParams();
  const { reviews, fetchMore } = useReviews({ id, first: 8 });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <ReviewsContainer
      reviews={reviews}
      onEndReach={onEndReach}
      header={<RepositoryInfo id={id} />}
    />
  );
};

export default SingleRepository;
