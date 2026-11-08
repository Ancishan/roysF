"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  price: string | number;
  discountPrice: string | number | null;
  stock: number;
  material: string | null;
  weight: string | number | null;
  warranty: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;

  category: {
    name: string;
  };

  brand: {
    name: string;
  } | null;

  images: ProductImage[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface Review {
  id: string;
  productId: string;
  name: string;
  email: string | null;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
}

interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
}

interface CreatedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  city: string;
  area?: string | null;
  subtotal: number | string;
  deliveryCharge: number | string;
  totalAmount: number | string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number | string;
    subtotal: number | string;
  }[];
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: CreatedOrder;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DELIVERY_CHARGE = 110;

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { clearItems } = useCart();

  const { addItem: addToWishlist, wishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // =========================
  // ORDER STATES
  // =========================

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

  // =========================
  // REVIEW STATES
  // =========================

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  // =========================
  // WISHLIST
  // =========================

  const isWishlisted = wishlist.some((item) => item.productId === id);

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products/${id}`, {
          signal: controller.signal,
        });

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load product");
        }

        setProduct(result.data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  // =========================
  // FETCH REVIEWS
  // =========================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReviews() {
      try {
        setReviewsLoading(true);

        const response = await fetch(`${API_URL}/api/reviews`, {
          signal: controller.signal,
        });

        const result: ReviewsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load reviews");
        }

        const productReviews = result.data.filter(
          (review) => review.productId === id && review.isApproved,
        );

        setReviews(productReviews);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Review fetch error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setReviewsLoading(false);
        }
      }
    }

    fetchReviews();

    return () => controller.abort();
  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-16">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-gray-100" />

          <div className="space-y-5">
            <div className="h-5 w-24 rounded bg-gray-100" />
            <div className="h-10 w-3/4 rounded bg-gray-100" />
            <div className="h-8 w-32 rounded bg-gray-100" />
            <div className="h-24 rounded bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Product Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {error || "This product could not be found."}
        </p>

        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7f1d2d] px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>
      </main>
    );
  }

  // =========================
  // PRODUCT UNAVAILABLE
  // =========================

  if (!product.isActive) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Product Unavailable
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          This product is currently unavailable.
        </p>

        <Link
          href="/shop"
          className="mt-6 rounded-full bg-[#7f1d2d] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  // =========================
  // PRICE
  // =========================

  const regularPrice = Number(product.price);

  const sellingPrice =
    product.discountPrice !== null
      ? Number(product.discountPrice)
      : regularPrice;

  const hasDiscount =
    product.discountPrice !== null && sellingPrice < regularPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
    : 0;

  const currentImage = product.images[selectedImage];

  // =========================
  // ORDER CALCULATIONS
  // =========================

  const orderSubtotal = sellingPrice * quantity;

  const orderTotal = orderSubtotal + DELIVERY_CHARGE;

  // =========================
  // REVIEW CALCULATIONS
  // =========================

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const roundedAverageRating = Math.round(averageRating * 10) / 10;

  // =========================
  // BUY NOW
  // =========================

  function handleBuyNow() {
    if (product.stock < 1 || quantity > product.stock) {
      return;
    }

    setOrderError("");
    setOrderSuccess(null);
    setShowOrderModal(true);
  }

  // =========================
  // WISHLIST
  // =========================

  function handleWishlistClick() {
    addToWishlist(product.id);
  }

  // =========================
  // SUBMIT ORDER
  // =========================

  async function handleSubmitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setOrderError("");
    setOrderSuccess(null);

    if (customerName.trim().length < 2) {
      setOrderError("Customer name must be at least 2 characters.");
      return;
    }

    if (customerPhone.trim().length < 11) {
      setOrderError("Customer phone must be at least 11 characters.");
      return;
    }

    if (shippingAddress.trim().length < 5) {
      setOrderError("Please enter your shipping address.");
      return;
    }

    if (city.trim().length < 2) {
      setOrderError("Please enter your city.");
      return;
    }

    if (product.stock < 1 || quantity > product.stock) {
      setOrderError("Sorry, the requested quantity is no longer available.");
      return;
    }

    try {
      setOrderSubmitting(true);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          shippingAddress: shippingAddress.trim(),
          city: city.trim(),
          area: area.trim() || undefined,
          paymentMethod: "COD",
          items: [
            {
              productId: product.id,
              quantity,
            },
          ],
        }),
      });

      const result: OrderResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to place order.");
      }

      // Clear cart after successful order
      clearItems();

      setOrderSuccess(result.data);
    } catch (err) {
      if (err instanceof Error) {
        setOrderError(err.message);
      } else {
        setOrderError("Something went wrong. Please try again.");
      }
    } finally {
      setOrderSubmitting(false);
    }
  }

  // =========================
  // SUBMIT REVIEW
  // =========================

  async function handleSubmitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setReviewMessage("");
    setReviewError("");

    if (!reviewName.trim()) {
      setReviewError("Please enter your name.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please write your review.");
      return;
    }

    try {
      setReviewSubmitting(true);

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          name: reviewName.trim(),
          email: reviewEmail.trim() || undefined,
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit review");
      }

      setReviewMessage(
        "Thank you! Your review has been submitted and is waiting for approval.",
      );

      setReviewName("");
      setReviewEmail("");
      setReviewRating(5);
      setReviewComment("");
    } catch (err) {
      if (err instanceof Error) {
        setReviewError(err.message);
      } else {
        setReviewError("Something went wrong. Please try again.");
      }
    } finally {
      setReviewSubmitting(false);
    }
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-white">
      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className="mx-auto max-w-7xl px-5 pt-7 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#7f1d2d]">
            Home
          </Link>

          <span>/</span>

          <Link href="/shop" className="hover:text-[#7f1d2d]">
            Shop
          </Link>

          <span>/</span>

          <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      {/* =========================
          PRODUCT SECTION
      ========================= */}

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* PRODUCT IMAGES */}

          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
              {product.isNewArrival && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-[#7f1d2d] px-3 py-1.5 text-xs font-semibold text-white">
                  New Arrival
                </span>
              )}

              {hasDiscount && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
                  -{discountPercentage}%
                </span>
              )}

              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.name}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ShoppingBag size={54} strokeWidth={1.2} />

                  <p className="mt-3 text-sm">Product image coming soon</p>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                      selectedImage === index
                        ? "border-[#7f1d2d]"
                        : "border-gray-100"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400">
              SKU: {product.sku}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={17}
                    className={
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-gray-500">
                {totalReviews > 0
                  ? `${roundedAverageRating} (${totalReviews} ${
                      totalReviews === 1 ? "review" : "reviews"
                    })`
                  : "No reviews yet"}
              </span>
            </div>

            {/* PRICE */}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-semibold text-[#7f1d2d]">
                ৳{sellingPrice.toLocaleString("en-BD")}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ৳{regularPrice.toLocaleString("en-BD")}
                  </span>

                  <span className="text-sm font-semibold text-green-600">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* SHORT DESCRIPTION */}

            {product.shortDescription && (
              <p className="mt-6 leading-7 text-gray-600">
                {product.shortDescription}
              </p>
            )}

            <div className="my-7 h-px bg-gray-100" />

            {/* CATEGORY / BRAND */}

            <div className="space-y-2 text-sm">
              <p className="text-gray-500">
                Category:{" "}
                <span className="font-medium text-gray-800">
                  {product.category.name}
                </span>
              </p>

              {product.brand && (
                <p className="text-gray-500">
                  Brand:{" "}
                  <span className="font-medium text-gray-800">
                    {product.brand.name}
                  </span>
                </p>
              )}
            </div>

            {/* STOCK */}

            <div className="mt-6 flex items-center justify-between">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-green-600">In Stock</p>
              ) : (
                <p className="text-sm font-medium text-red-600">Out of Stock</p>
              )}

              {product.stock > 0 && (
                <p className="text-sm text-gray-500">
                  {product.stock} available
                </p>
              )}
            </div>

            {/* QUANTITY */}

            {product.stock > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Quantity
                </p>

                <div className="flex h-12 w-fit items-center rounded-full border border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((current) => Math.max(1, current - 1));
                    }}
                    aria-label="Decrease quantity"
                    className="flex h-12 w-12 items-center justify-center text-gray-600 hover:text-[#7f1d2d]"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="w-10 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((current) =>
                        Math.min(product.stock, current + 1),
                      );
                    }}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                    className="flex h-12 w-12 items-center justify-center text-gray-600 hover:text-[#7f1d2d] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>
            )}

            {/* BUY NOW / WISHLIST */}

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={product.stock < 1}
                onClick={handleBuyNow}
                className="flex h-14 flex-1 items-center justify-center rounded-full bg-[#7f1d2d] px-4 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleWishlistClick}
                aria-label={
                  isWishlisted ? "Already in wishlist" : "Add to wishlist"
                }
                aria-pressed={isWishlisted}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-[#7f1d2d] hover:text-[#7f1d2d]"
              >
                <Heart
                  size={20}
                  strokeWidth={1.7}
                  fill={isWishlisted ? "#7f1d2d" : "none"}
                  color={isWishlisted ? "#7f1d2d" : "currentColor"}
                />
              </button>
            </div>

            {/* ADDITIONAL INFORMATION */}

            <div className="mt-8 border-t border-gray-100">
              {product.material && (
                <div className="flex justify-between gap-4 border-b border-gray-100 py-4 text-sm">
                  <span className="text-gray-500">Material</span>

                  <span className="text-right font-medium text-gray-800">
                    {product.material}
                  </span>
                </div>
              )}

              {product.weight && (
                <div className="flex justify-between gap-4 border-b border-gray-100 py-4 text-sm">
                  <span className="text-gray-500">Weight</span>

                  <span className="text-right font-medium text-gray-800">
                    {product.weight} g
                  </span>
                </div>
              )}

              {product.warranty && (
                <div className="flex justify-between gap-4 border-b border-gray-100 py-4 text-sm">
                  <span className="text-gray-500">Warranty</span>

                  <span className="text-right font-medium text-gray-800">
                    {product.warranty}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        {product.description && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              Product Description
            </h2>

            <p className="mt-5 max-w-4xl whitespace-pre-line leading-8 text-gray-600">
              {product.description}
            </p>
          </div>
        )}

        {/* =========================
            REVIEWS
        ========================= */}

        <section className="mt-16 border-t border-gray-100 pt-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* LEFT */}

            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Customer Reviews
              </h2>

              {/* SUMMARY */}

              <div className="mt-6 rounded-2xl bg-gray-50 p-6">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">
                      {totalReviews > 0 ? roundedAverageRating : "0.0"}
                    </p>

                    <div className="mt-2 flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= Math.round(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="h-12 w-px bg-gray-200" />

                  <div>
                    <p className="font-medium text-gray-900">
                      {totalReviews}{" "}
                      {totalReviews === 1
                        ? "Customer Review"
                        : "Customer Reviews"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Based on approved reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* REVIEW FORM */}

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900">
                  Write a Review
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Share your experience with this product.
                </p>

                <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="reviewName"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Your Name
                    </label>

                    <input
                      id="reviewName"
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reviewEmail"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Email{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="reviewEmail"
                      type="email"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-800">
                      Your Rating
                    </p>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          aria-label={`Rate ${star} stars`}
                          className="transition hover:scale-110"
                        >
                          <Star
                            size={25}
                            className={
                              star <= reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reviewComment"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Your Review
                    </label>

                    <textarea
                      id="reviewComment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  {reviewError && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      {reviewError}
                    </div>
                  )}

                  {reviewMessage && (
                    <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                      {reviewMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="h-12 rounded-full bg-[#7f1d2d] px-7 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>

                {totalReviews > 0 && (
                  <span className="text-sm text-gray-500">
                    {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </span>
                )}
              </div>

              {/* LOADING */}

              {reviewsLoading && (
                <div className="mt-6 space-y-5">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-gray-100 p-6"
                    >
                      <div className="h-4 w-32 rounded bg-gray-100" />

                      <div className="mt-3 h-4 w-24 rounded bg-gray-100" />

                      <div className="mt-5 h-12 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              )}

              {/* EMPTY */}

              {!reviewsLoading && reviews.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                  <Star
                    size={34}
                    strokeWidth={1.4}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-4 font-medium text-gray-800">
                    No reviews yet
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Be the first customer to review this product.
                  </p>
                </div>
              )}

              {/* REVIEW LIST */}

              {!reviewsLoading && reviews.length > 0 && (
                <div className="mt-6 space-y-5">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-gray-100 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-BD",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={15}
                              className={
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                          {review.comment}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </section>

      {/* ==================================================
          COD ORDER MODAL
      ================================================== */}

      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* CLOSE */}

            <button
              type="button"
              onClick={() => {
                if (!orderSubmitting) {
                  setShowOrderModal(false);
                }
              }}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
            >
              <X size={19} />
            </button>

            {!orderSuccess ? (
              <div className="p-6 sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f1d2d]">
                    Cash on Delivery
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                    Complete Your Order
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Fill in your delivery information.
                  </p>
                </div>

                {/* ORDER SUMMARY */}

                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                      {currentImage ? (
                        <Image
                          src={currentImage.url}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag size={25} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-2 font-semibold text-[#7f1d2d]">
                        ৳{sellingPrice.toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>

                      <span className="font-medium text-gray-800">
                        ৳{orderSubtotal.toLocaleString("en-BD")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Charge</span>

                      <span className="font-medium text-gray-800">
                        ৳{DELIVERY_CHARGE.toLocaleString("en-BD")}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="font-semibold text-gray-900">Total</span>

                      <span className="text-lg font-bold text-[#7f1d2d]">
                        ৳{orderTotal.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FORM */}

                <form onSubmit={handleSubmitOrder} className="mt-7 space-y-5">
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="customerName"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Full Name
                    </label>

                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="customerPhone"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Phone Number
                    </label>

                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Email{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  {/* CITY / AREA */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-medium text-gray-800"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Chattogram"
                        required
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="mb-2 block text-sm font-medium text-gray-800"
                      >
                        Area{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>

                      <input
                        id="area"
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Your area"
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#7f1d2d]"
                      />
                    </div>
                  </div>

                  {/* ADDRESS */}

                  <div>
                    <label
                      htmlFor="shippingAddress"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Shipping Address
                    </label>

                    <textarea
                      id="shippingAddress"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="House/Road/Block and other delivery details"
                      required
                      rows={4}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#7f1d2d]"
                    />
                  </div>

                  {/* PAYMENT METHOD */}

                  <div className="rounded-xl border border-[#7f1d2d]/20 bg-[#7f1d2d]/5 p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Payment Method
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-4 border-[#7f1d2d] bg-white">
                        <div className="h-2 w-2 rounded-full bg-[#7f1d2d]" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Cash on Delivery
                        </p>

                        <p className="text-xs text-gray-500">
                          Pay when your order arrives.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ERROR */}

                  {orderError && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      {orderError}
                    </div>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#7f1d2d] px-6 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {orderSubmitting ? (
                      "Placing Order..."
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        Place Order — ৳{orderTotal.toLocaleString("en-BD")}
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* =========================
                 ORDER SUCCESS
              ========================= */

              <div className="px-6 py-12 text-center sm:px-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 size={44} className="text-green-600" />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Order Placed Successfully!
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Thank you for shopping with ROYS.
                </p>

                <div className="mx-auto mt-7 max-w-md rounded-2xl bg-gray-50 p-6 text-left">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Order Number</span>

                      <span className="font-bold text-[#7f1d2d]">
                        {orderSuccess.orderNumber}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Customer</span>

                      <span className="font-medium text-gray-800">
                        {orderSuccess.customerName}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment</span>

                      <span className="font-medium text-gray-800">
                        Cash on Delivery
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-t border-gray-200 pt-4">
                      <span className="font-semibold text-gray-900">Total</span>

                      <span className="text-lg font-bold text-[#7f1d2d]">
                        ৳
                        {Number(orderSuccess.totalAmount).toLocaleString(
                          "en-BD",
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-gray-500">
                  We will contact you on{" "}
                  <span className="font-medium text-gray-700">
                    {orderSuccess.customerPhone}
                  </span>{" "}
                  to confirm your order.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/shop"
                    onClick={() => setShowOrderModal(false)}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 px-6 text-sm font-semibold text-gray-800 transition hover:border-[#7f1d2d] hover:text-[#7f1d2d]"
                  >
                    Continue Shopping
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOrderModal(false);
                      setOrderSuccess(null);
                    }}
                    className="h-12 rounded-full bg-[#7f1d2d] px-6 text-sm font-semibold text-white transition hover:bg-[#681725]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
