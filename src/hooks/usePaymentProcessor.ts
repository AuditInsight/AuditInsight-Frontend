import { useState, useCallback } from "react";
import apiClient from "@/api/client";
import { SubscriptionType, Subscription } from "@/types/billing";

export interface PaymentCheckoutResponse {
  paymentId: string;
  checkoutUrl?: string;
  status: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED" | "UNDERPAID" | "EXPIRED" | "CANCELLED";
  failureReason?: string;
}

export interface SubscriptionResponse {
  id: string;
  organisationId: string;
  subscriptionType: SubscriptionType | null;
  status: Subscription["status"];
  startDate: string;
  endDate: string;
}

/** Outcome of a Mobile Money payment, returned directly so callers never read stale hook state. */
export type MomoPaymentResult =
  | { outcome: "paid"; subscription: Subscription | null }
  /** Still awaiting approval when we stopped watching; the server will finish it when it is confirmed. */
  | { outcome: "pending"; paymentId: string }
  | { outcome: "failed"; error: string };

interface UsePaymentProcessorOptions {
  organisationId: string;
  subscriptionType: SubscriptionType;
}

const POLL_INTERVAL_MS = 2000;
/** About two minutes of active checking before we stop blocking the user. */
const MAX_POLL_ATTEMPTS = 60;

/** Backend messages (e.g. "A Mobile Money payment … is already waiting") live in response.data.message. */
function serverMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string; error?: string } } }).response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }
  return fallback;
}

function failureMessage(data: PaymentStatusResponse): string {
  switch (data.status) {
    case "UNDERPAID":
      return data.failureReason ?? "The full subscription amount was not received.";
    case "EXPIRED":
      return "The payment was not approved in time. Please try again.";
    case "CANCELLED":
      return "The payment was cancelled.";
    default:
      return data.failureReason ?? "The payment was declined. Please try again.";
  }
}

export function usePaymentProcessor({ organisationId, subscriptionType }: UsePaymentProcessorOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const startMomoCheckout = useCallback(
    async (phoneNumber: string): Promise<{ id: string } | { error: string }> => {
      try {
        const response = await apiClient.post<PaymentCheckoutResponse>(
          `/subscriptions/${organisationId}/checkout/momo`,
          { subscriptionType, phoneNumber }
        );
        setPaymentId(response.data.paymentId);
        return { id: response.data.paymentId };
      } catch (err) {
        return { error: serverMessage(err, "Could not start the Mobile Money payment. Please try again.") };
      }
    },
    [organisationId, subscriptionType]
  );

  /** Resolves with the final status, or null if it is still pending after the active window. */
  const pollPaymentStatus = useCallback(async (id: string): Promise<PaymentStatusResponse | null> => {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      try {
        const { data } = await apiClient.get<PaymentStatusResponse>(`/subscriptions/payments/${id}/status`);
        if (data.status !== "PENDING") return data;
      } catch {
        // A network blip is not a failed payment: keep checking.
      }
    }
    return null;
  }, []);

  /** The paid period now running (or queued after a trial). Null if it can't be loaded — payment still succeeded. */
  const getActiveSubscription = useCallback(async (): Promise<Subscription | null> => {
    try {
      const response = await apiClient.get<SubscriptionResponse>(`/subscriptions/${organisationId}/active`);
      return response.data;
    } catch {
      return null;
    }
  }, [organisationId]);

  const processMomoPayment = useCallback(
    async (phoneNumber: string): Promise<MomoPaymentResult> => {
      setLoading(true);
      setError(null);
      try {
        const started = await startMomoCheckout(phoneNumber);
        if ("error" in started) {
          setError(started.error);
          return { outcome: "failed", error: started.error };
        }
        const final = await pollPaymentStatus(started.id);
        if (!final) {
          return { outcome: "pending", paymentId: started.id };
        }
        if (final.status === "SUCCESSFUL") {
          return { outcome: "paid", subscription: await getActiveSubscription() };
        }
        const message = failureMessage(final);
        setError(message);
        return { outcome: "failed", error: message };
      } finally {
        setLoading(false);
      }
    },
    [startMomoCheckout, pollPaymentStatus, getActiveSubscription]
  );

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentId(null);
  }, []);

  return {
    loading,
    error,
    paymentId,
    processMomoPayment,
    getActiveSubscription,
    resetState,
  };
}
