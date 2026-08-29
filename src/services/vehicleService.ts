import vehicles from "../data/vehicles.json";
import { Vehicle } from "../types/vehicle";

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  return vehicles as Vehicle[];
};

export const searchVehicles = async (
  query: string
): Promise<Vehicle[]> => {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  return (vehicles as Vehicle[]).filter((vehicle) => {
    return (
      vehicle.model.toLowerCase().includes(normalizedQuery) ||
      vehicle.brand.toLowerCase().includes(normalizedQuery) ||
      vehicle.variant.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const getVehicleByModel = async (
  model: string
): Promise<Vehicle | null> => {
  const normalizedModel = model.toLowerCase().trim();

  const vehicle = (vehicles as Vehicle[]).find((item) =>
    item.model.toLowerCase().includes(normalizedModel)
  );

  return vehicle || null;
};


// export const getVehicleByModel = async (model: string) => {
//   const response = await fetch(
//     `https://your-api.com/vehicles/search?model=${model}`
//   );

//   return response.json();
// };