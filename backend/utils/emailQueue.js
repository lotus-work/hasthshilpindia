const queue = [];
const sendEmail = require('../controller/emailCtrl');

function addEmailJob(job) {
  queue.push(job);
}

async function processQueue() {
  if (queue.length === 0) return;

  const job = queue.shift();
  await sendOrderStatusEmail(job);
}

async function sendOrderStatusEmail({ email, name, orderId, status }) {
  let statusMessage = '';
  let statusText = '';

  switch (status) {
    case 'Failed':
      statusMessage = `
        <p style="color: red;">
          We sincerely apologize for the inconvenience. Unfortunately, your order could not be processed successfully.
          If a payment was already made, a refund will be initiated to your account shortly. Our support team may also reach out to you for further assistance.
        </p>
      `;
      statusText = `We sincerely apologize for the inconvenience. Unfortunately, your order could not be processed successfully. If a payment was already made, a refund will be initiated to your account shortly. Our support team may also reach out to you for further assistance.`;
      break;

    case 'Shipped':
      statusMessage = `
        <p style="color: red;">
          Good news! Your order has been shipped. It will take approximately 5–10 business days to arrive at your provided address.
          We’ll keep you updated throughout the delivery process. Thank you for your patience and support.
        </p>
      `;
      statusText = `Good news! Your order has been shipped. It will take approximately 5–10 business days to arrive. We'll keep you updated throughout.`;
      break;

    case 'Out_For_Delivery':
      statusMessage = `
        <p style="color: red;">
          Your order is currently out for delivery and will be reaching you very soon.
          Please ensure someone is available at your delivery address to receive it. Thank you for choosing Hasthshilp!
        </p>
      `;
      statusText = `Your order is currently out for delivery and will reach you soon. Please ensure someone is available to receive it.`;
      break;

    case 'Delivered':
      statusMessage = `
        <p style="color: red;">
          We’re pleased to inform you that your order has been successfully delivered.
          We hope you enjoy your purchase! If you have any feedback, we’d love to hear from you.
        </p>
      `;
      statusText = `Your order has been successfully delivered. We hope you enjoy your purchase!`;
      break;

    case 'Refund_Initiated':
      statusMessage = `
        <p style="color: red;">
          A refund has been initiated for your order. The amount will be credited to your bank account within 1–3 business days.
          We truly appreciate your patience and understanding.
        </p>
      `;
      statusText = `A refund has been initiated for your order. It will be credited to your account within 1–3 business days.`;
      break;

    case 'Refunded':
      statusMessage = `
        <p style="color: red;">
          We’re happy to inform you that your refund has been successfully processed and credited to your bank account.
          Thank you for your continued trust in Hasthshilp.
        </p>
      `;
      statusText = `Your refund has been successfully processed and credited to your bank account.`;
      break;

    default:
      statusMessage = '';
      statusText = '';
      break;
  }

  const data = {
    to: email,
    subject: `Order ${orderId} - ${status.replaceAll('_', ' ')}`,
    text: `
Dear ${name},

Thank you for shopping with Hasthshilp.

Your order ${orderId} is currently marked as ${status.replaceAll('_', ' ')}.

${statusText}

Track your order here: http://localhost:4200/myorders

You can also visit Your Account → My Orders on our platform.

Please note: This is an automated message. Do not reply to this email.

Contact Us:
Hasthshilp
Plot no 11, Lane no. 2, Doon Hills Colony, Ring Road, Ladpur,
Dehradun, Uttarakhand, India (248001)
Email: support@hasthshilp.com
Phone: +91 9027700914
    `,
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for shopping with <strong>Hasthshilp</strong>.</p>
      <p>Your order <strong>${orderId}</strong> is currently marked as <strong>${status.replaceAll('_', ' ')}</strong>.</p>
      ${statusMessage}
      <p>To track your order status, click <a href="http://localhost:4200/myorders">here</a>.</p>
      <p>You can also check your orders any time by visiting <strong>Your Account → My Orders</strong> on our platform.</p>
      <p><em>Please note: This is an automated message. Kindly do not reply to this email.</em></p>

      <hr style="margin-top: 30px 0;" />

      <p><strong>Contact Us</strong></p>
      <p>If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:</p>
      <p>
        Hasthshilp<br />
        Plot No 11, Lane No 2, Doon Hills Colony, Ring Road, Ladpur,<br />
        Dehradun, Uttarakhand, India (248001)<br />
           <strong>Website:</strong> <a href="https://hasthshilp.com/">hasthshilp.com</a><br />
        <strong>Email:</strong> <a href="mailto:support@hasthshilp.com">support@hasthshilp.com</a><br />
        <strong>Phone:</strong> <a href="tel:+919027700914">+91 9027700914</a>
      </p>
    `,
  };

  try {
    await sendEmail(data);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}


// process every 5 seconds
setInterval(processQueue, 5000);

module.exports = { addEmailJob };
