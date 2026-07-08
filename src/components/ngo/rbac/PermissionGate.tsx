"use client";

/**
 * PermissionGate.tsx — Declarative RBAC gate component.
 *
 * Three gate modes:
 *   1. permission — checks a Permission atom
 *   2. component  — checks a ComponentKey in COMPONENT_GATE
 *   3. roles      — checks role membership
 *
 * Usage:
 *   <PermissionGate component="txn:upload_btn">
 *     <UploadButton />
 *   </PermissionGate>
 *
 *   <PermissionGate roles={["ORG_ADMIN"]} fallback={<ReadOnlyLabel />}>
 *     <ResolveButton />
 *   </PermissionGate>
 */

import type { ReactNode } from "react";
import { useRBAC } from "@/context/RBACContext";
import type { Permission, ComponentKey, NGOUserRole } from "@/types/rbac";

interface PermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  permission?: Permission;
  component?: ComponentKey;
  roles?: NGOUserRole[];
}

export default function PermissionGate({
  children,
  fallback = null,
  permission,
  component,
  roles,
}: PermissionGateProps) {
  const { can, canSee, user } = useRBAC();

  let allowed = true;
  if (permission !== undefined)  allowed = can(permission);
  else if (component !== undefined) allowed = canSee(component);
  else if (roles !== undefined)  allowed = roles.includes(user.role);

  return allowed ? <>{children}</> : <>{fallback}</>;
}


