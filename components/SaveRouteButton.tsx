"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SaveRouteButton({ programId }: { programId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session?.user) {
      fetch("/api/saved-routes")
        .then((res) => {
          if (!res.ok) throw new Error("Unable to fetch saved routes.");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setIsSaved(data.some((item: { programId: string }) => item.programId === programId));
          }
        })
        .catch((err) => console.error("Error fetching saved routes status:", err));
    }
  }, [session, status, programId]);

  const handleToggle = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      if (nextSavedState) {
        const res = await fetch("/api/saved-routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ programId }),
        });
        if (!res.ok) throw new Error("Unable to save route.");
      } else {
        const res = await fetch("/api/saved-routes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ programId }),
        });
        if (!res.ok) throw new Error("Unable to remove route.");
      }
    } catch (err) {
      console.error(err);
      setIsSaved(!nextSavedState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      aria-pressed={Boolean(session?.user && isSaved)}
      className={`inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
        session?.user && isSaved
          ? "bg-safe/10 border-safe text-safe hover:bg-warning/10 hover:border-warning hover:text-warning"
          : "bg-surface border-border text-ink hover:bg-border/10"
      }`}
    >
      {session?.user && isSaved ? (hovered ? "Remove" : "Saved") : "Save Route"}
    </button>
  );
}
