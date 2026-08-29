import React from "react";
import {
  View,
  TextInput,
  StyleSheet
} from "react-native";

import { COLORS } from "../constants/colors";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({
  value,
  onChangeText
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search vehicle model..."
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },

  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16
  }
});