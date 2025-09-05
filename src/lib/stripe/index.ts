import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_dummy_key_for_build', {
  apiVersion: '2023-10-16',
  appInfo: {
    name: 'Plura App',
    version: '0.1.0',
  },
})


