import { Property } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { GetPropertiesResponse } from "@/lib/static-data/response-types";

interface PropertyListCardProps {
  property: GetPropertiesResponse;
}

const PropertyListCard = ({ property }: PropertyListCardProps) => {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-card"
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-foreground">{property.name}</h3>
        <StatusBadge status={property.ai_status} />
      </div>

      {/* Image */}
      <div className="px-4 relative">
        <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
          <img
            src={property.photo}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {property.active_guests_count > 0 && (
            <div className="absolute bottom-3 right-3 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
              {property.active_guests_count}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-3">
        <h4 className="font-semibold text-foreground mb-2">{property.address}</h4>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${property.ai_status === 'online' ? 'bg-status-online' : property.ai_status === 'warning' ? 'bg-status-warning' : 'bg-status-offline'}`} />
            <span>{property.active_guests_count}/3 active guests</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Subscription until {property.subscription_expires_at}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyListCard;
