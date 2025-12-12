import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar.jsx";

export default function Dispatch() {
  const [incidents, setIncidents] = useState([]);
  const [units, setUnits] = useState([]);
  const [newIncident, setNewIncident] = useState({
    type: "",
    priority: "2",
    address: "",
    notes: ""
  });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Fetch incidents & units
  useEffect(() => {
    async function fetchData() {
      try {
        const [incRes, unitRes] = await Promise.all([
          api.get("/incidents"),
          api.get("/units")
        ]);
        setIncidents(incRes.data.incidents || []);
        setUnits(unitRes.data.units || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();

    // Optional live refresh every 10s
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Create new incident
  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/incidents", newIncident);
      setIncidents((prev) => [res.data.incident, ...prev]);
      setNewIncident({ type: "", priority: "2", address: "", notes: "" });
    } catch (err) {
      console.error("Error creating incident:", err);
    }
  };

  // Assign unit to incident
  const handleAssignUnit = async (unitId, incidentId) => {
    try {
      await api.post(`/units/${unitId}/assign`, { incidentId });
      setAssignModal(false);
      const [incRes, unitRes] = await Promise.all([
        api.get("/incidents"),
        api.get("/units")
      ]);
      setIncidents(incRes.data.incidents || []);
      setUnits(unitRes.data.units || []);
    } catch (err) {
      console.error("Error assigning unit:", err);
    }
  };

  // Update unit status
  const handleStatusChange = async (unitId, status) => {
    try {
      await api.patch(`/units/${unitId}/status`, { status });
      setUnits((prev) =>
        prev.map((u) => (u._id === unitId ? { ...u, status } : u))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Close incident
  const handleCloseIncident = async (incidentId) => {
    try {
      await api.patch(`/incidents/${incidentId}/close`);
      setIncidents((prev) =>
        prev.map((i) =>
          i._id === incidentId ? { ...i, status: "Closed" } : i
        )
      );
    } catch (err) {
      console.error("Error closing incident:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050812] text-gray-200">
      <Navbar />

      <main className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ==================== INCIDENTS ==================== */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-300">Active Incidents</h2>
            <button
              onClick={() =>
                document.getElementById("createIncidentModal").showModal()
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-md"
            >
              + New Call
            </button>
          </div>

          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead className="text-[11px] uppercase text-gray-400">
                <tr>
                  <th className="text-left py-1 px-2">ID</th>
                  <th className="text-left py-1 px-2">Type</th>
                  <th className="text-left py-1 px-2">Priority</th>
                  <th className="text-left py-1 px-2">Address</th>
                  <th className="text-left py-1 px-2">Status</th>
                  <th className="text-left py-1 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr
                    key={inc._id}
                    className="bg-[#0a1124] hover:bg-[#101b3a] transition-all"
                  >
                    <td className="py-2 px-2 font-semibold text-blue-300">
                      #{inc.incidentId}
                    </td>
                    <td className="py-2 px-2">{inc.type}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          inc.priority === "1"
                            ? "bg-red-500/20 text-red-300"
                            : inc.priority === "2"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {inc.priority}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-gray-400">{inc.address}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          inc.status === "Closed"
                            ? "bg-gray-500/20 text-gray-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedIncident(inc);
                          setAssignModal(true);
                        }}
                        className="text-xs bg-blue-500/20 hover:bg-blue-600/30 text-blue-300 px-2 py-1 rounded-md"
                      >
                        Assign
                      </button>
                      {inc.status !== "Closed" && (
                        <button
                          onClick={() => handleCloseIncident(inc._id)}
                          className="text-xs bg-red-500/20 hover:bg-red-600/30 text-red-300 px-2 py-1 rounded-md"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 text-center text-gray-500 text-xs"
                    >
                      No incidents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================== UNITS ==================== */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">
            Active Units
          </h2>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead className="text-[11px] uppercase text-gray-400">
                <tr>
                  <th className="text-left py-1 px-2">Callsign</th>
                  <th className="text-left py-1 px-2">Status</th>
                  <th className="text-left py-1 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr
                    key={u._id}
                    className="bg-[#0a1124] hover:bg-[#101b3a] transition-all"
                  >
                    <td className="py-2 px-2 text-blue-300 font-semibold">
                      {u.callsign}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.status === "Available"
                            ? "bg-green-500/20 text-green-300"
                            : u.status === "En Route"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 space-x-1">
                      <button
                        onClick={() => handleStatusChange(u._id, "Available")}
                        className="bg-green-500/20 hover:bg-green-500/30 text-xs px-2 py-1 rounded"
                      >
                        Avail
                      </button>
                      <button
                        onClick={() => handleStatusChange(u._id, "En Route")}
                        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-xs px-2 py-1 rounded"
                      >
                        EnRt
                      </button>
                      <button
                        onClick={() => handleStatusChange(u._id, "On Scene")}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-xs px-2 py-1 rounded"
                      >
                        Scene
                      </button>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
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

      {/* ==================== CREATE INCIDENT MODAL ==================== */}
      <dialog id="createIncidentModal" className="modal">
        <form
          method="dialog"
          onSubmit={handleCreateIncident}
          className="modal-box bg-[#0a1124] border border-white/10 text-sm text-gray-200"
        >
          <h3 className="font-semibold text-blue-400 mb-3">New Incident</h3>
          <label className="block mb-2 text-xs uppercase">Type</label>
          <input
            value={newIncident.type}
            onChange={(e) =>
              setNewIncident({ ...newIncident, type: e.target.value })
            }
            className="w-full bg-[#050812] border border-white/10 rounded-md px-3 py-2 mb-3"
            placeholder="Structure Fire, MVC, Medical..."
            required
          />

          <label className="block mb-2 text-xs uppercase">Priority</label>
          <select
            value={newIncident.priority}
            onChange={(e) =>
              setNewIncident({ ...newIncident, priority: e.target.value })
            }
            className="w-full bg-[#050812] border border-white/10 rounded-md px-3 py-2 mb-3"
          >
            <option value="1">Priority 1 - Life Threat</option>
            <option value="2">Priority 2 - Urgent</option>
            <option value="3">Priority 3 - Routine</option>
          </select>

          <label className="block mb-2 text-xs uppercase">Address</label>
          <input
            value={newIncident.address}
            onChange={(e) =>
              setNewIncident({ ...newIncident, address: e.target.value })
            }
            className="w-full bg-[#050812] border border-white/10 rounded-md px-3 py-2 mb-3"
            placeholder="123 Main St"
            required
          />

          <label className="block mb-2 text-xs uppercase">Notes</label>
          <textarea
            value={newIncident.notes}
            onChange={(e) =>
              setNewIncident({ ...newIncident, notes: e.target.value })
            }
            className="w-full bg-[#050812] border border-white/10 rounded-md px-3 py-2 mb-3"
            rows="3"
            placeholder="Caller reports smoke showing..."
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() =>
                document.getElementById("createIncidentModal").close()
              }
              className="px-3 py-1 bg-white/10 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Create
            </button>
          </div>
        </form>
      </dialog>

      {/* ==================== ASSIGN UNIT MODAL ==================== */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0a1124] border border-white/10 rounded-xl p-6 w-[400px] text-sm">
            <h3 className="font-semibold text-blue-400 mb-4">
              Assign Unit to #{selectedIncident?.incidentId}
            </h3>
            <div className="max-h-[200px] overflow-y-auto">
              {units
                .filter((u) => u.status === "Available")
                .map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleAssignUnit(u._id, selectedIncident._id)}
                    className="w-full text-left bg-[#0f1a36] hover:bg-[#14224a] px-3 py-2 rounded-md mb-2"
                  >
                    {u.callsign} – {u.type}
                  </button>
                ))}
              {units.filter((u) => u.status === "Available").length === 0 && (
                <p className="text-gray-500 text-xs text-center">
                  No available units.
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setAssignModal(false)}
                className="px-3 py-1 bg-white/10 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
