interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Props {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function CollegePagination({ pagination, onPageChange }: Props) {
  const { page, totalPages } = pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="data-label text-xs font-mono px-4 py-2 rounded-full border border-border text-muted hover:border-primary/40 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`data-label text-xs font-mono w-8 h-8 rounded-full border transition-colors ${
              p === page
                ? "bg-primary text-surface border-primary font-semibold"
                : "border-border text-muted hover:border-primary/40 hover:text-ink"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="data-label text-xs font-mono px-4 py-2 rounded-full border border-border text-muted hover:border-primary/40 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}
