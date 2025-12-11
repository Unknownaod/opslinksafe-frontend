import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar.jsx";

export default function IncidentView() {
  const { id } = useParams(); // incidentId, not _id
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIncident() {
      try {
        // You may need this endpoint in backend: GET /api/incidents/incidents/:id
        const res = await api.get(`/incidents/${id}`);
        setIncident(res.data.incident);
      } catch (err) {
        console.error(err);
        setError("Unable to load incident details.");
      }
    }
    fetchIncident();
  }, [id]);

  if (!incident && !error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050812] text-gray-300">
        <div className="border-4 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
        <p className="ml-3 text-sm">Loading incident…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050812] text-gray-200">
      <Navbar />
      <main className="px-8 py-6 max-w-5xl mx-auto">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {incident && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-blue-400">
                  Incident #{incident.incidentId}
                </h1>
                <p className="text-sm text-gray-400">{incident.type}</p>
                <p className="text-xs text-gray-500">
                  {incident.location?.address}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <span className="px-3 py-1 text-[11px] rounded-full bg-blue-500/20 text-blue-300">
                  {incident.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-blue-300 mb-3">
                  Timeline
                </h2>
                {incident.timeline?.length ? (
                  <div className="space-y-3 text-sm max-h-[50vh] overflow-y-auto pr-1">
                    {incident.timeline.map((t, idx) => (
                      <div key={idx} className="border-l border-blue-500/40 pl-3">
                        <div className="text-xs text-gray-400">
                          {new Date(t.ts).toLocaleString()} — {t.status}
                        </div>
                        <div className="text-gray-200">{t.message}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    No timeline entries recorded.
                  </p>
                )}
              </section>

              <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-blue-300 mb-3">
                  Assigned Units
                </h2>
                {incident.unitsAssigned?.length ? (
                  <ul className="space-y-1 text-sm">
                    {incident.unitsAssigned.map((u) => (
                      <li
                        key={u}
                        className="bg-[#0a1124] border border-white/5 rounded px-3 py-2"
                      >
                        {u}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No units assigned.</p>
                )}

                <h2 className="text-sm font-semibold text-blue-300 mt-5 mb-3">
                  Notes
                </h2>
                {incident.notes?.length ? (
                  <div className="space-y-2 text-xs max-h-[20vh] overflow-y-auto pr-1">
                    {incident.notes.map((n, idx) => (
                      <div key={idx} className="bg-[#0a1124] rounded p-2">
                        <div className="text-gray-400">
                          {new Date(n.ts).toLocaleString()}
                        </div>
                        <div className="text-gray-200 mt-1">{n.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No notes recorded.</p>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
