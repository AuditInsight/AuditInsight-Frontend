"use client";

/**
 * DonorScopeBanner.tsx — Renders a high-visibility isolation banner for
 * DONOR_REPRESENTATIVE users. Renders nothing for all other roles.
 *
 * Reads scope from RBACContext — no props needed.
 */

import { Lock } from "lucide-react";
import { useRBAC } from "@/context/RBACContext";

export default function DonorScopeBanner() {
  const { user } = useRBAC();

  if (user.role !== "DONOR_REPRESENTATIVE" || !user.assignedDonorId) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 border border-violet-200 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
        <Lock size={14} className="text-violet-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-violet-900 leading-tight">
          Scoped Access — {user.assignedDonorId} Portfolio Only
        </p>
        <p className="text-xs text-violet-600 mt-0.5 leading-tight">
          You are viewing data exclusively scoped to your organisation&apos;s
          funding pool. Other donors&apos; data is not accessible from this account.
        </p>
      </div>
      <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-violet-200 text-violet-800 text-xs font-bold border border-violet-300">
        READ-ONLY
      </span>
    </div>
  );
}
