import { Select } from "antd";
import { OptionProps, SelectProps } from "antd/es/select";
import { filterOption } from "./shared";
import { getAreas } from "./sources";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AreaSelectProps extends SelectProps<any> {
  optionProps?: OptionProps;
}

export const AreaSelect = ({
  optionProps,
  ...selectProps
}: AreaSelectProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [areas, setAreas] = useState<any>([]);
  useEffect(() => {
    const countries = getAreas().map((area) => {
      return {
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={`./images/pool/${area.short.toLowerCase()}.png`} />
            <p> {area.name}</p>
          </div>
        ),
        ...area,
      };
    });

    setAreas(countries);
  }, []);

  return (
    <span
      onMouseUp={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Select
        showSearch
        variant={"outlined"}
        popupMatchSelectWidth={true}
        optionLabelProp="label"
        filterOption={filterOption}
        {...selectProps}
      >
        {areas.map((item: any, index: number) => {
          const key = `${item.name} +(${item.phoneCode})`;
          const fixedProps = {
            value: item.short,

            name: item.name,
            phone: item.phoneCode,
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={`./images/pool/${item.short.toLowerCase()}.png`} />
                <span style={{ paddingLeft: "5px" }}> {item.name}</span>
              </div>
            ),
          };
          return (
            <Select.Option {...optionProps} key={index} {...fixedProps}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={`./images/pool/${item.short.toLowerCase()}.png`} />
                {key}
              </div>
            </Select.Option>
          );
        })}
      </Select>
    </span>
  );
};

export default AreaSelect;
