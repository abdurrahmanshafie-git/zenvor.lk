import { CartItem, OrderStatus, OrderTotals } from '../types';
import { getSupabase } from './supabase';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: string;
}

export async function createOrder(customer: CheckoutCustomer, items: CartItem[], totals: OrderTotals) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  if (items.length === 0) throw new Error('Your cart is empty.');

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('Please sign in before checkout.');
  const orderNumber = `ZNV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  const { data: order, error } = await (supabase as any)
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userData.user.id,
      customer_email: customer.email,
      customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
      customer_phone: customer.phone,
      shipping_address: {
        address: customer.address,
        city: customer.city,
        district: customer.district,
      },
      subtotal: totals.subtotal,
      delivery_fee: totals.deliveryFee,
      total: totals.total,
      status: 'pending' satisfies OrderStatus,
      payment_method: customer.paymentMethod,
      payment_status: 'pending',
      payment_provider: customer.paymentMethod === 'card' ? 'gateway_pending' : null,
    })
    .select('id, order_number')
    .single();

  if (error) throw error;
  if (!order) throw new Error('Order could not be created.');

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    product_slug: item.slug,
    selected_size: item.selectedSize,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
    image_url: item.image,
  }));

  const { error: itemError } = await (supabase as any).from('order_items').insert(orderItems);
  if (itemError) {
    await (supabase as any).from('orders').delete().eq('id', order.id);
    throw itemError;
  }

  return order;
}

export interface CreatedOrderEmailPayload {
  id?: string;
  order_number?: string;
}

export async function sendOrderEmailNotification(
  order: CreatedOrderEmailPayload,
  customer: CheckoutCustomer,
  items: CartItem[],
  totals: OrderTotals
) {
  const response = await fetch('/api/send-order-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId: order.id,
      orderNumber: order.order_number,
      customer,
      items: items.map((item) => ({
        name: item.name,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.price,
      })),
      totals,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Order email notification failed.');
  }

  return result;
}

export async function getCustomerOrders() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await (supabase as any)
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function sendOrderConfirmationPlaceholder(orderNumber: string, email: string) {
  console.info(`Order confirmation ready for ${orderNumber} -> ${email}`);
}
