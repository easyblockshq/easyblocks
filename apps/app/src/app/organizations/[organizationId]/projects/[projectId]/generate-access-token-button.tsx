"use client";

import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

function GenerateAccessTokenButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => {
        fetch(`/api/projects/${projectId}/tokens`, {
          method: "POST",
        }).then((res) => {
          if (res.ok) {
            router.refresh();
          }
        });
      }}
    >
      Generate new access token
    </Button>
  );
}

export { GenerateAccessTokenButton };
