import type { ImageMessage as ImageMessageType } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? '').replace(/\/+$/, '');
const ROBOT_SRC = `${API_BASE}/Image/sir.png`;

export function ImageMessage({ message }: { message: ImageMessageType }) {
  const isBot = message.role === 'bot';
  return (
    <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-10 h-10 overflow-hidden flex-shrink-0 rounded-none">
          <img src={ROBOT_SRC} alt="AI" className="w-full h-full object-contain" />
        </div>
      )}
      <a
        href={message.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`max-w-[80%] rounded-[18px] overflow-hidden border block ${
          isBot
            ? 'bg-white border-indigo-100 rounded-bl-[5px] shadow-md shadow-indigo-100'
            : 'bg-white border-slate-200 rounded-br-[5px] shadow-sm'
        }`}
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
          <img src={message.url} alt="Uploaded" className="block w-full h-full object-cover" />
        </div>
      </a>
    </div>
  );
}
