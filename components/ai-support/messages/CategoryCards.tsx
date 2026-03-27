import type { CategoryCardsMessage } from '../types';

export function CategoryCards({ message }: { message: CategoryCardsMessage }) {
  return (
    <div className="w-full space-y-2">
      {message.cards.map((card, i) => (
        <a
          key={i}
          href={card.url}
          className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150 no-underline"
        >
          <span className="text-xs font-semibold text-slate-900">{card.name}</span>
          {card.count > 0 && (
            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
              {card.count} products
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
