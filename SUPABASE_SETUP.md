# Supabase Setup for Zenvor

## Environment Variables

Set these locally in `.env` and in Netlify:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Never expose a Supabase service role key in this Vite client.

## Database

Run the full schema in [`supabase-schema.sql`](./supabase-schema.sql) from the Supabase SQL Editor. It creates:

- `profiles`
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `inquiries`
- `inventory_logs`

It also enables RLS on every public ecommerce table, creates admin-only product/order management policies, allows public reads only for active products and active product images, adds customer-owned cart/order access, inquiry intake, indexes, timestamps, stock reservation triggers, inventory logging, and seed Zenvor products.

## Admin Access

1. Sign up through `/signup` or create a user in Supabase Auth.
2. Promote the user in SQL:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

3. Log in at `/login`.
4. Open `/admin` for product CMS and `/admin/orders` for order management.

## Payments and Email

Checkout saves authenticated customer orders to Supabase and keeps payment fields gateway-ready. PayHere/OnePay and email confirmation are intentionally modular placeholders:

- Payment integration lives at the checkout payment-method boundary.
- Email hook placeholder lives in `src/lib/orders.ts`.
- Prefer connecting Netlify Functions + Resend for production email so private API keys stay server-side.
- Keep payment secret keys and Supabase service role keys in server-only functions, never in `VITE_*` variables.
