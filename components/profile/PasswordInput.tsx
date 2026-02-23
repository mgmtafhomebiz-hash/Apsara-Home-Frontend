'use client';

import { useState } from "react";
import Icon from "./Icons";

const PasswordInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? '••••••••'}
        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? (
          <Icon.EyeOff className="h-4 w-4" />
        ) : (
          <Icon.Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput