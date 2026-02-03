import { AmenityItem, RecommendationItem, RuleItem, WhereIsItem } from "./client-types";
import {
    Wifi, Car, Droplets, Tv, ChefHat, WashingMachine, Thermometer,
    Flame, Dumbbell, Bath, Coffee, Utensils, Theater, Moon, Bus,
    Stethoscope, ShoppingCart, UtensilsCrossed, Volume2, Dog,
    Cigarette, PartyPopper, Baby, Bed, Trash2, Lock, Speaker,
    FireExtinguisher, BriefcaseMedical
} from "lucide-react";

export const defaultAmenities: AmenityItem[] = [
    { id: "wifi", label: "Wi-Fi", icon: Wifi, enabled: false },
    { id: "parking", label: "Parking", icon: Car, enabled: false },
    { id: "pool", label: "Pool", icon: Droplets, enabled: false },
    { id: "tv", label: "TV", icon: Tv, enabled: false },
    { id: "kitchen", label: "Kitchen", icon: ChefHat, enabled: false },
    { id: "laundry", label: "Laundry", icon: WashingMachine, enabled: false },
    { id: "ac", label: "A/C", icon: Thermometer, enabled: false },
    { id: "heating", label: "Heating", icon: Flame, enabled: false },
    { id: "gym", label: "Gym", icon: Dumbbell, enabled: false },
    { id: "hottub", label: "Hot Tub", icon: Bath, enabled: false },
    { id: "coffee", label: "Coffee Maker", icon: Coffee, enabled: false },
    { id: "workspace", label: "Workspace", icon: Utensils, enabled: false },
];

export const defaultRecommendations: RecommendationItem[] = [
    { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed, recommendations: "" },
    { id: "grocery", label: "Grocery Stores", icon: ShoppingCart, recommendations: "" },
    { id: "hospital", label: "Hospital / Pharmacy", icon: Stethoscope, recommendations: "" },
    { id: "transport", label: "Transport", icon: Bus, recommendations: "" },
    { id: "nightlife", label: "Nightlife", icon: Moon, recommendations: "" },
    { id: "attractions", label: "Attractions", icon: Theater, recommendations: "" },
];

export const defaultRules: RuleItem[] = [
    { id: "quiet", label: "Quiet Hours", icon: Volume2, enabled: false, type: "time" },
    { id: "pets", label: "Pets Allowed", icon: Dog, enabled: false, type: "toggle" },
    { id: "smoking", label: "Smoking Allowed", icon: Cigarette, enabled: false, type: "toggle" },
    { id: "parties", label: "Parties Allowed", icon: PartyPopper, enabled: false, type: "toggle" },
    { id: "children", label: "Children Allowed", icon: Baby, enabled: false, type: "toggle" },
];

export const defaultWhereIsItems: WhereIsItem[] = [
    { id: "towels", label: "Towels", icon: Bath, location: "" },
    { id: "bedding", label: "Extra Bedding", icon: Bed, location: "" },
    { id: "pots", label: "Pots & Pans", icon: Utensils, location: "" },
    { id: "remote", label: "TV Remote", icon: Tv, location: "" },
    { id: "cleaning", label: "Cleaning Supplies", icon: Trash2, location: "" },
    { id: "thermostat", label: "Thermostat", icon: Thermometer, location: "" },
    { id: "safe", label: "Safe/Lockbox", icon: Lock, location: "" },
    { id: "speaker", label: "Bluetooth Speaker", icon: Speaker, location: "" },
    { id: "first_aid", label: "First Aid Kit", icon: BriefcaseMedical, location: "" },
    { id: "fire_extinguisher", label: "Fire Extinguisher", icon: FireExtinguisher, location: "" },
];
