import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar.jsx";

export default function Supervisor() {
  const [agency, setAgency] = useState(null);
  const [verified, setVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUnit, setNewUnit] = useState({ callsign: "", type: "", status: "Available" });

  // 🔹 STEP 1: Fetch the logged-in user's agency
  useEffect(() => {
    async function fetchAgency() {
      try {
        const me = await api.get("/auth/me");
        if (!me.data.user) return;
        const agencyId = me.data.user.agencyId;
        const agencyRes = await api.get(`/agency/${agencyId}`);
        setAgency(agencyRes.data.agency || null);
      } catch (err) {
        console.error("Error fetching agency:", err);
      }
    }
    fetchAgency();
  }, []);

  // 🔹 STEP 2: Handle password verification
  const verifyPassword = () => {
    if (passwordInput.trim() === agency?.supervisorPassword) {
      setVerified(true);
      setError("");
      loadSupervisorData();
    } else {
      setError("Invalid supervisor password for this agency.");
    }
  };

  // 🔹 STEP 3: Fetch users + units if verified
  const loadSupervisorData = async () => {
    setLoading(true);
    try {
      const [usersRes, unitsRes] = await Promise.all([
        api.get("/users"),
        api.get("/units")
      ]);
      setUsers(usersRes.data.users || []);
      setUnits(unitsRes.data.units || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Unit actions
  const addUnit = async (e) => {
    e.preventDefault();
    const res = await api.post("/units", newUnit);
    setUnits([res.data.unit, ...units]);
    setNewUnit({ callsign: "", type: "", status: "Available" });
  };

  const removeUnit = async (unitId) => {
    if (!confirm("Remove this unit?")) return;
    await api.delete(`/units/${unitId}`);
    setUnits(units.filter((u) => u._id !== unitId));
  };

  const updateUnitStatus = async (unitId, status) => {
    await api.patch(`/units/${unitId}/status`, { status });
    setUnits(units.map((u) => (u._id === unitId ? { ...u, status } : u)));
  };

  // 🔸 User actions
  const suspendUser = async (userId) => {
    await api.patch(`/users/${userId}/suspend`);
    setUsers(users.map((u) => (u._id === userId ? { ...u, suspended: true } : u)));
  };

  const unsuspendUser = async (userId) => {
    await api.patch(`/users/${userId}/unsuspend`);
    setUsers(users.map((u) => (u._id === userId ? { ...u, suspended: false } : u)));
  };

  const terminateUser = async (userId) => {
    await api.delete(`/users/${userId}`);
    setUsers(users.filter((u) => u._id !== userId));
  };

  const updateUserRole = async (userId, newRole) => {
    await api.patch(`/users/${userId}/role`, { role: newRole });
    setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
  };

  // =======================================================
  //                     PASSWORD GATE
  // =======================================================
  if (!verified) {
    return (
      <div className="min-h-screen bg-[#050812] text-gray-200 flex items-center justify-center flex-col">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 w-[360px] text-center">
          <h2 className="text-lg font-semibold text-blue-300 mb-3">
            Supervisor Access – {agency ? agency.name : "Loading..."}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Enter your agency's supervisor password to continue.
          </p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Supervisor password"
            className="w-full bg-[#0a1124] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-200"
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <button
            onClick={verifyPassword}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Access Supervisor Console
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  //                VERIFIED SUPERVISOR PANEL
  // =======================================================
  return (
    <div className="min-h-screen bg-[#050812] text-gray-200">
      <Navbar />
      <main className="px-8 py-6 space-y-10">
        {/* Agency Info */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold text-blue-300 mb-2">
            Agency Overview
          </h2>
          {agency ? (
            <div className="text-sm text-gray-300">
              <p><span className="text-gray-400">Agency Name:</span> {agency.name}</p>
              <p><span className="text-gray-400">Agency ID:</span> {agency.agencyId}</p>
              <p><span className="text-gray-400">Supervisor Key:</span> 🔒 Verified</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No agency data.</p>
          )}
        </section>

        {/* User Management */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">User Management</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead className="text-[11px] uppercase text-gray-400">
                  <tr>
                    <th className="text-left py-1 px-2">Username</th>
                    <th className="text-left py-1 px-2">Email</th>
                    <th className="text-left py-1 px-2">Role</th>
                    <th className="text-left py-1 px-2">Status</th>
                    <th className="text-left py-1 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="bg-[#0a1124] hover:bg-[#101b3a] transition-all">
                      <td className="py-2 px-2 text-blue-300 font-semibold">{u.username}</td>
                      <td className="py-2 px-2">{u.email}</td>
                      <td className="py-2 px-2 capitalize">{u.role}</td>
                      <td className="py-2 px-2">
                        {u.suspended ? (
                          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs">
                            Suspended
                          </span>
                        ) : (
                          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 space-x-2">
                        {u.suspended ? (
                          <button
                            onClick={() => unsuspendUser(u._id)}
                            className="text-xs bg-green-500/20 hover:bg-green-600/30 px-2 py-1 rounded-md"
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => suspendUser(u._id)}
                            className="text-xs bg-yellow-500/20 hover:bg-yellow-600/30 px-2 py-1 rounded-md"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => terminateUser(u._id)}
                          className="text-xs bg-red-500/20 hover:bg-red-600/30 px-2 py-1 rounded-md"
                        >
                          Terminate
                        </button>
                        <button
                          onClick={() =>
                            updateUserRole(
                              u._id,
                              u.role === "user" ? "supervisor" : "user"
                            )
                          }
                          className="text-xs bg-blue-500/20 hover:bg-blue-600/30 px-2 py-1 rounded-md"
                        >
                          Promote/Demote
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500 text-xs">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Unit Management */}
        <section className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">Unit Management</h2>
          <form onSubmit={addUnit} className="flex gap-3 mb-4">
            <input
              placeholder="Callsign"
              value={newUnit.callsign}
              onChange={(e) =>
                setNewUnit({ ...newUnit, callsign: e.target.value })
              }
              className="bg-[#0a1124] border border-white/10 px-3 py-2 rounded-md text-sm"
              required
            />
            <input
              placeholder="Type"
              value={newUnit.type}
              onChange={(e) =>
                setNewUnit({ ...newUnit, type: e.target.value })
              }
              className="bg-[#0a1124] border border-white/10 px-3 py-2 rounded-md text-sm"
              required
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Add
            </button>
          </form>

          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead className="text-[11px] uppercase text-gray-400">
                <tr>
                  <th className="text-left py-1 px-2">Callsign</th>
                  <th className="text-left py-1 px-2">Type</th>
                  <th className="text-left py-1 px-2">Status</th>
                  <th className="text-left py-1 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u._id} className="bg-[#0a1124] hover:bg-[#101b3a] transition-all">
                    <td className="py-2 px-2 text-blue-300 font-semibold">{u.callsign}</td>
                    <td className="py-2 px-2">{u.type}</td>
                    <td className="py-2 px-2 text-xs">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 space-x-2">
                      <button
                        onClick={() => updateUnitStatus(u._id, "Available")}
                        className="text-xs bg-green-500/20 hover:bg-green-600/30 px-2 py-1 rounded-md"
                      >
                        Avail
                      </button>
                      <button
                        onClick={() => updateUnitStatus(u._id, "Out of Service")}
                        className="text-xs bg-yellow-500/20 hover:bg-yellow-600/30 px-2 py-1 rounded-md"
                      >
                        OOS
                      </button>
                      <button
                        onClick={() => removeUnit(u._id)}
                        className="text-xs bg-red-500/20 hover:bg-red-600/30 px-2 py-1 rounded-md"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
