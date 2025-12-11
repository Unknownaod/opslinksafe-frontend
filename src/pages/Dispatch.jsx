import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar.jsx";

export default function Dispatch() {
  const [incidents, setIncidents] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [incRes, unitRes] = await Promise.all([
        api.get("/incidents"), // adjust to /incidents/incidents if needed
        api.get("/units")
      ]);
      setIncidents(incRes.data.incidents || []);
      setUnits(unitRes.data.units || []);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050812] text-gray-200">
      <Navbar />

      <main className="px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INCIDENT TABLE */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">
            Incidents
          </h2>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead className="text-[11px] uppercase text-gray-400">
                <tr>
                  <th className="text-left py-1 px-2">ID</th>
                  <th className="text-left py-1 px-2">Type</th>
                  <th className="text-left py-1 px-2">Address</th>
                  <th className="text-left py-1 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr
                    key={inc._id || inc.incidentId}
                    className="bg-[#0a1124] hover:bg-[#101b3a] transition-all"
                  >
                    <td className="py-2 px-2 text-blue-300 font-semibold">
                      #{inc.incidentId}
                    </td>
                    <td className="py-2 px-2">{inc.type}</td>
                    <td className="py-2 px-2 text-gray-400">
                      {inc.location?.address}
                    </td>
                    <td className="py-2 px-2 text-[11px]">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 text-center text-gray-500 text-xs"
                    >
                      No incidents to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* UNIT TABLE */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">Units</h2>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead className="text-[11px] uppercase text-gray-400">
                <tr>
                  <th className="text-left py-1 px-2">Callsign</th>
                  <th className="text-left py-1 px-2">Type</th>
                  <th className="text-left py-1 px-2">Status</th>
                  <th className="text-left py-1 px-2">Incident</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr
                    key={unit._id || unit.unitId}
                    className="bg-[#0a1124] hover:bg-[#101b3a] transition-all"
                  >
                    <td className="py-2 px-2 text-blue-300 font-semibold">
                      {unit.callsign}
                    </td>
                    <td className="py-2 px-2">{unit.type}</td>
                    <td className="py-2 px-2 text-[11px]">
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-gray-400 text-xs">
                      {unit.currentIncidentId || "—"}
                    </td>
                  </tr>
                ))}
                {units.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 text-center text-gray-500 text-xs"
                    >
                      No units registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
