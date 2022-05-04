import { Pressable, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';

import FormikTextInput from './FormikTextInput';
import theme from '../theme';
import Text from './Text';
import useCreateUser from '../hooks/useCreateUser';
import useSignIn from '../hooks/useSignIn';

const validationSchema = yup.object().shape({
  username: yup.string().min(1).max(30).required('Username is required'),
  password: yup.string().min(5).max(50).required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords don't match")
    .required(),
});

const initialValues = {
  username: '',
  password: '',
  passwordConfirmation: '',
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

const SignUpFields = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput name='username' placeholder='Username' />
      <FormikTextInput secureTextEntry name='password' placeholder='Password' />
      <FormikTextInput
        secureTextEntry
        name='passwordConfirmation'
        placeholder='Password confirmation'
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
};

export const SignUpForm = ({ onSubmit }) => (
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    {({ handleSubmit }) => <SignUpFields onSubmit={handleSubmit} />}
  </Formik>
);

const SignUp = () => {
  const navigate = useNavigate();
  const [createUser] = useCreateUser();
  const [signIn] = useSignIn();

  const onSubmit = async ({ username, password }) => {
    try {
      await createUser({ username, password });
      await signIn({ username, password });
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={theme.styles.container}>
      <SignUpForm onSubmit={onSubmit} />
    </View>
  );
};

export default SignUp;
