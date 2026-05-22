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
  };
  items?: OrderEmailItem[];
  totals?: {
    subtotal?: number;
    deliveryFee?: number;
    total?: number;
  };
};

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

function buildEmailHtml(payload: OrderEmailRequest) {
  const items = payload.items || [];
  const itemRows = items
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

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
      <h1 style="letter-spacing:0.08em;">ZENVOR order confirmed</h1>
      <p>Thank you for your order. We have received <strong>${escapeHtml(payload.orderNumber)}</strong> and will follow up shortly.</p>
      <h2 style="font-size:16px;margin-top:28px;">Order summary</h2>
      <table style="width:100%;border-collapse:collapse;">${itemRows}</table>
      <table style="width:100%;margin-top:18px;">
        <tr><td>Subtotal</td><td style="text-align:right;">${currency.format(Number(payload.totals?.subtotal || 0))}</td></tr>
        <tr><td>Delivery</td><td style="text-align:right;">${currency.format(Number(payload.totals?.deliveryFee || 0))}</td></tr>
        <tr><td style="padding-top:10px;"><strong>Total</strong></td><td style="text-align:right;padding-top:10px;"><strong>${currency.format(Number(payload.totals?.total || 0))}</strong></td></tr>
      </table>
      <h2 style="font-size:16px;margin-top:28px;">Delivery details</h2>
      <p>
        ${escapeHtml(payload.customer?.firstName)} ${escapeHtml(payload.customer?.lastName)}<br />
        ${escapeHtml(payload.customer?.address)}<br />
        ${escapeHtml(payload.customer?.city)}, ${escapeHtml(payload.customer?.district)}<br />
        ${escapeHtml(payload.customer?.phone)}
      </p>
    </div>
  `;
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
  const to = payload.customer?.email;

  if (!to || !payload.orderNumber) {
    return res.status(400).json({ error: 'Order number and customer email are required.' });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || 'ZENVOR <onboarding@resend.dev>',
      to,
      subject: `ZENVOR order ${payload.orderNumber} confirmed`,
      html: buildEmailHtml(payload),
    }),
  });

  const result = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    return res.status(resendResponse.status).json({
      error: result.message || result.error || 'Resend email delivery failed.',
    });
  }

  return res.status(200).json({ ok: true, id: result.id });
}
