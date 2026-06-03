import type { FilterState } from "./CollegeExplorerClient";

const CITIES = ["Bhopal", "Indore", "Gwalior", "Jabalpur"];
const TYPES = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private" },
  { value: "AUTONOMOUS", label: "Autonomous" },
];
const BRANCHES = [
  { value: "CSE", label: "CSE" },
  { value: "AIML", label: "AI/ML" },
  { value: "IT", label: "IT" },
  { value: "EC", label: "EC" },
  { value: "ME", label: "ME" },
  { value: "CE", label: "CE" },
];

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function CollegeFilters({ filters, onChange, onApply, onClear }: Props) {
  const set = (key: keyof FilterState, val: string) =>
    onChange({ ...filters, [key]: val });

  const inputClass =
    "w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-colors";
  const labelClass = "data-label text-[10px] font-mono font-semibold text-muted uppercase tracking-wider block mb-1.5";

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <label className={labelClass}>Search</label>
          <input
            type="text"
            placeholder="College name or city…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            className={inputClass}
          />
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City</label>
          <select
            value={filters.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputClass}
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={filters.type}
            onChange={(e) => set("type", e.target.value)}
            className={inputClass}
          >
            <option value="">All Types</option>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <div>
          <label className={labelClass}>Branch</label>
          <select
            value={filters.branch}
            onChange={(e) => set("branch", e.target.value)}
            className={inputClass}
          >
            <option value="">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Max Fee */}
        <div>
          <label className={labelClass}>Max Annual Fee (₹)</label>
          <input
            type="number"
            placeholder="e.g. 100000"
            value={filters.maxFee}
            onChange={(e) => set("maxFee", e.target.value)}
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/50">
        <button
          onClick={onApply}
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/90 rounded-full transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={onClear}
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted border border-border hover:border-primary/40 hover:text-ink rounded-full transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
