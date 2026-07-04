"use client";

// RoleSwitcher is a dev-only tool that relied on the mock AuthContext's setMockRole.
// In production mode it renders nothing — role switching is done by logging in
// with a different account.
export default function RoleSwitcher() {
  return null;
}
