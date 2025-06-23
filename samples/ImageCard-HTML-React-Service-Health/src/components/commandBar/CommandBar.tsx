import * as React from "react";

import { Button, Divider, } from "@fluentui/react-components";

import Stack from "../stack/Stack";

export interface ICommandBarOption {
  /** Label for the button */
  label?: string;

  /** Icon for the button */
  icon: JSX.Element;

  /** Callback for the button */
  onClick: () => void;

  /** Whether the button should be disabled */
  disabled?: boolean;

  /** Custom style for the button */
  style?: React.CSSProperties;

  /** Custom className for the button */
  className?: string;
  /* apperance */
 appearance?: "primary" | "subtle" | "outline" | "transparent";
 
}

interface ICommandBarProps {
  /** Array of options to render in the CommandBar */
  options: ICommandBarOption[];
  className?: string;
  style?: React.CSSProperties;
  faritems?: ICommandBarOption[];
}

export const CommandBar: React.FC<ICommandBarProps> = ({ options, className, style, faritems }) => {
  return (
    <>
      <Stack
        direction="horizontal"
        gap={"s"}
        className={className}
        style={style}
      >
        {options.map((option, index) => (
           
          <Button
            key={index}
            appearance={option?.appearance ?? "subtle"}
            icon={option.icon}
            onClick={option.onClick}
            disabled={option.disabled}
            style={option.style}
            className={option.className}
          >
            {option.label}
          </Button>
         
        ))}
        <Stack direction="horizontal" gap={"s"} justifyContent="end" width={"100%"}>
          {faritems &&
            faritems.map((option, index) => (
                
              <Button
                key={index}
                appearance={option?.appearance ?? "subtle"}
                icon={option.icon}
                onClick={option.onClick}
                disabled={option.disabled}
                style={option.style}
                className={option.className}
              >
                {option.label ? option.label : <></>}
              </Button>
            ))}
        </Stack>
      </Stack>

      <Divider />
    </>
  );
};

export default CommandBar;
