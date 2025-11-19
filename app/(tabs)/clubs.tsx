import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text, RefreshControl } from "react-native";
import SearchBar from "@/components/SearchBar";
import ClubCard from "@/components/ClubCard";
import type { ClubProfile } from "@/types/clubProfile";
import { getAllClubs, type Club } from "@/api/clubs";

const numColumns = 2;
const { width } = Dimensions.get("window");
const cardWidth = width / numColumns - 20;

// map server row -> UI type
function mapClubToProfile(row: Club): ClubProfile {
  return {
    id: String(row.id),
    name: row.title,
    description: row.description ?? "",
    logo_url: row.logourl ?? "",
    created_at: row.createdat ?? "",
    // you don't return these from the list route; leave empty for now
    original_President: "",
    current_President: "",
  };
}

export default function ClubsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubs, setClubs] = useState<ClubProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const rows = await getAllClubs(); // uses axios to call GET /clubs (paged under the hood)
      setClubs(rows.map(mapClubToProfile));
    } catch (e: any) {
      console.error("Failed to fetch clubs", e?.message || e);
      setError("Failed to load clubs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const filteredClubs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter((c) => c.name.toLowerCase().includes(q));
  }, [searchQuery, clubs]);

  const renderClub = ({ item }: { item: ClubProfile }) => (
    <View style={{ width: cardWidth, marginBottom: 12 }}>
      <ClubCard club={item} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading clubs…</Text>
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

      {error ? (
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
      ) : null}

      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id} // id is string after mapping
        renderItem={renderClub}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text>No clubs found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  searchWrapper: { marginTop: 10, marginBottom: 8 },
  listContent: { paddingBottom: 100 },
});
