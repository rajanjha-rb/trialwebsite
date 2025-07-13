"use client";

import { useAuthStore } from "../../store/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, hydrated } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    // Only redirect after hydration is complete and session is confirmed
    if (hydrated && session) {
      router.push("/");
    }
  }, [session, router, hydrated]);

  // Don't render anything until hydration is complete
  if (!hydrated) {
    return null;
  }

  // Don't render auth pages if user is already logged in
  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <div className="relative">{children}</div>
    </div>
  );
};

export default Layout;
