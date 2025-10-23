import { mockClubProfiles } from '@/constants/mockClubProfiles';
import { mockEvents } from '@/constants/mockEvents';
import type { ClubProfile } from '@/types/clubProfile';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 3; // 3 posters per row

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const club = mockClubProfiles.find((c) => c.clubId === id) as ClubProfile | undefined;

  const clubEvents = useMemo(() => {
    if (!club) return [];
    return mockEvents
      .filter((event) => club.eventIds.includes(event.storageId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first
  }, [club]);

  if (!club) {
    return (
      <View style={styles.centered}>
        <Text>Club not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/clubs')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Club Image */}
            <Image source={{ uri: club.clubLogo }} style={styles.logo} />

            {/* Club Info */}
            <View style={styles.infoCard}>
              <Text style={styles.title}>{club.clubName}</Text>
              <Text style={styles.description}>{club.description}</Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Events</Text>
          </>
        }
        data={clubEvents}
        keyExtractor={(item) => item.storageId}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: item.eventPoster }} style={styles.eventImage} />
          </View>
        )}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 2,
    backgroundColor: '#f9f9f9',
    padding: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  logo: {
    width: width - 24,
    height: 180,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  divider: {
    height: 3,
    backgroundColor: '#555',
    width: width * 0.8,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 10,
  },
  eventCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
