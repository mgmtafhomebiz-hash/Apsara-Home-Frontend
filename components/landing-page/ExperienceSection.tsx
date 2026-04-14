'use client';

import { motion } from 'framer-motion';

const experiences = [
  {
    title: 'Comfort',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    description: 'Living room setup',
  },
  {
    title: 'Function',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    description: 'Small condo space',
  },
  {
    title: 'Everyday Living',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    description: 'Bedroom setup',
  },
  {
    title: 'Gathering',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    description: 'Dining room setup',
  },
];

const highlights = [
  'Products designed for real Filipino homes',
  'Styles for condos, houses, offices, and families',
  'Quality materials at factory-direct prices',
  'Solutions people actually use every day',
];

export default function ExperienceSection() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-[#fbf7f2] via-white to-[#f7f2eb] dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/10" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 rounded-[32px] border border-orange-100/80 bg-white/80 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-10 lg:max-w-xl"
          >
            <span className="mb-4 block font-mono text-sm uppercase tracking-[0.28em] text-orange-500 dark:text-orange-400">
              Experience
            </span>
            <h2 className="mb-6 font-display text-3xl font-medium leading-tight text-gray-900 dark:text-white md:text-5xl">
              More Than Products.{' '}
              <span className="italic text-blue-600 dark:text-blue-400">
                A Better Home Experience.
              </span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-400">
              As an AF Home Affiliate, you don&apos;t just promote furniture.
              You help people create better living spaces - homes that feel
              comfortable, functional, and inspiring.
            </p>

            <ul className="grid gap-3">
              {highlights.map((highlight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 font-medium text-gray-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                >
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  {highlight}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="w-full flex-1">
            <div className="grid h-auto grid-cols-1 gap-4 sm:grid-cols-2 md:h-[600px]">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group relative h-64 overflow-hidden rounded-3xl border border-white/70 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-black/5 md:h-full dark:border-white/10 dark:ring-white/10"
                >
                  <img
                    src={exp.image}
                    alt={exp.description}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent transition-colors group-hover:from-black/45 group-hover:via-black/20" />
                  <div className="absolute bottom-6 left-6">
                    <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 font-display text-lg tracking-wide text-white backdrop-blur-md">
                      {exp.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
