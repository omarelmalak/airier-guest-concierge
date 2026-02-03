import { FeatureItem } from './static-data/client-types';

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
