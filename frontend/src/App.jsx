import "./App.css";
import { useEffect, useMemo, useState } from "react";
import BranchDetail from "./components/BranchDetail";
import { apiGet, BASE_URL } from "./api/client";

export default function App() {
  const [branches, setBranches] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBranch, setSelectedBranch] = useState(null);

  const filtered = useMemo(() => {
    const c = city.trim().toLowerCase();
    if (!c) return branches;
    return branches.filter((b) => (b.city || "").toLowerCase().includes(c));
  }, [branches, city]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiGet("/branches");
        setBranches(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load branches");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Restaurant Reservations</h1>
          <p className="text-zinc-400">Frontend (WIP) • API: {BASE_URL}</p>
        </header>

        
        {selectedBranch ? (
          <BranchDetail
            branch={selectedBranch}
            onBack={() => setSelectedBranch(null)}
          />
        ) : (
          <>
            {/* Filtro */}
            <div className="mb-4 flex gap-3">
              <input
                className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
                placeholder="Filter by city (e.g. Rosario)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button
                className="rounded-lg bg-zinc-100 text-zinc-900 px-4 py-2 font-medium hover:bg-white"
                onClick={() => setCity("")}
              >
                Clear
              </button>
            </div>

            {loading && <p className="text-zinc-400">Loading branches...</p>}

            {error && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
                <div className="font-semibold">Could not load branches</div>
                <div className="mt-1">{error}</div>
                <div className="text-sm text-red-300 mt-2">
                  Tip: make sure your backend is running on{" "}
                  <span className="underline">http://localhost:3000</span>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
                    >
                      <h2 className="text-lg font-semibold">{b.name}</h2>
                      <p className="text-zinc-400">{b.city}</p>
                      <p className="text-zinc-500 text-sm mt-1">ID: {b.id}</p>

                      {"capacity" in b && (
                        <div className="mt-3 text-sm text-zinc-300">
                          Capacity:{" "}
                          <span className="font-semibold">{b.capacity}</span>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <button
                          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                          onClick={() => setSelectedBranch(b)}
                        >
                          View details
                        </button>

                        <button
                          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                          onClick={() =>
                            alert(`Next: create reservation for ${b.id}`)
                          }
                        >
                          Create reservation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <p className="text-zinc-400 mt-4">No branches found.</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
