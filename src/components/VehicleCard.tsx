import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { Vehicle } from "../types/vehicle";
import { COLORS } from "../constants/colors";

interface Props {
  vehicle: Vehicle;
  onPress?: () => void;
}

export default function VehicleCard({
  vehicle,
  onPress
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>
            {vehicle.brand}
          </Text>

          <Text style={styles.model}>
            {vehicle.model}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {vehicle.year}
          </Text>
        </View>
      </View>

      <Text style={styles.variant}>
        {vehicle.variant}
      </Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Fuel</Text>
        <Text style={styles.value}>
          {vehicle.fuelType}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Engine</Text>
        <Text style={styles.value}>
          {vehicle.engine}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Transmission</Text>
        <Text style={styles.value}>
          {vehicle.transmission}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },

  brand: {
    fontSize: 13,
    color: COLORS.gray
  },

  model: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 3
  },

  variant: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.primary
  },

  badge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },

  badgeText: {
    color: COLORS.primary,
    fontWeight: "600"
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },

  label: {
    color: COLORS.gray
  },

  value: {
    color: COLORS.text,
    fontWeight: "500"
  }
});