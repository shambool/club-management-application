import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { ClubProfile } from '@/types/clubProfile';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150?text=No+Image';

export default function ClubCard({ club }: { club: ClubProfile }) {
  const router = useRouter();

  // Handle description safely (optional field)
  const descriptionText = club.description ?? 'No description available';
  const shortDesc =
    descriptionText.length > 30
      ? descriptionText.slice(0, 30) + '...'
      : descriptionText;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/club/[id]', params: { id: club.id } })}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: club.logo_url || PLACEHOLDER_IMAGE }}
          style={styles.image}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{club.name}</Text>
        <View style={styles.descRow}>
          <Text style={styles.description}>{shortDesc}</Text>
        </View>

        {/* Optional: Show current president if available */}
        {club.current_President && (
          <Text style={styles.president}>
            President: {club.current_President}
          </Text>
        )}
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
    backgroundColor: '#f0f0f0',
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
  president: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
});
