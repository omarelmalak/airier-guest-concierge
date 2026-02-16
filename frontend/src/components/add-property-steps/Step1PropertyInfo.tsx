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

interface Step1PropertyInfoProps {
  propertyInfo: PropertyInfo;
  setPropertyInfo: (info: PropertyInfo) => void;
}

export const Step1PropertyInfo = ({ propertyInfo, setPropertyInfo }: Step1PropertyInfoProps) => {
  return (
    <div className="space-y-5">
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
            placeholder="e.g., 123 Main St, Toronto, Canada"
            value={propertyInfo.address}
            onChange={(e) =>
              setPropertyInfo({ ...propertyInfo, address: e.target.value })
            }
            className="mt-1.5"
          />
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
