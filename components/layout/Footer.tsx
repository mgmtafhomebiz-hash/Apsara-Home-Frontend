import Link from 'next/link'
import Image from 'next/image'

const links = {
  Information: ['About Us', 'Careers', 'Press', 'Sustainability'],
  'Customer Services': ['FAQ', 'Shipping Policy', 'Returns', 'Track Order'],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/Images/af_home_logo.png"
                alt="AF Home"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Your trusted partner for premium furniture and home appliances. Making every house a home since 2018.
            </p>
            <div className="flex gap-3">
              {['F', 'I', 'T'].map((s, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/50 hover:text-orange-400 text-sm transition-colors duration-200">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-sm text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400 shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                123 Furniture Ave, Quezon City
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +63 912 345 6789
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                hello@afhome.ph
              </li>
            </ul>
            <p className="text-xs text-white/30 mb-2">We accept</p>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'GCash', 'Maya', 'COD'].map((p) => (
                <span key={p} className="bg-white/10 text-white/60 text-xs px-2.5 py-1 rounded-lg">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">© 2025 AF Home. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
