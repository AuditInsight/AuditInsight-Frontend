"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MockNotification,
  getNotificationsForUser,
  markNotificationRead,
  markAllRead,
  sendNotification,
  seedNotificationsIfEmpty,
  NotifType,
} from "@/mock/notifications.mock";
import { useAuth } from "@/context/AuthContext.production";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<MockNotification[]>([]);

  const refresh = useCallback(() => {
    if (!user?.email) return;
    seedNotificationsIfEmpty();
    setNotifications(getNotificationsForUser(user.email));
  }, [user?.email]);

  useEffect(() => { refresh(); }, [refresh]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const read = (id: string) => {
    markNotificationRead(id);
    refresh();
  };

  const readAll = () => {
    if (user?.email) { markAllRead(user.email); refresh(); }
  };

  return { notifications, unreadCount, read, readAll, refresh };
}

// ── Helpers called from action handlers (no hook needed) ─────────────

export function notifyInviteSent(recipientEmail: string, orgName: string, inviterName: string, role: string) {
  sendNotification({
    type: "INVITE_SENT" as NotifType,
    recipientEmail,
    subject: `You've been invited to ${orgName}`,
    body: `${inviterName} has invited you to join ${orgName} as ${role === "AUDITOR" ? "an Auditor" : "an Accountant"}. Check your email for the secure invite link.`,
  });
}

export function notifyFlagCreated(
  accountantEmail: string,
  txnId: string,
  counterparty: string,
  amount: string,
  issueType: string,
  severity: string,
  auditorName: string
) {
  sendNotification({
    type: "FLAG_CREATED" as NotifType,
    recipientEmail: accountantEmail,
    subject: `⚠ Auditor flagged ${txnId} — ${issueType} [${severity}]`,
    body: `${auditorName} has flagged transaction ${txnId} (${counterparty} – ${amount}). Issue: ${issueType}. Severity: ${severity}. Please resolve in the Review Queue.`,
  });
}

export function notifyFlagResolved(
  auditorEmail: string,
  txnId: string,
  resolutionNote: string,
  accountantName: string
) {
  sendNotification({
    type: "FLAG_RESOLVED" as NotifType,
    recipientEmail: auditorEmail,
    subject: `✅ Accountant resolved flag on ${txnId}`,
    body: `${accountantName} has resolved the flag on ${txnId}. Note: "${resolutionNote}". Please review.`,
  });
}
