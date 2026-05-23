"use client"
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


export function CollapsableShell({ title, description, children, actions }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <main className="rounded-3xl border border-border-soft  p-6 lg:p-8">
        {/* Header */}
        <div className="mb-1">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left */}
            <button
              onClick={() => setOpen(!open)}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <div>
                <h1 className="mt-2 text-3xl font-semibold">
                  {title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-text-muted">
                  {description}
                </p>
              </div>

              <div className="mt-2 shrink-0">
                {open ? (
                  <ChevronUp className="h-5 w-5 text-text-muted" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-text-muted" />
                )}
              </div>
            </button>

            {/* Actions */}
            {actions ? (
              <div className="flex flex-wrap gap-3">
                {actions}
              </div>
            ) : null}
          </div>
        </div>

        {/* Collapsable Content */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${open ? "max-h-[5000px] opacity-100 mt-3" : "max-h-0 opacity-0"}
          `}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
