import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'react-router-native';
import Constants from 'expo-constants';
import { useNavigate } from 'react-router-native';

import Text from './Text';
import theme from '../theme';
import useLoggedUser from '../hooks/useLoggedUser';
import useSignOut from '../hooks/useSignOut';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight || 15,
    backgroundColor: theme.colors.appBarBackground,
  },
  heading: {
    color: 'white',
    paddingBottom: 15,
    paddingLeft: 15,
  },
});

const AppBarTab = ({ text, linkTo }) => (
  <View>
    <Link to={linkTo}>
      <Text fontWeight='bold' style={styles.heading}>
        {text}
      </Text>
    </Link>
  </View>
);

const SignOutButton = ({ handleSignOut }) => {
  return (
    <Pressable onPress={handleSignOut}>
      <Text fontWeight='bold' style={styles.heading}>
        Sign out
      </Text>
    </Pressable>
  );
};

const AppBar = () => {
  const navigate = useNavigate();
  const { user } = useLoggedUser();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab text='Repositories' linkTo='/' />
        {!user && <AppBarTab text='Sign in' linkTo='/sign-in' />}
        {!user && <AppBarTab text='Sign up' linkTo='/sign-up' />}
        {user && <AppBarTab text='Create a review' linkTo='/review' />}
        {user && <AppBarTab text='My reviews' linkTo='/my-reviews' />}
        {user && <SignOutButton handleSignOut={handleSignOut} />}
      </ScrollView>
    </View>
  );
};

export default AppBar;
