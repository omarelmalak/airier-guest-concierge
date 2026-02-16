export interface ExactAnswer {
    id: string;
    question: string;
    answer: string;
}

export interface Guest {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    startDate: string;
    endDate: string;
}

export interface FeatureItem {
    id: string;
    label: string;
    icon: React.ElementType;
    enabled?: boolean;
    details?: string;
    allowDetails?: boolean;
}

export type TabType = "overview" | "knowledge" | "exact-answers" | "guests";
