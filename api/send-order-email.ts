type OrderEmailItem = {
  name?: string;
  selectedSize?: string;
  quantity?: number;
  price?: number;
};

type OrderEmailRequest = {
  orderId?: string;
  orderNumber?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    paymentMethod?: string;
  };
  items?: OrderEmailItem[];
  totals?: {
    subtotal?: number;
    deliveryFee?: number;
    total?: number;
  };
  submittedAt?: string;
};

const ADMIN_EMAIL = 'zenvor.lk@gmail.com';
const FROM_EMAIL = 'ZENVOR <orders@zenvor.lk>';

const currency = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
});

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatPaymentMethod(value?: string) {
  if (!value) return 'Not provided';
  if (value === 'cod') return 'Cash on Delivery';
  if (value === 'card') return 'PayHere / OnePay Ready';
  return value;
}

function formatTimestamp(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString();

  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Colombo',
  }).format(date);
}

function buildItemRows(payload: OrderEmailRequest) {
  const items = payload.items || [];
  return items
    .map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            <strong>${escapeHtml(item.name)}</strong><br />
            <span style="color:#666;font-size:12px;">Size: ${escapeHtml(item.selectedSize)} | Qty: ${escapeHtml(item.quantity)}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;">${currency.format(lineTotal)}</td>
        </tr>
      `;
    })
    .join('');
}

function buildCustomerEmailHtml(payload: OrderEmailRequest) {
  const itemRows = buildItemRows(payload);
  return `
    <div style="margin:0;background:#101010;padding:32px 16px;font-family:Arial,sans-serif;color:#f7f2e8;">
      <div style="max-width:680px;margin:0 auto;border:1px solid #c6a15b;background:#171717;">
        <div style="padding:34px 28px;border-bottom:1px solid rgba(198,161,91,0.35);">
          <div style="font-size:11px;letter-spacing:0.42em;color:#c6a15b;font-weight:700;">ZENVOR</div>
          <h1 style="margin:18px 0 10px;font-size:30px;letter-spacing:0.08em;text-transform:uppercase;color:#fff;">Order confirmed</h1>
          <p style="margin:0;color:#d9d1c2;line-height:1.7;">Thank you for your order. Your acquisition has been received and is being prepared with care.</p>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 22px;color:#d9d1c2;">Order number<br /><strong style="font-size:18px;color:#fff;">${escapeHtml(payload.orderNumber)}</strong></p>
          <h2 style="font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#c6a15b;margin:0 0 14px;">Product summary</h2>
          <table style="width:100%;border-collapse:collapse;color:#f7f2e8;">${itemRows}</table>
          <table style="width:100%;margin-top:22px;color:#f7f2e8;">
            <tr><td>Subtotal</td><td style="text-align:right;">${currency.format(Number(payload.totals?.subtotal || 0))}</td></tr>
            <tr><td>Delivery</td><td style="text-align:right;">${currency.format(Number(payload.totals?.deliveryFee || 0))}</td></tr>
            <tr><td style="padding-top:12px;"><strong>Total</strong></td><td style="text-align:right;padding-top:12px;"><strong>${currency.format(Number(payload.totals?.total || 0))}</strong></td></tr>
          </table>
          <p style="margin:28px 0 0;color:#d9d1c2;line-height:1.7;">Estimated delivery: your order will be processed within 24 hours, and our team will contact you with the next delivery update.</p>
        </div>
      </div>
    </div>
  `;
}

function buildAdminEmailHtml(payload: OrderEmailRequest) {
  const itemRows = buildItemRows(payload);
  const customerName = `${payload.customer?.firstName || ''} ${payload.customer?.lastName || ''}`.trim();

  return `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#171717;">
      <h1>New ZENVOR order</h1>
      <p><strong>Timestamp:</strong> ${escapeHtml(formatTimestamp(payload.submittedAt))}</p>
      <p><strong>Order number:</strong> ${escapeHtml(payload.orderNumber)}</p>
      <h2 style="font-size:16px;margin-top:28px;">Customer</h2>
      <p>
        <strong>Name:</strong> ${escapeHtml(customerName)}<br />
        <strong>Phone:</strong> ${escapeHtml(payload.customer?.phone)}<br />
        <strong>Email:</strong> ${escapeHtml(payload.customer?.email)}<br />
        <strong>Payment method:</strong> ${escapeHtml(formatPaymentMethod(payload.customer?.paymentMethod))}
      </p>
      <h2 style="font-size:16px;margin-top:28px;">Delivery address</h2>
      <p>
        ${escapeHtml(payload.customer?.address)}<br />
        ${escapeHtml(payload.customer?.city)}, ${escapeHtml(payload.customer?.district)}
      </p>
      <h2 style="font-size:16px;margin-top:28px;">Ordered products</h2>
      <table style="width:100%;border-collapse:collapse;">${itemRows}</table>
      <table style="width:100%;margin-top:18px;">
        <tr><td>Subtotal</td><td style="text-align:right;">${currency.format(Number(payload.totals?.subtotal || 0))}</td></tr>
        <tr><td>Delivery</td><td style="text-align:right;">${currency.format(Number(payload.totals?.deliveryFee || 0))}</td></tr>
        <tr><td style="padding-top:10px;"><strong>Total amount</strong></td><td style="text-align:right;padding-top:10px;"><strong>${currency.format(Number(payload.totals?.total || 0))}</strong></td></tr>
      </table>
    </div>
  `;
}

async function sendResendEmail(apiKey: string, message: { to: string; subject: string; html: string }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      ...message,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || `Resend email delivery failed with status ${response.status}.`);
  }

  return result;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured.' });
  }

  const payload: OrderEmailRequest = req.body || {};
  const customerEmail = payload.customer?.email;

  if (!customerEmail || !payload.orderNumber) {
    return res.status(400).json({ error: 'Order number and customer email are required.' });
  }

  try {
    const [customerResult, adminResult] = await Promise.all([
      sendResendEmail(apiKey, {
        to: customerEmail,
        subject: `ZENVOR order ${payload.orderNumber} confirmed`,
        html: buildCustomerEmailHtml(payload),
      }),
      sendResendEmail(apiKey, {
        to: ADMIN_EMAIL,
        subject: `New ZENVOR order ${payload.orderNumber}`,
        html: buildAdminEmailHtml(payload),
      }),
    ]);

    return res.status(200).json({
      ok: true,
      customerEmailId: customerResult.id,
      adminEmailId: adminResult.id,
    });
  } catch (error) {
    console.error('Order email delivery failed:', error);
    return res.status(502).json({
      error: error instanceof Error ? error.message : 'Order email delivery failed.',
    });
  }
}
