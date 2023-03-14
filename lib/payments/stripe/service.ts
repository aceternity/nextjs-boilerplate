import Stripe from 'stripe';

export class StripeService {
  private static instance: StripeService;
  private stripe: Stripe;

  private constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2022-11-15"
    });
  }

  public static getInstance(secretKey: string): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService(secretKey);
    }
    return StripeService.instance;
  }

  public getStripe(): Stripe {
    return this.stripe;
  }
}
