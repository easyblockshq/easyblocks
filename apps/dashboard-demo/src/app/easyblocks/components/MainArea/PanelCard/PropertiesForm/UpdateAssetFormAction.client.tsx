import { FormEvent, ReactElement } from "react";
import { NoCodeComponentProps } from "../../../types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function UpdateAssetFormAction({
  target: Target,
  asset,
}: NoCodeComponentProps & { target: ReactElement }) {
  const router = useRouter();

  return (
    <Target.type
      {...Target.props}
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const payload: Record<string, any> = {};

        for (const formDataEntry of formData.entries()) {
          const [key, value] = formDataEntry;

          if (key === "isDisabled" && value === "on") {
            payload[key] = true;
          } else {
            payload[key] = value;
          }
        }

        if (payload.isDisabled === undefined) {
          payload.isDisabled = false;
        }

        fetch(`http://localhost:3200/assets/${asset.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => {
          toast("Data saved!");
          router.refresh();
        });
      }}
    />
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { UpdateAssetFormAction };
