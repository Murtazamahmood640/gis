export interface Appointment {
  _id?: string;
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  vehicleName: string;
  make: string;
  model: string;
  year: string;
  serviceType: string;
  vehicleCategory: string;
  date: string;
  timeSlot: string;
  promoCode: string;
  discountApplied: boolean;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    _id: "507f1f77bcf86cd799439011",
    id: "APT-001",
    fullName: "James Morrison",
    phone: "(555) 234-5678",
    email: "james@email.com",
    address: "456 Oak Ave, Auto City",
    vehicleName: "Tesla Model 3",
    make: "Tesla",
    model: "Model 3",
    year: "2024",
    serviceType: "Super Wax Detail",
    vehicleCategory: "Car",
    date: "2026-03-01",
    timeSlot: "10:00 AM",
    promoCode: "FIRST10",
    discountApplied: true,
    totalPrice: 206.99,
    status: "Confirmed",
    createdAt: "2026-02-20T10:30:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    id: "APT-002",
    fullName: "Sarah Kim",
    phone: "(555) 345-6789",
    email: "sarah@email.com",
    address: "789 Pine St, Auto City",
    vehicleName: "BMW X5",
    make: "BMW",
    model: "X5",
    year: "2023",
    serviceType: "Interior Only",
    vehicleCategory: "SUV",
    date: "2026-03-02",
    timeSlot: "2:00 PM",
    promoCode: "",
    discountApplied: false,
    totalPrice: 219.99,
    status: "Pending",
    createdAt: "2026-02-21T14:15:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439013",
    id: "APT-003",
    fullName: "Michael Rivera",
    phone: "(555) 456-7890",
    email: "michael@email.com",
    address: "321 Elm Blvd, Auto City",
    vehicleName: "Ford Mustang",
    make: "Ford",
    model: "Mustang",
    year: "2022",
    serviceType: "Exterior Only",
    vehicleCategory: "Car",
    date: "2026-02-28",
    timeSlot: "9:00 AM",
    promoCode: "",
    discountApplied: false,
    totalPrice: 179.99,
    status: "Completed",
    createdAt: "2026-02-18T09:00:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439014",
    id: "APT-004",
    fullName: "Emily Davis",
    phone: "(555) 567-8901",
    email: "emily@email.com",
    address: "654 Maple Dr, Auto City",
    vehicleName: "Toyota Highlander",
    make: "Toyota",
    model: "Highlander",
    year: "2025",
    serviceType: "Super Wax Detail",
    vehicleCategory: "CrossOver",
    date: "2026-03-05",
    timeSlot: "11:00 AM",
    promoCode: "FIRST10",
    discountApplied: true,
    totalPrice: 215.99,
    status: "Pending",
    createdAt: "2026-02-23T16:45:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439015",
    id: "APT-005",
    fullName: "David Lee",
    phone: "(555) 678-9012",
    email: "david@email.com",
    address: "987 Cedar Ln, Auto City",
    vehicleName: "Chevrolet Suburban",
    make: "Chevrolet",
    model: "Suburban",
    year: "2023",
    serviceType: "Interior Only",
    vehicleCategory: "X-Large",
    date: "2026-03-03",
    timeSlot: "3:00 PM",
    promoCode: "",
    discountApplied: false,
    totalPrice: 239.99,
    status: "Cancelled",
    createdAt: "2026-02-22T11:20:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439016",
    id: "APT-006",
    fullName: "Amanda Torres",
    phone: "(555) 789-0123",
    email: "amanda@email.com",
    address: "147 Birch Way, Auto City",
    vehicleName: "Mercedes GLE",
    make: "Mercedes-Benz",
    model: "GLE",
    year: "2024",
    serviceType: "Exterior Only",
    vehicleCategory: "SUV",
    date: "2026-03-04",
    timeSlot: "1:00 PM",
    promoCode: "",
    discountApplied: false,
    totalPrice: 199.99,
    status: "Confirmed",
    createdAt: "2026-02-24T08:30:00Z",
  },
];
