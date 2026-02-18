'use client';

const messages = [
    '🚚  Free Shipping on orders over ₱5,000',
    '🎉  Summer Sale — Up to 50% off selected items',
    '✨  New arrivals every week',
    '🏠  Nationwide delivery to all major cities',
    '💳  Installment available via GCash & Maya',
]

const TopBar = () => {
    return (
        <div className="bg-slate-900 text-white text-xs py-2 overflow-hidden">
            <div className="flex items-center">
                <div className="hidden md:flex items-center gap-5 px-6 shrink-0 text-white/60">
                    <a href="tel:+639123456789" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        +63 912 345 6789
                    </a>
                    <a href="mailto:hello@afhome.ph" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,12 2,6" /></svg>
                        hello@afhome.ph
                    </a>
                </div>

                <div className="flex-1 overflow-hidden mx-4">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...messages, ...messages].map((message, index) => (
                            <span
                                key={index}
                                className="mx-10 text-white/70"
                            >{message}</span>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3 px-6 shrink-0 text-white/50">
                    <a href="#" className="hover:text-orange-400 transition-colors">FB</a>
                    <span className="text-white/20">|</span>
                    <a href="#" className="hover:text-orange-400 transition-colors">IG</a>
                    <span className="text-white/20">|</span>
                    <a href="#" className="hover:text-orange-400 transition-colors">TikTok</a>
                </div>
            </div>
        </div>
    )
}

export default TopBar
