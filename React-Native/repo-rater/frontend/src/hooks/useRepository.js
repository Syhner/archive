import { useQuery } from '@apollo/client';

import { GET_REPO } from '../graphql/queries';

const useRepository = id => {
  const { data, loading } = useQuery(GET_REPO, {
    variables: { id },
  });

  return { repository: data?.repository, loading };
};

export default useRepository;
