import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import SearchBar from '@/components/SearchBar';
import ClubCard from '@/components/ClubCard';
import { mockClubProfiles } from '@/constants/mockClubProfiles';
import type { ClubProfile } from '@/types/clubProfile';

const numColumns = 2;
const { width } = Dimensions.get('window');
const cardWidth = width / numColumns - 20;

export default function ClubsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mockClubProfiles.filter((club) =>
      club.clubName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const renderClub = ({ item }: { item: ClubProfile }) => (
    <View style={{ width: cardWidth }}>
      <ClubCard club={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search clubs..."
        />
      </View>

      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.clubId}
        renderItem={renderClub}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  searchWrapper: {
    marginTop: 10,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
});
