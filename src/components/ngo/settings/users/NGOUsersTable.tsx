// src/components/ngo/settings/users/NGOUsersTable.tsx

"use client";

import UsersTable, { User as MSEUser } from "@/components/mse/settings/users/UsersTable";

// Re‑export the MSE UsersTable under an NGO‑specific name.
// This keeps the folder structure tidy while re‑using the existing logic.

export interface User extends MSEUser {}

export default function NGOUsersTable({ users }: { users: User[] }) {
  return <UsersTable users={users} />;
}
