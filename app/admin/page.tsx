"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Design = {
  id: number
  title: string
  category: string | null
  description: string | null
  image_url: string
  is_home_featured: boolean
}
type Review = {
  id: number
  name: string
  phone: string | null
  rating: number
  body: string
  image_url: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

type CustomerPost = {
  id: number
  name: string
  phone: string | null
  caption: string | null
  image_url: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

type Order = {
  id: number
  name: string
  phone: string
  blouse_type: string | null
  design_details: string | null
  required_date: string | null
  status: "new" | "contacted" | "confirmed" | "completed" | "cancelled"
  created_at: string
}

type Section = "dashboard" | "designs" | "reviews" | "posts" | "orders"

export default function AdminPage() {
  const supabase = createClient()

  const [section, setSection] = useState<Section>("dashboard")

  const [designs, setDesigns] = useState<Design[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [posts, setPosts] = useState<CustomerPost[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Bridal")
  const [description, setDescription] = useState("")
  const [designFile, setDesignFile] = useState<File | null>(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)

    const [
      designsResult,
      reviewsResult,
      postsResult,
      ordersResult,
    ] = await Promise.all([
      supabase
        .from("designs")
        .select("id,title,category,description,image_url,is_home_featured")
        .order("id", { ascending: false }),

      supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("customer_posts")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
    ])

    if (designsResult.data) {
      setDesigns(designsResult.data)
    }

    if (reviewsResult.data) {
      setReviews(reviewsResult.data)
    }

    if (postsResult.data) {
      setPosts(postsResult.data)
    }

    if (ordersResult.data) {
      setOrders(ordersResult.data)
    }

    setLoading(false)
  }

  function showMessage(text: string) {
    setMessage(text)

    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  async function uploadDesign() {
    if (!designFile) {
      showMessage("আগে একটি blouse photo select করো।")
      return
    }

    if (!title.trim()) {
      showMessage("Design-এর title দাও।")
      return
    }

    setLoading(true)

    try {
      const extension =
        designFile.name.split(".").pop()?.toLowerCase() || "jpg"

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`

      const filePath = `designs/${fileName}`

      const uploadResult = await supabase.storage
        .from("Designs")
        .upload(filePath, designFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadResult.error) {
        throw uploadResult.error
      }

      const publicUrlResult = supabase.storage
        .from("Designs")
        .getPublicUrl(filePath)

      const imageUrl = publicUrlResult.data.publicUrl

      const insertResult = await supabase
        .from("designs")
        .insert({
          title: title.trim(),
          category,
          description: description.trim() || null,
          image_url: imageUrl,
        })

      if (insertResult.error) {
        throw insertResult.error
      }

      setTitle("")
      setDescription("")
      setCategory("Bridal")
      setDesignFile(null)

      const fileInput = document.getElementById(
        "design-file"
      ) as HTMLInputElement | null

      if (fileInput) {
        fileInput.value = ""
      }

      showMessage("Design successfully uploaded।")
      await loadAll()
    } catch (error: any) {
      console.error(error)
      showMessage(error?.message || "Design upload failed।")
    } finally {
      setLoading(false)
    }
  }

  async function updateReviewStatus(
    id: number,
    status: "approved" | "rejected"
  ) {
    const result = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)

    if (result.error) {
      showMessage(result.error.message)
      return
    }

    showMessage(
      status === "approved"
        ? "Review approved হয়েছে।"
        : "Review rejected হয়েছে।"
    )

    await loadAll()
  }

  async function deleteReview(id: number) {
    const confirmed = window.confirm("এই review permanently delete করতে চাও?")
    if (!confirmed) return

    const result = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)

    if (result.error) {
      showMessage(result.error.message)
      return
    }

    showMessage("Review deleted হয়েছে।")
    await loadAll()
  }

  async function updatePostStatus(
    id: number,
    status: "approved" | "rejected"
  ) {
    const result = await supabase
      .from("customer_posts")
      .update({ status })
      .eq("id", id)

    if (result.error) {
      showMessage(result.error.message)
      return
    }

    showMessage(
      status === "approved"
        ? "Customer post approved হয়েছে।"
        : "Customer post rejected হয়েছে।"
    )

    await loadAll()
  }

  async function updateOrderStatus(
    id: number,
    status: Order["status"]
  ) {
    const result = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)

    if (result.error) {
      showMessage(result.error.message)
      return
    }

    showMessage("Order status updated হয়েছে।")
    await loadAll()
  }

  async function toggleHomeFeatured(id: number, current: boolean) {
    const featuredCount = designs.filter(
      (design) => design.is_home_featured
    ).length

    if (!current && featuredCount >= 4) {
      showMessage("Home Page-এ সর্বোচ্চ ৪টি design রাখা যাবে।")
      return
    }

    const result = await supabase
      .from("designs")
      .update({ is_home_featured: !current })
      .eq("id", id)

    if (result.error) {
      showMessage(result.error.message)
      return
    }

    showMessage(
      !current
        ? "Design Home Page-এ যোগ হয়েছে।"
        : "Design Home Page থেকে সরানো হয়েছে।"
    )

    await loadAll()
  }

  async function deleteDesign(id: number) {
    const confirmed = window.confirm(
      "এই design website থেকে delete করতে চাও?"
    )

    if (!confirmed) return

    const result = await supabase
      .from("designs")
      .delete()
      .eq("id", id)

    if (result.error) {
      showMessage(result.error.message)
      return
    }

    showMessage("Design deleted হয়েছে।")
    await loadAll()
  }

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending"
  ).length

  const pendingPosts = posts.filter(
    (post) => post.status === "pending"
  ).length

  const newOrders = orders.filter(
    (order) => order.status === "new"
  ).length

  const homeFeaturedCount = designs.filter(
    (design) => design.is_home_featured
  ).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* TOP BAR */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-sm border border-pink-100">

          <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-500 px-5 py-3 text-white">
            <p className="text-sm font-medium">
              🌸 Doli&apos;s Boutique — Private Admin Panel
            </p>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-bold tracking-wide text-pink-600">
                  DOLI&apos;S BOUTIQUE
                </p>

                <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
                  Admin Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                  Pirojpur, Bongaon
                </p>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-3">
                <p className="font-semibold text-green-700">
                  ✓ Admin Login Active
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-5 rounded-2xl border border-pink-200 bg-pink-50 px-5 py-4 font-medium text-pink-700 shadow-sm">
            {message}
          </div>
        )}

        {/* NAVIGATION */}
        <div className="mb-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-2">

            <button
              onClick={() => setSection("dashboard")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                section === "dashboard"
                  ? "bg-pink-600 text-white"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              🏠 Dashboard
            </button>

            <button
              onClick={() => setSection("designs")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                section === "designs"
                  ? "bg-pink-600 text-white"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              👗 Designs
            </button>

            <button
              onClick={() => setSection("reviews")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                section === "reviews"
                  ? "bg-pink-600 text-white"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              ⭐ Reviews
              {pendingReviews > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {pendingReviews}
                </span>
              )}
            </button>

            <button
              onClick={() => setSection("posts")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                section === "posts"
                  ? "bg-pink-600 text-white"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              📸 Posts
              {pendingPosts > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {pendingPosts}
                </span>
              )}
            </button>

            <button
              onClick={() => setSection("orders")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                section === "orders"
                  ? "bg-pink-600 text-white"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              📩 Enquiries
              {newOrders > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {newOrders}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* DASHBOARD */}
        {section === "dashboard" && (
          <div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <button
                onClick={() => setSection("designs")}
                className="group rounded-3xl border border-blue-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  👗
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Blouse Designs
                </h2>

                <p className="mt-2 text-gray-500">
                  Upload and manage designs
                </p>

                <p className="mt-5 font-semibold text-blue-600">
                  Manage Designs →
                </p>
              </button>

              <button
                onClick={() => setSection("reviews")}
                className="group rounded-3xl border border-yellow-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-3xl">
                  ⭐
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Reviews
                </h2>

                <p className="mt-2 text-gray-500">
                  Approve customer reviews
                </p>

                <p className="mt-5 font-semibold text-yellow-600">
                  Manage Reviews →
                </p>
              </button>

              <button
                onClick={() => setSection("posts")}
                className="group rounded-3xl border border-purple-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-3xl">
                  📸
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Customer Posts
                </h2>

                <p className="mt-2 text-gray-500">
                  Approve customer photos
                </p>

                <p className="mt-5 font-semibold text-purple-600">
                  Manage Posts →
                </p>
              </button>

              <button
                onClick={() => setSection("orders")}
                className="group rounded-3xl border border-green-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                  📩
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Enquiries
                </h2>

                <p className="mt-2 text-gray-500">
                  Manage customer orders
                </p>

                <p className="mt-5 font-semibold text-green-600">
                  View Enquiries →
                </p>
              </button>

            </div>

            <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">

              <h2 className="text-2xl font-bold text-gray-900">
                Website Management
              </h2>

              <p className="mt-2 text-gray-600">
                এখান থেকেই Doli&apos;s Boutique-এর website-এর
                designs, reviews, customer posts এবং enquiries manage
                করা যাবে।
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <button
                  onClick={() => setSection("designs")}
                  className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-left font-semibold text-gray-900 transition hover:border-pink-300 hover:bg-pink-50"
                >
                  👗 Upload New Design
                </button>

                <button
                  onClick={() => setSection("reviews")}
                  className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-left font-semibold text-gray-900 transition hover:border-pink-300 hover:bg-pink-50"
                >
                  ⭐ Manage Reviews
                </button>

                <button
                  onClick={() => setSection("posts")}
                  className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-left font-semibold text-gray-900 transition hover:border-pink-300 hover:bg-pink-50"
                >
                  📸 Manage Customer Posts
                </button>

                <button
                  onClick={() => setSection("orders")}
                  className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-left font-semibold text-gray-900 transition hover:border-pink-300 hover:bg-pink-50"
                >
                  📩 View Enquiries
                </button>

              </div>
            </div>

          </div>
        )}

        {/* DESIGNS */}
        {section === "designs" && (
          <div className="space-y-6">

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">

              <h2 className="text-2xl font-bold text-gray-900">
                👗 Upload New Blouse Design
              </h2>

              <p className="mt-1 text-gray-500">
                নতুন blouse design website gallery-তে যোগ করো।
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-gray-900">🏠 Home Page Featured</p>
                <p className="mt-1 text-sm text-gray-500">
                  Home page-এ কোন ৪টি design দেখাবে, এখান থেকে বেছে নাও।
                </p>
              </div>
              <div className={`rounded-full px-4 py-2 text-sm font-bold ${
                homeFeaturedCount === 4
                  ? "bg-green-100 text-green-700"
                  : "bg-pink-100 text-pink-700"
              }`}>
                {homeFeaturedCount} / 4 selected
              </div>
            </div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Design Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: Bridal Designer Blouse"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-pink-500"
                  >
                    <option>Bridal</option>
                    <option>Party Wear</option>
                    <option>Traditional</option>
                    <option>Designer</option>
                    <option>Simple</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="এই design সম্পর্কে ছোট description..."
                    rows={4}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Blouse Photo
                  </label>

                  <input
                    id="design-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setDesignFile(e.target.files?.[0] || null)
                    }
                    className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700"
                  />
                </div>

              </div>

              <button
                onClick={uploadDesign}
                disabled={loading}
                className="mt-5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Uploading..." : "👗 Upload Design"}
              </button>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Existing Designs
                  </h2>

                  <p className="text-gray-500">
                    মোট {designs.length}টি design
                  </p>
                </div>
              </div>

              {designs.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
                  এখনো কোনো design নেই।
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                  {designs.map((design) => (
                    <div
                      key={design.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      <img
  src={design.image_url}
  alt={design.title}
  className="h-64 w-full object-cover"
/>

                      
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Home Page
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {design.is_home_featured ? "Featured ✓" : "Not selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toggleHomeFeatured(
                        design.id,
                        design.is_home_featured
                      )
                    }
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      design.is_home_featured
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {design.is_home_featured
                      ? "Remove from Home"
                      : "Show on Home"}
                  </button>
                </div>
<div className="p-4">
                        <h3 className="font-bold text-gray-900">
                          {design.title}
                        </h3>

                        {design.category && (
                          <p className="mt-1 text-sm text-pink-600">
                            {design.category}
                          </p>
                        )}

                        {design.description && (
                          <p className="mt-2 text-sm text-gray-500">
                            {design.description}
                          </p>
                        )}

                        <button
                          onClick={() => deleteDesign(design.id)}
                          className="mt-4 w-full rounded-xl bg-red-50 px-4 py-2.5 font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete Design
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>
        )}

        {/* REVIEWS */}
        {section === "reviews" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              ⭐ Customer Reviews
            </h2>

            <p className="mt-1 text-gray-500">
              Customer reviews approve বা reject করো।
            </p>

            <div className="mt-6 space-y-4">

              {reviews.length === 0 && (
                <p className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
                  কোনো review নেই।
                </p>
              )}

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-gray-200 p-5"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {review.name}
                      </h3>

                      <p className="mt-1 text-yellow-500">
                        {"★".repeat(review.rating)}
                        <span className="text-gray-300">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </p>

                      <p className="mt-3 text-gray-700">
                        {review.body}
                      </p>

                      {review.phone && (
                        <p className="mt-2 text-sm text-gray-500">
                          Phone: {review.phone}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : review.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.status}
                    </span>

                  </div>

                  {review.image_url && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                      <img
                        src={review.image_url}
                        alt={`${review.name} review photo`}
                        className="max-h-80 w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {review.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateReviewStatus(review.id, "approved")
                          }
                          className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
                        >
                          ✓ Approve
                        </button>

                        <button
                          onClick={() =>
                            updateReviewStatus(review.id, "rejected")
                          }
                          className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deleteReview(review.id)}
                      className="rounded-xl bg-gray-900 px-5 py-2.5 font-semibold text-white hover:bg-gray-800"
                    >
                      🗑 Delete Review
                    </button>
                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

        {/* CUSTOMER POSTS */}
        {section === "posts" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              📸 Customer Posts
            </h2>

            <p className="mt-1 text-gray-500">
              Customer-এর photo/post approve করার জায়গা।
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

              {posts.length === 0 && (
                <p className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500 md:col-span-2">
                  কোনো customer post নেই।
                </p>
              )}

              {posts.map((post) => (
                <div
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-gray-200"
                >

                  <img
                    src={post.image_url}
                    alt={post.caption || "Customer post"}
                    className="h-80 w-full object-cover"
                  />

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {post.name}
                        </h3>

                        {post.phone && (
                          <p className="text-sm text-gray-500">
                            {post.phone}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                        {post.status}
                      </span>
                    </div>

                    {post.caption && (
                      <p className="mt-3 text-gray-700">
                        {post.caption}
                      </p>
                    )}

                    {post.status === "pending" && (
                      <div className="mt-5 flex gap-3">

                        <button
                          onClick={() =>
                            updatePostStatus(post.id, "approved")
                          }
                          className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700"
                        >
                          ✓ Approve
                        </button>

                        <button
                          onClick={() =>
                            updatePostStatus(post.id, "rejected")
                          }
                          className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
                        >
                          ✕ Reject
                        </button>

                      </div>
                    )}

                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

        {/* ORDERS */}
        {section === "orders" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              📩 Customer Enquiries
            </h2>

            <p className="mt-1 text-gray-500">
              Website থেকে আসা customer enquiry/order এখানে দেখা যাবে।
            </p>

            <div className="mt-6 space-y-5">

              {orders.length === 0 && (
                <p className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
                  এখনো কোনো enquiry নেই।
                </p>
              )}

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-200 p-5"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="space-y-2">

                      <h3 className="text-lg font-bold text-gray-900">
                        {order.name}
                      </h3>

                      <p className="font-medium text-pink-600">
                        📞 {order.phone}
                      </p>

                      {order.blouse_type && (
                        <p>
                          <span className="font-semibold">
                            Blouse Type:
                          </span>{" "}
                          {order.blouse_type}
                        </p>
                      )}

                      {order.design_details && (
                        <p>
                          <span className="font-semibold">
                            Details:
                          </span>{" "}
                          {order.design_details}
                        </p>
                      )}

                      {order.required_date && (
                        <p>
                          <span className="font-semibold">
                            Required Date:
                          </span>{" "}
                          {order.required_date}
                        </p>
                      )}

                    </div>

                    <div className="w-full lg:w-52">

                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Order Status
                      </label>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 font-medium text-gray-900"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

        {/* FOOTER */}
        <p className="mt-8 pb-5 text-center text-sm text-gray-400">
          Doli&apos;s Boutique • Private Admin Panel
        </p>

      </div>
    </main>
  )
}