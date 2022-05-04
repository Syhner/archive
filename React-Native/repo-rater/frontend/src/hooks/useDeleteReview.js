import { useMutation } from '@apollo/client';

import { DELETE_REVIEW } from '../graphql/mutations';
import { LOGGED_USER } from '../graphql/queries';

const useDeleteReview = () => {
  const [mutate, result] = useMutation(DELETE_REVIEW);

  const deleteReview = async fields => {
    const { data } = await mutate({
      variables: fields,
      refetchQueries: [
        { query: LOGGED_USER, variables: { fetchReviews: true } },
      ],
    });

    return data;
  };

  return [deleteReview, result];
};

export default useDeleteReview;
