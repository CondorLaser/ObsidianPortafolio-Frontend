export function MetricCard({ label, value, helper }) {
  return (
    <article className="rounded-3xl border border-border-soft bg-panel-soft p-5">
      <p className="text-sm text-text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      {helper ? <p className="mt-2 text-sm text-success">{helper}</p> : null}
    </article>
  );
}
