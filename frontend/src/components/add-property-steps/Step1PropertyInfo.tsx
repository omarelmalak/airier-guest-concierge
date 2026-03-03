import { PropertyInfo } from "@/lib/static-data/request-types";
import { Step1BasicDetails } from "./Step1BasicDetails";
import { Step1CheckinCheckout } from "./Step1CheckinCheckout";

interface Step1PropertyInfoProps {
  currentSubStep: number; // 1 = Basic details, 2 = Check-in & Check-out
  propertyInfo: PropertyInfo;
  setPropertyInfo: (info: PropertyInfo) => void;
}

export const Step1PropertyInfo = ({
  currentSubStep,
  propertyInfo,
  setPropertyInfo,
}: Step1PropertyInfoProps) => {
  if (currentSubStep === 1) {
    return (
      <Step1BasicDetails
        propertyInfo={propertyInfo}
        setPropertyInfo={setPropertyInfo}
      />
    );
  }
  if (currentSubStep === 2) {
    return (
      <Step1CheckinCheckout
        propertyInfo={propertyInfo}
        setPropertyInfo={setPropertyInfo}
      />
    );
  }
  return null;
};
