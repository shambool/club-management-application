import React, { useMemo } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

type DateLike = string | number | Date;

type Props<T> = {
  data: T[];
  columns?: number;                          // default 3
  getId: (row: T) => string | number;        // e.g. r.id
  getImageUrl: (row: T) => string | null;    // e.g. r.imgurl
  getCreatedAt: (row: T) => DateLike;        // e.g. r.createdat
  onPressItem?: (row: T) => void;
};

export default function SnakeEventsGrid<T>({
  data,
  columns = 3,
  getId,
  getImageUrl,
  getCreatedAt,
  onPressItem,
}: Props<T>) {
  // newest → oldest globally
  const sorted = useMemo(() => {
    const t = (v: DateLike) => new Date(v).getTime();
    return [...data].sort((a, b) => t(getCreatedAt(b)) - t(getCreatedAt(a)));
  }, [data, getCreatedAt]);

  // chunk into rows
  const rows = useMemo(() => {
    const out: T[][] = [];
    for (let i = 0; i < sorted.length; i += columns) out.push(sorted.slice(i, i + columns));
    return out;
  }, [sorted, columns]);

  return (
    <FlatList
      data={rows}
      keyExtractor={(_, i) => `row-${i}`}
      scrollEnabled={false}
      renderItem={({ item: row, index }) => {
        const reverse = index % 2 === 1; // snake!
        return (
          <View style={[styles.row, reverse && styles.rowReverse]}>
            {row.map((r) => (
              <TouchableOpacity
                key={String(getId(r))}
                style={styles.cell}
                activeOpacity={0.9}
                onPress={() => onPressItem?.(r)}
              >
                {/* if your url can be null, guard it in getImageUrl or show a placeholder */}
                <Image source={{ uri: getImageUrl(r) ?? '' }} style={styles.img} />
              </TouchableOpacity>
            ))}
            {/* keep last row aligned */}
            {row.length < columns &&
              Array.from({ length: columns - row.length }).map((_, i) => (
                <View key={`ghost-${i}`} style={[styles.cell, styles.ghost]} />
              ))}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  rowReverse: { flexDirection: 'row-reverse' },
  cell: { flex: 1, aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#eee' },
  img: { width: '100%', height: '100%' },
  ghost: { opacity: 0 },
});
