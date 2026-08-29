import React, {
  useCallback,
  useState
} from "react";

import VehicleDetailsScreen from "./VehicleDetailsScreen";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import VehicleCard from "../components/VehicleCard";

import {
  getHistory,
  clearHistory
} from "../services/historyService";

import { Vehicle } from "../types/vehicle";
import { COLORS } from "../constants/colors";

export default function HistoryScreen() {
  const [history, setHistory] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const loadHistory = async () => {
    const data = await getHistory();

    setHistory(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const handleClear = async () => {
    await clearHistory();

    setHistory([]);
  };

  if (selected) {
    return (
      <VehicleDetailsScreen
        vehicle={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            History
          </Text>

          <Text style={styles.subtitle}>
            Recently scanned vehicles
          </Text>
        </View>

        {history.length > 0 && (
          <Button
            title="Clear"
            onPress={handleClear}
          />
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehicleCard vehicle={item} onPress={() => setSelected(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No vehicle history yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text
  },

  subtitle: {
    color: COLORS.gray,
    marginTop: 4
  },

  empty: {
    marginTop: 100,
    alignItems: "center"
  },

  emptyText: {
    color: COLORS.gray
  }
});