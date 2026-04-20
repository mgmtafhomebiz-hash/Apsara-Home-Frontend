import Link from 'next/link';
import type { ReactNode } from 'react';
import Header from '@/components/landing-page/Header';
import Footer from '@/components/landing-page/Footer';

type LegalPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function LegalPageShell({ title, subtitle, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-af-cream dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-[1]" />
      <Header cartCount={0} />

      <main className="relative z-[2] pt-24 md:pt-28 pb-10">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.15),transparent_40%)]" />
          <div className="container mx-auto px-4 py-10 md:py-16">
            <div className="max-w-5xl mx-auto rounded-3xl border border-orange-200/60 dark:border-orange-900/40 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-[0_20px_80px_rgba(17,24,39,0.12)] p-6 md:p-10">
              <div className="inline-flex items-center rounded-full border border-orange-200 dark:border-orange-900/50 px-3 py-1 text-xs font-medium tracking-wide text-orange-700 dark:text-orange-300 bg-orange-50/70 dark:bg-orange-950/30 mb-4">
                INFORMATIONS
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Link href="/shop" className="hover:text-orange-500 transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span>{title}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-3 text-gray-900 dark:text-white">{title}</h1>
              <p className="text-gray-700 dark:text-gray-200 max-w-3xl text-sm md:text-base leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-4 md:pb-8">
          <div className="max-w-5xl mx-auto rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-[0_20px_80px_rgba(17,24,39,0.12)] p-6 md:p-10">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-p:leading-8 prose-li:leading-7 prose-a:text-orange-600 hover:prose-a:text-orange-500">
              {children}
            </div>
          </div>
        </section>
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </div>
  );
}
