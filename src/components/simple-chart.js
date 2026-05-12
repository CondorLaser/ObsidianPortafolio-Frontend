export function SimpleChart({ data, labels, className = "" }) {
  const points = data ?? [44, 47, 49, 53, 57, 61];
  const ticks = labels ?? ["ene", "feb", "mar", "abr", "may", "jun"];
  const maxValue = Math.max(...points, 1);
  const minValue = Math.min(...points, 1);
  const range = Math.max(maxValue - minValue, 1);
  const chartWidth = 640;
  const chartHeight = 248;
  const paddingX = 26;
  const paddingTop = 30;
  const paddingBottom = 44;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const usableWidth = chartWidth - paddingX * 2;
  const pathPoints = points.map((value, index) => {
    const x = paddingX + index * (usableWidth / Math.max(points.length - 1, 1));
    const y = paddingTop + (1 - (value - minValue) / range) * innerHeight;
    return [x, y];
  });
  const linePath = pathPoints
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${pathPoints.at(-1)?.[0] ?? chartWidth} ${chartHeight - paddingBottom} L ${pathPoints[0]?.[0] ?? 0} ${chartHeight - paddingBottom} Z`;

  return (
    <div className={`h-[292px] overflow-hidden rounded-[18px] border border-border-soft bg-surface ${className}`}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(20,184,166,0.35)" />
            <stop offset="100%" stopColor="rgba(20,184,166,0.06)" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((step) => {
          const y = paddingTop + step * (innerHeight / 3);
          return <line key={step} x1="0" y1={y} x2={chartWidth} y2={y} stroke="rgba(148,163,184,0.12)" />;
        })}

        <path d={areaPath} fill="url(#dashboardArea)" />
        <path d={linePath} fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {pathPoints.map(([x, y], index) => (
          <circle key={`${ticks[index]}-${x}`} cx={x} cy={y} r="2.5" fill="#14b8a6" />
        ))}

        {ticks.map((label, index) => {
          const x = paddingX + index * (usableWidth / Math.max(ticks.length - 1, 1));
          return (
            <text
              key={label}
              x={x}
              y={chartHeight - 16}
              fill="#f5f8fc"
              fontSize="12"
              textAnchor={index === 0 ? "start" : index === ticks.length - 1 ? "end" : "middle"}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
