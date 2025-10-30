import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text } from 'react-native';
import SearchBar from '@/components/SearchBar';
import ClubCard from '@/components/ClubCard';
import { getAllClubs, Club } from '@/api/clubs';
import type { ClubProfile } from '@/types/clubProfile';

const numColumns = 2;
const { width } = Dimensions.get('window');
const cardWidth = width / numColumns - 20;

export default function clubs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch clubs from backend
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await getAllClubs();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Filter clubs based on search query
  const filteredClubs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return clubs.filter((club) =>
      club.name.toLowerCase().includes(query)
    );
  }, [searchQuery, clubs]);

  // Render each club
  const renderClub = ({ item }: { item: Club }) => {
    // Map Club → ClubProfile for ClubCard component
    const clubProfile: ClubProfile = {
      clubId: item.id,
      clubName: item.name,
      description: item.description || '',
      clubLogo: item.logo_url || '',
    };

    return (
      <View style={{ width: cardWidth, marginBottom: 12 }}>
        <ClubCard club={clubProfile} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading clubs...</Text>
      </View>
    );
  }

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
        keyExtractor={(item) => item.id}
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
