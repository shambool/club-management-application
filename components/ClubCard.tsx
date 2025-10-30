import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { ClubProfile } from '@/types/clubProfile';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/150?text=No+Image'; // fallback image

export default function ClubCard({ club }: { club: ClubProfile }) {
  const router = useRouter();

  const shortDesc =
    club.description.length > 30
      ? club.description.slice(0, 30) + '...'
      : club.description;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({ pathname: '/club/[id]', params: { id: club.clubId } })
      }
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: club.clubLogo || PLACEHOLDER_IMAGE }}
          style={styles.image}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{club.clubName}</Text>
        <View style={styles.descRow}>
          <Text style={styles.description}>{shortDesc}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f0f0f0', // subtle background if image is loading
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  descRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  description: {
    fontSize: 11,
    color: '#666',
    flexShrink: 1,
  },
});
