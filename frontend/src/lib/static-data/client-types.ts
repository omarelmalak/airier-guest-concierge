export interface ExactAnswer {
    id: string;
    question: string;
    answer: string;
}

export interface GuestInfo {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    startDate: string;
    endDate: string;
}

export interface WhereIsItem {
    id: string;
    label: string;
    icon: React.ElementType;
    location: string;
}

export interface AmenityItem {
    id: string;
    label: string;
    icon: React.ElementType;
    enabled: boolean;
    details?: string;
}

export interface RecommendationItem {
    id: string;
    label: string;
    icon: React.ElementType;
    recommendations: string;
}

export interface RuleItem {
    id: string;
    label: string;
    icon: React.ElementType;
    enabled: boolean;
    details?: string;
    type: "toggle" | "time";
}

export type TabType = "overview" | "knowledge" | "exact-answers" | "guests";
