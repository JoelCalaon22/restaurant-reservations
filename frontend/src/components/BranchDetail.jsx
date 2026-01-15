import { useEffect, useState } from "react";
import { apiGet } from "../api/client";

export default function BranchDetail({ branch, onBack }) {
  const [tables, setTables] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiGet(`/branches/${branch.id}/tables`).then(setTables);
    apiGet(`/branches/${branch.id}/summary`).then(setSummary);
  }, [branch.id]);

  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-zinc-400 hover:text-white"
      >
        ← Back to branches
      </button>

      <h2 className="text-2xl font-bold">{branch.name}</h2>
      <p className="text-zinc-400">{branch.city}</p>

      {summary && (
        <div className="mt-4 text-sm text-zinc-400">
          Tables: {summary.tables} — Total seats: {summary.totalSeats}
        </div>
      )}

      <h3 className="mt-6 font-semibold">Tables</h3>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {tables.map(t => (
          <div
            key={t.id}
            className="rounded border border-zinc-800 p-3 bg-zinc-900"
          >
            <div>Table {t.id}</div>
            <div className="text-sm text-zinc-400">
              Seats: {t.seats}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
