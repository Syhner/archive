import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

import useRepositories from '../../hooks/useRepositories';
import RepositoryItem from './RepositoryItem';
import theme from '../../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RenderRepo = ({ item }) => {
  const navigate = useNavigate();

  const openRepository = () => {
    navigate(`/${item.id}`);
  };

  return (
    <Pressable onPress={openRepository}>
      <RepositoryItem item={item} />
    </Pressable>
  );
};

export const RepositoryListContainer = ({ repositories, onEndReach }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <RenderRepo item={item} />}
      keyExtractor={item => item.id}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

const formatOrder = order => {
  switch (order) {
    case 'latest':
      return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
    case 'highest':
      return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
    case 'lowest':
      return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
    default:
      return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
  }
};

const RepositoryList = () => {
  const [order, setOrder] = useState('latest');
  const { orderBy, orderDirection } = formatOrder(order);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    orderBy,
    orderDirection,
    searchKeyword: debouncedSearchQuery,
  });

  const onChangeSearch = query => setSearchQuery(query);

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <>
      <Searchbar
        style={{ marginHorizontal: 10, marginTop: 10 }}
        placeholder='Search'
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <View style={{ paddingHorizontal: 15 }}>
        <Picker
          selectedValue={order}
          onValueChange={itemValue => setOrder(itemValue)}
        >
          <Picker.Item
            color={theme.colors.textSecondary}
            enabled={false}
            label='Select an item...'
            value='header'
          />
          <Picker.Item
            color='black'
            label='Latest repositories'
            value='latest'
          />
          <Picker.Item
            color='black'
            label='Highest rated repositories'
            value='highest'
          />
          <Picker.Item
            color='black'
            label='Lowest rated repositories'
            value='lowest'
          />
        </Picker>
      </View>
      <RepositoryListContainer
        repositories={repositories}
        onEndReach={onEndReach}
      />
    </>
  );
};

export default RepositoryList;
