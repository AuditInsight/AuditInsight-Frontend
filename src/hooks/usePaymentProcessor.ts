import { useState, useCallback } from "react";
import apiClient from "@/api/client";
import { PlanTier, BillingCycle, Subscription } from "@/types/billing";

export interface PaymentCheckoutResponse {
  paymentId: string;
  checkoutUrl?: string;
  status: "PENDING" | "PROCESSING";
  message: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED";
  message?: string;
}

export interface SubscriptionResponse {
  id: string;
  organisationId: string;
  planTier: PlanTier;
  billingCycle: BillingCycle;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  endDate: string;
}

interface UsePaymentProcessorOptions {
  organisationId: string;
  planTier: PlanTier;
  billingCycle: BillingCycle;
}

export function usePaymentProcessor({
  organisationId,
  planTier,
  billingCycle,
}: UsePaymentProcessorOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Start MOMO Checkout
  const startMomoCheckout = useCallback(
    async (phoneNumber: string): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post<PaymentCheckoutResponse>(
          `/subscriptions/${organisationId}/checkout/momo`,
          {
            planTier,
            billingCycle,
            phoneNumber,
          }
        );

        const { paymentId: id } = response.data;
        setPaymentId(id);
        return id;
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to initiate MOMO payment. Please try again.";
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [organisationId, planTier, billingCycle]
  );

  // Start Card Checkout
  const startCardCheckout = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<PaymentCheckoutResponse>(
        `/subscriptions/${organisationId}/checkout/card`,
        {
          planTier,
          billingCycle,
          returnUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/ngo-dashboard/settings?tab=Billing%20and%20Plans`,
        }
      );

      const { paymentId: id, checkoutUrl: url } = response.data;
      setPaymentId(id);
      if (url) setCheckoutUrl(url);
      return id;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to initiate card payment. Please try again.";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [organisationId, planTier, billingCycle]);

  // Poll Payment Status
  const pollPaymentStatus = useCallback(
    async (id: string, maxAttempts: number = 60): Promise<boolean> => {
      let attempts = 0;
      const pollInterval = 2000; // 2 seconds

      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          attempts++;

          try {
            const response = await apiClient.get<PaymentStatusResponse>(
              `/subscriptions/payments/${id}/status`
            );

            const { status } = response.data;

            if (status === "SUCCESSFUL") {
              clearInterval(interval);
              resolve(true);
            } else if (status === "FAILED") {
              clearInterval(interval);
              setError("Payment failed. Please try again.");
              resolve(false);
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              setError("Payment verification timed out. Please check your payment status.");
              resolve(false);
            }
          } catch (err) {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              const errorMsg =
                err instanceof Error ? err.message : "Failed to verify payment status";
              setError(errorMsg);
              resolve(false);
            }
          }
        }, pollInterval);
      });
    },
    []
  );

  // Get Active Subscription
  const getActiveSubscription = useCallback(async (): Promise<Subscription | null> => {
    try {
      // Create a promise that rejects after 5 seconds
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Subscription request timed out")), 5000)
      );

      const response = await Promise.race([
        apiClient.get<SubscriptionResponse>(
          `/subscriptions/${organisationId}/active`
        ),
        timeoutPromise,
      ]);

      return response.data;
    } catch (err) {
      console.warn("Failed to fetch active subscription - using default", err);
      // Return null and let the settings page use a default subscription
      return null;
    }
  }, [organisationId]);

  // Process MOMO Payment (full flow)
  const processMomoPayment = useCallback(
    async (phoneNumber: string): Promise<Subscription | null> => {
      const id = await startMomoCheckout(phoneNumber);
      if (!id) return null;

      setLoading(true);
      try {
        const success = await pollPaymentStatus(id);
        if (!success) return null;

        const subscription = await getActiveSubscription();
        return subscription;
      } finally {
        setLoading(false);
      }
    },
    [startMomoCheckout, pollPaymentStatus, getActiveSubscription]
  );

  // Process Card Payment (returns checkout URL)
  const processCardPayment = useCallback(async (): Promise<string | null> => {
    const id = await startCardCheckout();
    return id ? checkoutUrl : null;
  }, [startCardCheckout, checkoutUrl]);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentId(null);
    setCheckoutUrl(null);
  }, []);

  return {
    loading,
    error,
    paymentId,
    checkoutUrl,
    startMomoCheckout,
    startCardCheckout,
    pollPaymentStatus,
    processMomoPayment,
    processCardPayment,
    getActiveSubscription,
    resetState,
  };
}
