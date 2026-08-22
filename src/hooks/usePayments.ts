"use client";

import { useState, useCallback } from "react";
import {
  getPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  processCardPayment,
  processMOMOPayment,
  getPaymentHistory,
  getSubscription,
  changePlan,
  cancelSubscription,
  type CardPaymentMethodResponse,
  type MOMOPaymentMethodResponse,
  type PaymentMethodType,
  type PaymentProvider,
  type SubscriptionResponse,
} from "@/utils/api";

export function usePayments() {
  const [paymentMethods, setPaymentMethods] = useState<
    (CardPaymentMethodResponse | MOMOPaymentMethodResponse)[]
  >([]);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment methods
  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPaymentMethods();
      setPaymentMethods(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch payment methods";
      setError(message);
      console.error("Payment methods fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch subscription
  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getSubscription();
      setSubscription(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch subscription";
      setError(message);
      console.error("Subscription fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPaymentHistory();
      setPaymentHistory(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch payment history";
      setError(message);
      console.error("Payment history fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add payment method
  const addMethod = useCallback(
    async (data: {
      type: PaymentMethodType;
      provider: PaymentProvider;
      token?: string;
      phoneNumber?: string;
      network?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const { data: newMethod } = await addPaymentMethod(data);
        setPaymentMethods((prev) => [...prev, newMethod as any]);
        return newMethod;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add payment method";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Set default payment method
  const setDefault = useCallback(async (methodId: string) => {
    setLoading(true);
    setError(null);
    try {
      await setDefaultPaymentMethod(methodId);
      setPaymentMethods((prev) =>
        prev.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        }))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set default payment method";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete payment method
  const deleteMethod = useCallback(async (methodId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePaymentMethod(methodId);
      setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete payment method";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Process card payment
  const payWithCard = useCallback(
    async (data: {
      paymentMethodId: string;
      amount: number;
      currency?: string;
      planId?: string;
      billingCycle?: string;
      description?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const { data: paymentIntent } = await processCardPayment(data);
        return paymentIntent;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Process MOMO payment
  const payWithMOMO = useCallback(
    async (data: {
      phoneNumber: string;
      amount: number;
      currency?: string;
      network: "mtn" | "airtel";
      planId?: string;
      billingCycle?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const { data: paymentResult } = await processMOMOPayment(data);
        return paymentResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : "MOMO payment failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Change subscription plan
  const changePlanHandler = useCallback(
    async (data: {
      planId: string;
      billingCycle: string;
      paymentMethodId: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const { data: updatedSubscription } = await changePlan(data);
        setSubscription(updatedSubscription);
        return updatedSubscription;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to change plan";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cancel subscription
  const cancelSub = useCallback(async (cancelAtPeriodEnd?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { data: updatedSubscription } = await cancelSubscription(cancelAtPeriodEnd);
      setSubscription(updatedSubscription);
      return updatedSubscription;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to cancel subscription";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    paymentMethods,
    subscription,
    paymentHistory,
    loading,
    error,
    fetchPaymentMethods,
    fetchSubscription,
    fetchPaymentHistory,
    addMethod,
    setDefault,
    deleteMethod,
    payWithCard,
    payWithMOMO,
    changePlan: changePlanHandler,
    cancelSubscription: cancelSub,
  };
}
