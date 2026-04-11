import DashboardLayout from "@/components/superAdmin/DashboardLayout";

function SkeletonTable() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 w-28 bg-slate-100 rounded-lg" />
      </div>
      <div className="divide-y divide-slate-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-slate-100 rounded" />
              <div className="h-2.5 w-20 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-7 w-16 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingMembersPage() {
  return (
    <DashboardLayout>
      <div id="af-loading-screen" className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-6 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-72 rounded bg-slate-200 mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white border border-slate-100 animate-pulse" />
          ))}
        </div>

        <div className="h-24 rounded-2xl bg-white border border-slate-100 animate-pulse" />
        <SkeletonTable />
      </div>
    </DashboardLayout>
  );
}
