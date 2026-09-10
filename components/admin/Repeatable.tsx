"use client";

/**
 * Editor for an ordered list — categories, projects, milestones, nav links.
 * Renders each item through `children`, with add / delete / move controls.
 */
export function Repeatable<T>({
  items,
  onChange,
  makeNew,
  addLabel,
  title,
  children,
  minItems = 0,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  makeNew: () => T;
  addLabel: string;
  title?: string;
  minItems?: number;
  children: (item: T, update: (patch: T) => void, index: number) => React.ReactNode;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  return (
    <div>
      {title && <span className="admin-label">{title}</span>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="admin-item">
            <div className="mb-3 flex items-center justify-between">
              <span className="admin-chip">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="admin-iconbtn"
                  aria-label="Move up"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === items.length - 1}
                  className="admin-iconbtn"
                  aria-label="Move down"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  disabled={items.length <= minItems}
                  className="admin-iconbtn hover:!bg-[#fbeceb] hover:!text-[var(--a-danger)]"
                  aria-label="Delete"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            {children(
              item,
              (patch) => onChange(items.map((it, j) => (j === i ? patch : it))),
              i,
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, makeNew()])}
        className="admin-btn admin-btn-ghost mt-3"
      >
        + {addLabel}
      </button>
    </div>
  );
}
