export function MetricCard({ label, value, helper, hero = false, helperTone = "success" }) {
  const helperClass =
    helperTone === "muted"
      ? "text-text-muted"
      : helperTone === "pill"
        ? "inline-flex rounded-full bg-green-attention px-3 py-1.5 font-mono text-xs font-extrabold text-success"
        : "text-success";

  return (
    <article
      className={`min-h-[132px] rounded-[20px] border border-border-soft p-[18px] ${
        hero
          ? "bg-[radial-gradient(circle_at_90%_0%,rgba(20,184,166,0.18),transparent_13rem),var(--color-panel-soft)]"
          : "bg-panel-soft"
      }`}
    >
      <p className="text-sm text-text-muted">{label}</p>
      <p
        className={`mt-3 font-semibold tracking-[-0.02em] ${
          hero ? "font-mono text-[28px] leading-[1.1]" : "text-[28px] leading-[1.1]"
        }`}
      >
        {value}
      </p>
      {helper ? <p className={`mt-3 text-sm ${helperClass}`}>{helper}</p> : null}
    </article>
  );
}
