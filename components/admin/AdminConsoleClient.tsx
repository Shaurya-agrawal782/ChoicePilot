"use client";

import { useState, useEffect } from "react";
import { CollegeType, BranchCode, ExamType, Category, SourceType, ConfidenceLevel } from "@prisma/client";

interface DataSource {
  id: string;
  title: string;
  url: string | null;
  sourceType: SourceType;
  academicYear: string | null;
  confidence: ConfidenceLevel;
  notes: string | null;
}

interface Cutoff {
  id: string;
  programId: string;
  year: number;
  round: number;
  category: Category;
  openingRank: number | null;
  closingRank: number;
  source: DataSource | null;
}

interface Program {
  id: string;
  collegeId: string;
  branchCode: BranchCode;
  branchName: string;
  degree: string;
  durationYears: number;
  annualFee: number | null;
  examAccepted: ExamType;
  averagePackage: number | null;
  highestPackage: number | null;
  placementYear: string | null;
  cutoffs: Cutoff[];
}

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  affiliation: string | null;
  approvalStatus: string | null;
  officialWebsite: string | null;
  overview: string | null;
  hostelAvailable: boolean | null;
  programs: Program[];
}

export default function AdminConsoleClient() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection states
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  // Form states
  const [collegeForm, setCollegeForm] = useState<{
    id?: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    type: CollegeType;
    affiliation: string;
    approvalStatus: string;
    officialWebsite: string;
    overview: string;
    hostelAvailable: boolean;
  } | null>(null);

  const [programForm, setProgramForm] = useState<{
    id?: string;
    collegeId: string;
    branchCode: BranchCode;
    branchName: string;
    degree: string;
    durationYears: number;
    annualFee: string;
    examAccepted: ExamType;
    averagePackage: string;
    highestPackage: string;
    placementYear: string;
  } | null>(null);

  const [cutoffForm, setCutoffForm] = useState<{
    id?: string;
    programId: string;
    year: number;
    round: number;
    category: Category;
    openingRank: string;
    closingRank: string;
    sourceTitle: string;
    sourceType: SourceType;
    confidence: ConfidenceLevel;
    sourceUrl: string;
    sourceNotes: string;
  } | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/colleges");
      if (!res.ok) throw new Error("Failed to fetch colleges");
      const data = await res.json();
      setColleges(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchColleges();
  }, []);

  const activeCollege = colleges.find(c => c.id === selectedCollegeId) || null;

  // Counts
  const collegeCount = colleges.length;
  const programCount = colleges.reduce((acc, c) => acc + c.programs.length, 0);
  const cutoffCount = colleges.reduce((acc, c) => acc + c.programs.reduce((pAcc, p) => pAcc + p.cutoffs.length, 0), 0);

  // College handlers
  const handleAddCollegeClick = () => {
    setCollegeForm({
      name: "",
      slug: "",
      city: "",
      state: "Madhya Pradesh",
      type: CollegeType.PRIVATE,
      affiliation: "",
      approvalStatus: "",
      officialWebsite: "",
      overview: "",
      hostelAvailable: false,
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEditCollegeClick = (col: College) => {
    setCollegeForm({
      id: col.id,
      name: col.name,
      slug: col.slug,
      city: col.city,
      state: col.state,
      type: col.type,
      affiliation: col.affiliation || "",
      approvalStatus: col.approvalStatus || "",
      officialWebsite: col.officialWebsite || "",
      overview: col.overview || "",
      hostelAvailable: col.hostelAvailable || false,
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleCollegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeForm) return;

    setFormError(null);
    setFormSuccess(null);

    const isEdit = !!collegeForm.id;
    const url = isEdit ? `/api/admin/colleges/${collegeForm.id}` : "/api/admin/colleges";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...collegeForm,
          affiliation: collegeForm.affiliation || null,
          approvalStatus: collegeForm.approvalStatus || null,
          officialWebsite: collegeForm.officialWebsite || null,
          overview: collegeForm.overview || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save college");
      }

      setFormSuccess(`Successfully ${isEdit ? "updated" : "created"} college!`);
      setCollegeForm(null);
      await fetchColleges();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Something went wrong.");
    }
  };

  // Program handlers
  const handleAddProgramClick = () => {
    if (!selectedCollegeId) return;
    setProgramForm({
      collegeId: selectedCollegeId,
      branchCode: BranchCode.CSE,
      branchName: "Computer Science Engineering",
      degree: "B.Tech",
      durationYears: 4,
      annualFee: "",
      examAccepted: ExamType.JEE_MAIN,
      averagePackage: "",
      highestPackage: "",
      placementYear: "",
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEditProgramClick = (prog: Program) => {
    setProgramForm({
      id: prog.id,
      collegeId: prog.collegeId,
      branchCode: prog.branchCode,
      branchName: prog.branchName,
      degree: prog.degree,
      durationYears: prog.durationYears,
      annualFee: prog.annualFee !== null ? String(prog.annualFee) : "",
      examAccepted: prog.examAccepted,
      averagePackage: prog.averagePackage !== null ? String(prog.averagePackage) : "",
      highestPackage: prog.highestPackage !== null ? String(prog.highestPackage) : "",
      placementYear: prog.placementYear || "",
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm) return;

    setFormError(null);
    setFormSuccess(null);

    const isEdit = !!programForm.id;
    const url = isEdit ? `/api/admin/programs/${programForm.id}` : "/api/admin/programs";
    const method = isEdit ? "PATCH" : "POST";

    const payload = {
      ...programForm,
      annualFee: programForm.annualFee ? parseInt(programForm.annualFee) : null,
      averagePackage: programForm.averagePackage ? parseFloat(programForm.averagePackage) : null,
      highestPackage: programForm.highestPackage ? parseFloat(programForm.highestPackage) : null,
      placementYear: programForm.placementYear || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save program");
      }

      setFormSuccess(`Successfully ${isEdit ? "updated" : "created"} program!`);
      setProgramForm(null);
      await fetchColleges();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Something went wrong.");
    }
  };

  // Cutoff handlers
  const handleAddCutoffClick = () => {
    if (!selectedProgramId) return;
    setCutoffForm({
      programId: selectedProgramId,
      year: 2025,
      round: 1,
      category: Category.GENERAL,
      openingRank: "",
      closingRank: "",
      sourceTitle: "Official DTE MP Admission Records",
      sourceType: SourceType.OFFICIAL_COUNSELLING,
      confidence: ConfidenceLevel.VERIFIED,
      sourceUrl: "",
      sourceNotes: "",
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEditCutoffClick = (cut: Cutoff) => {
    setCutoffForm({
      id: cut.id,
      programId: cut.programId,
      year: cut.year,
      round: cut.round,
      category: cut.category,
      openingRank: cut.openingRank !== null ? String(cut.openingRank) : "",
      closingRank: String(cut.closingRank),
      sourceTitle: cut.source?.title || "",
      sourceType: cut.source?.sourceType || SourceType.OFFICIAL_COUNSELLING,
      confidence: cut.source?.confidence || ConfidenceLevel.DEMO,
      sourceUrl: cut.source?.url || "",
      sourceNotes: cut.source?.notes || "",
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleCutoffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cutoffForm) return;

    setFormError(null);
    setFormSuccess(null);

    const isEdit = !!cutoffForm.id;
    const url = isEdit ? `/api/admin/cutoffs/${cutoffForm.id}` : "/api/admin/cutoffs";
    const method = isEdit ? "PATCH" : "POST";

    const payload = {
      ...cutoffForm,
      openingRank: cutoffForm.openingRank ? parseInt(cutoffForm.openingRank) : null,
      closingRank: parseInt(cutoffForm.closingRank),
      sourceUrl: cutoffForm.sourceUrl || null,
      sourceNotes: cutoffForm.sourceNotes || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save cutoff");
      }

      setFormSuccess(`Successfully ${isEdit ? "updated" : "created"} cutoff!`);
      setCutoffForm(null);
      await fetchColleges();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Something went wrong.");
    }
  };

  const getConfidenceBadgeColor = (level: ConfidenceLevel) => {
    switch (level) {
      case ConfidenceLevel.VERIFIED:
        return "text-safe bg-safe/8 border-safe/20";
      case ConfidenceLevel.PARTIALLY_VERIFIED:
        return "text-dream bg-dream/8 border-dream/20";
      default:
        return "text-target bg-target/8 border-target/20";
    }
  };

  const getConfidenceBadgeLabel = (level: ConfidenceLevel) => {
    switch (level) {
      case ConfidenceLevel.VERIFIED:
        return "Verified";
      case ConfidenceLevel.PARTIALLY_VERIFIED:
        return "Partially Verified";
      default:
        return "Demo";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 mt-4">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="data-label text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
            Colleges
          </div>
          <div className="text-2xl font-mono font-semibold text-ink">
            {loading ? "..." : collegeCount}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="data-label text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
            Programmes
          </div>
          <div className="text-2xl font-mono font-semibold text-ink">
            {loading ? "..." : programCount}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="data-label text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
            Cutoff Records
          </div>
          <div className="text-2xl font-mono font-semibold text-ink">
            {loading ? "..." : cutoffCount}
          </div>
        </div>
      </div>

      {/* Main Console Grid */}
      {error ? (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6 mb-8 text-center">
          <p className="text-sm text-warning font-medium">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Colleges List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
                Colleges Explorer
              </span>
              <button
                onClick={handleAddCollegeClick}
                className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-full transition-colors"
              >
                Add College
              </button>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2 max-h-[600px] overflow-y-auto">
              {colleges.length === 0 ? (
                <p className="text-xs text-muted/70 italic p-4 text-center">No colleges in the database.</p>
              ) : (
                colleges.map((col) => (
                  <div
                    key={col.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedCollegeId === col.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30 bg-paper/50"
                    }`}
                    onClick={() => {
                      setSelectedCollegeId(col.id);
                      setSelectedProgramId(null);
                    }}
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-ink leading-tight">{col.name}</h4>
                      <p className="data-label text-[10px] font-mono text-muted mt-1">
                        {col.city} · {col.type} · {col.programs.length} prog{col.programs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCollegeClick(col);
                      }}
                      className="text-[10px] font-mono uppercase tracking-wider border border-border/80 px-2.5 py-1 rounded hover:bg-border/10 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Dynamic details & Forms (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Success/Error Banners */}
            {formSuccess && (
              <div className="bg-safe/5 border border-safe/20 rounded-2xl p-4 text-sm text-safe">
                ✓ {formSuccess}
              </div>
            )}
            {formError && (
              <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4 text-sm text-warning">
                ⚠ {formError}
              </div>
            )}

            {/* College Add/Edit Form */}
            {collegeForm && (
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-ink">
                    {collegeForm.id ? "Edit College Basic Info" : "Add New College"}
                  </h3>
                  <button
                    onClick={() => setCollegeForm(null)}
                    className="text-xs font-mono uppercase text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleCollegeSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">Name *</label>
                      <input
                        type="text"
                        required
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.name}
                        onChange={e => setCollegeForm({ ...collegeForm, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">Slug *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. lnct-bhopal"
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.slug}
                        onChange={e => setCollegeForm({ ...collegeForm, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">City *</label>
                      <input
                        type="text"
                        required
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.city}
                        onChange={e => setCollegeForm({ ...collegeForm, city: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">State</label>
                      <input
                        type="text"
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.state}
                        onChange={e => setCollegeForm({ ...collegeForm, state: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">Type</label>
                      <select
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.type}
                        onChange={e => setCollegeForm({ ...collegeForm, type: e.target.value as CollegeType })}
                      >
                        <option value={CollegeType.PRIVATE}>Private</option>
                        <option value={CollegeType.GOVERNMENT}>Government</option>
                        <option value={CollegeType.AUTONOMOUS}>Autonomous</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">Affiliation</label>
                      <input
                        type="text"
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.affiliation}
                        onChange={e => setCollegeForm({ ...collegeForm, affiliation: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="data-label text-[9px] font-mono text-muted uppercase">Approval Status</label>
                      <input
                        type="text"
                        placeholder="e.g. AICTE Approved"
                        className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        value={collegeForm.approvalStatus}
                        onChange={e => setCollegeForm({ ...collegeForm, approvalStatus: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="data-label text-[9px] font-mono text-muted uppercase">Official Website Link</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                      value={collegeForm.officialWebsite}
                      onChange={e => setCollegeForm({ ...collegeForm, officialWebsite: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="data-label text-[9px] font-mono text-muted uppercase">Overview</label>
                    <textarea
                      rows={3}
                      className="bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-primary resize-none"
                      value={collegeForm.overview}
                      onChange={e => setCollegeForm({ ...collegeForm, overview: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id="hostelAvailable"
                      className="accent-primary"
                      checked={collegeForm.hostelAvailable}
                      onChange={e => setCollegeForm({ ...collegeForm, hostelAvailable: e.target.checked })}
                    />
                    <label htmlFor="hostelAvailable" className="data-label text-[10px] font-mono text-muted uppercase cursor-pointer">
                      Hostel facility available
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-lg transition-colors"
                  >
                    Save College Record
                  </button>
                </form>
              </div>
            )}

            {/* Selected College Area */}
            {activeCollege && !collegeForm && (
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <span className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1">
                    Selected College
                  </span>
                  <h2 className="text-xl font-normal leading-tight text-ink">{activeCollege.name}</h2>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{activeCollege.overview || "No overview provided."}</p>
                </div>

                <hr className="border-border/50" />

                {/* Programmes list */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
                      Programmes list ({activeCollege.programs.length})
                    </span>
                    <button
                      onClick={handleAddProgramClick}
                      className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-primary/30 text-primary hover:bg-primary/5 rounded-full transition-colors"
                    >
                      Add Programme
                    </button>
                  </div>

                  {programForm && (
                    <div className="bg-paper/50 border border-border/80 rounded-xl p-4 mt-2">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-semibold text-ink">
                          {programForm.id ? "Edit Programme Details" : "Add New Programme"}
                        </h4>
                        <button onClick={() => setProgramForm(null)} className="text-[10px] font-mono uppercase text-muted">
                          Cancel
                        </button>
                      </div>
                      <form onSubmit={handleProgramSubmit} className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Branch Code</label>
                            <select
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.branchCode}
                              onChange={e => setProgramForm({ ...programForm, branchCode: e.target.value as BranchCode })}
                            >
                              <option value={BranchCode.CSE}>CSE</option>
                              <option value={BranchCode.AIML}>AIML</option>
                              <option value={BranchCode.IT}>IT</option>
                              <option value={BranchCode.EC}>EC</option>
                              <option value={BranchCode.ME}>ME</option>
                              <option value={BranchCode.CE}>CE</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Branch Name</label>
                            <input
                              type="text"
                              required
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.branchName}
                              onChange={e => setProgramForm({ ...programForm, branchName: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Degree</label>
                            <input
                              type="text"
                              required
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.degree}
                              onChange={e => setProgramForm({ ...programForm, degree: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Duration (Yrs)</label>
                            <input
                              type="number"
                              required
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.durationYears}
                              onChange={e => setProgramForm({ ...programForm, durationYears: parseInt(e.target.value) || 4 })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Exam Accepted</label>
                            <select
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.examAccepted}
                              onChange={e => setProgramForm({ ...programForm, examAccepted: e.target.value as ExamType })}
                            >
                              <option value={ExamType.JEE_MAIN}>JEE Main</option>
                              <option value={ExamType.MP_DTE}>MP DTE</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Annual Fee (INR)</label>
                            <input
                              type="number"
                              placeholder="Optional"
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.annualFee}
                              onChange={e => setProgramForm({ ...programForm, annualFee: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Avg Package (LPA)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Optional"
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.averagePackage}
                              onChange={e => setProgramForm({ ...programForm, averagePackage: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="data-label text-[8px] font-mono text-muted uppercase">Placement Year</label>
                            <input
                              type="text"
                              placeholder="e.g. 2024"
                              className="bg-paper border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink outline-none"
                              value={programForm.placementYear}
                              onChange={e => setProgramForm({ ...programForm, placementYear: e.target.value })}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full mt-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-lg transition-colors"
                        >
                          Save Program
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {activeCollege.programs.map((p) => (
                      <div key={p.id} className="border border-border/40 rounded-xl p-4 bg-paper/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-sm font-semibold text-ink">{p.branchName} ({p.branchCode})</h5>
                            <p className="data-label text-[10px] font-mono text-muted mt-0.5">
                              {p.degree} · Fee: {p.annualFee ? `₹${p.annualFee.toLocaleString()}/yr` : "—"} · Avg Pkg: {p.averagePackage ? `₹${p.averagePackage}L` : "—"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProgramClick(p)}
                              className="text-[9px] font-mono uppercase px-2 py-1 border border-border hover:bg-border/10 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProgramId(p.id);
                                setCutoffForm(null);
                              }}
                              className={`text-[9px] font-mono uppercase px-2 py-1 rounded transition-colors ${
                                selectedProgramId === p.id
                                  ? "bg-primary text-surface"
                                  : "border border-primary/30 text-primary hover:bg-primary/5"
                              }`}
                            >
                              Cutoffs ({p.cutoffs.length})
                            </button>
                          </div>
                        </div>

                        {/* Selected Program Cutoffs */}
                        {selectedProgramId === p.id && (
                          <div className="mt-4 pt-4 border-t border-border/30 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <span className="data-label text-[9px] font-mono font-semibold tracking-wider text-muted uppercase">
                                Program Cutoffs
                              </span>
                              <button
                                onClick={handleAddCutoffClick}
                                className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded"
                              >
                                Add Cutoff
                              </button>
                            </div>

                            {/* Cutoff Add/Edit Form */}
                            {cutoffForm && (
                              <div className="bg-surface border border-border/80 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-xs font-semibold text-ink">
                                    {cutoffForm.id ? "Edit Cutoff details" : "Add New Cutoff record"}
                                  </h4>
                                  <button onClick={() => setCutoffForm(null)} className="text-[9px] font-mono uppercase text-muted">
                                    Cancel
                                  </button>
                                </div>
                                <form onSubmit={handleCutoffSubmit} className="flex flex-col gap-3">
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Year *</label>
                                      <input
                                        type="number"
                                        required
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.year}
                                        onChange={e => setCutoffForm({ ...cutoffForm, year: parseInt(e.target.value) || 2025 })}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Round *</label>
                                      <input
                                        type="number"
                                        required
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.round}
                                        onChange={e => setCutoffForm({ ...cutoffForm, round: parseInt(e.target.value) || 1 })}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Category</label>
                                      <select
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.category}
                                        onChange={e => setCutoffForm({ ...cutoffForm, category: e.target.value as Category })}
                                      >
                                        <option value={Category.GENERAL}>General</option>
                                        <option value={Category.OBC}>OBC</option>
                                        <option value={Category.SC}>SC</option>
                                        <option value={Category.ST}>ST</option>
                                        <option value={Category.EWS}>EWS</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Opening Rank</label>
                                      <input
                                        type="number"
                                        placeholder="Optional"
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.openingRank}
                                        onChange={e => setCutoffForm({ ...cutoffForm, openingRank: e.target.value })}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Closing Rank *</label>
                                      <input
                                        type="number"
                                        required
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.closingRank}
                                        onChange={e => setCutoffForm({ ...cutoffForm, closingRank: e.target.value })}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1 col-span-2">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Source Title *</label>
                                      <input
                                        type="text"
                                        required
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.sourceTitle}
                                        onChange={e => setCutoffForm({ ...cutoffForm, sourceTitle: e.target.value })}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Confidence</label>
                                      <select
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.confidence}
                                        onChange={e => setCutoffForm({ ...cutoffForm, confidence: e.target.value as ConfidenceLevel })}
                                      >
                                        <option value={ConfidenceLevel.DEMO}>Demo</option>
                                        <option value={ConfidenceLevel.PARTIALLY_VERIFIED}>Partial</option>
                                        <option value={ConfidenceLevel.VERIFIED}>Verified</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Source Type</label>
                                      <select
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.sourceType}
                                        onChange={e => setCutoffForm({ ...cutoffForm, sourceType: e.target.value as SourceType })}
                                      >
                                        <option value={SourceType.OFFICIAL_COUNSELLING}>Official Counselling</option>
                                        <option value={SourceType.OFFICIAL_COLLEGE}>Official College</option>
                                        <option value={SourceType.REGULATORY}>Regulatory</option>
                                        <option value={SourceType.RANKING}>Ranking</option>
                                        <option value={SourceType.DEMO}>Demo</option>
                                      </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="data-label text-[8px] font-mono text-muted uppercase">Source URL</label>
                                      <input
                                        type="url"
                                        placeholder="Optional"
                                        className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                        value={cutoffForm.sourceUrl}
                                        onChange={e => setCutoffForm({ ...cutoffForm, sourceUrl: e.target.value })}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="data-label text-[8px] font-mono text-muted uppercase">Source Notes</label>
                                    <input
                                      type="text"
                                      placeholder="Optional"
                                      className="bg-paper border border-border rounded px-2 py-1 text-xs text-ink outline-none"
                                      value={cutoffForm.sourceNotes}
                                      onChange={e => setCutoffForm({ ...cutoffForm, sourceNotes: e.target.value })}
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    className="w-full mt-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-lg transition-colors"
                                  >
                                    Save Cutoff Record
                                  </button>
                                </form>
                              </div>
                            )}

                            {/* Cutoff records list */}
                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                              {p.cutoffs.length === 0 ? (
                                <p className="text-xs text-muted/70 italic py-2">No cutoffs registered.</p>
                              ) : (
                                p.cutoffs.map((c) => (
                                  <div key={c.id} className="p-3 bg-paper border border-border/30 rounded-lg flex justify-between items-center text-xs">
                                    <div>
                                      <span className="font-semibold text-ink">General / R{c.round} / {c.year}</span>
                                      <p className="data-label text-[10px] font-mono text-muted mt-0.5">
                                        Closing Rank: <span className="font-semibold text-ink">{c.closingRank.toLocaleString()}</span>
                                      </p>
                                      {c.source && (
                                        <p className="data-label text-[9px] font-mono text-muted/85 mt-0.5">
                                          Src: {c.source.title}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {c.source && (
                                        <span className={`data-label text-[8px] font-mono px-2 py-0.5 rounded border ${getConfidenceBadgeColor(c.source.confidence)}`}>
                                          {getConfidenceBadgeLabel(c.source.confidence)}
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleEditCutoffClick(c)}
                                        className="text-[9px] font-mono uppercase px-2 py-0.5 border border-border hover:bg-border/10 rounded"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Default Placeholder State */}
            {!activeCollege && !collegeForm && (
              <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center flex flex-col justify-center items-center min-h-[300px]">
                <p className="text-sm text-muted leading-relaxed max-w-sm">
                  Select a college from the left explorer to view and manage its branches, packages, and historical cutoff rankings.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
