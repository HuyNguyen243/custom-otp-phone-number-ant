import { SelectProps } from "rc-select";
import { useCallback, useEffect, useState } from "react";
import compactAreas, { Area } from "./sources";
import { CountryPhoneInputValue } from "./typings";
import parsePhoneNumber, { AsYouType, CountryCode } from "libphonenumber-js";
export const filterOption: SelectProps["filterOption"] = (input, option) => {
  let result = false;
  const parsePhoneToString = option?.phone?.toString();
  const formatInput = input.toLowerCase().trim();

  if (
    option?.name?.toLowerCase()?.includes(formatInput) ||
    parsePhoneToString?.toLowerCase()?.includes(formatInput)
  ) {
    result = true;
  }
  return result;
};

export const usePhoneInput = ({
  isControlled,
  defaultValue,
  value,
  onChange,
}: {
  isControlled: boolean;
  defaultValue?: CountryPhoneInputValue;
  value?: CountryPhoneInputValue;
  onChange?: (value: CountryPhoneInputValue) => void;
}) => {
  if (defaultValue) {
    defaultValue.short = defaultValue.short?.toUpperCase();
  }
  if (value) {
    value.short = value.short?.toUpperCase();
  }

  const defaultArea: Area | undefined = compactAreas.find((area) => {
    if (defaultValue) {
      return area.short === defaultValue.short;
    }
    return area.short === "CN";
  });
  const [area, setArea] = useState<Area | undefined>(defaultArea);
  const [phone, setPhone] = useState<string | undefined>(defaultValue?.phone);

  useEffect(() => {
    if (!isControlled) return;

    if (value === undefined) {
      setArea(undefined);
      setPhone(undefined);
      return;
    }
    if (value.short) {
      setArea(compactAreas.find((area) => area.short === value.short));
    } else {
      setArea(compactAreas.find((area) => area.phoneCode === value.code));
    }
    setPhone(value.phone);
  }, [value, isControlled]);

  const formatPhoneNumber = (phoneNumber: string | undefined) => {
    const AREA_CODE_LENGTH = 3;
    const code = area?.short as CountryCode;
    if (!phoneNumber) return "";

    if (phoneNumber.length - AREA_CODE_LENGTH > 2) {
      // Guard condition for phone number parser breaking when length reaches 2

      const parsedPhoneNumber = parsePhoneNumber(phoneNumber, code);
      if (!parsedPhoneNumber) return new AsYouType(code).input(phoneNumber);

      return parsedPhoneNumber.formatInternational();
    } else {
      // Allow free input of telephone numbers except invalid characters

      return new AsYouType(code).input(phoneNumber);
    }
  };

  const triggerChange = useCallback(
    (phone?: string, area?: Area) => {
      const result: CountryPhoneInputValue = {
        phone: phone,
        code: area?.phoneCode,
        short: area?.short,
      };
      onChange?.(result);
    },
    [onChange]
  );

  const handleAreaChange = useCallback(
    (value: string) => {
      const area = compactAreas.find((area) => area.short === value);
      if (!area) {
        return;
      }
      setArea(area);
      triggerChange(phone, area);
    },
    [setArea, triggerChange, phone]
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentValue = e.target.value;
      const formatPhone = formatPhoneNumber(currentValue);
      setPhone(formatPhone);
      triggerChange(formatPhone, area);
    },
    [setPhone, area, triggerChange]
  );
  return { area, handleAreaChange, handlePhoneChange, phone };
};
