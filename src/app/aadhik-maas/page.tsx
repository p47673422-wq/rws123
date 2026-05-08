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
    <main className="min-h-screen bg-[#07152f] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative isolate">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1f4a] via-[#091733] to-[#030712]" />

        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Adhik Maas Special Course
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-orange-400">māmekam</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
              A sacred one‑month spiritual journey by ISKCON Abids,
              Hyderabad — dedicated to devotion, learning, prayer,
              and transformation during the auspicious Adhik Maas.
            </p>

            <div className="mt-8 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="italic text-gray-200 text-lg leading-relaxed">
                “Abandon all varieties of religion and just surrender unto Me.
                I shall deliver you from all sinful reactions. Do not fear.”
              </p>
              <p className="mt-3 text-orange-300 font-medium">
                — Bhagavad Gita 18.66
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="https://tinyurl.com/mamekam"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all duration-300 px-7 py-4 text-lg font-semibold shadow-lg shadow-orange-500/20"
              >
                Register Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="#details"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 hover:border-orange-400/40 bg-white/5 hover:bg-white/10 transition-all duration-300 px-7 py-4 text-lg font-medium"
              >
                Explore Details
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />

            <div className="relative rounded-[2rem] overflow-hidden border-4 border-orange-400/30 shadow-2xl shadow-orange-500/20 bg-white/5 backdrop-blur-md">
              <Image
                src="/images/am.png"
                alt="Mamekam Adhik Maas Course"
                width={650}
                height={650}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section
        id="details"
        className="relative py-20 px-6 lg:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-300 border border-orange-400/20 px-4 py-2 rounded-full mb-5">
              🌸 Sacred Opportunity 🌸
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              Adhik Maas Special – Free Course
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              This sacred month is a rare opportunity to deepen spiritual life,
              nourish devotion, and engage in meaningful association through
              daily learning and seva.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-7 backdrop-blur-md hover:border-orange-400/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-300">
                  <CalendarDays className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Program Dates</h3>
                  <p className="text-gray-300">May 17 – June 15</p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed">
                A special one‑month devotional course during Adhik Maas,
                designed for spiritual growth and Krishna consciousness.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-7 backdrop-blur-md hover:border-orange-400/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-300">
                  <Clock3 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Daily Timings</h3>
                  <p className="text-gray-300">8:30 – 9:00 PM (Online)</p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed">
                Short and focused daily sessions that easily fit into your
                routine while helping maintain consistent spiritual practice.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-8 md:p-10 backdrop-blur-md">
            <h3 className="text-3xl font-bold mb-8 text-orange-300">
              ✨ Program Highlights ✨
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start rounded-2xl bg-white/5 p-5 border border-white/5 hover:border-orange-400/20 transition-all duration-300">
                <div className="p-3 rounded-xl bg-orange-500/15 text-orange-300">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Prahlada’s Timeless Prayers
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Learn powerful prayers and reflections from Prahlada Maharaj
                    that inspire devotion, courage, and surrender.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start rounded-2xl bg-white/5 p-5 border border-white/5 hover:border-orange-400/20 transition-all duration-300">
                <div className="p-3 rounded-xl bg-orange-500/15 text-orange-300">
                  <Clock3 className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Daily Short Sessions
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Engage in simple and uplifting daily discussions and
                    reflections during this sacred month.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start rounded-2xl bg-white/5 p-5 border border-white/5 hover:border-orange-400/20 transition-all duration-300">
                <div className="p-3 rounded-xl bg-orange-500/15 text-orange-300">
                  <MapPinned className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Spiritual Tour to Ahobilam
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Optional paid spiritual tour to Ahobilam scheduled on
                    June 13–14 for deeper devotional experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start rounded-2xl bg-white/5 p-5 border border-white/5 hover:border-orange-400/20 transition-all duration-300">
                <div className="p-3 rounded-xl bg-orange-500/15 text-orange-300">
                  <HeartHandshake className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Temple Seva Opportunities
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Participate in meaningful seva activities and devotional
                    service at the temple.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start rounded-2xl bg-white/5 p-5 border border-white/5 hover:border-orange-400/20 transition-all duration-300 md:col-span-2">
                <div className="p-3 rounded-xl bg-orange-500/15 text-orange-300">
                  <MonitorPlay className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Easy Online Access
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    Attend conveniently from anywhere through daily online
                    sessions and stay connected throughout the course.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center rounded-[2rem] border border-orange-400/20 bg-gradient-to-r from-orange-500/10 to-yellow-400/10 p-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              🌿 Make this Adhik Maas truly transformative 🌿
            </h3>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Join devotees from different places in this beautiful journey of
              learning, remembrance, prayer, and seva.
            </p>

            <Link
              href="https://tinyurl.com/mamekam"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-lg shadow-orange-500/20"
            >
              Register Here
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-8 text-gray-400 text-sm space-y-1">
              <p>ISKCON Abids, Hyderabad</p>
              <p>ibsc.iskconabids@gmail.com</p>
              <p>+91‑8074234585</p>
              <p>www.myKrishnaTouch.in</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}