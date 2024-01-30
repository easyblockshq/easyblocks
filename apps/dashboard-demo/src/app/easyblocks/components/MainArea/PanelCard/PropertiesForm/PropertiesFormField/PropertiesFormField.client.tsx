import { Switch, TextField } from "@radix-ui/themes";
import { useId } from "react";
import { NoCodeComponentProps } from "../../../../types";

function PropertiesFormTextField({ property }: NoCodeComponentProps) {
  const inputId = useId();

  return (
    <div className={`flex flex-col gap-2`}>
      <label htmlFor={inputId}>{property.label}</label>
      <TextField.Root>
        <TextField.Input
          name={property.id}
          id={inputId}
          defaultValue={property.value}
        />
      </TextField.Root>
    </div>
  );
}

function PropertiesFormBooleanField({ property }: NoCodeComponentProps) {
  const inputId = useId();

  return (
    <div className={`flex flex-col gap-2`}>
      <label htmlFor={inputId}>{property.label}</label>
      <Switch name={property.id} id={inputId} defaultValue={property.value} />
    </div>
  );
}

export { PropertiesFormTextField, PropertiesFormBooleanField };
