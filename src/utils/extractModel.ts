import { Vehicle } from "../types/vehicle";

export const extractVehicleFromText = (
  text: string,
  vehicles: Vehicle[]
): Vehicle | null => {
  const normalizedText = text.toLowerCase();

  for (const vehicle of vehicles) {
    const model = vehicle.model.toLowerCase();

    if (normalizedText.includes(model)) {
      return vehicle;
    }
  }

  return null;
};