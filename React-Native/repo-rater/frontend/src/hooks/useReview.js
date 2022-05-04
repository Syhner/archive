import { useMutation } from '@apollo/client';

import { CREATE_REVIEW } from '../graphql/mutations';

const useReview = () => {
  const [mutate, result] = useMutation(CREATE_REVIEW);

  const signIn = async fields => {
    const { data } = await mutate({
      variables: fields,
    });

    return data;
  };

  return [signIn, result];
};

export default useReview;
