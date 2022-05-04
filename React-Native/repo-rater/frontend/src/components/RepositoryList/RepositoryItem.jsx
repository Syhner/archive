import { View, Image, StyleSheet, Pressable } from 'react-native';
import * as Linking from 'expo-linking';

import Text from '../Text';
import theme from '../../theme';

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
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

const suffixCount = number => {
  if (number < 1000) {
    return number;
  }

  const trunc = Math.floor(number / 100);
  const truncStr = trunc.toString();
  const suffixed =
    truncStr.substring(0, truncStr.length - 1) +
    '.' +
    truncStr.substring(truncStr.length - 1) +
    'k';
  return suffixed;
};

const RepositoryItem = ({ item, renderButton }) => {
  const {
    ownerAvatarUrl,
    fullName,
    description,
    language,
    forksCount,
    stargazersCount,
    ratingAverage,
    reviewCount,
    url,
  } = item;

  const CardBody = () => (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          paddingRight: 10,
        }}
      >
        <Image source={{ uri: ownerAvatarUrl }} style={styles.tinyLogo} />
      </View>
      <View style={{ flexDirection: 'column' }}>
        <Text fontWeight='bold'>{fullName}</Text>
        <Text color='textSecondary'>{description}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              color: 'white',
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 5,
            }}
          >
            {language}
          </Text>
        </View>
      </View>
    </View>
  );

  const CardFooterComponent = ({ top, bottom }) => (
    <View style={{ flexDirection: 'column', paddingTop: 10 }}>
      <Text fontWeight='bold' style={{ textAlign: 'center' }} testId='s'>
        {suffixCount(top)}
      </Text>
      <Text style={{ textAlign: 'center' }} color='textSecondary'>
        {bottom}
      </Text>
    </View>
  );

  const CardFooter = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <CardFooterComponent top={stargazersCount} bottom='Stars' />
      <CardFooterComponent top={forksCount} bottom='Forks' />
      <CardFooterComponent top={reviewCount} bottom='Reviews' />
      <CardFooterComponent top={ratingAverage} bottom='Rating' />
    </View>
  );

  const VisitRepo = () => {
    const onSubmit = () => {
      Linking.openURL(url);
    };

    return (
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Open in GitHub</Text>
      </Pressable>
    );
  };

  return (
    <View
      testID='repositoryItem'
      style={{ padding: 15, backgroundColor: 'white' }}
    >
      <CardBody />
      <CardFooter />
      {renderButton && <VisitRepo />}
    </View>
  );
};

export default RepositoryItem;
