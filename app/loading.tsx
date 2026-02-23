import Image from 'next/image';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-white/60 backdrop-blur-lg">

      {/* Logo */}
      <Image
        src="/Images/af_home_logo.png"
        alt="AF Home Logo"
        width={200}
        height={200}
        priority
        className="object-contain animate-float"
      />

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-bold tracking-widest text-gray-800">
          AF <span className="text-orange-500">Home</span>
        </p>
        <p className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">Loading...</p>
      </div>

    </div>
  );
};

export default Loading;
