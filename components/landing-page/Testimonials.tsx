import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'James Dela Cruz',
    role: 'Interior Designer',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKrrwhQ_77kdU7Nn1--i-7HkgF3t1hmGQyDA&s',
    content:
      'The quality of AFhome furniture is exceptional. Every piece I\'ve purchased has exceeded my expectations. Their attention to detail is remarkable.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Kurt Rodriguez',
    role: 'Architect',
    image: 'https://t3.ftcdn.net/jpg/06/69/31/58/360_F_669315870_bzhKwzvSERkba6LsjmNh5FhXDtLtM1TS.jpg',
    content:
      "I've furnished multiple client projects with AFhome pieces. The blend of modern design and craftsmanship is unmatched in this price range.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Chua',
    role: 'Homeowner',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS12Z07ElLrs733vYazzm77ZSTb6qMAG1euQg&s',
    content:
      "Our living room was transformed completely. The velvet sofa became the centerpiece of our home. Delivery and setup were seamless.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 !bg-white dark:!bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white font-semibold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Stories from homeowners and designers who chose AFhome
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              whileHover={{ y: -8 }}
              className="relative bg-stone-50 dark:bg-gray-800 rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-500"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 right-8 w-12 h-12 bg-af-brass rounded-full flex items-center justify-center shadow-soft">
                <Quote size={20} className="text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-af-brass fill-af-brass"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-900 dark:text-gray-200 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-display font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '500+', label: 'Products' },
            { value: '15+', label: 'Years Experience' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="font-display text-4xl md:text-5xl font-bold text-orange-500">
                {stat.value}
              </span>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

