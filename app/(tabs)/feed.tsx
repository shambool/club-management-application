import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/constants/mockEvents';
import type { Event } from '@/types/event';

export default function Feed() {
  const renderEvent = ({ item }: { item: Event }) => <EventCard event={item} />;

  return (
    <View style={styles.container}>
      {/* Top Section: Logo + Saved Events */}
      <Header />

      {/* Search Placeholder */}
      <SearchBar value={''} onChangeText={function (text: string): void {
        throw new Error('Function not implemented.');
      } } />

      {/* Scrollable Event Feed */}
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.storageId}
        renderItem={renderEvent}
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
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 80, // leaves space below the last event
  },
});
