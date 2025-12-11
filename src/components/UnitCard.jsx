export default function UnitCard({ unit }) {
  const statusColor =
    unit.status === "AVAILABLE"
      ? "bg-green-500/20 text-green-300"
      : unit.status === "DISPATCHED" || unit.status === "EN_ROUTE"
      ? "bg-yellow-500/20 text-yellow-300"
      : unit.status === "ON_SCENE"
      ? "bg-blue-500/20 text-blue-300"
      : "bg-red-500/20 text-red-300";

  return (
    <div className="bg-[#0a1124] border border-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-[#101b3a] transition-all">
      <div>
        <div className="font-semibold text-blue-300">{unit.callsign}</div>
        <div className="text-xs text-gray-400">{unit.type}</div>
        {unit.currentIncidentId && (
          <div className="text-[11px] text-gray-500 mt-1">
            Incident: {unit.currentIncidentId}
          </div>
        )}
      </div>
      <span className={`px-3 py-1 text-[11px] rounded-full ${statusColor}`}>
        {unit.status}
      </span>
    </div>
  );
}
