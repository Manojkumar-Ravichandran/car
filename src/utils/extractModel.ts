import { Vehicle } from "../types/vehicle";

export const extractVehicleFromText = (
  text: string,
  vehicles: Vehicle[]
): Vehicle | null => {
  if (!text || text.trim() === "") {
    console.log("No text provided to extractVehicleFromText");
    return null;
  }

  const normalizedText = text.toLowerCase();
  console.log("Normalizing OCR text for vehicle matching:", normalizedText);

  // 1. Direct Model Name Match (e.g. "dzire", "creta", "swift", "baleno", "i20", "nexon", "punch", "xuv700", "scorpio", "city", "innova")
  for (const vehicle of vehicles) {
    const modelName = vehicle.model.toLowerCase();
    if (normalizedText.includes(modelName)) {
      console.log(`✅ MATCHED MODEL: ${vehicle.brand} ${vehicle.model}`);
      return vehicle;
    }
  }

  // 2. Specific Keyword Check for Maruti Dzire / ABT Maruti / TN47
  if (
    normalizedText.includes("dzire") ||
    normalizedText.includes("abt maruti") ||
    normalizedText.includes("tn47") ||
    normalizedText.includes("1.2l 5mt")
  ) {
    const dzire = vehicles.find((v) => v.model.toLowerCase().includes("dzire"));
    if (dzire) return dzire;
  }

  // 3. Variant Match (e.g. "vxi", "sx(o)", "zeta", "sportz", "xz+", "z8")
  for (const vehicle of vehicles) {
    const variantWord = vehicle.variant.toLowerCase();
    if (normalizedText.includes(variantWord)) {
      console.log(`✅ MATCHED VARIANT: ${vehicle.brand} ${vehicle.model} (${vehicle.variant})`);
      return vehicle;
    }
  }

  // 4. Brand Match (e.g. "maruti", "hyundai", "tata", "mahindra", "honda", "toyota")
  for (const vehicle of vehicles) {
    const brandName = vehicle.brand.toLowerCase();
    if (normalizedText.includes(brandName)) {
      console.log(`✅ MATCHED BRAND: ${vehicle.brand} ${vehicle.model}`);
      return vehicle;
    }
  }

  // 5. If no vehicle model or brand was found in the text -> STRICT NULL!
  console.log("❌ No vehicle brand or model recognized in the uploaded image text.");
  return null;
};