export function ActionItem({ title, detail, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "border-warning/25 bg-warning/8"
      : tone === "accent"
        ? "border-accent/25 bg-accent/6"
        : "border-border-soft bg-surface/55";

  return (
    <article className={`rounded-[24px] border px-6 py-5 ${toneClass}`}>
      <p className="text-[11px] font-[760] uppercase tracking-[0.12em] text-text-muted">{title}</p>
      <p className="mt-3 max-w-[36ch] text-[17px] leading-[1.45] font-semibold text-white">{detail}</p>
    </article>
  );
}
