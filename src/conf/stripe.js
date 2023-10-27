import Stripe from 'stripe'
import {config} from 'dotenv'

config()

let stripeObj = new Stripe(process.env.STRIP_PRIVAT_KEY)

export async function getStripeUrl(items=[]) {
    let session = await stripeObj.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: items.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.amount * 100
                },
                quantity: item.product_count,
            }
        }),
        success_url: "http://localhost:3000/",
        cancel_url: "http://localhost:3000/"
    })

    return session
}