export function FeedbackCard({ title, detail, tone = "default" }) {
  const toneClass =
    tone === "error"
      ? "border-red-500/20 bg-red-500/5 text-red-300"
      : "border-border-soft bg-panel-soft text-text-muted";

  return (
    <section className={`rounded-[28px] border p-8 text-center ${toneClass}`}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-[1.6]">{detail}</p>
    </section>
  );
}