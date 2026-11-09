"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock3,
  Star,
  MessageSquare,
  Package,
  UserRound,
  LoaderCircle,
  AlertCircle,
  ShieldCheck,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Review = {
  id: string;
  productId: string;
  name: string;
  email?: string | null;
  rating: number;
  comment?: string | null;
  isApproved: boolean;
  createdAt: string;

  product?: {
    id: string;
    name?: string;
    title?: string;
    slug?: string;
  };
};

type FilterType = "ALL" | "PENDING" | "APPROVED";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =====================================
  // AUTH HEADERS
  // =====================================

  const getHeaders = (): HeadersInit => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    };
  };

  // =====================================
  // GET ALL REVIEWS
  // =====================================

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "GET",
          headers: getHeaders(),
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch reviews"
        );
      }

      setReviews(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // =====================================
  // APPROVE / UNAPPROVE REVIEW
  // =====================================

  const handleApproval = async (review: Review) => {
    try {
      setUpdatingId(review.id);

      const response = await fetch(
        `${API_URL}/api/reviews/${review.id}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
          body: JSON.stringify({
            isApproved: !review.isApproved,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update review"
        );
      }

      setReviews((prev) =>
        prev.map((item) =>
          item.id === review.id
            ? {
                ...item,
                isApproved: !review.isApproved,
              }
            : item
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update review"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================
  // DELETE REVIEW
  // =====================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/api/reviews/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete review"
        );
      }

      setReviews((prev) =>
        prev.filter((review) => review.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete review"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // STATISTICS
  // =====================================

  const totalReviews = reviews.length;

  const approvedReviews = reviews.filter(
    (review) => review.isApproved
  ).length;

  const pendingReviews = reviews.filter(
    (review) => !review.isApproved
  ).length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  // =====================================
  // SEARCH & FILTER
  // =====================================

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const productName =
        review.product?.name ||
        review.product?.title ||
        "";

      const searchMatch = [
        review.name,
        review.email || "",
        review.comment || "",
        productName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const filterMatch =
        filter === "ALL" ||
        (filter === "APPROVED" && review.isApproved) ||
        (filter === "PENDING" && !review.isApproved);

      return searchMatch && filterMatch;
    });
  }, [reviews, search, filter]);

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================
  // STAR RATING
  // =====================================

  const RatingStars = ({
    rating,
  }: {
    rating: number;
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }
          />
        ))}

        <span className="ml-1 text-sm font-semibold text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

  // =====================================
  // PAGE UI
  // =====================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck
              size={22}
              className="text-[#7f1d2d]"
            />

            <span className="text-sm font-semibold uppercase tracking-wider text-[#7f1d2d]">
              ROYS Administration
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Customer Reviews
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, approve and monitor customer feedback.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#7f1d2d] hover:text-[#7f1d2d] disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Reviews
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* STATISTICS */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Reviews
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {totalReviews}
              </h2>
            </div>

            <div className="rounded-xl bg-purple-50 p-3">
              <MessageSquare
                size={23}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* APPROVED */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Approved Reviews
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {approvedReviews}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <CheckCircle2
                size={23}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Reviews
              </p>

              <h2 className="mt-2 text-3xl font-bold text-amber-600">
                {pendingReviews}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <Clock3
                size={23}
                className="text-amber-600"
              />
            </div>
          </div>
        </div>

        {/* AVERAGE RATING */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Average Rating
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {averageRating}
                <span className="ml-1 text-base text-gray-400">
                  / 5
                </span>
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <Star
                size={23}
                className="fill-amber-400 text-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* REVIEW MANAGEMENT */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* SEARCH & FILTER HEADER */}

        <div className="border-b border-gray-100 p-5">

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Customer Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage customer feedback.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search reviews..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-[#7f1d2d] focus:bg-white sm:w-64"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* FILTER */}

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as FilterType)
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#7f1d2d]"
              >
                <option value="ALL">
                  All Reviews
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>
              </select>

            </div>
          </div>
        </div>

        {/* REVIEW LIST */}

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">
            <LoaderCircle
              size={35}
              className="animate-spin text-[#7f1d2d]"
            />

            <p className="text-sm text-gray-500">
              Loading customer reviews...
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">

            <div className="mb-4 rounded-full bg-gray-100 p-5">
              <MessageSquare
                size={32}
                className="text-gray-400"
              />
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              No Reviews Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {search || filter !== "ALL"
                ? "Try changing your search or filter."
                : "Customer reviews will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {filteredReviews.map((review) => {

              const productName =
                review.product?.name ||
                review.product?.title ||
                "Unknown Product";

              return (
                <div
                  key={review.id}
                  className="p-5 transition hover:bg-gray-50/70 sm:p-6"
                >

                  {/* CUSTOMER INFORMATION */}

                  <div className="flex flex-col justify-between gap-4 lg:flex-row">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[#7f1d2d]">
                          <UserRound size={21} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900">
                            {review.name}
                          </h3>

                          <p className="break-all text-xs text-gray-500">
                            {review.email || "No email provided"}
                          </p>
                        </div>

                        {/* STATUS */}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            review.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {review.isApproved
                            ? "Approved"
                            : "Pending"}
                        </span>

                      </div>

                      {/* PRODUCT */}

                      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-600">

                        <Package
                          size={16}
                          className="text-[#7f1d2d]"
                        />

                        <span className="font-medium">
                          Product:
                        </span>

                        <span className="font-semibold text-gray-800">
                          {productName}
                        </span>

                      </div>

                      {/* RATING */}

                      <div className="mt-3">
                        <RatingStars rating={review.rating} />
                      </div>

                      {/* COMMENT */}

                      <div className="mt-4 rounded-xl bg-gray-50 p-4">

                        <p className="text-sm leading-7 text-gray-700">
                          {review.comment?.trim()
                            ? review.comment
                            : "No comment provided."}
                        </p>

                      </div>

                      {/* DATE */}

                      <p className="mt-3 text-xs text-gray-400">
                        Submitted on{" "}
                        {formatDate(review.createdAt)}
                      </p>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex shrink-0 flex-row items-start gap-2 lg:flex-col">

                      {/* APPROVE / UNAPPROVE */}

                      <button
                        onClick={() =>
                          handleApproval(review)
                        }
                        disabled={
                          updatingId === review.id ||
                          deletingId === review.id
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 lg:w-40 ${
                          review.isApproved
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-[#7f1d2d] text-white hover:bg-[#681725]"
                        }`}
                      >
                        {updatingId === review.id ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}

                        {updatingId === review.id
                          ? "Updating..."
                          : review.isApproved
                            ? "Unapprove"
                            : "Approve"}
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(review.id)
                        }
                        disabled={
                          deletingId === review.id ||
                          updatingId === review.id
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 lg:w-40"
                      >
                        {deletingId === review.id ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}

                        {deletingId === review.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* FOOTER */}

        {!loading && filteredReviews.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-800">
                {filteredReviews.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-800">
                {totalReviews}
              </span>{" "}
              reviews
            </p>

          </div>
        )}

      </div>
    </div>
  );
}