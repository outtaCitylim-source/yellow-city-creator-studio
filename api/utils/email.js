import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(customerEmail, order) {
  try {
    const result = await resend.emails.send({
      from: 'orders@yellowcity.local',
      to: customerEmail,
      subject: `Order Confirmation #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">Order Confirmation</h2>
          <p>Thank you for your order!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Items</h3>
            ${order.items.map(item => `
              <p>
                <strong>${item.garment}</strong> - ${item.decoration_method}<br>
                Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}
              </p>
            `).join('')}
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            You can track your order status at: <a href="${process.env.VITE_APP_URL}/orders/${order.id}">View Order</a>
          </p>

          <p style="color: #d4af37; font-weight: bold;">
            Yellow City Creator Studio<br>
            Amarillo, TX
          </p>
        </div>
      `,
    });

    console.log('Order confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendStatusUpdate(customerEmail, order, oldStatus) {
  try {
    const statusMessages = {
      'Proof Sent': 'Your artwork proof is ready for review',
      'In Production': 'Your order is now in production',
      'Quality Check': 'Your order is undergoing quality checks',
      'Ready': 'Your order is ready for pickup!',
      'Picked Up': 'Thank you for your business!',
    };

    const message = statusMessages[order.status] || `Your order status has been updated to ${order.status}`;

    const result = await resend.emails.send({
      from: 'orders@yellowcity.local',
      to: customerEmail,
      subject: `Order #${order.id} - ${order.status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">Order Status Update</h2>
          <p>${message}</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>New Status:</strong> ${order.status}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <p style="margin-top: 30px;">
            <a href="${process.env.VITE_APP_URL}/orders/${order.id}" style="background: #d4af37; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Order Details
            </a>
          </p>

          <p style="color: #d4af37; font-weight: bold; margin-top: 30px;">
            Yellow City Creator Studio<br>
            Amarillo, TX
          </p>
        </div>
      `,
    });

    console.log('Status update email sent:', result);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendPaymentReceipt(customerEmail, payment) {
  try {
    const result = await resend.emails.send({
      from: 'payments@yellowcity.local',
      to: customerEmail,
      subject: `Payment Receipt - Order #${payment.order_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">Payment Receipt</h2>
          <p>Thank you for your payment!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${payment.order_id}</p>
            <p><strong>Amount:</strong> $${payment.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> ${new Date(payment.paid_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Paid</span></p>
          </div>

          <p style="color: #d4af37; font-weight: bold; margin-top: 30px;">
            Yellow City Creator Studio<br>
            Amarillo, TX
          </p>
        </div>
      `,
    });

    console.log('Payment receipt email sent:', result);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
