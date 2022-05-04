import { Pressable, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';

import FormikTextInput from './FormikTextInput';
import theme from '../theme';
import Text from './Text';
import useReview from '../hooks/useReview';

const validationSchema = yup.object().shape({
  repoOwner: yup.string().required('Repository owner name is required'),
  repoName: yup.string().required('Repository name is required'),
  rating: yup.number().integer().min(0).max(100).required('Rating is required'),
  review: yup.string(),
});

const initialValues = {
  repoOwner: '',
  repoName: '',
  rating: '',
  review: '',
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    paddingVertical: 5,
    fontWeight: 'bold',
  },
});

const ReviewFields = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput name='repoOwner' placeholder='Repository owner name' />
      <FormikTextInput name='repoName' placeholder='Repository name' />
      <FormikTextInput name='rating' placeholder='Rating between 0 and 100' />
      <FormikTextInput multiline name='review' placeholder='Review' />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Create a review</Text>
      </Pressable>
    </View>
  );
};

export const ReviewForm = ({ onSubmit }) => (
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    {({ handleSubmit }) => <ReviewFields onSubmit={handleSubmit} />}
  </Formik>
);

const Review = () => {
  const navigate = useNavigate();
  const [createReview] = useReview();

  const onSubmit = async ({ repoOwner, repoName, rating, review }) => {
    try {
      const reviewed = await createReview({
        repositoryName: repoName,
        ownerName: repoOwner,
        rating: parseInt(rating),
        text: review,
      });

      navigate(`/${reviewed.createReview.repositoryId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={theme.styles.container}>
      <ReviewForm onSubmit={onSubmit} />
    </View>
  );
};

export default Review;
