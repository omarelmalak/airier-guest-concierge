import { Property } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-card"
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-foreground">{property.name}</h3>
        <StatusBadge status={property.aiStatus} />
      </div>

      {/* Image */}
      <div className="px-4 relative">
        <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {property.activeGuests > 0 && (
            <div className="absolute bottom-3 right-3 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
              {property.activeGuests}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-3">
        <h4 className="font-semibold text-foreground mb-2">{property.name}</h4>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${property.aiStatus === 'online' ? 'bg-status-online' : property.aiStatus === 'warning' ? 'bg-status-warning' : 'bg-status-offline'}`} />
            <span>{property.activeGuests}/{property.maxGuests} active guests</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Subscription until {property.subscriptionExpiry}</span>
        </div>

        {/* Guest Avatars
        {property.guests.length > 0 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex -space-x-2">
              {property.guests.slice(0, 3).map((guest, index) => (
                <div
                  key={guest.id}
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center"
                  style={{ zIndex: 3 - index }}
                >
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </Link>
  );
};

export default PropertyCard;
