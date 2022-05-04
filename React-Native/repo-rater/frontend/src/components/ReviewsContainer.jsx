import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigate } from 'react-router-native';

import Text from './Text';
import theme from '../theme';
import useDeleteReview from '../hooks/useDeleteReview';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  rating: {
    borderRadius: 20,
    width: 40,
    height: 40,
    paddingVertical: 7,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderStyle: 'solid',
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 35,
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

const ItemSeparator = () => <View style={styles.separator} />;

const padTo2Digits = num => {
  return num.toString().padStart(2, '0');
};

const formatDate = unix => {
  const date = new Date(Date.parse(unix));
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('.');
};

const ReviewItem = ({ review, fromMyReviews }) => {
  const navigate = useNavigate();
  const [deleteReview] = useDeleteReview();

  const viewRepo = () => {
    navigate(`/${review.repository.id}`);
  };

  const handleDelete = () =>
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteReview({ id: review.id });
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: 'white',
        }}
      >
        <View style={{ paddingRight: 10 }}>
          <Text fontWeight='bold' style={styles.rating}>
            {review.rating}
          </Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text fontWeight='bold'>
            {fromMyReviews ? review.repository.fullName : review.user.username}
          </Text>
          <Text color='textSecondary'>{formatDate(review.createdAt)}</Text>
          <Text>{review.text}</Text>
        </View>
      </View>
      {fromMyReviews && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: 'white',
            paddingBottom: 10,
          }}
        >
          <Pressable
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={viewRepo}
          >
            <Text style={styles.buttonText}>View repository</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.colors.danger }]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete review</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const ReviewsContainer = ({ reviews, onEndReach, header, fromMyReviews }) => {
  const reviewNodes = reviews ? reviews.edges.map(edge => edge.node) : [];

  return (
    <FlatList
      data={reviewNodes}
      renderItem={({ item }) => (
        <ReviewItem review={item} fromMyReviews={fromMyReviews} />
      )}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={header}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

export default ReviewsContainer;
