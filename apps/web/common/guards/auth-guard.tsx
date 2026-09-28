"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMe } from "../../features/auth/hooks/me";
import { FullPageSpinner } from "../components/spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push("/login");
    }
  }, [isLoading, isError, user, router, pathname]);

  if (isLoading) return <FullPageSpinner></FullPageSpinner>;
  if (!user) return null;

  return <>{children}</>;
}
