import { motion } from "framer-motion";
import { Armchair, Box, Home, Hammer, Star } from "lucide-react";

const categories = [
  {
    icon: Armchair,
    title: "Furniture",
    description: "Sofas, Beds, Cabinets",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Box,
    title: "Space-Saving Solutions",
    description: "Multifunctional & Compact",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Home,
    title: "Home & Lifestyle",
    description: "Essentials & Decor",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Hammer,
    title: "Interior Services",
    description: "Fit-out & Renovation",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Star,
    title: "Partner Brands",
    description: "Exclusive Collections",
    color: "bg-yellow-100 text-yellow-600",
  },
];

const brands = [
  { name: "Afforda Home", logo: "/Images/landing/affordahome.png" },
  { name: "Astro Foam", logo: "/Images/landing/astro-foam.png" },
  { name: "Hyundai Home", logo: "/Images/landing/hyundai-home.png" },
  { name: "Sunnyware", logo: "/Images/landing/sunnyware.png" },
  { name: "Turtle Wax", logo: "/Images/landing/turtle-wax.png" },
  { name: "Xiaomi", logo: "/Images/landing/xiaomi.png" },
  { name: "Zooey", logo: "/Images/landing/zooey.png" },
  { name: "Mr. Chuck", logo: "/Images/landing/mrchuck.png" },
  { name: "Easy Space", logo: "/Images/landing/easy-space.png" },
  { name: "Furnigo", logo: "/Images/landing/furnigo.png" },
  { name: "Beanio", logo: "/Images/landing/beani-mnl.png" },
  { name: "Pica Pillow", logo: "/Images/landing/pica-pillow.png" },
  { name: "AirPro", logo: "/Images/landing/airpro.png" },
];

export default function ProductsBrandsSection() {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden bg-gradient-to-b from-[#fbf7f2] via-white to-[#f8f3ec] py-24 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/10" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-block rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 shadow-sm dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300"
          >
            PRODUCTS & BRANDS ECOSYSTEM
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl"
          >
            One Ecosystem. <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Many Trusted Home Brands.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl leading-relaxed text-gray-700 dark:text-gray-400"
          >
            AF Home brings together furniture, home essentials, and interior
            solutions under one affiliate-friendly platform, giving you more
            ways to earn.
          </motion.p>
        </div>

        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
          >
            Trusted by Top Brands
          </motion.p>

          <div className="grid grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex h-16 w-32 items-center justify-center rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 md:w-36"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-20 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex h-full flex-col items-center justify-center rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
            >
              <div
                className={`mb-4 rounded-2xl p-4 ${cat.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <cat.icon size={32} />
              </div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {cat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
