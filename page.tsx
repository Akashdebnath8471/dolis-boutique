 "use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const WHATSAPP = "9046965501";

type Design = {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string;
};

type Review = {
  id: number;
  name: string;
  rating: number;
  body: string;
  image_url: string | null;
  created_at: string;
};

type CustomerPost = {
  id: number;
  name: string;
  caption: string | null;
  image_url: string;
  created_at: string;
};

const fallbackDesigns = [
  {
    image_url: "/images/blouse 1.jpg",
    title: "এলিগ্যান্ট ব্লাউজ",
    category: "Elegant",
    description: "সুন্দর ফিনিশিং ও নিখুঁত ফিটিং",
  },
  {
    image_url: "/images/blouse 2.jpg",
    title: "ডিজাইনার ব্লাউজ",
    category: "Designer",
    description: "আপনার পছন্দ অনুযায়ী কাস্টম ডিজাইন",
  },
  {
    image_url: "/images/blouse 3.jpg",
    title: "পার্টি ওয়্যার",
    category: "Party Wear",
    description: "বিশেষ দিনের জন্য আকর্ষণীয় ডিজাইন",
  },
  {
    image_url: "/images/blouse 4.jpg",
    title: "ট্র্যাডিশনাল",
    category: "Traditional",
    description: "ঐতিহ্যবাহী সৌন্দর্যের সঙ্গে আধুনিক ফিনিশিং",
  },
];

function whatsappLink(message: string) {
  return `https://wa.me/91${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-[#c98a48]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("bn-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<CustomerPost[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [reviewName, setReviewName] = useState("");
  const [reviewPhone, setReviewPhone] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewPreview, setReviewPreview] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [postName, setPostName] = useState("");
  const [postPhone, setPostPhone] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  const orderMessage =
    "নমস্কার Doli's Boutique 🌸\nআমি একটি কাস্টমাইজড ব্লাউজ তৈরি করাতে চাই।\nদয়া করে ডিজাইন, মাপ ও অর্ডারের বিষয়ে আমাকে সাহায্য করুন।";

  useEffect(() => {
    async function loadPublicContent() {
      setLoadingDesigns(true);

      const [designResult, reviewResult, postResult] = await Promise.all([
        supabase
          .from("designs")
          .select("id,title,category,description,image_url")
          .order("id", { ascending: false }),
        supabase.rpc("get_approved_reviews"),
        supabase.rpc("get_approved_customer_posts"),
      ]);

      if (!designResult.error && designResult.data?.length) {
        setDesigns(designResult.data as Design[]);
      } else {
        setDesigns(
          fallbackDesigns.map((item, index) => ({
            ...item,
            id: index + 1,
          })),
        );
      }

      if (!reviewResult.error && reviewResult.data) {
        setReviews(reviewResult.data as Review[]);
      }

      if (!postResult.error && postResult.data) {
        setPosts(postResult.data as CustomerPost[]);
      }

      setLoadingDesigns(false);
    }

    loadPublicContent();
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewMessage("");

    if (!reviewName.trim() || !reviewBody.trim()) {
      setReviewMessage("নাম ও review লিখুন।");
      return;
    }

    if (reviewBody.trim().length < 5) {
      setReviewMessage("Review একটু বিস্তারিত লিখুন।");
      return;
    }

    if (reviewImage && reviewImage.size > 5 * 1024 * 1024) {
      setReviewMessage("ছবির size সর্বোচ্চ 5 MB হতে পারবে।");
      return;
    }

    setReviewSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (reviewImage) {
        const extension = reviewImage.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `reviews/${Date.now()}-${crypto.randomUUID()}.${extension}`;
        const upload = await supabase.storage
          .from("Review-images")
          .upload(filePath, reviewImage, {
            cacheControl: "3600",
            upsert: false,
            contentType: reviewImage.type,
          });

        if (upload.error) throw upload.error;

        imageUrl = supabase.storage.from("Review-images").getPublicUrl(filePath).data.publicUrl;
      }

      const { error } = await supabase.from("reviews").insert({
        name: reviewName.trim(),
        phone: reviewPhone.trim() || null,
        rating: reviewRating,
        body: reviewBody.trim(),
        image_url: imageUrl,
        status: "pending",
      });

      if (error) throw error;

      setReviewName("");
      setReviewPhone("");
      setReviewRating(5);
      setReviewBody("");
      setReviewImage(null);
      setReviewPreview("");
      setReviewMessage("Review সফলভাবে পাঠানো হয়েছে। Admin approve করার পর website-এ দেখা যাবে। ❤️");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setReviewMessage(`Review submit করা যায়নি: ${message}`);
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function submitCustomerPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPostMessage("");

    if (!postName.trim() || !postPhone.trim() || !postImage) {
      setPostMessage("নাম, ফোন নম্বর এবং ছবি অবশ্যই দিতে হবে।");
      return;
    }

    if (postImage.size > 5 * 1024 * 1024) {
      setPostMessage("ছবির size সর্বোচ্চ 5 MB হতে পারবে।");
      return;
    }

    setPostSubmitting(true);

    try {
      const extension = postImage.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `posts/${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage
        .from("Customer-posts")
        .upload(filePath, postImage, {
          cacheControl: "3600",
          upsert: false,
          contentType: postImage.type,
        });

      if (upload.error) throw upload.error;

      const imageUrl = supabase.storage.from("Customer-posts").getPublicUrl(filePath).data.publicUrl;

      const { error } = await supabase.from("customer_posts").insert({
        name: postName.trim(),
        phone: postPhone.trim(),
        caption: postCaption.trim() || null,
        image_url: imageUrl,
        status: "pending",
      });

      if (error) throw error;

      setPostName("");
      setPostPhone("");
      setPostCaption("");
      setPostImage(null);
      setPostPreview("");
      setPostMessage("Photo post সফলভাবে পাঠানো হয়েছে। Admin approve করার পর website-এ দেখা যাবে। ❤️");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setPostMessage(`Post submit করা যায়নি: ${message}`);
    } finally {
      setPostSubmitting(false);
    }
  }

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffaf8] text-[#302522]">
      {/* Announcement */}
      <div className="bg-[#302522] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        ✨ কাস্টমাইজড ব্লাউজ • পিরোজপুর, বনগাঁ • WhatsApp-এ সহজে অর্ডার করুন
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#eadbd5]/80 bg-[#fffaf8]/90 shadow-[0_8px_30px_rgba(70,40,35,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2d8da] text-xl shadow-sm">
              🪡
            </div>
            <div>
              <div className="text-lg font-black tracking-tight sm:text-xl">
                Doli&apos;s <span className="text-[#a65c67]">Boutique</span>
              </div>
              <div className="text-[9px] font-semibold tracking-[0.24em] text-[#927b75]">
                CUSTOM BLOUSE STUDIO
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {[
              ["হোম", "#home"],
              ["ডিজাইন", "#designs"],
              ["পরিষেবা", "#services"],
              ["আমাদের কথা", "#about"],
              ["রিভিউ", "#reviews"],
              ["যোগাযোগ", "#contact"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="transition hover:text-[#a65c67]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink(orderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-[#a65c67] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#a65c67]/20 transition hover:-translate-y-0.5 hover:bg-[#914f5a] sm:inline-flex"
            >
              💬 WhatsApp-এ অর্ডার
            </a>

            <button
              type="button"
              onClick={() => setMobileMenu((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eadbd5] bg-white text-lg lg:hidden"
              aria-label="Menu"
            >
              {mobileMenu ? "×" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-[#eadbd5] bg-white px-5 py-4 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {[
                ["হোম", "#home"],
                ["ডিজাইন", "#designs"],
                ["পরিষেবা", "#services"],
                ["আমাদের কথা", "#about"],
                ["রিভিউ", "#reviews"],
                ["যোগাযোগ", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-xl px-4 py-3 font-semibold hover:bg-[#fff3f3]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#f4dfe0] blur-3xl" />
        <div className="absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#f7e9d8] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8c8cd] bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-[#9a5661] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#a65c67]" />
              পিরোজপুর, বনগাঁ • Home-Based Boutique
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              আপনার পছন্দের
              <span className="mt-2 block text-[#a65c67]">
                ব্লাউজ, আপনার মাপেই।
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#725f59] sm:text-lg">
              নিজের পছন্দের ডিজাইন, শাড়ি ও মাপ অনুযায়ী তৈরি করুন আপনার
              ব্লাউজ। প্রতিটি কাজ করা হয় যত্ন, নিখুঁত ফিটিং এবং সুন্দর
              ফিনিশিং-এর দিকে নজর রেখে।
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#designs"
                className="rounded-full bg-[#302522] px-7 py-4 text-center text-sm font-bold text-white shadow-xl shadow-[#302522]/15 transition hover:-translate-y-1 hover:bg-[#463632]"
              >
                আমাদের ডিজাইন দেখুন →
              </a>
              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#d8adb4] bg-white px-7 py-4 text-center text-sm font-bold text-[#9a5661] shadow-sm transition hover:-translate-y-1 hover:bg-[#fff1f2]"
              >
                💬 WhatsApp-এ কথা বলুন
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-[#eadbd5] rounded-3xl border border-[#eadbd5] bg-white/80 p-5 shadow-sm">
              <div className="px-3 text-center">
                <div className="text-2xl font-black">01</div>
                <div className="mt-1 text-xs font-semibold text-[#806d67]">
                  পছন্দের ডিজাইন
                </div>
              </div>
              <div className="px-3 text-center">
                <div className="text-2xl font-black">02</div>
                <div className="mt-1 text-xs font-semibold text-[#806d67]">
                  মাপ অনুযায়ী তৈরি
                </div>
              </div>
              <div className="px-3 text-center">
                <div className="text-2xl font-black">03</div>
                <div className="mt-1 text-xs font-semibold text-[#806d67]">
                  WhatsApp অর্ডার
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#f2d8da] via-[#f8eee7] to-[#efd7cf] opacity-80 blur-2xl" />
            <div className="relative rounded-[2.4rem] border border-white/80 bg-white/75 p-3 shadow-[0_35px_100px_rgba(70,40,35,0.18)] backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                {fallbackDesigns.map((design, index) => (
                  <div
                    key={design.image_url}
                    className={`group overflow-hidden rounded-[1.7rem] ${
                      index === 1 ? "mt-10" : index === 2 ? "-mt-7" : ""
                    }`}
                  >
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-80"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-8 left-1/2 w-[78%] -translate-x-1/2 rounded-2xl border border-white/70 bg-white/92 p-4 text-center shadow-xl backdrop-blur">
                <p className="font-black">✨ আপনার স্টাইল, আমাদের কারিগরি</p>
                <p className="mt-1 text-xs text-[#806d67]">
                  Customised Blouse Making • Pirojpur, Bongaon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y border-[#eadbd5] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {[
            ["🧵", "কাস্টমাইজড তৈরি", "আপনার পছন্দ অনুযায়ী"],
            ["📏", "নিখুঁত ফিটিং", "আপনার মাপ অনুযায়ী"],
            ["✨", "সুন্দর ফিনিশিং", "যত্নসহকারে তৈরি"],
            ["💬", "সহজে অর্ডার", "WhatsApp-এর মাধ্যমে"],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="border-b border-r border-[#eadbd5] p-7 text-center last:border-r-0 lg:border-b-0"
            >
              <div className="text-3xl">{icon}</div>
              <p className="mt-3 font-black">{title}</p>
              <p className="mt-1 text-xs text-[#806d67]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Designs */}
      <section id="designs" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a65c67]">
              আমাদের কাজ
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              ব্লাউজ ডিজাইনের গ্যালারি
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[#806d67]">
              পছন্দের কোনো ডিজাইন ভালো লাগলে সেটার reference নিয়ে WhatsApp-এ
              কথা বলুন। নতুন ডিজাইন যোগ হলে এই gallery-তেও automatically দেখা যাবে।
            </p>
          </div>

          <a
            href={whatsappLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 rounded-full border border-[#d8adb4] bg-white px-6 py-3 text-sm font-bold text-[#a65c67] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff1f2]"
          >
            ডিজাইন নিয়ে কথা বলুন →
          </a>
        </div>

        {loadingDesigns ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[2rem] bg-[#f2e8e5]"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {designs.map((design) => (
              <article
                key={design.id}
                className="group overflow-hidden rounded-[2rem] border border-[#eadbd5] bg-white shadow-[0_10px_35px_rgba(70,40,35,0.06)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(70,40,35,0.13)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5ece9]">
                  <img
                    src={design.image_url}
                    alt={design.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {design.category && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#9a5661] shadow backdrop-blur">
                      {design.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-black">{design.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#806d67]">
                    {design.description || "আপনার পছন্দ অনুযায়ী কাস্টমাইজ করা যাবে।"}
                  </p>
                  <a
                    href={whatsappLink(
                      `নমস্কার Doli's Boutique 🌸\nআমি "${design.title}"-এর মতো একটি ব্লাউজ তৈরি করাতে চাই।`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex font-bold text-[#a65c67] hover:underline"
                  >
                    এই ডিজাইনটি চাই →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Services */}
      <section id="services" className="relative overflow-hidden bg-[#302522] text-white">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#a65c67]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e7b8bd]">
              আমাদের পরিষেবা
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              শুধু ব্লাউজ নয়—
              <span className="text-[#e7b8bd]"> আপনার স্টাইল।</span>
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-[#d8c8c3]">
              আপনার পছন্দের ছবি, শাড়ি, অনুষ্ঠান এবং মাপের কথা মাথায় রেখে
              customised blouse তৈরির জন্য আলোচনা করা যায়।
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "কাস্টম ডিজাইন", "আপনার পছন্দের ছবি বা reference দেখে কাজ।"],
              ["02", "পারফেক্ট ফিটিং", "আপনার মাপ অনুযায়ী carefully তৈরি করা।"],
              ["03", "পার্টি ও ফেস্টিভ", "পুজো, বিয়ে ও বিশেষ দিনের জন্য।"],
              ["04", "ট্র্যাডিশনাল", "শাড়ির সঙ্গে মানানসই traditional look।"],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 transition hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                <span className="text-sm font-black text-[#e7b8bd]">{number}</span>
                <h3 className="mt-12 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#d1c1bc]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          {/* Real founder / maker photo */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-[#f2d8da] via-[#f8eee7] to-[#efd7cf] blur-2xl opacity-70" />

            <div className="relative overflow-hidden rounded-[2.6rem] border border-white bg-white p-3 shadow-[0_25px_70px_rgba(70,40,35,0.14)]">
              <div className="relative overflow-hidden rounded-[2.2rem]">
                <img
                  src="/images/doli-mother.jpg"
                  alt="Doli's Boutique founder and maker"
                  className="h-[520px] w-full object-cover object-center sm:h-[620px]"
                />

                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a65c67]">
                    DOLI&apos;S BOUTIQUE
                  </p>
                  <p className="mt-1 font-black">
                    ভালোবাসা দিয়ে তৈরি প্রতিটি কাজ
                  </p>
                  <p className="mt-1 text-xs text-[#806d67]">
                    Pirojpur, Bongaon • Customised Blouse Making
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 rounded-2xl border border-[#eadbd5] bg-white px-5 py-3 shadow-xl sm:-right-5">
              <p className="text-xs font-bold text-[#806d67]">🧵 Home-Based</p>
              <p className="mt-1 font-black text-[#302522]">Custom Blouse Studio</p>
            </div>
          </div>

          {/* Story */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a65c67]">
              আমাদের কথা
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              একটি ছোট্ট ঘরোয়া উদ্যোগ,
              <span className="block text-[#a65c67]">
                ভালোবাসা দিয়ে তৈরি।
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#604f4a]">
              Doli&apos;s Boutique হলো পিরোজপুর, বনগাঁ-র একটি home-based
              customised blouse making service। এখানে প্রতিটি blouse তৈরি করা হয়
              customer-এর পছন্দ, design এবং প্রয়োজন অনুযায়ী।
            </p>

            <p className="mt-4 leading-8 text-[#725f59]">
              আপনার পছন্দের blouse-এর ছবি বা design reference WhatsApp-এ পাঠিয়ে
              আগে থেকেই design, মাপ এবং প্রয়োজনীয় বিষয় নিয়ে আলোচনা করতে পারবেন।
              লক্ষ্য একটাই—আপনার শাড়ি ও style-এর সঙ্গে মানানসই একটি blouse তৈরি করা।
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#eadbd5] bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f2] text-2xl">
                  🧵
                </div>
                <p className="mt-4 font-black">যত্নসহকারে তৈরি</p>
                <p className="mt-2 text-sm leading-6 text-[#806d67]">
                  প্রতিটি customer-এর প্রয়োজন ও design-এর দিকে ব্যক্তিগত নজর।
                </p>
              </div>

              <div className="rounded-3xl border border-[#eadbd5] bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ea] text-2xl">
                  ✨
                </div>
                <p className="mt-4 font-black">আপনার পছন্দই গুরুত্বপূর্ণ</p>
                <p className="mt-2 text-sm leading-6 text-[#806d67]">
                  Reference, style ও মাপ অনুযায়ী customised কাজ।
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#302522] px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#463632]"
              >
                💬 WhatsApp-এ কথা বলুন
              </a>

              <a
                href="https://facebook.com/share/19Z3Zoyyqa?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#d8adb4] bg-white px-6 py-3.5 text-sm font-black text-[#9a5661] transition hover:-translate-y-0.5 hover:bg-[#fff1f2]"
              >
                f Facebook Page দেখুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="border-y border-[#eadbd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a65c67]">
                Customer Reviews
              </p>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                আমাদের গ্রাহকদের ভালোবাসা ❤️
              </h2>
              <p className="mt-4 max-w-2xl leading-8 text-[#806d67]">
                আপনার experience, rating এবং চাইলে নিজের photo-ও share করুন।
                Photo দেওয়া সম্পূর্ণ optional।
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="rounded-3xl bg-[#fff5f5] px-6 py-4 text-center">
                <div className="text-2xl font-black">{averageRating.toFixed(1)} / 5</div>
                <Stars rating={Math.round(averageRating)} />
                <div className="mt-1 text-xs text-[#806d67]">
                  {reviews.length} approved review{reviews.length > 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <form
              onSubmit={submitReview}
              className="rounded-[2rem] border border-[#eadbd5] bg-[#fffaf8] p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black">আপনার Review দিন</h3>
                  <p className="mt-2 text-sm leading-6 text-[#806d67]">
                    Star + comment দিন। Photo চাইলে দিতে পারেন, না দিলেও review প্রকাশ হবে।
                  </p>
                </div>
                <span className="rounded-full bg-[#f2d8da] px-3 py-1 text-xs font-bold text-[#9a5661]">
                  Optional Photo
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold">নাম *</span>
                  <input
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#e2d2cc] bg-white px-4 py-3 outline-none transition focus:border-[#a65c67]"
                    placeholder="আপনার নাম"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">Phone <span className="font-normal text-[#927b75]">(optional)</span></span>
                  <input
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#e2d2cc] bg-white px-4 py-3 outline-none transition focus:border-[#a65c67]"
                    placeholder="Phone number"
                    inputMode="tel"
                  />
                </label>
              </div>

              <div className="mt-5">
                <span className="text-sm font-bold">আপনার Rating *</span>
                <div className="mt-2 flex flex-wrap gap-1 rounded-2xl border border-[#e2d2cc] bg-white p-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl leading-none transition hover:scale-110 ${star <= reviewRating ? "text-[#c98a48]" : "text-[#d8cbc6]"}`}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 self-center text-sm font-bold text-[#806d67]">
                    {reviewRating}/5
                  </span>
                </div>
              </div>

              <label className="mt-5 block">
                <span className="text-sm font-bold">আপনার Comment *</span>
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  className="mt-2 min-h-32 w-full resize-y rounded-2xl border border-[#e2d2cc] bg-white px-4 py-3 outline-none transition focus:border-[#a65c67]"
                  placeholder="ব্লাউজের fitting, design বা service কেমন লেগেছে লিখুন..."
                  required
                />
              </label>

              <div className="mt-5 rounded-2xl border border-dashed border-[#d8c2bc] bg-white p-4">
                <label className="block cursor-pointer">
                  <span className="text-sm font-bold">📷 Photo <span className="font-normal text-[#927b75]">(optional, max 5 MB)</span></span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="mt-3 block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setReviewImage(file);
                      setReviewPreview(file ? URL.createObjectURL(file) : "");
                    }}
                  />
                </label>
                {reviewPreview && (
                  <img src={reviewPreview} alt="Review preview" className="mt-4 h-28 w-28 rounded-2xl object-cover" />
                )}
              </div>

              {reviewMessage && (
                <div className="mt-4 rounded-2xl bg-[#f7ebe8] px-4 py-3 text-sm leading-6 text-[#604f4a]">
                  {reviewMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="mt-5 w-full rounded-full bg-[#302522] px-6 py-4 text-sm font-black text-white transition hover:bg-[#463632] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewSubmitting ? "Review পাঠানো হচ্ছে..." : "⭐ Review Submit করুন"}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-[#927b75]">
                আপনার phone number website-এ public দেখানো হবে না। Review আগে Admin approve করবেন।
              </p>
            </form>

            <div>
              {reviews.length === 0 ? (
                <div className="flex min-h-full items-center justify-center rounded-[2rem] border border-dashed border-[#d9c3bd] bg-[#fffaf7] p-10 text-center">
                  <div>
                    <div className="text-4xl tracking-widest text-[#c98a48]">★★★★★</div>
                    <h3 className="mt-5 text-xl font-black">প্রথম review-এর অপেক্ষায় ❤️</h3>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#806d67]">
                      Customer review approve হলে এখানে Star, Comment এবং customer photo দেখা যাবে। Photo না থাকলে শুধু Star + Comment + Name দেখা যাবে।
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {reviews.slice(0, 6).map((review) => (
                    <article key={review.id} className="overflow-hidden rounded-[2rem] border border-[#eadbd5] bg-[#fffaf8] shadow-sm">
                      {review.image_url && (
                        <div className="aspect-[4/3] overflow-hidden bg-[#f4ebe8]">
                          <img src={review.image_url} alt={`${review.name} customer review`} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <Stars rating={review.rating} />
                        <p className="mt-4 text-sm leading-7 text-[#604f4a]">“{review.body}”</p>
                        <div className="mt-6 border-t border-[#eadbd5] pt-4">
                          <p className="font-black">{review.name}</p>
                          <p className="mt-1 text-xs text-[#927b75]">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Posts are managed from Admin Panel only. */}

      {/* CTA / Contact */}
      <section id="contact" className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f2d8da] via-[#f7e8e4] to-[#f1dccb] shadow-[0_25px_80px_rgba(70,40,35,0.12)]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a65c67]">
                যোগাযোগ করুন
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                আপনার পছন্দের ব্লাউজ নিয়ে আজই কথা বলি।
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-[#725f59]">
                Design reference, আপনার প্রয়োজন বা অর্ডারের বিষয়ে জানতে
                সরাসরি WhatsApp-এ message করুন।
              </p>

              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-[#a65c67] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#a65c67]/20 transition hover:-translate-y-1 hover:bg-[#914f5a]"
              >
                💬 WhatsApp-এ মেসেজ করুন
              </a>
            </div>

            <div className="bg-[#302522] p-8 text-white sm:p-12 lg:p-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6aaaF]">
                  Location
                </p>
                <h3 className="mt-3 text-2xl font-black">📍 পিরোজপুর, বনগাঁ</h3>
                <p className="mt-2 text-sm text-[#cbbab5]">West Bengal, India</p>
              </div>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6aaaF]">
                  WhatsApp
                </p>
                <p className="mt-3 text-2xl font-black">+91 90469 65501</p>
              </div>

              <a
                href="https://maps.app.goo.gl/QS4GoSDMTXqXbB7X7?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
              >
                🗺️ Google Maps-এ Location দেখুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eadbd5] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-lg font-black">
              Doli&apos;s <span className="text-[#a65c67]">Boutique</span>
            </p>
            <p className="mt-1 text-xs text-[#806d67]">
              Customised Blouse Making • Pirojpur, Bongaon
            </p>
          </div>

          <div className="text-left text-xs text-[#927b75] sm:text-right">
            <p>© {new Date().getFullYear()} Doli&apos;s Boutique</p>
            <p className="mt-1">Made with care for every blouse.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={whatsappLink(orderMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-[0_12px_35px_rgba(37,211,102,0.35)] transition hover:scale-110"
      >
        💬
      </a>
    </main>
  );
}
