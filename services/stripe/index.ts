/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export const createStripeSession = async ({
  email,
  coupon,
}: {
  email: string;
  coupon?: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/stripe/create-stripe-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, coupon }), // coupon optional
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log("Stripe Session Error:", error);
    return { success: false, message: error.message };
  }
};

export const saveSubscription = async ({ sessionId }: { sessionId: string }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/stripe/save-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      }
    );

    const result = await res.json();
    console.log('session_infosave', result);
    return result;
    
  } catch (error: any) {
    console.log("Save Subscription Error:", error);
    return { success: false, message: error.message };
  }
};
