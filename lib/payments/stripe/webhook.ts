import prisma from "@lib/prisma";
import Stripe from "stripe";
import { StripeService } from "./service";

export default class StripeWebhook {
  private static instance: StripeWebhook;
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = StripeService.getInstance(secretKey);
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
    
    switch (event.type) {
      case 'product.created': {
        const product = event.data.object as Stripe.Product;
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            productId: product.id,
            active: product.active,
            defaultPrice: undefined,
            uniqueIdentifier: product.metadata.uniqueIdentifier || '',
          },
        });
      }
      case 'product.updated': {
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
            uniqueIdentifier: product.metadata.uniqueIdentifier || '',
            defaultPrice: {
              connect: {
                priceId: product.default_price?.toString()
              }
            }
          },
        });
        break;
      }
      case 'product.deleted': {
        const product = event.data.object as Stripe.Product;
        await prisma.product.update({
          where: {
            productId: product.id,
          },
          data: {
            active: false
          }
        });
        break;
      }
      case 'price.created': {
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
        break;
      }
      case 'price.updated': {
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
        });
        break;
      }
      case 'price.deleted':  {
        const price = event.data.object as Stripe.Price;
        await prisma.productPrice.update({
          where: {
            priceId: price.id,
          },
          data: {
            active: false
          }
        });
        break;
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const product = subscription.items.data[0];
        const productPriceId = product.price.id;
        const { product: productId } = product.price;
        const customerId = subscription.customer.toString();
        const { metadata } = subscription;

        await prisma.subscription.create({
          data: {
            paymentCustomerId: customerId,
            subscriptionId: subscription.id,
            user: { connect: { id: metadata.userId } },
            product: { connect: { productId: productId as string } },
            price: { connect: { priceId: productPriceId } },
            status: subscription.status,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
          },
        });
  
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
  
        await prisma.subscription.update({
          where: { subscriptionId: subscription.id },
          data: { status: 'canceled', endDate: new Date() },
        });
  
        break;
      }
      case 'customer.subscription.paused': {
        const subscription = event.data.object as Stripe.Subscription;
  
        await prisma.subscription.update({
          where: { subscriptionId: subscription.id },
          data: { status: 'paused' },
        });
  
        break;
      }
      case 'customer.subscription.pending_update_applied': {
        const subscription = event.data.object as Stripe.Subscription;
  
        await prisma.subscription.update({
          where: { subscriptionId: subscription.id },
          data: { status: subscription.status },
        });
  
        break;
      }
      case 'customer.subscription.pending_update_expired': {
        const subscription = event.data.object as Stripe.Subscription;
  
        await prisma.subscription.update({
          where: { subscriptionId: subscription.id },
          data: { status: subscription.status },
        });
  
        break;
      }
      case 'customer.subscription.resumed': {
        const subscription = event.data.object as Stripe.Subscription;
  
        await prisma.subscription.update({
          where: { subscriptionId: subscription.id },
          data: { status: 'active' },
        });
  
        break;
      }
      case 'customer.subscription.trial_will_end': {
        // Handle trial will end event here
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
  
        await prisma.subscription.update({
          where: { subscriptionId: subscription.id },
          data: { status: subscription.status },
        });
  
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
