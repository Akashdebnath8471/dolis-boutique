const WHATSAPP = "9046965501";

const designs = [
  {
    image: "/images/blouse 1.jpg",
    title: "এলিগ্যান্ট ব্লাউজ",
    subtitle: "সুন্দর ফিনিশিং ও নিখুঁত ফিটিং",
  },
  {
    image: "/images/blouse 2.jpg",
    title: "ডিজাইনার ব্লাউজ",
    subtitle: "আপনার পছন্দ অনুযায়ী কাস্টম ডিজাইন",
  },
  {
    image: "/images/blouse 3.jpg",
    title: "পার্টি ওয়্যার",
    subtitle: "বিশেষ দিনের জন্য আকর্ষণীয় ডিজাইন",
  },
  {
    image: "/images/blouse 4.jpg",
    title: "ট্র্যাডিশনাল ডিজাইন",
    subtitle: "ঐতিহ্যবাহী সৌন্দর্যের সঙ্গে আধুনিক ফিনিশিং",
  },
];

function whatsappLink(message: string) {
  return `https://wa.me/91${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const orderMessage =
    "নমস্কার Doli's Boutique 🌸\nআমি একটি কাস্টমাইজড ব্লাউজ তৈরি করাতে চাই।\nদয়া করে ডিজাইন ও অর্ডারের বিষয়ে আমাকে সাহায্য করুন।";

  return (
    <main className="min-h-screen bg-[#fffaf7] text-[#302522]">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-[#eadbd5] bg-[#fffaf7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <a href="#home" className="group">
            <div className="text-xl font-bold tracking-tight sm:text-2xl">
              Doli&apos;s <span className="text-[#a65c67]">Boutique</span>
            </div>
            <div className="mt-0.5 text-[10px] tracking-[0.25em] text-[#927b75]">
              CUSTOM BLOUSE STUDIO
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#home" className="transition hover:text-[#a65c67]">
              হোম
            </a>
            <a href="#designs" className="transition hover:text-[#a65c67]">
              ডিজাইন
            </a>
            <a href="#services" className="transition hover:text-[#a65c67]">
              পরিষেবা
            </a>
            <a href="#about" className="transition hover:text-[#a65c67]">
              আমাদের সম্পর্কে
            </a>
            <a href="#contact" className="transition hover:text-[#a65c67]">
              যোগাযোগ
            </a>
          </nav>

          <a
            href={whatsappLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#a65c67] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#914f5a]"
          >
            WhatsApp-এ অর্ডার
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

          <div>
            <div className="mb-5 inline-flex rounded-full border border-[#e7c9ce] bg-[#fff0f1] px-4 py-2 text-xs font-semibold tracking-wider text-[#9a5661]">
              ✦ পিরোজপুর, বনগাঁ
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              আপনার পছন্দের
              <span className="block text-[#a65c67]">
                ব্লাউজ, আপনার মাপেই।
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#725f59] sm:text-lg">
              সুন্দর ডিজাইন, নিখুঁত ফিটিং এবং যত্নসহকারে তৈরি করা
              কাস্টমাইজড ব্লাউজ। আপনার শাড়ি, আপনার স্টাইল এবং আপনার
              পছন্দ অনুযায়ী প্রতিটি ব্লাউজ তৈরি করা হয়।
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="#designs"
                className="rounded-full bg-[#302522] px-7 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#463632]"
              >
                আমাদের ডিজাইন দেখুন →
              </a>

              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#c8959d] bg-white px-7 py-4 text-center text-sm font-semibold text-[#9a5661] transition hover:bg-[#fff0f1]"
              >
                WhatsApp-এ যোগাযোগ করুন
              </a>

            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-[#76635e]">
              <div>
                <span className="font-bold text-[#302522]">✓</span>{" "}
                কাস্টম ডিজাইন
              </div>
              <div>
                <span className="font-bold text-[#302522]">✓</span>{" "}
                নিখুঁত ফিটিং
              </div>
              <div>
                <span className="font-bold text-[#302522]">✓</span>{" "}
                যত্নসহকারে তৈরি
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[3rem] bg-[#f4dfe0] opacity-60 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-[#ead8d3] bg-white p-3 shadow-[0_25px_70px_rgba(80,45,40,0.12)]">
              <div className="grid grid-cols-2 gap-3">

                <div className="overflow-hidden rounded-[1.5rem]">
                  <img
                    src="/images/blouse 1.jpg"
                    alt="Doli's Boutique blouse design"
                    className="h-72 w-full object-cover transition duration-700 hover:scale-105 sm:h-80"
                  />
                </div>

                <div className="mt-10 overflow-hidden rounded-[1.5rem]">
                  <img
                    src="/images/blouse 2.jpg"
                    alt="Doli's Boutique customised blouse"
                    className="h-72 w-full object-cover transition duration-700 hover:scale-105 sm:h-80"
                  />
                </div>

                <div className="-mt-7 overflow-hidden rounded-[1.5rem]">
                  <img
                    src="/images/blouse 3.jpg"
                    alt="Doli's Boutique designer blouse"
                    className="h-64 w-full object-cover transition duration-700 hover:scale-105 sm:h-72"
                  />
                </div>

                <div className="overflow-hidden rounded-[1.5rem]">
                  <img
                    src="/images/blouse 4.jpg"
                    alt="Doli's Boutique traditional blouse"
                    className="h-64 w-full object-cover transition duration-700 hover:scale-105 sm:h-72"
                  />
                </div>

              </div>

              <div className="absolute bottom-7 left-1/2 w-[82%] -translate-x-1/2 rounded-2xl border border-white/60 bg-white/90 p-4 text-center shadow-lg backdrop-blur">
                <p className="text-sm font-bold text-[#302522]">
                  ✨ আপনার স্টাইল, আমাদের কারিগরি
                </p>
                <p className="mt-1 text-xs text-[#806b65]">
                  Customised Blouse Making • Pirojpur, Bongaon
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="border-y border-[#eadbd5] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">

          <div className="border-b border-r border-[#eadbd5] p-6 text-center md:border-b-0">
            <div className="text-2xl">🧵</div>
            <p className="mt-2 text-sm font-semibold">কাস্টমাইজড তৈরি</p>
            <p className="mt-1 text-xs text-[#806d67]">আপনার পছন্দ অনুযায়ী</p>
          </div>

          <div className="border-b border-[#eadbd5] p-6 text-center md:border-b-0 md:border-r">
            <div className="text-2xl">📏</div>
            <p className="mt-2 text-sm font-semibold">পারফেক্ট ফিটিং</p>
            <p className="mt-1 text-xs text-[#806d67]">আপনার মাপ অনুযায়ী</p>
          </div>

          <div className="border-r border-[#eadbd5] p-6 text-center">
            <div className="text-2xl">✨</div>
            <p className="mt-2 text-sm font-semibold">নিট ফিনিশিং</p>
            <p className="mt-1 text-xs text-[#806d67]">যত্নসহকারে তৈরি</p>
          </div>

          <div className="p-6 text-center">
            <div className="text-2xl">💬</div>
            <p className="mt-2 text-sm font-semibold">সহজে অর্ডার</p>
            <p className="mt-1 text-xs text-[#806d67]">WhatsApp-এর মাধ্যমে</p>
          </div>

        </div>
      </section>

      {/* ================= DESIGNS ================= */}
      <section id="designs" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a65c67]">
              আমাদের কাজ
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              কিছু সুন্দর ব্লাউজ ডিজাইন
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#806d67]">
              আমাদের তৈরি কিছু ব্লাউজের নমুনা। আপনার পছন্দের ডিজাইন
              দেখে নিজের মতো করে কাস্টমাইজ করাতে পারেন।
            </p>
          </div>

          <a
            href={whatsappLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#a65c67] hover:underline"
          >
            ডিজাইন নিয়ে কথা বলুন →
          </a>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {designs.map((design) => (
            <div
              key={design.image}
              className="group overflow-hidden rounded-3xl border border-[#eadbd5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#f5ece9]">
                <img
                  src={design.image}
                  alt={design.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold">{design.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#806d67]">
                  {design.subtitle}
                </p>

                <a
                  href={whatsappLink(
                    `নমস্কার Doli's Boutique 🌸\nআমি "${design.title}"-এর মতো একটি ব্লাউজ তৈরি করাতে চাই।`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-[#a65c67]"
                >
                  এই ডিজাইন নিয়ে জানতে চাই →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="bg-[#302522] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e7b8bd]">
              আমাদের পরিষেবা
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              আপনার প্রয়োজন অনুযায়ী ব্লাউজ
            </h2>

            <p className="mt-4 leading-7 text-[#d8c8c3]">
              প্রতিটি অর্ডার আলাদা। তাই আপনার মাপ, পছন্দের ডিজাইন এবং
              প্রয়োজন অনুযায়ী ব্লাউজ তৈরির চেষ্টা করা হয়।
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[
              ["01", "কাস্টম ডিজাইন", "আপনার পছন্দের ছবি বা ডিজাইন দেখে ব্লাউজ তৈরি।"],
              ["02", "পারফেক্ট ফিটিং", "আপনার মাপ অনুযায়ী যত্নসহকারে তৈরি করা হয়।"],
              ["03", "পার্টি ও ফেস্টিভ", "পুজো, বিয়ে ও বিশেষ অনুষ্ঠানের জন্য ডিজাইন।"],
              ["04", "ট্র্যাডিশনাল", "শাড়ির সঙ্গে মানানসই সুন্দর ট্র্যাডিশনাল ডিজাইন।"],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 transition hover:bg-white/[0.1]"
              >
                <span className="text-sm text-[#e7b8bd]">{number}</span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#d1c1bc]">
                  {description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

          <div className="rounded-[2rem] bg-[#f3e0e1] p-8 sm:p-12">
            <div className="text-6xl">🪡</div>

            <p className="mt-8 text-sm font-semibold tracking-widest text-[#a65c67]">
              DOLI&apos;S BOUTIQUE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              ছোট্ট উদ্যোগ,
              <br />
              ভালোবাসা দিয়ে তৈরি।
            </h2>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a65c67]">
              আমাদের সম্পর্কে
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              আপনার পছন্দকে সুন্দরভাবে ফুটিয়ে তোলাই আমাদের লক্ষ্য।
            </h2>

            <p className="mt-6 leading-8 text-[#725f59]">
              Doli&apos;s Boutique হলো পিরোজপুর, বনগাঁ-র একটি home-based
              boutique, যেখানে আপনার পছন্দ, মাপ এবং ডিজাইন অনুযায়ী
              customised blouse তৈরি করা হয়।
            </p>

            <p className="mt-4 leading-8 text-[#725f59]">
              আপনি চাইলে নিজের পছন্দের blouse-এর ছবি বা design reference
              WhatsApp-এ পাঠাতে পারেন। অর্ডারের আগে ডিজাইন, মাপ এবং
              প্রয়োজনীয় বিষয় নিয়ে আলোচনা করা যাবে।
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#eadbd5] bg-white p-5">
                <p className="text-2xl">❤️</p>
                <p className="mt-3 font-bold">যত্নসহকারে তৈরি</p>
                <p className="mt-2 text-sm text-[#806d67]">
                  প্রতিটি কাজের প্রতি ব্যক্তিগত যত্ন।
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadbd5] bg-white p-5">
                <p className="text-2xl">✨</p>
                <p className="mt-3 font-bold">আপনার পছন্দই গুরুত্বপূর্ণ</p>
                <p className="mt-2 text-sm text-[#806d67]">
                  আপনার design ও style অনুযায়ী কাজ।
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= REVIEWS PLACEHOLDER ================= */}
      <section className="border-y border-[#eadbd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a65c67]">
            Customer Reviews
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            আমাদের গ্রাহকদের ভালোবাসা ❤️
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806d67]">
            খুব শীঘ্রই এখানে আমাদের customers-এর real review এবং
            rating দেখা যাবে।
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-dashed border-[#d9c3bd] bg-[#fffaf7] p-8">
            <div className="text-3xl tracking-widest">★★★★★</div>
            <p className="mt-4 text-sm text-[#806d67]">
              আপনার অভিজ্ঞতাও আমাদের সঙ্গে share করুন।
            </p>
          </div>

        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="overflow-hidden rounded-[2rem] bg-[#f2dedf]">

          <div className="grid lg:grid-cols-2">

            <div className="p-8 sm:p-12 lg:p-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a65c67]">
                যোগাযোগ করুন
              </p>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                আপনার পছন্দের ব্লাউজ নিয়ে কথা বলি।
              </h2>

              <p className="mt-5 leading-8 text-[#725f59]">
                ডিজাইনের ছবি, আপনার প্রয়োজন বা অর্ডারের বিষয়ে জানতে
                WhatsApp-এ আমাদের সঙ্গে যোগাযোগ করুন।
              </p>

              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-[#a65c67] px-7 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#914f5a]"
              >
                💬 WhatsApp-এ মেসেজ করুন
              </a>
            </div>

            <div className="bg-[#302522] p-8 text-white sm:p-12 lg:p-16">

              <div>
                <p className="text-sm text-[#d6aaaF]">📍 Location</p>
                <h3 className="mt-2 text-xl font-bold">
                  পিরোজপুর, বনগাঁ
                </h3>
                <p className="mt-2 text-sm text-[#cbbab5]">
                  West Bengal, India
                </p>
              </div>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-sm text-[#d6aaaF]">📱 WhatsApp</p>
                <p className="mt-2 text-xl font-semibold">
                  +91 90469 65501
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Pirojpur%2C+Bongaon%2C+West%20Bengal"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-block rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                🗺️ Google Maps-এ Location দেখুন
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#eadbd5] bg-[#fffaf7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>
            <p className="font-bold">
              Doli&apos;s <span className="text-[#a65c67]">Boutique</span>
            </p>
            <p className="mt-1 text-xs text-[#806d67]">
              Customised Blouse Making • Pirojpur, Bongaon
            </p>
          </div>

          <p className="text-xs text-[#927b75]">
            © {new Date().getFullYear()} Doli&apos;s Boutique. All rights reserved.
          </p>

        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={whatsappLink(orderMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-xl transition hover:scale-105"
      >
        💬
      </a>

    </main>
  );
}