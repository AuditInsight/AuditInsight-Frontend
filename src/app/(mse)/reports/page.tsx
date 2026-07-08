"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Reports module removed — platform focuses on transactions and evidence. */
export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}
