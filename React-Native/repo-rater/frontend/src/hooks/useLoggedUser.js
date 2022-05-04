import { useQuery } from '@apollo/client';

import { LOGGED_USER } from '../graphql/queries';

const useLoggedUser = variables => {
  const { data, loading, fetchMore } = useQuery(LOGGED_USER, {
    fetchPolicy: 'cache-and-network',
    variables,
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.me.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.me.reviews.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return { user: data?.me, fetchMore: handleFetchMore };
};

export default useLoggedUser;
