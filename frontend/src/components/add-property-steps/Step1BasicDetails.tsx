import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import tzlookup from "tz-lookup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyInfo } from "@/lib/static-data/request-types";

declare global {
  interface Window {
    google?: any;
  }
}

interface Step1BasicDetailsProps {
  propertyInfo: PropertyInfo;
  setPropertyInfo: Dispatch<SetStateAction<PropertyInfo>>;
}

export const Step1BasicDetails = ({ propertyInfo, setPropertyInfo }: Step1BasicDetailsProps) => {
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const isAddressLocked = Boolean(propertyInfo.address && propertyInfo.timezone);

  const inferTimezoneFromLatLng = (lat: number, lng: number): string | undefined => {
    try {
      const zone = tzlookup(lat, lng);
      console.log("Inferred timezone from lat/lng", { lat, lng, zone });
      return zone;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    let autocomplete: any;

    const loadScript = () => {
      if ((window as any).google?.maps?.places) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
          'script[data-google-maps="true"]'
        );
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener(
            "error",
            () => reject(new Error("Failed to load Google Maps")),
            { once: true }
          );
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMaps = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
      });
    };

    loadScript()
      .then(() => {
        if (!addressInputRef.current || !window.google?.maps?.places) return;

        autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          fields: ["formatted_address", "name", "geometry"],
          types: ["geocode"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace?.();
          const address =
            (place?.formatted_address as string | undefined) ||
            (place?.name as string | undefined) ||
            "";

          if (!address) return;

          let timezone: string | undefined;
          const lat = place?.geometry?.location?.lat?.();
          const lng = place?.geometry?.location?.lng?.();

          if (typeof lat === "number" && typeof lng === "number") {
            timezone = inferTimezoneFromLatLng(lat, lng);
          }

          setPropertyInfo((prev) => ({
            ...prev,
            address,
            timezone: timezone ?? prev.timezone,
          }));
        });
      })
      .catch(() => {
        // swallow errors; user can still type manually
      });

    return () => {
      if (autocomplete && window.google?.maps?.event?.clearInstanceListeners) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [setPropertyInfo]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1">Basic details</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Name, address, type, and capacity of your property.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Label htmlFor="name">Property Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Cozy Downtown Loft"
            value={propertyInfo.name}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, name: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            placeholder="Enter an address"
            ref={addressInputRef}
            value={propertyInfo.address}
            readOnly={isAddressLocked}
            onChange={(e) => {
              if (isAddressLocked) return;
              setPropertyInfo({
                ...propertyInfo,
                address: e.target.value,
                timezone: undefined,
              });
            }}
            className="mt-1.5"
          />
          {isAddressLocked && (
            <button
              type="button"
              className="mt-1 text-xs text-muted-foreground underline underline-offset-2"
              onClick={() =>
                setPropertyInfo({
                  ...propertyInfo,
                  address: "",
                  timezone: undefined,
                })
              }
            >
              Change address
            </button>
          )}
        </div>
        <div>
          <Label htmlFor="ownershipLevel">What guests have access to *</Label>
          <Select
            value={propertyInfo.ownershipLevel}
            onValueChange={(value) =>
              setPropertyInfo({ ...propertyInfo, ownershipLevel: value })
            }
          >
            <SelectTrigger id="ownershipLevel" className="mt-1.5">
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entire place">Entire place</SelectItem>
              <SelectItem value="Private room">Private room</SelectItem>
              <SelectItem value="Shared room">Shared room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Property Type *</Label>
          <Select
            value={propertyInfo.propertyType}
            onValueChange={(value) =>
              setPropertyInfo({ ...propertyInfo, propertyType: value })
            }
          >
            <SelectTrigger id="type" className="mt-1.5">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Cabin">Cabin</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
              <SelectItem value="Loft">Loft</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="2"
            value={propertyInfo.bedrooms}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, bedrooms: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            placeholder="1"
            value={propertyInfo.bathrooms}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, bathrooms: e.target.value })
            }
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
};
