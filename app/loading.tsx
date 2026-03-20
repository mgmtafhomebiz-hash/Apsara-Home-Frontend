import Image from 'next/image';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#faf8f5] overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2c5f4f]/10 animate-blob blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#d4a574]/15 animate-blob animation-delay-2000 blur-3xl" />
      <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-[#2c5f4f]/8 animate-blob animation-delay-4000 blur-2xl" />

      {/* Logo with pulse rings */}
      <div className="relative flex items-center justify-center mb-8">

        {/* Outer pulse ring — brass */}
        <span
          className="absolute inline-flex rounded-full bg-[#d4a574]/20 animate-ping"
          style={{ width: 180, height: 180, animationDuration: '2.4s', animationDelay: '0.3s' }}
        />
        {/* Inner pulse ring — forest */}
        <span
          className="absolute inline-flex rounded-full bg-[#2c5f4f]/25 animate-ping"
          style={{ width: 148, height: 148, animationDuration: '2s' }}
        />

        {/* Static soft glow ring */}
        <span className="absolute w-32 h-32 rounded-full bg-[#2c5f4f]/10 blur-md" />

        {/* Logo */}
        <div className="relative z-10 animate-logo-enter">
          <Image
            src="/Images/af_home_logo.png"
            alt="AF Home Logo"
            width={110}
            height={110}
            priority
            className="object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Brand text */}
      <div
        className="flex flex-col items-center gap-1.5 mb-10 animate-fade-up-in"
        style={{ animationDelay: '0.4s', opacity: 0 }}
      >
        <p className="font-display text-2xl font-semibold tracking-[0.18em] text-[#1a1a1a]">
          AF <span className="text-[#d4a574]">HOME</span>
        </p>
        <p className="text-[10px] font-medium text-[#6b6b6b] tracking-[0.4em] uppercase">
          Your Trusted Home Partner
        </p>
      </div>

      {/* Animated loading dots */}
      <div
        className="flex items-center gap-2 animate-fade-up-in"
        style={{ animationDelay: '0.65s', opacity: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#2c5f4f] loading-dot"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      {/* Thin progress sweep bar at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2c5f4f]/10 overflow-hidden">
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#2c5f4f] to-transparent animate-loading-sweep" />
      </div>

    </div>
  );
};

export default Loading;
