import { useNavigate } from "react-router-dom";

export default function IncidentCard({ incident }) {
  const navigate = useNavigate();

  const statusColor =
    incident.status === "ON_SCENE"
      ? "bg-green-500/20 text-green-300"
      : incident.status === "DISPATCHED" || incident.status === "EN_ROUTE"
      ? "bg-yellow-500/20 text-yellow-300"
      : incident.status === "CLEARED"
      ? "bg-gray-500/30 text-gray-200"
      : "bg-blue-500/20 text-blue-300";

  return (
    <div
      className="bg-[#0a1124] border border-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-[#101b3a] transition-all cursor-pointer"
      onClick={() => navigate(`/incident/${incident.incidentId}`)}
    >
      <div>
        <div className="font-semibold text-blue-400">
          #{incident.incidentId} · {incident.type}
        </div>
        <div className="text-xs text-gray-400">
          {incident.location?.address || "No address on file"}
        </div>
        <div className="text-[11px] text-gray-500 mt-1">
          Opened: {new Date(incident.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`px-3 py-1 text-[11px] rounded-full ${statusColor}`}>
          {incident.status}
        </span>
        <span className="text-[11px] text-gray-500">
          Units: {incident.unitsAssigned?.length || 0}
        </span>
      </div>
    </div>
  );
}
