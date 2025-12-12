import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-[#060b18]/80 backdrop-blur-xl">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold">
          OS
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-gray-400">
            OpsLink SAFE
          </div>
          <div className="text-xs text-gray-500">
            Fire & EMS Computer-Aided Dispatch
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => navigate("/dispatch")}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all text-white font-medium text-xs"
        >
          Open Dispatch
        </button>

        <button
          onClick={() => navigate("/supervisor")}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 transition-all text-black font-medium text-xs shadow-[0_0_10px_rgba(255,193,7,0.4)]"
        >
          Supervisor
        </button>

        <button
          onClick={logout}
          className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
