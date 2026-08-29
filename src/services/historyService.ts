import AsyncStorage from "@react-native-async-storage/async-storage";
import { Vehicle } from "../types/vehicle";

const HISTORY_KEY = "VEHICLE_HISTORY";

export const getHistory = async (): Promise<Vehicle[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("History error:", error);

    return [];
  }
};

export const addToHistory = async (
  vehicle: Vehicle
) => {
  try {
    const history = await getHistory();

    const filtered = history.filter(
      (item) => item.id !== vehicle.id
    );

    const updatedHistory = [
      vehicle,
      ...filtered
    ];

    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.log("Save history error:", error);
  }
};

export const clearHistory = async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};