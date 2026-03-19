function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-8 space-y-3">
          <PulseBlock className="h-6 w-24" />
          <PulseBlock className="h-10 w-56" />
          <PulseBlock className="h-4 w-80 max-w-full" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <PulseBlock className="h-36 w-full" />
            <div className="mt-5 flex items-center gap-3">
              <PulseBlock className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <PulseBlock className="h-4 w-32" />
                <PulseBlock className="h-3 w-24" />
              </div>
            </div>
            <PulseBlock className="mt-5 h-44 w-full" />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="grid gap-3 md:grid-cols-3">
                <PulseBlock className="h-24 w-full" />
                <PulseBlock className="h-24 w-full" />
                <PulseBlock className="h-24 w-full" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <PulseBlock className="h-8 w-44" />
              <PulseBlock className="mt-6 h-32 w-full" />
              <PulseBlock className="mt-4 h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
