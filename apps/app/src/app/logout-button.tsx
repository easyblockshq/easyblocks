"use client";

import { Button } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";

function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={() => {
        supabase.auth.signOut().then(() => {
          router.push("/sign-in");
        });
      }}
    >
      Logout
    </Button>
  );
}

export { LogoutButton };
