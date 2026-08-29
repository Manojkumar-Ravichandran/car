import { Vehicle } from "../types/vehicle";

export const extractVehicleFromText = (
  text: string,
  vehicles: Vehicle[]
): Vehicle | null => {
  if (!text || text.trim() === "") {
    // Default fallback to Hyundai Creta if general image uploaded
    const creta = vehicles.find(
      (v) => v.model.toLowerCase().includes("creta") || v.brand.toLowerCase().includes("hyundai")
    );
    return creta || vehicles[0] || null;
  }

  const normalizedText = text.toLowerCase();

  // 1. Direct model match
  for (const vehicle of vehicles) {
    const model = vehicle.model.toLowerCase();
    if (normalizedText.includes(model)) {
      return vehicle;
    }
  }

  // 2. Brand match
  for (const vehicle of vehicles) {
    const brand = vehicle.brand.toLowerCase();
    if (normalizedText.includes(brand)) {
      return vehicle;
    }
  }

  // 3. Variant match
  for (const vehicle of vehicles) {
    const variant = vehicle.variant.toLowerCase();
    if (normalizedText.includes(variant)) {
      return vehicle;
    }
  }

  // 4. Default to Hyundai Creta for demo jobcards
  const defaultVehicle = vehicles.find(
    (v) => v.model.toLowerCase().includes("creta")
  );

  return defaultVehicle || vehicles[0] || null;
};