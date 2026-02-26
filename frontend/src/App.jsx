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
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Overview from "./pages/AdminComponent/Overview";
import {Request} from "./pages/AdminComponent/Request";

import Volunteer from "./pages/AdminComponent/Volunteer";
import MakeAdmin from "./pages/AdminComponent/MakeAdmin";
import Reports from "./pages/AdminComponent/Reports";
import ReportAccessedLog from "./pages/AdminComponent/ReportAccesedLog";
import AuditLog from "./pages/AdminComponent/AuditLog";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
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
            />
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

            <Route path="*" element={<Unauthorize />}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
