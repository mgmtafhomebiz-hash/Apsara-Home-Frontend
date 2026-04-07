import { useEffect, useMemo, useState } from 'react';
import type { StepImagesMessage } from '../types';

export function StepImages({ message }: { message: StepImagesMessage }) {
  const [images, setImages] = useState(message.images);
  const isGrid = images.length > 3;
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = images.length;
  const active = useMemo(() => images[activeIndex], [images, activeIndex]);
  const openAt = (index: number) => {
    if (total === 0) return;
    setActiveIndex(Math.max(0, Math.min(index, total - 1)));
    setIsOpen(true);
  };
  const goPrev = () => setActiveIndex((idx) => (idx - 1 + total) % total);
  const goNext = () => setActiveIndex((idx) => (idx + 1) % total);
  const isSteps = message.images.length > 0 && message.images.every((img) => img.url.includes('/images/steps/'));

  useEffect(() => {
    if (!isSteps) return;
    const first = message.images[0]?.url ?? '';
    const match = first.match(/(.*\/)r\d+\.(\w+)$/i);
    if (!match) return;
    const base = match[1];
    const ext = match[2];
    const maxProbe = 20;
    const urls = Array.from({ length: maxProbe }, (_, i) => `${base}r${i + 1}.${ext}`);

    const loadImage = (url: string) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

    Promise.all(urls.map((u) => loadImage(u))).then((results) => {
      const next = urls
        .filter((_, i) => results[i])
        .map((url, i) => ({
          url,
          caption: message.images[i]?.caption,
        }));
      if (next.length > 0) {
        setImages(next);
      }
    });
  }, [isSteps, message.images]);

  return (
    <div className={isGrid ? 'w-full' : 'w-full space-y-3'}>
      {isGrid && (
        <div className="flex flex-col items-start gap-1">
          <div className="text-[12px] text-slate-500"> <span className="text-orange-500 font-bold">A</span><span className="text-cyan-500 font-bold">F</span>Shop AI sent {images.length} photos</div>
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36"
            aria-label="Open image viewer"
          >
            <div className="absolute inset-0 rounded-[22px] bg-white shadow-md border border-slate-100" />
            {images.slice(0, 3).map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.caption ?? `Step ${i + 1}`}
                className={`absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-[20px] border border-white shadow ${
                  i === 0 ? 'left-1 top-1 z-30' : i === 1 ? 'left-2.5 top-2.5 z-20' : 'left-4 top-4 z-10'
                }`}
              />
            ))}
            <div className="absolute right-1 bottom-1 z-40 rounded-full bg-black/70 px-2 py-0.5 text-[11px] text-white">
              +{images.length - 3}
            </div>
          </button>
          <div className="text-[11px] text-slate-400">Sent</div>
        </div>
      )}
      {!isGrid &&
        images.map((img, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm">
          <button
            type="button"
            onClick={() => openAt(i)}
            className="block w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 overflow-hidden rounded-xl"
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={img.url}
              alt={img.caption ?? `Step ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
          {img.caption && (
            <p className="mt-2 text-[12px] text-slate-600">{img.caption}</p>
          )}
        </div>
      ))}
      {isOpen && active && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-[61] flex h-full w-full flex-col items-center justify-center px-4 py-6">
            <div className="absolute right-4 top-4 flex items-center gap-2 text-white">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/15 px-3 py-1.5 text-[13px] hover:bg-white/25"
              >
                Close
              </button>
            </div>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-white hover:bg-white/30"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-white hover:bg-white/30"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="max-h-[70vh] max-w-[90vw] overflow-hidden rounded-xl bg-black/20 p-2">
              <img
                src={active.url}
                alt={active.caption ?? `Step ${activeIndex + 1}`}
                className="max-h-[65vh] max-w-[85vw] object-contain"
              />
            </div>
            <div className="mt-4 flex max-w-[90vw] items-center gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border ${
                    i === activeIndex ? 'border-white' : 'border-white/30'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img.url} alt={img.caption ?? `Step ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
