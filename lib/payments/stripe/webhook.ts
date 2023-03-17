import { Prisma, PrismaClient } from "@prisma/client";
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

  public async handleEvent(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">, event: Stripe.Event): Promise<void> {
    
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
        const defaultPriceId = product.default_price?.toString();
        const defaultPriceExists = await prisma.productPrice.findUnique({
          where: { priceId: defaultPriceId },
        });
      
        const data = {
          name: product.name,
          description: product.description,
          productId: product.id,
          active: product.active,
          updatedAt: new Date(product.updated),
          uniqueIdentifier: product.metadata.uniqueIdentifier || '',
          defaultPrice: defaultPriceExists
            ? {
                connect: { priceId: defaultPriceId },
              }
            : undefined,
        };
      
        await prisma.product.update({
          where: { productId: product.id },
          data,
        });
        break;
      }
      case 'product.deleted': {
        const product = event.data.object as Stripe.Product;
        await prisma.product.delete({
          where: {
            productId: product.id,
          }
        });
        break;
      }
      case 'price.created': {
        const price = event.data.object as Stripe.Price;
        const productExists = await prisma.product.findUnique({
          where: { productId: price.product as string },
        });
      
        if (!productExists) {
          // fetch the product from Stripe
          const stripeProduct = await this.stripe.products.retrieve(price.product as string);
          // create the product in the database
          await prisma.product.create({
            data: {
              name: stripeProduct.name,
              description: stripeProduct.description,
              productId: stripeProduct.id,
              active: stripeProduct.active,
              defaultPrice: undefined,
              uniqueIdentifier: stripeProduct.metadata.uniqueIdentifier || '',
            },
          });
          // handle the error appropriately, e.g. log it or throw an error
          console.error(`Product not found for price ${price.id}`);
        }
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
        const productExists = await prisma.product.findUnique({
          where: { productId: price.product as string },
        });
      
        if (!productExists) {
          // fetch the product from Stripe
          const stripeProduct = await this.stripe.products.retrieve(price.product as string);
          // create the product in the database
          await prisma.product.create({
            data: {
              name: stripeProduct.name,
              description: stripeProduct.description,
              productId: stripeProduct.id,
              active: stripeProduct.active,
              defaultPrice: undefined,
              uniqueIdentifier: stripeProduct.metadata.uniqueIdentifier || '',
            },
          });
          // handle the error appropriately, e.g. log it or throw an error
          console.error(`Product not found for price ${price.id}`);
        }
      
        const data = {
          priceId: price.id as string,
          product: {
            connect: { productId: price.product as string },
          },
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          description: '',
          active: price.active,
          currency: price.currency,
          type: price.type,
          unitAmount: price.unit_amount || 0,
        };
      
        await prisma.productPrice.create({
          data,
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
      case 'customer.subscription.created':
      case 'customer.subscription.pending_update_applied': 
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed':
      case 'customer.subscription.updated': 
      case 'customer.subscription.pending_update_expired': 
      case 'customer.subscription.created': {
        const subscriptionEvent = event.data.object as Stripe.Subscription;
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionEvent.id as string);
        const product = subscription.items.data[0];
        const productPriceId = product.price.id;
        const { product: productId } = product.price;
        const customerId = subscription.customer.toString();
        const { metadata } = subscription;

        const user = await prisma.user.findUnique({
          where: {
            id: metadata.userId
          },
          select: {
            stripeCustomerId: true,
          }
        });

        if (user) {
          await prisma.subscription.upsert({
            where: {
              subscriptionId: subscription.id,
            },
            create: {
              paymentCustomerId: customerId,
              subscriptionId: subscription.id,
              user: { connect: { id: metadata.userId } },
              product: { connect: { productId: productId as string } },
              price: { connect: { priceId: productPriceId } },
              status: subscription.status,
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
            },
            update: {
              product: { connect: { productId: productId as string } },
              price: { connect: { priceId: productPriceId } },
              status: subscription.status,
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
            }
          });

          if (!user.stripeCustomerId) {
            await prisma.user.update({ 
              where: {
                id: metadata.userId
              },
              data: {
                stripeCustomerId: customerId
              }
            })
          }
        }
  
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
