import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPinned,
  BookOpen,
  HeartHandshake,
  MonitorPlay,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function MamekamPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[#f4b544]/20 blur-3xl" />

        <div className="absolute bottom-[-10rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#ffdf8c]/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,196,72,0.08),transparent_45%)]" />

        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f4b544]/10 border border-[#f4b544]/20 text-[#ffd36b] px-5 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-xl">
              <Sparkles className="w-4 h-4" />
              Adhik Maas Special Course
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd36b] to-[#f4b544]">
                māmekam
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-[#d8d4ca] leading-relaxed max-w-2xl">
              A sacred one-month spiritual journey by ISKCON Abids,
              Hyderabad — dedicated to devotion, learning, prayer,
              and transformation during the auspicious Adhik Maas.
            </p>

            {/* Bhagavad Gita Quote */}
            <div
              className="
              mt-8
              rounded-[2rem]
              bg-white/[0.04]
              border border-[#f4b544]/10
              backdrop-blur-xl
              shadow-[0_0_40px_rgba(255,190,60,0.06)]
              p-6
            "
            >
              <p className="italic text-[#f5efe2] text-lg leading-relaxed">
                “Abandon all varieties of religion and just surrender unto Me.
                I shall deliver you from all sinful reactions. Do not fear.”
              </p>

              <p className="mt-4 text-[#ffd36b] font-medium">
                — Bhagavad Gita 18.66
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="https://tinyurl.com/mamekam"
                target="_blank"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl
                  px-7 py-4
                  bg-gradient-to-r
                  from-[#f4b544]
                  to-[#ffcc67]
                  text-[#1b1405]
                  font-semibold
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  shadow-lg
                  shadow-yellow-500/20
                "
              >
                Register Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="#details"
                className="
                  inline-flex items-center justify-center
                  rounded-2xl
                  px-7 py-4
                  bg-white/[0.04]
                  border border-[#f4b544]/10
                  text-white
                  hover:border-[#f4b544]/30
                  transition-all
                  duration-300
                "
              >
                Explore Details
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-yellow-300/10 blur-3xl scale-110" />

            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,215,120,0.25),transparent_70%)]" />

            <div
              className="
              relative
              rounded-[2.5rem]
              overflow-hidden
              border border-[#f4b544]/20
              shadow-[0_0_60px_rgba(255,190,60,0.15)]
            "
            >
              <Image
                src="/images/mamekam-hero.png"
                alt="Lord Narasimha and Prahlada"
                width={650}
                height={650}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section
        id="details"
        className="relative z-10 py-20 px-6 lg:px-10"
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#f4b544]/10 border border-[#f4b544]/20 text-[#ffd36b] px-5 py-2 rounded-full mb-6 backdrop-blur-xl">
              🌸 Sacred Opportunity 🌸
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd36b] to-[#f4b544]">
                Adhik Maas Special – Free Course
              </span>
            </h2>

            <p className="mt-6 text-lg text-[#d8d4ca] max-w-3xl mx-auto leading-relaxed">
              This sacred month is a rare opportunity to deepen spiritual life,
              nourish devotion, and engage in meaningful association through
              daily learning and seva.
            </p>
          </div>

          {/* Date & Time Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Dates */}
            <div
              className="
                rounded-[2rem]
                bg-white/[0.04]
                border border-[#f4b544]/10
                backdrop-blur-xl
                shadow-[0_0_40px_rgba(255,190,60,0.06)]
                p-7
              "
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-[#f4b544]/10 text-[#ffd36b]">
                  <CalendarDays className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Program Dates</h3>
                  <p className="text-[#d8d4ca]">May 17 – June 15</p>
                </div>
              </div>

              <p className="text-[#bdb7aa] leading-relaxed">
                A special one-month devotional course during Adhik Maas,
                designed for spiritual growth and Krishna consciousness.
              </p>
            </div>

            {/* Time */}
            <div
              className="
                rounded-[2rem]
                bg-white/[0.04]
                border border-[#f4b544]/10
                backdrop-blur-xl
                shadow-[0_0_40px_rgba(255,190,60,0.06)]
                p-7
              "
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-[#f4b544]/10 text-[#ffd36b]">
                  <Clock3 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Daily Timings</h3>
                  <p className="text-[#d8d4ca]">
                    8:30 – 9:00 PM (Online)
                  </p>
                </div>
              </div>

              <p className="text-[#bdb7aa] leading-relaxed">
                Short and focused daily sessions that easily fit into your
                routine while helping maintain consistent spiritual practice.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div
            className="
              rounded-[2.5rem]
              bg-white/[0.04]
              border border-[#f4b544]/10
              backdrop-blur-xl
              shadow-[0_0_40px_rgba(255,190,60,0.06)]
              p-8 md:p-10
            "
          >
            <h3 className="text-3xl font-bold mb-8 text-[#ffd36b]">
              ✨ Program Highlights ✨
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: "Prahlada’s Timeless Prayers",
                  desc: "Learn powerful prayers and reflections from Prahlada Maharaj.",
                },
                {
                  icon: <Clock3 className="w-5 h-5" />,
                  title: "Daily Short Sessions",
                  desc: "Simple and uplifting daily spiritual discussions.",
                },
                {
                  icon: <MapPinned className="w-5 h-5" />,
                  title: "Ahobilam Spiritual Tour",
                  desc: "Optional devotional tour scheduled on June 13–14.",
                },
                {
                  icon: <HeartHandshake className="w-5 h-5" />,
                  title: "Temple Seva Opportunities",
                  desc: "Participate in meaningful devotional service.",
                },
                {
                  icon: <MonitorPlay className="w-5 h-5" />,
                  title: "Easy Online Access",
                  desc: "Attend from anywhere through online sessions.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="
                    rounded-2xl
                    bg-[#ffffff03]
                    border border-[#f4b544]/10
                    p-5
                    hover:border-[#f4b544]/30
                    transition-all
                    duration-300
                    flex gap-4
                    items-start
                  "
                >
                  <div className="p-3 rounded-xl bg-[#f4b544]/10 text-[#ffd36b]">
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      {item.title}
                    </h4>

                    <p className="text-[#bdb7aa] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="
              mt-16
              text-center
              rounded-[2.5rem]
              border border-[#f4b544]/20
              bg-gradient-to-r
              from-[#f4b544]/10
              to-[#ffdf8c]/5
              p-10
            "
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              🌿 Make this Adhik Maas truly transformative 🌿
            </h3>

            <p className="text-lg text-[#d8d4ca] max-w-2xl mx-auto leading-relaxed mb-8">
              Join devotees from different places in this beautiful journey of
              learning, remembrance, prayer, and seva.
            </p>

            <Link
              href="https://tinyurl.com/mamekam"
              target="_blank"
              className="
                inline-flex items-center gap-2
                rounded-2xl
                px-8 py-4
                bg-gradient-to-r
                from-[#f4b544]
                to-[#ffcc67]
                text-[#1b1405]
                font-semibold
                hover:scale-[1.02]
                transition-all
                duration-300
                shadow-lg
                shadow-yellow-500/20
              "
            >
              Register Here
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-8 text-[#bdb7aa] text-sm space-y-1">
              <p>ISKCON Abids, Hyderabad</p>
              <p>ibsc.iskconabids@gmail.com</p>
              <p>+91-8074234585</p>
              <p>www.myKrishnaTouch.in</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}