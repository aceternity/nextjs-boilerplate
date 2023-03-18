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
      case 'product.deleted': {
        const product = event.data.object as Stripe.Product;
        await prisma.product.delete({
          where: {
            productId: product.id,
          }
        });
        break;
      }
      case 'price.updated': 
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
        await prisma.productPrice.upsert({
          where: {
            priceId: price.id as string,
          },
          create: {
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
          },
          update: {
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
      
      case 'price.deleted':  {
        const price = event.data.object as Stripe.Price;
        await prisma.productPrice.delete({
          where: {
            priceId: price.id,
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

        const { organizationId } = metadata;
        const user = await prisma.user.findUnique({
          where: {
            id: metadata.userId
          },
          select: {
            stripeCustomerId: true,
          }
        });

        if (user) {

          const subscrptionUpsert:Prisma.SubscriptionUpsertArgs = {
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
          };

          if (organizationId) {
            subscrptionUpsert.create.organization = {
              connect: { id: organizationId }
            };

            subscrptionUpsert.update.organization = {
              connect: { id: organizationId }
            }
          }

          await prisma.subscription.upsert(subscrptionUpsert);
          
          if (organizationId) {
            const user = await prisma.organizationMember.findUnique({
              where: {
                userId_organizationId: {
                  userId: metadata.userId,
                  organizationId: organizationId,
                }
              }
            });
           
            try {
              await prisma.organization.update({
                where:  { id: organizationId },
                data: { 
                  status: subscription.status === 'active' ? 'active': 'inactive',
                  users: {
                    connect: { id: metadata.userId }
                  }
                }
              });
              if (!user) {
              await prisma.organizationMember.create({
                  data: {
                    role: 'org_admin',
                    organization: {
                      connect: { id: organizationId }
                    },
                    user: {
                      connect: { id: metadata.userId }
                    }
                  }
                });
              }
            } catch (e) {
              if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                  console.log(
                    'There is a unique constraint violation, a new user cannot be created with this email'
                  )
                }
              }
            }
          }

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
