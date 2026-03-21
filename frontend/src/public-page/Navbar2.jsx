import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
axios.defaults.withCredentials = true;

const Navbar2 = () => {
  const { loginStatus, logout, role } = useContext(AuthContext);

  const navigate = useNavigate();

  const logoutHandle = async () => {
    const axiosResponse = await axios.get("http://localhost:3000/home/logout", { withCredentials: true }, {
      headers: { "Content-Type": "application/json" },
    });
    logout();
    navigate("/");
  };

  return (
    <div className="bg-slate-950 border-b border-white/8 px-6 py-3 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">

      {/* brand */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-red-500/30">
          C
        </div>
        <h1 className="text-white text-lg font-extrabold tracking-tight group-hover:text-orange-300 transition-colors">
          Crime Report <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">Desk</span>
        </h1>
      </Link>

      {/* nav links */}
      <ul className="flex items-center gap-1">
        <Link to="/"
          className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all font-medium">
          Home
        </Link>
        <Link to="/home/crime-info"
          className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all font-medium">
          Crime Info
        </Link>

        {loginStatus ? (
          <>
            <Link to="/home/crime-submit"
              className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all font-medium">
              Crime Submit
            </Link>
            <Link to="/home/crime-repository"
              className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all font-medium">
              Repository
            </Link>

            {role === "volunteer" ? (
              <Link to="/home/volunteer-dashboard"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all font-medium">
                Dashboard
              </Link>
            ) : (
              <Link to="/home/admin-dashboard"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all font-medium">
                Dashboard
              </Link>
            )}

            <div className="w-px h-4 bg-white/10 mx-2" />

            <button
              onClick={logoutHandle}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/home/login"
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Login
            </Link>
            <Link to="/home/register"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-lg shadow-red-500/20 transition-all">
              Register
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar2;