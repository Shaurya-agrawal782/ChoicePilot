"use client";

import { useState, useCallback, useRef } from "react";
import CollegeFilters from "@/components/colleges/CollegeFilters";
import CollegeCard from "@/components/colleges/CollegeCard";
import CollegePagination from "@/components/colleges/CollegePagination";

interface Program {
  id: string;
  branchCode: string;
  branchName: string;
  annualFee: number | null;
  averagePackage: number | null;
}

interface College {
  id: string;
  name: string;
  city: string;
  type: string;
  programs: Program[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  colleges: College[];
  pagination: Pagination;
  dataNotice: string;
}

export interface FilterState {
  search: string;
  city: string;
  type: string;
  branch: string;
  maxFee: string;
}

const EMPTY_FILTERS: FilterState = {
  search: "",
  city: "",
  type: "",
  branch: "",
  maxFee: "",
};

async function fetchColleges(
  filters: FilterState,
  page: number
): Promise<ApiResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.city) params.set("city", filters.city);
  if (filters.type) params.set("type", filters.type);
  if (filters.branch) params.set("branch", filters.branch);
  if (filters.maxFee) params.set("maxFee", filters.maxFee);
  params.set("page", String(page));
  params.set("limit", "10");

  const res = await fetch(`/api/colleges?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
}

export default function CollegeExplorerClient() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (f: FilterState, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchColleges(f, p);
      setData(result);
    } catch {
      setError("Unable to load colleges. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApply = () => {
    setFilters(pendingFilters);
    pageRef.current = 1;
    setHasSearched(true);
    runSearch(pendingFilters, 1);
  };

  const handleClear = () => {
    setPendingFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    pageRef.current = 1;
    setHasSearched(true);
    runSearch(EMPTY_FILTERS, 1);
  };

  const handlePageChange = (newPage: number) => {
    pageRef.current = newPage;
    runSearch(filters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Trigger initial load on first render
  if (!hasSearched && !loading && !data && !error) {
    setHasSearched(true);
    runSearch(EMPTY_FILTERS, 1);
  }

  return (
    <>
      {/* Data Notice Banner */}
      {data?.dataNotice && (
        <div className="bg-border/30 border border-border rounded-lg px-4 py-2.5 mb-8">
          <p className="data-label text-[10px] sm:text-xs font-mono text-muted tracking-wide">
            ⚠ {data.dataNotice}
          </p>
        </div>
      )}

      {/* Filters */}
      <CollegeFilters
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApply}
        onClear={handleClear}
      />

      {/* Result count */}
      {data && !loading && (
        <div className="flex items-center justify-between mb-5 mt-8">
          <span className="data-label text-[10px] sm:text-xs font-mono text-muted uppercase tracking-wider">
            {data.pagination.total === 0
              ? "No results"
              : `${data.pagination.total} college${data.pagination.total !== 1 ? "s" : ""} found`}
          </span>
          <span className="data-label text-[10px] font-mono text-muted/60">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="data-label text-xs font-mono text-muted">Loading colleges…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl px-5 py-6 text-center">
          <p className="text-sm text-warning font-medium">{error}</p>
          <button
            onClick={handleApply}
            className="mt-3 data-label text-xs font-mono text-muted underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* No results */}
      {!loading && !error && data?.colleges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <p className="text-sm font-medium text-ink">No colleges match your filters.</p>
          <button
            onClick={handleClear}
            className="data-label text-xs font-mono text-primary underline underline-offset-2"
          >
            Clear filters and show all
          </button>
        </div>
      )}

      {/* College Cards */}
      {!loading && !error && data && data.colleges.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && data && data.pagination.totalPages > 1 && (
        <CollegePagination
          pagination={data.pagination}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
