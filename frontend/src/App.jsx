import Body1 from "./public-page/Body1";
import Navbar2 from "./public-page/Navbar2";
import CrimeInfo from "./public-page/CrimeInfo";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import CrimeSubmit from "./pages/CrimeSubmit";
import CrimeRepository from "./pages/CrimeRepository";
import { Login } from "./public-page/Login";
import Register from "./public-page/Register";

import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorize from "./public-page/Unauthorize";
import AdminDashboard from "./pages/AdminComponent/AdminDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard/VolunteerDashboard";
import Overview from "./pages/AdminComponent/Overview";
import {Request} from "./pages/AdminComponent/Request";

import Volunteer from "./pages/AdminComponent/Volunteer";
import MakeAdmin from "./pages/AdminComponent/MakeAdmin";
import Reports from "./pages/AdminComponent/Reports";
import ReportAccessedLog from "./pages/AdminComponent/ReportAccesedLog";
import AuditLog from "./pages/AdminComponent/AuditLog";
import MyInvestigation from "./pages/VolunteerDashboard/myInvestigation";
import AllReport from "./pages/VolunteerDashboard/allReport";
import axios from 'axios'

import ForgotPassword from "./forgot";

import { io } from "socket.io-client";
import { useEffect,useContext } from "react";
import { AuthContext } from "./AuthContext";
import { socket } from './public-page/socket'; // Recommended to keep socket in its own file

// axios.defaults.withCredentials = true;
// const socket = io("http://localhost:3000", { withCredentials: true });

function SocketHandler() {
  const { user } = useContext(AuthContext); // Now this works!

  useEffect(() => {
    if (user && user.email) {
      socket.emit('go-online', user.email);
    }
  }, [user]);

  return null; // This component doesn't need to render anything
}

function App() {

  
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <SocketHandler /> {/* This handles the connection */}
          <Navbar2 />
          {/* </AuthProvider> */}
          <Routes>
            <Route path="/" element={<Body1 />} />
            <Route path="/home/crime-info" element={<CrimeInfo />} />
            <Route
              path="/home/crime-submit"
              element={
                <ProtectedRoute roles={["admin", "volunteer"]}>
                  <CrimeSubmit />
                </ProtectedRoute>
              }/>

            <Route
              path="/home/crime-repository"
              element={
                <ProtectedRoute roles={["admin", "volunteer"]}>
                  <CrimeRepository />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/volunteer-dashboard"
              element={
                <ProtectedRoute roles="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview/>}/>
                <Route path="all-reports" element={<AllReport/>}/>
                <Route path="my-investigation" element={<MyInvestigation/>}/>
                

            </Route>
            <Route
              path="/home/admin-dashboard"
              element={
                <ProtectedRoute roles="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }>
                <Route index element={<Overview/>}/>
                <Route path="Request" element={<Request/>}/>
                <Route path="Volunteer" element={<Volunteer/>}/>
                <Route path="make-admin" element={<MakeAdmin/>}/>
                <Route path="reports" element={<Reports/>}/>
                <Route path="report-accessed-log" element={<ReportAccessedLog/>}/>
                <Route path="audit-logs" element={<AuditLog/>}/>
              </Route>

            <Route path="/home/login" element={<Login />} />
            <Route path="/home/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorize/>} />

            <Route path="/home/forgot" element={<ForgotPassword/>}/>

            <Route path="*" element={<Unauthorize />}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
// const getCompleteDetails = async () => {
//     // A. System & Browser (Client Hints)
//     let uaData = {};
//     if (navigator.userAgentData) {
//         uaData = await navigator.userAgentData.getHighEntropyValues([
//             "architecture", "bitness", "model", "platformVersion", "fullVersionList"
//         ]);
//     }

//     // B. Graphics (WebGL)
//     const canvas = document.createElement('canvas');
//     const gl = canvas.getContext('webgl');
//     const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
//     const gpu = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown GPU";

//     // C. Network
//     const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

//     // D. Battery
//     let battery = {};
//     if (navigator.getBattery) {
//         const b = await navigator.getBattery();
//         battery = { level: b.level * 100 + "%", charging: b.charging };
//     }

//     let data = {
//         system: {
//             os: uaData.platform,
//             osVersion: uaData.platformVersion,
//             arch: uaData.architecture,
//             ram: navigator.deviceMemory + "GB",
//             cores: navigator.hardwareConcurrency
//         },
//         browser: {
//             name: uaData.brands?.[0]?.brand,
//             version: uaData.fullVersionList?.[0]?.version,
//             language: navigator.language
//         },
//         graphics: {
//             gpu: gpu,
//             screen: `${window.screen.width}x${window.screen.height}`,
//             pixelRatio: window.devicePixelRatio
//         },
//         network: {
//             type: conn?.effectiveType,
//             downlink: conn?.downlink + "Mbps",
//             saveData: conn?.saveData
//         },
//         state: battery
//     };
//     console.log('device data', data)
// };