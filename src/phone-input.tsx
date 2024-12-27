import { Input } from "antd";
import { GroupProps, InputProps } from "antd/es/input";
import AreaSelect, { AreaSelectProps } from "./area-select";
import { CountryPhoneInputValue } from "./typings";
import { usePhoneInput } from "./shared";
import { CountryCode } from "libphonenumber-js";

export interface CountryPhoneInputProps
  extends Omit<InputProps, "defaultValue" | "value" | "onChange"> {
  defaultValue?: CountryPhoneInputValue;
  value?: CountryPhoneInputValue;
  onChange?: (value: CountryPhoneInputValue) => void;
  selectProps?: AreaSelectProps;
  inputGroupProps?: GroupProps;
  inline?: boolean;
  className?: string;
  disabled?: boolean;
  country?: CountryCode;
}

export const CountryPhoneInput = ({
  defaultValue,
  onChange,
  selectProps = { value: "235" },
  // inputGroupProps,
  inline,
  className,
  disabled,
  country = "JP",
  ...inputProps
}: CountryPhoneInputProps) => {
  const isControlled = "value" in inputProps;
  const { value } = inputProps;
  const { area, handleAreaChange, handlePhoneChange, phone } = usePhoneInput({
    isControlled,
    defaultValue,
    value,
    onChange,
  });

  const commonProps = { disabled };
  const areaSelect = (
    <AreaSelect
      {...commonProps}
      {...selectProps}
      value={area?.short || country}
      onChange={handleAreaChange}
    />
  );

  if (inline) {
    inputProps.addonBefore = areaSelect;
  } else {
    inputProps.prefix = areaSelect;
  }

  return (
    <Input
      {...commonProps}
      {...inputProps}
      className={
        "antd-country-phone-input" + (className ? ` ${className}` : "")
      }
      value={phone}
      onChange={handlePhoneChange}
    />
  );
};
