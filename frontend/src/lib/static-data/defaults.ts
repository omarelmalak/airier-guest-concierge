import { FeatureItem } from "./client-types";
import {
    Wifi, Car, Droplets, Tv, ChefHat, WashingMachine, Thermometer,
    Flame, Dumbbell, Bath, Coffee, Utensils, Theater, Moon, Bus,
    Stethoscope, ShoppingCart, UtensilsCrossed, Volume2, Dog,
    Cigarette, PartyPopper, Baby, Bed, Trash2, Lock, Speaker,
    FireExtinguisher, BriefcaseMedical
} from "lucide-react";

export const defaultAmenities: FeatureItem[] = [
    { id: "wifi", label: "Wi-Fi", icon: Wifi, enabled: false, allowDetails: true, details: "" },
    { id: "parking", label: "Parking", icon: Car, enabled: false, allowDetails: true, details: "" },
    { id: "pool", label: "Pool", icon: Droplets, enabled: false, allowDetails: true, details: "" },
    { id: "tv", label: "TV", icon: Tv, enabled: false, allowDetails: true, details: "" },
    { id: "kitchen", label: "Kitchen", icon: ChefHat, enabled: false, allowDetails: true, details: "" },
    { id: "laundry", label: "Laundry", icon: WashingMachine, enabled: false, allowDetails: true, details: "" },
    { id: "ac", label: "A/C", icon: Thermometer, enabled: false, allowDetails: true, details: "" },
    { id: "heating", label: "Heating", icon: Flame, enabled: false, allowDetails: true, details: "" },
    { id: "gym", label: "Gym", icon: Dumbbell, enabled: false, allowDetails: true, details: "" },
    { id: "hottub", label: "Hot Tub", icon: Bath, enabled: false, allowDetails: true, details: "" },
    { id: "coffee", label: "Coffee Maker", icon: Coffee, enabled: false, allowDetails: true, details: "" },
    { id: "workspace", label: "Workspace", icon: Utensils, enabled: false, allowDetails: true, details: "" },
];

export const defaultRecommendations: FeatureItem[] = [
    { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed, enabled: false, allowDetails: true, details: "" },
    { id: "grocery", label: "Grocery Stores", icon: ShoppingCart, enabled: false, allowDetails: true, details: "" },
    { id: "hospital", label: "Hospital / Pharmacy", icon: Stethoscope, enabled: false, allowDetails: true, details: "" },
    { id: "transport", label: "Transport", icon: Bus, enabled: false, allowDetails: true, details: "" },
    { id: "nightlife", label: "Nightlife", icon: Moon, enabled: false, allowDetails: true, details: "" },
    { id: "attractions", label: "Attractions", icon: Theater, enabled: false, allowDetails: true, details: "" },
];

export const defaultRules: FeatureItem[] = [
    { id: "quiet", label: "Quiet Hours", icon: Volume2, enabled: false, allowDetails: true, details: "" },
    { id: "pets", label: "Pets Allowed", icon: Dog, enabled: false, allowDetails: true, details: "" },
    { id: "smoking", label: "Smoking Allowed", icon: Cigarette, enabled: false, allowDetails: false, details: "" },
    { id: "parties", label: "Parties Allowed", icon: PartyPopper, enabled: false, allowDetails: false, details: "" },
    { id: "children", label: "Children Allowed", icon: Baby, enabled: false, allowDetails: false, details: "" },
];

export const defaultWhereIsItems: FeatureItem[] = [
    { id: "towels", label: "Towels", icon: Bath, enabled: false, allowDetails: true, details: "" },
    { id: "bedding", label: "Extra Bedding", icon: Bed, enabled: false, allowDetails: true, details: "" },
    { id: "pots", label: "Pots & Pans", icon: Utensils, enabled: false, allowDetails: true, details: "" },
    { id: "remote", label: "TV Remote", icon: Tv, enabled: false, allowDetails: true, details: "" },
    { id: "cleaning", label: "Cleaning Supplies", icon: Trash2, enabled: false, allowDetails: true, details: "" },
    { id: "thermostat", label: "Thermostat", icon: Thermometer, enabled: false, allowDetails: true, details: "" },
    { id: "safe", label: "Safe/Lockbox", icon: Lock, enabled: false, allowDetails: true, details: "" },
    { id: "speaker", label: "Bluetooth Speaker", icon: Speaker, enabled: false, allowDetails: true, details: "" },
    { id: "first_aid", label: "First Aid Kit", icon: BriefcaseMedical, enabled: false, allowDetails: true, details: "" },
    { id: "fire_extinguisher", label: "Fire Extinguisher", icon: FireExtinguisher, enabled: false, allowDetails: true, details: "" },
];
