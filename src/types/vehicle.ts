export interface ServiceItem {
  _id?: string;
  serviceName: string;
  category?: string;
  cost?: number;
  replacementRequired: "yes" | "no";
  notes: string;
}

export interface PmsSchedule {
  interval: number;
  description?: string;
  serviceItems: ServiceItem[];
}

export interface TechnicalSpecifications {
  engineOilCapacity?: string;
  engineOilGrade?: string;
  gearOilCapacity?: string;
  gearOilGrade?: string;
  coolantCapacity?: string;
  brakeFluidType?: string;
  powerSteeringOil?: string;
  batterySpecification?: string;
  tyrePressureFront?: string;
  tyrePressureRear?: string;
  sparkPlugGap?: string;
}

export interface FiltersAndParts {
  oilFilter?: string;
  airFilter?: string;
  cabinFilter?: string;
  fuelFilter?: string;
  driveBeltNumber?: string;
  timingBeltNumber?: string;
  timingChain?: string;
  waterPumpPartNumber?: string;
  drainPlugPartNumber?: string;
  drainWasherPartNumber?: string;
}

export interface AdditionalNotes {
  specialNotes?: string;
  commonProblems?: string;
  workshopInstructions?: string;
}

export interface Vehicle {
  id: string;
  vehicleImage?: string;
  brand: string;
  model: string;
  variant: string;
  fuelType: string;
  engine?: string;
  engineCode?: string;
  engineCapacity?: string;
  transmission: string;
  driveType?: string;
  vehicleSegment?: string;
  country?: string;
  year: string;
  productionYear?: number;
  serviceInterval?: string;
  engineOil?: string;
  oilCapacity?: string;
  technicalSpecifications?: TechnicalSpecifications;
  filtersAndParts?: FiltersAndParts;
  pmsSchedule?: PmsSchedule[];
  additionalNotes?: AdditionalNotes;
}