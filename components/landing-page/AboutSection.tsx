import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <span className="font-mono text-orange-500 text-sm tracking-widest uppercase mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-af-text dark:text-white font-bold mb-6 leading-tight">
              Crafting Spaces,{' '}
              <span className="text-orange-500 italic">Creating Memories</span>
            </h2>
            <p className="text-lg text-af-text-secondary dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AFhome was born from a simple belief: everyone deserves a home that reflects their personality and inspires their daily life.
              Founded in 2009, we've grown from a small showroom into a destination for thoughtfully designed furniture.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display text-3xl md:text-4xl text-af-text dark:text-white font-bold mb-4">
                    Our Philosophy
                  </h3>
                  <p className="text-af-text-secondary dark:text-gray-400 leading-relaxed">
                    We partner with skilled artisans and sustainable manufacturers worldwide to bring you pieces that combine timeless aesthetics with exceptional comfort.
                    Every item in our collection is curated with intention—designed to last and meant to be loved.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-3xl md:text-4xl text-af-text dark:text-white font-bold mb-4">
                    Our Promise
                  </h3>
                  <p className="text-af-text-secondary dark:text-gray-400 leading-relaxed">
                    From the first sketch to the final delivery, we're committed to creating an experience that makes turning your house into a home both effortless and enjoyable.
                    Quality craftsmanship, sustainable materials, and exceptional service are at the heart of everything we do.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-500/10 dark:shadow-gray-700/20"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
                alt="Living space showcase"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="font-display text-2xl font-bold mb-2 block">
                  15+ Years
                </span>
                <span className="text-lg font-semibold">
                  of Excellence
                </span>
              </div>
            </motion.div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '🎨',
                title: 'Design',
                desc: 'Timeless Aesthetics',
                color: 'text-orange-400'
              },
              {
                icon: '⭐',
                title: 'Quality',
                desc: 'Premium Materials',
                color: 'text-blue-400'
              },
              {
                icon: '👢',
                title: 'Service',
                desc: 'White Glove Care',
                color: 'text-green-400'
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">
                  {item.icon}
                </div>
                <h4 className={`font-display text-xl font-bold mb-2 ${item.color}`}>
                  {item.title}
                </h4>
                <p className="text-af-text-secondary dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="font-display text-3xl md:text-4xl text-af-text dark:text-white font-bold mb-4">
              Ready to Transform Your Space?
            </h3>
            <p className="text-af-text-secondary dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Visit our showroom or explore our collection online to find the perfect pieces for your home.
            </p>
            <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all duration-300">
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

