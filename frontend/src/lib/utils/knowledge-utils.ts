import { FeatureItem } from '../static-data/client-types';

export const toggleItem = (
    id: string,
    items: FeatureItem[],
    setItems: (items: FeatureItem[]) => void
) => {
    setItems(
        items.map((item) =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        )
    );
};

export const updateDetails = (
    id: string,
    details: string,
    items: FeatureItem[],
    setItems: (items: FeatureItem[]) => void
) => {
    setItems(
        items.map((item) => (item.id === id ? { ...item, details } : item))
    );
};

/** Like updateDetails but also sets enabled from whether details is non-empty. Use when there is no separate toggle (e.g. Local Recommendations). */
export const updateDetailsAndEnabled = (
    id: string,
    details: string,
    items: FeatureItem[],
    setItems: (items: FeatureItem[]) => void
) => {
    setItems(
        items.map((item) =>
            item.id === id
                ? { ...item, details, enabled: details.trim().length > 0 }
                : item
        )
    );
};
