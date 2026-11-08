"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
  discountPrice: string | number | null;
  stock: number;
  images: { id: string; url: string; altText: string | null }[];
}

interface CartProduct {
  product: Product;
  quantity: number;
}

interface ProductApiResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface CreatedOrder {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number | string;
}

interface OrderApiResponse {
  success: boolean;
  message: string;
  data: CreatedOrder;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const DELIVERY_CHARGE = 110;
const formatPrice = (price: number) => `৳${price.toLocaleString("en-BD")}`;

export default function CartPage() {
  const { cart, updateItem, removeItem, clearItems } = useCart();

  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<CreatedOrder | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCartProducts() {
      if (cart.length === 0) {
        setProducts([]);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const results = await Promise.all(
          cart.map(async (item) => {
            const response = await fetch(`${API_URL}/api/products/${item.productId}`);
            const result: ProductApiResponse = await response.json();

            if (!response.ok || !result.success) {
              throw new Error(result.message || "Failed to load a cart product");
            }

            return { product: result.data, quantity: item.quantity };
          })
        );

        if (!cancelled) setProducts(results);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load cart products.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCartProducts();
    return () => {
      cancelled = true;
    };
  }, [cart]);

  const subtotal = products.reduce((total, item) => {
    const price = Number(item.product.discountPrice ?? item.product.price);
    return total + price * item.quantity;
  }, 0);

  const total = subtotal + DELIVERY_CHARGE;
  const unavailableItem = products.find(({ product, quantity }) => product.stock < quantity);

  function openOrderModal() {
    if (unavailableItem) {
      setError(`Only ${unavailableItem.product.stock} item(s) of ${unavailableItem.product.name} are available.`);
      return;
    }

    setOrderError("");
    setOrderSuccess(null);
    setShowOrderModal(true);
  }

  function closeOrderModal() {
    if (!orderSubmitting) setShowOrderModal(false);
  }

  async function handleSubmitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderError("");

    if (customerName.trim().length < 2) {
      setOrderError("Customer name must be at least 2 characters.");
      return;
    }

    if (customerPhone.trim().length < 11) {
      setOrderError("Enter a valid phone number.");
      return;
    }

    if (shippingAddress.trim().length < 5) {
      setOrderError("Please enter your full shipping address.");
      return;
    }

    if (city.trim().length < 2) {
      setOrderError("Please enter your city.");
      return;
    }

    if (unavailableItem) {
      setOrderError(`Sorry, ${unavailableItem.product.name} is no longer available in that quantity.`);
      return;
    }

    try {
      setOrderSubmitting(true);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          shippingAddress: shippingAddress.trim(),
          city: city.trim(),
          area: area.trim() || undefined,
          paymentMethod: "COD",
          items: products.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });

      const result: OrderApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to place order.");
      }

      clearItems();
      setOrderSuccess(result.data);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setOrderSubmitting(false);
    }
  }

  if (loading) {
    return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-16 lg:px-8"><h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1><div className="mt-8 animate-pulse space-y-4"><div className="h-28 rounded-2xl bg-gray-100" /><div className="h-28 rounded-2xl bg-gray-100" /></div></main>;
  }

  if (error && products.length === 0) {
    return <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center"><h1 className="text-2xl font-semibold text-gray-900">Could not load your cart</h1><p className="mt-2 text-sm text-gray-500">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-[#7f1d2d] px-6 py-3 text-sm font-semibold text-white">Try Again</button></main>;
  }

  if (cart.length === 0 || products.length === 0) {
    return <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-[#7f1d2d]"><ShoppingBag size={34} strokeWidth={1.4} /></div><h1 className="mt-6 text-3xl font-semibold text-gray-900">Your Cart Is Empty</h1><p className="mt-3 max-w-md text-sm leading-6 text-gray-500">Looks like you haven’t added anything to your cart yet.</p><Link href="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7f1d2d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#681725]"><ArrowLeft size={17} />Continue Shopping</Link></main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7f1d2d]">ROYS Shopping</p><h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">Your Cart</h1><p className="mt-2 text-sm text-gray-500">{cart.reduce((count, item) => count + item.quantity, 0)} item(s) in your cart</p></div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-[#7f1d2d]"><ArrowLeft size={16} />Continue Shopping</Link>
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {products.map(({ product, quantity }) => {
              const price = Number(product.discountPrice ?? product.price);
              const image = product.images?.[0];
              return <article key={product.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:p-5"><Link href={`/products/${product.id}`} className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-28 sm:w-28">{image ? <Image src={image.url} alt={image.altText || product.name} fill unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center text-gray-300"><ShoppingBag size={30} /></div>}</Link><div className="min-w-0 flex-1"><Link href={`/products/${product.id}`} className="font-semibold text-gray-900 transition hover:text-[#7f1d2d]">{product.name}</Link><p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p><p className="mt-3 text-base font-semibold text-[#7f1d2d]">{formatPrice(price)}</p>{product.stock < quantity && <p className="mt-2 text-xs font-medium text-red-600">Only {product.stock} item(s) currently available.</p>}</div><div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><div className="flex h-10 items-center rounded-full border border-gray-200"><button type="button" aria-label={`Decrease quantity of ${product.name}`} onClick={() => updateItem(product.id, quantity - 1)} className="flex h-10 w-10 items-center justify-center text-gray-600 hover:text-[#7f1d2d]"><Minus size={15} /></button><span className="w-8 text-center text-sm font-semibold text-gray-900">{quantity}</span><button type="button" aria-label={`Increase quantity of ${product.name}`} disabled={quantity >= product.stock} onClick={() => updateItem(product.id, quantity + 1)} className="flex h-10 w-10 items-center justify-center text-gray-600 hover:text-[#7f1d2d] disabled:cursor-not-allowed disabled:opacity-30"><Plus size={15} /></button></div><button type="button" onClick={() => removeItem(product.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition hover:text-red-600"><Trash2 size={15} />Remove</button></div></article>;
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-100 p-5 sm:p-6"><h2 className="text-lg font-semibold text-gray-900">Order Summary</h2><div className="mt-6 flex items-center justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span></div><div className="mt-4 flex items-center justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="text-gray-500">{formatPrice(DELIVERY_CHARGE)}</span></div><div className="my-5 h-px bg-gray-100" /><div className="flex items-center justify-between"><span className="font-semibold text-gray-900">Total</span><span className="text-xl font-semibold text-[#7f1d2d]">{formatPrice(total)}</span></div><button type="button" onClick={openOrderModal} disabled={Boolean(unavailableItem)} className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#7f1d2d] px-5 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:cursor-not-allowed disabled:bg-gray-300"><ShoppingBag size={17} className="mr-2" />Order Now</button><p className="mt-4 text-center text-xs leading-5 text-gray-400">Cash on delivery. Enter your delivery information in the next step.</p></aside>
        </div>
      </section>

      {showOrderModal && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="cart-order-title"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7"><div><h2 id="cart-order-title" className="text-xl font-semibold text-gray-900">Complete Your Order</h2><p className="mt-1 text-sm text-gray-500">Cash on delivery · {formatPrice(total)}</p></div><button type="button" onClick={closeOrderModal} disabled={orderSubmitting} aria-label="Close order form" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-40"><X size={20} /></button></div>{orderSuccess ? <div className="px-6 py-12 text-center sm:px-10"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50"><CheckCircle2 size={44} className="text-green-600" /></div><h3 className="mt-6 text-2xl font-bold text-gray-900">Order Placed Successfully!</h3><p className="mt-2 text-sm text-gray-500">Thank you for shopping with ROYS.</p><div className="mx-auto mt-7 max-w-md rounded-2xl bg-gray-50 p-6 text-left text-sm"><div className="flex justify-between gap-4"><span className="text-gray-500">Order number</span><span className="font-bold text-[#7f1d2d]">{orderSuccess.orderNumber}</span></div><div className="mt-4 flex justify-between gap-4"><span className="text-gray-500">Total</span><span className="font-semibold text-gray-900">{formatPrice(Number(orderSuccess.totalAmount))}</span></div></div><p className="mx-auto mt-6 max-w-md text-sm leading-6 text-gray-500">Save your order number. You can later track it with this number and <span className="font-medium text-gray-700">{orderSuccess.customerPhone}</span>.</p><button type="button" onClick={closeOrderModal} className="mt-8 h-12 rounded-full bg-[#7f1d2d] px-7 text-sm font-semibold text-white transition hover:bg-[#681725]">Done</button></div> : <form onSubmit={handleSubmitOrder} className="space-y-5 px-5 py-6 sm:px-7"><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="customerName" className="mb-2 block text-sm font-medium text-gray-800">Full Name</label><input id="customerName" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]" /></div><div><label htmlFor="customerPhone" className="mb-2 block text-sm font-medium text-gray-800">Phone Number</label><input id="customerPhone" type="tel" inputMode="numeric" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="01XXXXXXXXX" required className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]" /></div><div><label htmlFor="customerEmail" className="mb-2 block text-sm font-medium text-gray-800">Email <span className="font-normal text-gray-400">(optional)</span></label><input id="customerEmail" type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]" /></div><div><label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-800">City</label><input id="city" value={city} onChange={(event) => setCity(event.target.value)} required className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]" /></div><div><label htmlFor="area" className="mb-2 block text-sm font-medium text-gray-800">Area <span className="font-normal text-gray-400">(optional)</span></label><input id="area" value={area} onChange={(event) => setArea(event.target.value)} className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]" /></div></div><div><label htmlFor="shippingAddress" className="mb-2 block text-sm font-medium text-gray-800">Shipping Address</label><textarea id="shippingAddress" value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} required rows={4} placeholder="House/Road/Block and delivery details" className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#7f1d2d]" /></div><div className="rounded-xl border border-[#7f1d2d]/20 bg-[#7f1d2d]/5 p-4"><p className="text-sm font-semibold text-gray-900">Payment Method</p><p className="mt-1 text-sm text-gray-600">Cash on Delivery — pay when your order arrives.</p></div>{orderError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{orderError}</p>}<button type="submit" disabled={orderSubmitting} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#7f1d2d] px-6 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:cursor-not-allowed disabled:bg-gray-300">{orderSubmitting ? <><Loader2 size={18} className="animate-spin" />Placing Order...</> : <><ShoppingBag size={18} />Place Order — {formatPrice(total)}</>}</button></form>}</div></div>}
    </main>
  );
}
