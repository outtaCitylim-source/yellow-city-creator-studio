import Stripe from 'stripe';
import { getDb } from '../../server/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        // Update payment status
        await db.query(
          'UPDATE payments SET status = ?, paid_at = NOW() WHERE stripe_session_id = ?',
          ['completed', session.id]
        );

        // Update order status to "In Production"
        await db.query(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['In Production', orderId]
        );

        console.log(`Payment completed for order ${orderId}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        await db.query(
          'UPDATE payments SET status = ? WHERE stripe_session_id = ?',
          ['expired', session.id]
        );
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        await db.query(
          'UPDATE payments SET status = ? WHERE stripe_charge_id = ?',
          ['refunded', charge.id]
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
}
