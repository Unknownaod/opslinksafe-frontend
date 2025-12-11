import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar.jsx";
import StatCard from "../components/StatCard.jsx";
import IncidentCard from "../components/IncidentCard.jsx";
import UnitCard from "../components/UnitCard.jsx";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // NOTE: if your incidentRoutes are mounted as /api/incidents/incidents,
        // change "/incidents" to "/incidents/incidents"
        const [incRes, unitRes] = await Promise.all([
          api.get("/incidents"), // or "/incidents/incidents" depending on backend
          api.get("/units")
        ]);

        setIncidents(incRes.data.incidents || []);
        setUnits(unitRes.data.units || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeIncidents = incidents.filter(
    (i) => i.status !== "CLEARED" && i.status !== "CANCELLED"
  );

  const availableUnits = units.filter((u) => u.status === "AVAILABLE");

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050812] text-gray-300">
        <div className="border-4 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
        <p className="ml-3 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050812] text-gray-200">
      <Navbar />

      <main className="px-8 py-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Incidents"
            value={activeIncidents.length}
            sub={`${incidents.length} total today`}
          />
          <StatCard
            label="Available Units"
            value={availableUnits.length}
            sub={`${units.length} total units`}
          />
          <StatCard
            label="On Scene"
            value={incidents.filter((i) => i.status === "ON_SCENE").length}
          />
          <StatCard
            label="Dispatched"
            value={incidents.filter(
              (i) => i.status === "DISPATCHED" || i.status === "EN_ROUTE"
            ).length}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* INCIDENTS */}
          <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-300">
                Active Incidents
              </h2>
              <span className="text-[11px] text-gray-500">
                Showing latest {incidents.length}
              </span>
            </div>

            {incidents.length === 0 ? (
              <p className="text-gray-400 text-sm">No incidents recorded.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {incidents.map((inc) => (
                  <IncidentCard key={inc._id || inc.incidentId} incident={inc} />
                ))}
              </div>
            )}
          </section>

          {/* UNITS */}
          <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-semibold text-blue-300 mb-4">
              Unit Status
            </h2>
            {units.length === 0 ? (
              <p className="text-gray-400 text-sm">No units registered.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {units.map((unit) => (
                  <UnitCard key={unit._id || unit.unitId} unit={unit} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
