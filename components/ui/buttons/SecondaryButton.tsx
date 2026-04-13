import Link from 'next/link';
import { ReactNode } from 'react';

interface SecondaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function SecondaryButton({
  href,
  onClick,
  children,
  className = '',
  type = 'button',
  disabled,
}: SecondaryButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 dark:text-white/80 font-semibold rounded-full px-8 py-4 text-base cursor-pointer transition-colors ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}
