export function SectionCard({ title, description, children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-border-soft bg-panel-soft p-5 ${className}`.trim()}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
