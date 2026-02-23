import DashboardLayout from "@/components/superAdmin/DashboardLayout";

export default function LoadingMembersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5 animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-6 w-32 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-200 mt-2" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white border border-slate-100" />
          ))}
        </div>

        <div className="h-24 rounded-2xl bg-white border border-slate-100" />
        <div className="h-[420px] rounded-2xl bg-white border border-slate-100" />
      </div>
    </DashboardLayout>
  );
}

