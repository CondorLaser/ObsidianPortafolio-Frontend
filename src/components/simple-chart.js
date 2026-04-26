export function SimpleChart() {
  return (
    <div className="rounded-3xl border border-dashed border-border-soft bg-[linear-gradient(180deg,rgba(109,102,255,0.12),rgba(16,185,129,0.08))] p-4">
      <div className="flex h-72 items-end gap-2">
        {[28, 32, 30, 36, 40, 45, 44, 48, 52, 56, 60, 64].map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,#6d66ff,#10b981)] opacity-85"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
