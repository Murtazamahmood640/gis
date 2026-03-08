export interface PricingItem {
  serviceType: string;
  vehicleCategory: string;
  price: number;
}

export const PRICING_DATA: PricingItem[] = [
  // Interior Only
  { serviceType: "Interior Only", vehicleCategory: "Car", price: 199.99 },
  { serviceType: "Interior Only", vehicleCategory: "CrossOver", price: 209.99 },
  { serviceType: "Interior Only", vehicleCategory: "SUV", price: 219.99 },
  { serviceType: "Interior Only", vehicleCategory: "X-Large", price: 239.99 },
  { serviceType: "Interior Only", vehicleCategory: "RV/Boat/Semi", price: 429.99 },

  // Exterior Only
  { serviceType: "Exterior Only", vehicleCategory: "Car", price: 179.99 },
  { serviceType: "Exterior Only", vehicleCategory: "CrossOver", price: 189.99 },
  { serviceType: "Exterior Only", vehicleCategory: "SUV", price: 199.99 },
  { serviceType: "Exterior Only", vehicleCategory: "X-Large", price: 219.99 },
  { serviceType: "Exterior Only", vehicleCategory: "RV/Boat/Semi", price: 399.99 },

  // Super Wax Detail
  { serviceType: "Super Wax Detail", vehicleCategory: "Car", price: 229.99 },
  { serviceType: "Super Wax Detail", vehicleCategory: "CrossOver", price: 239.99 },
  { serviceType: "Super Wax Detail", vehicleCategory: "SUV", price: 249.99 },
  { serviceType: "Super Wax Detail", vehicleCategory: "X-Large", price: 259.99 },
  { serviceType: "Super Wax Detail", vehicleCategory: "RV/Boat/Semi", price: 599.99 },
];

export const SERVICE_TYPES = ["Interior Only", "Exterior Only", "Super Wax Detail"];
export const VEHICLE_CATEGORIES = ["Car", "CrossOver", "SUV", "X-Large", "RV/Boat/Semi"];

export const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

export function getPrice(serviceType: string, vehicleCategory: string): number | null {
  const item = PRICING_DATA.find(
    (p) => p.serviceType === serviceType && p.vehicleCategory === vehicleCategory
  );
  return item?.price ?? null;
}
