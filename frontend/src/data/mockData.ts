// Mock data for the application

import cabin from "@/assets/default-property-photos/cabin.jpg";
import apartment from "@/assets/default-property-photos/apartment.jpg";
import villa from "@/assets/default-property-photos/villa.jpg";
import house from "@/assets/default-property-photos/house.jpg";

export type AIStatus = "online" | "warning" | "offline";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  image: string;
  aiStatus: AIStatus;
  subscriptionActive: boolean;
  subscriptionExpiry: string;
  activeGuests: number;
  maxGuests: number;
  ownershipLevel: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  checkInReminderHours: number;
  checkOutReminderHours: number;
  checkInMessage: string;
  checkOutMessage: string;
  guests: Guest[];
  knowledge: {
    amenities: string;
    whereIs: string;
    localRecommendations: string;
    rulesAndPolicies: string;
  };
  exactAnswers: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export interface User {
  name: string;
  role: string;
  propertyCount: number;
  avatar: string;
}

export const mockUser: User = {
  name: "Omar El Malak",
  role: "Host",
  propertyCount: 4,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
};

export const mockProperties: Property[] = [
  {
    id: "1",
    name: "123 Pine St",
    address: "Toronto, Canada",
    image: cabin,
    aiStatus: "online",
    subscriptionActive: true,
    subscriptionExpiry: "Aug 7, 2025",
    activeGuests: 2,
    maxGuests: 3,
    ownershipLevel: "Entire place",
    propertyType: "Cabin",
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.9,
    reviewCount: 368,
    amenities: ["Wi-Fi", "Pool", "Hot tub", "Kitchen", "Parking"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    checkInReminderHours: 2,
    checkOutReminderHours: 1,
    checkInMessage: "Welcome to our cozy cabin! Your check-in is at 3 PM. The lockbox code is 1234. Fresh towels are in the bathroom closet.",
    checkOutMessage: "Thank you for staying with us! Please leave the keys on the kitchen counter and ensure all windows are closed.",
    guests: [
      { id: "g1", firstName: "Alice", lastName: "Johnson", phone: "+1 416-555-0123", startDate: "Jul 26, 2025", endDate: "Jul 30, 2025", isActive: true },
      { id: "g2", firstName: "Mark", lastName: "Davidson", phone: "+1 416-555-0456", startDate: "Jul 22, 2025", endDate: "Jul 25, 2025", isActive: true },
    ],
    knowledge: {
      amenities: "High-speed Wi-Fi (password: CabinLife2024). Heated pool open 8 AM - 10 PM. Hot tub on the back deck. Full kitchen with coffee maker, blender, and all cookware.",
      whereIs: "Towels in the bathroom closet. Extra blankets in the bedroom chest. Outdoor pillows in the deck storage box. TV remote in the living room drawer.",
      localRecommendations: "Best pizza at Tony's (5 min drive). Grocery store: Metro on Main St. Hiking trails at Pine Valley Park. Hospital: Toronto General (20 min).",
      rulesAndPolicies: "Quiet hours 10 PM - 8 AM. No smoking anywhere on property. No parties or events. Pets allowed with prior approval.",
    },
    exactAnswers: [
      { id: "ea1", question: "What's the Wi-Fi password?", answer: "The Wi-Fi password is CabinLife2024" },
      { id: "ea2", question: "Where can I park?", answer: "You can park in the driveway. There's space for 2 cars." },
    ],
  },
  {
    id: "2",
    name: "789 Bay St",
    address: "Toronto, Canada",
    image: apartment,
    aiStatus: "warning",
    subscriptionActive: true,
    subscriptionExpiry: "Nov 16, 2025",
    activeGuests: 3,
    maxGuests: 3,
    ownershipLevel: "Entire place",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.8,
    reviewCount: 245,
    amenities: ["Wi-Fi", "Gym", "Concierge", "City view", "Parking"],
    checkInTime: "16:00",
    checkOutTime: "10:00",
    checkInReminderHours: 3,
    checkOutReminderHours: 2,
    checkInMessage: "Welcome to downtown luxury! Check-in is at 4 PM. The concierge will provide your key fob.",
    checkOutMessage: "Thanks for choosing our apartment! Please return the key fob to the concierge.",
    guests: [
      { id: "g3", firstName: "Sarah", lastName: "Miller", phone: "+1 416-555-0789", startDate: "Jul 26, 2025", endDate: "Jul 29, 2025", isActive: true },
      { id: "g4", firstName: "John", lastName: "Smith", phone: "+1 416-555-0321", startDate: "Jul 28, 2025", endDate: "Aug 2, 2025", isActive: true },
      { id: "g5", firstName: "Emma", lastName: "Wilson", phone: "+1 416-555-0654", startDate: "Jul 25, 2025", endDate: "Jul 27, 2025", isActive: true },
    ],
    knowledge: {
      amenities: "Building gym on floor 3, open 24/7. High-speed fiber Wi-Fi. 55-inch smart TV in living room.",
      whereIs: "Extra towels under bathroom sink. Iron and ironing board in hall closet.",
      localRecommendations: "CN Tower 10 min walk. St. Lawrence Market for fresh food. Union Station for transit.",
      rulesAndPolicies: "Building quiet hours 11 PM - 7 AM. No smoking. No pets.",
    },
    exactAnswers: [
      { id: "ea3", question: "How do I access the gym?", answer: "Use your key fob on the 3rd floor. The gym is open 24/7." },
    ],
  },
  {
    id: "3",
    name: "250 Lakeview Ave",
    address: "Muskoka, Canada",
    image: villa,
    aiStatus: "online",
    subscriptionActive: true,
    subscriptionExpiry: "Sep 2, 2025",
    activeGuests: 1,
    maxGuests: 3,
    ownershipLevel: "Entire place",
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    rating: 5.0,
    reviewCount: 89,
    amenities: ["Wi-Fi", "Pool", "Lake access", "BBQ", "Kayaks"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    checkInReminderHours: 4,
    checkOutReminderHours: 2,
    checkInMessage: "Your lakeside paradise awaits! Check-in at 3 PM. Gate code: 5678.",
    checkOutMessage: "Hope you enjoyed the lake! Please store kayaks and lock the gate on your way out.",
    guests: [
      { id: "g6", firstName: "David", lastName: "Chen", phone: "+1 705-555-0987", startDate: "Jul 20, 2025", endDate: "Jul 28, 2025", isActive: true },
    ],
    knowledge: {
      amenities: "Private dock with 2 kayaks. Infinity pool heated to 82°F. Professional BBQ on the deck.",
      whereIs: "Life jackets in the boathouse. Pool towels in the outdoor cabinet.",
      localRecommendations: "Best restaurant: Muskoka Grill. Boat rentals at the marina. Hospital in Huntsville (25 min).",
      rulesAndPolicies: "Respect lake hours (no motors after 8 PM). Pool closed after 10 PM.",
    },
    exactAnswers: [],
  },
  {
    id: "4",
    name: "93 Beach Rd",
    address: "Cape Cod, USA",
    image: house,
    aiStatus: "offline",
    subscriptionActive: false,
    subscriptionExpiry: "Oct 25, 2025",
    activeGuests: 0,
    maxGuests: 3,
    ownershipLevel: "Entire place",
    propertyType: "House",
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.7,
    reviewCount: 156,
    amenities: ["Wi-Fi", "Beach access", "Outdoor shower", "Deck"],
    checkInTime: "14:00",
    checkOutTime: "10:00",
    checkInReminderHours: 2,
    checkOutReminderHours: 1,
    checkInMessage: "Beach vibes await! Keys in the lockbox. Code: 9012.",
    checkOutMessage: "Thanks for visiting! Please rinse sand off at the outdoor shower.",
    guests: [],
    knowledge: {
      amenities: "Private beach access via the back path. Outdoor shower for rinsing off.",
      whereIs: "Beach chairs in the garage. Sunscreen in the hall closet.",
      localRecommendations: "Lobster at Captain's Table. Whale watching tours from the harbor.",
      rulesAndPolicies: "No glass on the beach. Quiet hours 10 PM - 8 AM.",
    },
    exactAnswers: [
      { id: "ea4", question: "How do I get to the beach?", answer: "Follow the path from the back deck. It's a 2-minute walk through the dunes." },
    ],
  },
];
