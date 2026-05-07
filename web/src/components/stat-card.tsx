interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <span className="text-3xl font-bold text-gray-900">{value}</span>
    </div>
  );
}
