import Image from 'next/image';
import LegalPageShell from '@/components/legal/LegalPageShell';

const stats = [
  { value: '12+ years', label: 'Designing homes with purpose' },
  { value: '100k+', label: 'Happy customers nationwide' },
  { value: '4.9/5', label: 'Average customer satisfaction' },
];

const values = [
  {
    title: 'QUALITY',
    subtitle: 'Materials that last',
    text: 'Solid construction, reliable finishes, and testing standards that keep your home looking great over time.',
  },
  {
    title: 'DESIGN',
    subtitle: 'Modern, warm, livable',
    text: 'Balanced silhouettes and curated tones that elevate the space without overwhelming it.',
  },
  {
    title: 'CARE',
    subtitle: 'People-first service',
    text: 'From choosing the right piece to post-delivery support, we’re here to help you feel at home.',
  },
];

export default function AboutUsPage() {
  return (
    <LegalPageShell
      title="About Us"
      subtitle="Crafted Living. Design-forward spaces, built for everyday joy."
    >
      <p>
        We create furniture and home essentials that balance form, comfort, and lasting quality. Thoughtful details,
        honest materials, and a service mindset you can feel.
      </p>

      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <Image
          src="/Images/abs.png"
          alt="AF Home crafted living showcase"
          width={1200}
          height={700}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div>
        <h2 id="about" className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          About AF Home
        </h2>
        <p>
          Welcome to AF Home - Your Ultimate Destination for Quality Furniture and Home Products! At AF Home, we take
          pride in bringing you the finest selection of home furniture made in the Philippines. Our mission is to
          provide you with furniture that not only offers unmatched comfort but also adds a touch of style to your
          living spaces.
        </p>
        <p>
          We understand that your home is your sanctuary, a place where memories are made and cherished. That&apos;s
          why we go the extra mile to curate a diverse range of furniture that caters to various tastes and
          preferences. Whether you&apos;re seeking a cozy sofa for your living room, a sturdy dining table for family
          gatherings, or a luxurious bed to rest and rejuvenate, we have it all.
        </p>
        <p>
          Our commitment to quality is unwavering. Each piece of furniture we offer is crafted with precision and
          attention to detail, using only the finest materials available. Our artisans pour their heart and soul into
          creating furniture that not only stands the test of time but also becomes an integral part of your home&apos;s
          story.
        </p>
        <p>
          But that&apos;s not all! We also bring you a wide selection of home appliances to make your life easier and
          more convenient. From kitchen essentials to smart home devices, we have everything you need to transform your
          house into a haven of functionality.
        </p>
        <p>
          Customer satisfaction is at the core of everything we do. Our knowledgeable and friendly team is always here
          to assist you in finding the perfect furniture and home products that align with your vision. We believe that
          creating a beautiful home should be an enjoyable and stress-free experience, and we&apos;re dedicated to
          making that a reality for you.
        </p>
        <p>
          Join the AF Home family today and let us help you turn your house into a place you&apos;ll never want to
          leave. Explore our collection, experience comfort and style like never before, and discover the joy of a
          truly remarkable home.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((item) => (
          <div
            key={item.value}
            className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50/70 dark:bg-gray-900/60"
          >
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">What We Stand For</h2>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Values</h3>
        <div className="space-y-4">
          {values.map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="font-semibold tracking-wide text-gray-900 dark:text-white">{item.title}</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{item.subtitle}</p>
              <p className="text-gray-600 dark:text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </LegalPageShell>
  );
}
