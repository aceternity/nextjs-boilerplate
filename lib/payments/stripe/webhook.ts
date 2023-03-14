import prisma from "@lib/prisma";
import Stripe from "stripe";
import { StripeService } from "./service";

export default class StripeWebhook {
  private static instance: StripeWebhook;
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = StripeService.getInstance(secretKey).getStripe();
  }


  public static getInstance(secretKey: string): StripeWebhook {
    if (!StripeWebhook.instance) {
      StripeWebhook.instance = new StripeWebhook(secretKey);
    }
    return StripeWebhook.instance;
  }

  public constructEvent(
    payload: string,
    sig: string,
    secret: string
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        sig,
        secret
      );
    } catch (err) {
      console.error(`Error constructing Stripe webhook event: ${err}`);
      throw new Error(`Error constructing Stripe webhook event: ${err}`);
    }
  }

  public async handleEvent(event: Stripe.Event): Promise<void> {
    if (event.type === 'product.created') {
      const product = event.data.object as Stripe.Product;
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          productId: product.id,
          active: product.active,
        },
      });
    }

    if (event.type === 'product.updated') {
      const product = event.data.object as Stripe.Product;
      await prisma.product.update({
        where: {
          productId: product.id,
        },
        data: {
          name: product.name,
          description: product.description,
          productId: product.id,
          active: product.active,
          updateAt: new Date(product.updated),
          defaultPrice: {
            connect: {
              priceId: product.default_price?.toString()
            }
          }
        },
      });
    }

    if (event.type === 'product.deleted') {
      const product = event.data.object as Stripe.Product;
      await prisma.product.update({
        where: {
          productId: product.id,
        },
        data: {
          active: false
        }
      })
    }

    if (event.type === 'price.created') {
      const price = event.data.object as Stripe.Price;
      await prisma.productPrice.create({
        data: {
          priceId: price.id as string,
          product: {
            connect: {
              productId: price.product as string
            }
          },
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          description: '',
          active: price.active,
          currency: price.currency,
          type: price.type,
          unitAmount: price.unit_amount || 0,
        }
      })
    }

    if (event.type === 'price.updated') {
      const price = event.data.object as Stripe.Price;
      await prisma.productPrice.update({
        where: {
          priceId: price.id,
        },
        data: {
          id: price.id,
          priceId: price.product as string,
          active: price.active,
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          currency: price.currency,
          type: price.type,
          unitAmount: price.unit_amount || 0,
        }
      })
    }

    if (event.type === 'price.deleted') {
      const price = event.data.object as Stripe.Price;
      await prisma.productPrice.update({
        where: {
          priceId: price.id,
        },
        data: {
          active: false
        }
      })
    }

    return;
  }
}
