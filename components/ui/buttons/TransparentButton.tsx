import Link from 'next/link';
import { ReactNode } from 'react';

interface TransparentButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function TransparentButton({ href, onClick, children, className = '', type = 'button' }: TransparentButtonProps) {
  const base = `group inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold rounded-full px-8 py-4 text-base border border-white/30 cursor-pointer ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {children}
    </button>
  );
}
