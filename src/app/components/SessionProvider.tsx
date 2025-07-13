"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function SessionProvider() {
  const { verifySession, hydrated } = useAuthStore();

  useEffect(() => {
    // Only verify session after hydration is complete
    if (hydrated) {
      verifySession();
    }
  }, [hydrated, verifySession]);

  // This component doesn't render anything
  return null;
} 