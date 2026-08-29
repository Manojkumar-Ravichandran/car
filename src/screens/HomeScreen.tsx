import React, {
  useEffect,
  useState
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList
} from "react-native";

import SearchBar from "../components/SearchBar";
import VehicleCard from "../components/VehicleCard";

import {
  getAllVehicles,
  searchVehicles
} from "../services/vehicleService";

import { Vehicle } from "../types/vehicle";
import { COLORS } from "../constants/colors";
import VehicleDetailsScreen from "./VehicleDetailsScreen";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [results, setResults] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [query]);

  const loadVehicles = async () => {
    const data = await getAllVehicles();
    setVehicles(data);
    setResults(data);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults(vehicles);
      return;
    }
    const data = await searchVehicles(query);
    setResults(data);
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
      <Text style={styles.title}>
        Vehicle Assistant
      </Text>

      <Text style={styles.subtitle}>
        Search vehicle information
      </Text>

      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => setSelected(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
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

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text
  },

  subtitle: {
    color: COLORS.gray,
    marginTop: 6,
    marginBottom: 22
  },

  searchContainer: {
    marginBottom: 20
  }
});