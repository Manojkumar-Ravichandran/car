import { Vehicle } from "../types/vehicle";

export const extractVehicleFromText = (
  text: string,
  vehicles: Vehicle[]
): Vehicle | null => {
  if (!text || text.trim() === "") {
    // Default fallback to Dzire or Creta
    const dzire = vehicles.find(
      (v) => v.model.toLowerCase().includes("dzire")
    );
    return dzire || vehicles[0] || null;
  }

  const normalizedText = text.toLowerCase();

  // 1. Direct Model Name Matching (dzire, creta, swift, baleno, i20, etc.)
  for (const vehicle of vehicles) {
    const modelName = vehicle.model.toLowerCase();
    if (normalizedText.includes(modelName)) {
      console.log(`Matched vehicle by model: ${vehicle.brand} ${vehicle.model}`);
      return vehicle;
    }
  }

  // 2. Specific Keyword Check for Maruti Dzire / ABT Maruti
  if (normalizedText.includes("dzire") || normalizedText.includes("abt maruti") || normalizedText.includes("tn47") || normalizedText.includes("1.2l 5mt")) {
    const dzire = vehicles.find((v) => v.model.toLowerCase().includes("dzire"));
    if (dzire) return dzire;
  }

  // 3. Variant Match (e.g. "vxi 1.2l 5mt", "sx(o)", "zeta")
  for (const vehicle of vehicles) {
    const variant = vehicle.variant.toLowerCase();
    if (normalizedText.includes(variant)) {
      console.log(`Matched vehicle by variant: ${vehicle.brand} ${vehicle.model} (${vehicle.variant})`);
      return vehicle;
    }
  }

  // 4. Brand Match (Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Toyota)
  for (const vehicle of vehicles) {
    const brand = vehicle.brand.toLowerCase();
    if (normalizedText.includes(brand)) {
      console.log(`Matched vehicle by brand: ${vehicle.brand} ${vehicle.model}`);
      return vehicle;
    }
  }

  // 5. Fallback to Maruti Dzire for ABT jobcards or first vehicle
  const fallbackDzire = vehicles.find((v) => v.model.toLowerCase().includes("dzire"));
  return fallbackDzire || vehicles[0] || null;
};