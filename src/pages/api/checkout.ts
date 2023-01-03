import { NextApiRequest, NextApiResponse } from "next" 
import { stripe } from "../../lib/stripe"

export default async function checkout(req: NextApiRequest, res: NextApiResponse) {
  const priceId = 'price_1Lmd0LJUjiaDWoWzE4VWglxz'

  const baseUrl = process.env.NEXT_URL

  const successUrl = `${baseUrl}/success`
  const cancelUrl = `${baseUrl}/`

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl
  })


  return res.status(201).json({
    checkoutUrl: checkoutSession.url
  })
}