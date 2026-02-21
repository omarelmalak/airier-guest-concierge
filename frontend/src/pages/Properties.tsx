import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PropertyListCard from "@/components/PropertyListCard";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/services/properties";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";

const Properties = () => {
    const { data: properties, isLoading } = useQuery({
        queryKey: ['properties'],
        queryFn: () => getProperties(),
        refetchInterval: 30_000,
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Properties</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your property listings and check their activity.
                        </p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                        <Link to="/add-property">
                            <Plus className="w-4 h-4" />
                            Add Property
                        </Link>
                    </Button>
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {properties?.map((property, index) => (
                        <div
                            key={property.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <PropertyListCard property={property} />
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Properties;
