import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

interface PropertyCreatedProps {
    propertyId: number | string;
}

export const PropertyCreated = ({ propertyId }: PropertyCreatedProps) => {
    const navigate = useNavigate();

    const handleViewProperty = () => {
        navigate(`/properties/${propertyId}`);
    };

    const handleBackToDashboard = () => {
        navigate("/properties");
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] relative overflow-hidden">
                {/* Confetti particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 rounded-sm"
                            style={{
                                left: `${10 + (i * 7)}%`,
                                top: '-20px',
                                backgroundColor: i % 3 === 0 ? 'hsl(var(--primary))' : i % 3 === 1 ? 'hsl(var(--primary-light))' : 'hsl(var(--status-online))',
                                animation: `confetti-fall ${2 + (i * 0.2)}s ease-out ${i * 0.1}s forwards`,
                                transform: `rotate(${i * 30}deg)`,
                            }}
                        />
                    ))}
                </div>

                <div className="text-center">
                    {/* Checkmark Animation */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        {/* Outer pulse ring */}
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-success-pulse" />

                        {/* Main circle with checkmark */}
                        <div className="relative flex items-center justify-center w-32 h-32 bg-primary rounded-full shadow-xl animate-circle-fill">
                            <svg
                                viewBox="0 0 52 52"
                                className="w-16 h-16"
                            >
                                <path
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 27l8 8 16-16"
                                    strokeDasharray="100"
                                    strokeDashoffset="100"
                                    className="animate-checkmark"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="animate-float-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                        <h1 className="text-3xl font-semibold text-foreground mb-3">
                            Property Created!
                        </h1>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Your property has been successfully added. You can now configure more settings or start welcoming guests.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={handleViewProperty}
                                className="min-w-[140px]"
                            >
                                View Property
                            </Button>
                            <Button onClick={handleBackToDashboard} className="min-w-[140px]">
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
