import Stripe from 'stripe';
import { getDb } from '../../server/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, amount, description, customerEmail } = req.body;

    if (!orderId || !amount || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'Yellow City Order',
              description: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL}/orders/${orderId}?payment=success`,
      cancel_url: `${process.env.VITE_APP_URL}/orders/${orderId}?payment=cancelled`,
      customer_email: customerEmail,
      metadata: {
        orderId,
      },
    });

    // Store payment session in database
    const db = await getDb();
    if (db) {
      await db.query(
        'INSERT INTO payments (order_id, stripe_session_id, amount, status) VALUES (?, ?, ?, ?)',
        [orderId, session.id, amount, 'pending']
      );
    }

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
