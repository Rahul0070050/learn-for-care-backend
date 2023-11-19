import Stripe from "stripe";
import { config } from "dotenv";

config();

export const stripeObj = new Stripe(process.env.STRIP_PRIVAT_KEY);

export async function getStripeUrl(items = [], user) {
  console.log(items);
  let session = await stripeObj.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: items.map((item) => {
      return {
        price_data: {
          currency: "GBP",
          product_data: {
            name: item.name,
          },
          unit_amount: (item.amount / item.product_count) * 100,
        },
        quantity: item.product_count,
      };
    }),
    success_url: "https://test.learnforcare.co.uk/success",
    cancel_url: "https://test.learnforcare.co.uk/failed",
    metadata: {
      user_type: `${user?.type_of_account}`,
    },
  });

  return session;
}
