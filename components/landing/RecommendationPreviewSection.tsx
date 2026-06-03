export default function RecommendationPreviewSection() {
  const scores = [
    { label: "Cutoff Fit", value: 28, max: 35, colorClass: "bg-primary" },
    { label: "Branch Match", value: 20, max: 20, colorClass: "bg-primary" },
    { label: "Budget Fit", value: 13, max: 15, colorClass: "bg-primary" },
    { label: "Placement Fit", value: 12, max: 15, colorClass: "bg-primary" },
    { label: "Location Fit", value: 10, max: 10, colorClass: "bg-primary" },
    { label: "Source Trust", value: 4, max: 5, colorClass: "bg-route-indigo" },
  ];

  return (
    <section className="relative w-full bg-paper text-ink pt-0 md:pt-2 lg:pt-4 pb-20 md:pb-28 lg:pb-36">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center">
          
          {/* Left Column: Editorial Explanation Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-muted font-mono uppercase">
              EXPLAINABLE RECOMMENDATIONS
            </span>
            
            <h2 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink mt-3">
              See why a route fits before you choose it.
            </h2>
            
            <p className="text-sm sm:text-base text-muted leading-relaxed mt-4">
              Every recommendation exposes the factors behind it — eligibility, branch preference, affordability, location and placement goals.
            </p>
            
            <div className="mt-10 lg:mt-12 space-y-6">
              {/* Principle Row 1 */}
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Cutoff-aware</h4>
                  <p className="text-xs sm:text-sm text-muted mt-0.5 leading-relaxed">
                    Historical eligibility is separated from personal preference.
                  </p>
                </div>
              </div>
              
              {/* Principle Row 2 */}
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Budget-conscious</h4>
                  <p className="text-xs sm:text-sm text-muted mt-0.5 leading-relaxed">
                    Choices outside your plan are clearly flagged.
                  </p>
                </div>
              </div>
              
              {/* Principle Row 3 */}
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Source-backed</h4>
                  <p className="text-xs sm:text-sm text-muted mt-0.5 leading-relaxed">
                    Important figures carry verification context.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Recommendation Dossier Preview Card */}
          <div className="lg:col-span-7 w-full flex justify-center">
            <div className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Card Header */}
              <div className="flex flex-col gap-4 border-b border-border/60 pb-5">
                <div className="flex items-center justify-between">
                  <span className="data-label text-[10px] font-semibold tracking-widest text-muted font-mono uppercase">
                    PERSONALISED ROUTE ANALYSIS
                  </span>
                  <span className="data-label text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded text-target bg-target/10 border border-target/25 uppercase">
                    TARGET
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
                      LNCT Bhopal
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mt-1">
                      Computer Science Engineering
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end shrink-0">
                    <span className="data-label text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary">
                      84 <span className="text-muted text-base font-normal">/ 100</span>
                    </span>
                    <span className="data-label text-[9px] tracking-wider text-muted font-mono uppercase mt-1">
                      MATCH SCORE
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Score Breakdown Rows */}
              <div className="flex flex-col gap-4.5">
                {scores.map((score, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs sm:text-sm font-medium text-ink">{score.label}</span>
                      <span className="data-label text-xs font-mono text-muted">
                        {score.value} <span className="text-muted/60">/ {score.max}</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${score.colorClass}`} 
                        style={{ width: `${(score.value / score.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Reason Footer Inside Card */}
              <div className="border-t border-border/60 pt-5 mt-2">
                <span className="data-label text-[10px] font-semibold tracking-widest text-muted font-mono uppercase block mb-3">
                  WHY THIS APPEARS
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-ink bg-paper border border-border/60 px-3 py-1 rounded-full font-medium">
                    Exact preferred branch
                  </span>
                  <span className="text-xs text-ink bg-paper border border-border/60 px-3 py-1 rounded-full font-medium">
                    Within annual budget
                  </span>
                  <span className="text-xs text-ink bg-paper border border-border/60 px-3 py-1 rounded-full font-medium">
                    Preferred city matched
                  </span>
                </div>
              </div>
              
              {/* Data Context Note */}
              <p className="data-label text-[9px] text-muted/80 font-mono tracking-wide text-center mt-2">
                Historical cutoff guidance · Verify current-year data before counselling
              </p>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
