import { Route, Routes, Link, useLocation } from "react-router-dom"
import { Navbar } from "../utilComponents/Navbar"
import { EmployeeWeek } from "./EmployeeWeek"
import { Daily } from "../gridComponents/Daily"
import { Add } from "./Add"
import { AddTimeTrack } from "../timeTrack/pages/AddTimeTrack"
import { TimeTrackView } from "../timeTrack/pages/TimeTrackView"
import { Login } from "../timeTrack/pages/Login"
import { LogList } from "../timeTrack/pages/LogList"
import { Landing } from "./Landing"
import { TechInfo } from "./TechInfo"
import { useContext, useState } from "react"
import { SchedulesByEmployee } from "./SchedulesByEmployee"
import { AdminPage } from "./AdminPage"
import { CyclesGenerator } from "../genericShifts/pages/CyclesGenerator"
import { SetupWeek } from "../genericShifts/pages/SetupWeek"
import { ShiftForm } from "./ShiftForm"
import { Reports } from "./Reports"
import { RosterPage } from "./RosterPage"
import { ChatUI } from "../ia/components/ChatUI"
import { AuthContext } from "@/timeTrack/context/AuthContext"
import { ProtectedRoute } from "@/timeTrack/context/ProtectedRoute"


export const MainPage = () => {
  const [showDemoBanner, setShowDemoBanner] = useState(true)
  const location = useLocation()
  const isRosterPage = location.pathname === "/"
  const { auth } = useContext(AuthContext);

  // Definimos los grupos de roles para no repetir strings
  const ALL_AUTHENTICATED = ["USER", "ADMIN", "DEMO"];
  const ONLY_ADMIN = ["ADMIN", "DEMO"];

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="container grid min-h-[100dvh] max-w-full grid-rows-[auto_1fr_auto] relative px-0">
        <header>
          <Navbar />
        </header>

        {/* Banner DEMO: Solo se muestra si el usuario logueado tiene rol DEMO */}
        {auth.role === "DEMO" && showDemoBanner && (
          <div
            className="absolute right-6 z-50 flex items-center gap-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-5 py-3 rounded-lg shadow-lg mt-2"
            style={{ top: isRosterPage ? "8.5rem" : "4.5rem" }}
          >
            <div>
              <span className="font-semibold block">
                ¡Estás usando una versión DEMO sin conexión a la API!
              </span>
              <span className="text-sm">
                Puedes explorar la app libremente. Si quieres más información,&nbsp;
                <Link to="/info" className="underline text-indigo-700 hover:text-indigo-900 font-semibold">
                  haz clic aquí
                </Link>.
              </span>
            </div>
            <button onClick={() => setShowDemoBanner(false)} className="ml-2 text-yellow-700 hover:text-yellow-900 font-bold text-lg">×</button>
          </div>
        )}

        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <div className="pointer-events-auto"><ChatUI /></div>
        </div>

        <main className="flex flex-col w-full max-w-full overflow-x-auto">
          <Routes>
            {/* --- 1. RUTAS TOTALMENTE PÚBLICAS --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/fichar" element={<AddTimeTrack />} />
            <Route path="/info" element={<Landing />} />
            <Route path="/techinfo" element={<TechInfo />} />

            {/* --- 2. RUTAS PARA USER, ADMIN Y DEMO --- */}
            <Route path="/revisar" element={
              <ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><TimeTrackView /></ProtectedRoute>
            } />
            <Route path="/schedules" element={
              <ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><SchedulesByEmployee /></ProtectedRoute>
            } />

            {/* --- 3. RUTAS SOLO PARA ADMIN (O DEMO) --- */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><RosterPage /></ProtectedRoute>
            } />
            <Route path="/daily" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><Daily /></ProtectedRoute>
            } />
            <Route path="/employeeweek" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><EmployeeWeek /></ProtectedRoute>
            } />
            <Route path="/adduser" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><Add /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><AdminPage /></ProtectedRoute>
            } />
            <Route path="/loglist" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><LogList /></ProtectedRoute>
            } />
            <Route path="/generate" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><CyclesGenerator /></ProtectedRoute>
            } />
            <Route path="/setupweek" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><SetupWeek /></ProtectedRoute>
            } />
            <Route path="/generate-individual" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><ShiftForm /></ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={ONLY_ADMIN}><Reports /></ProtectedRoute>
            } />
          </Routes>
        </main>

        <footer className="mt-8 mb-2">
          <p className="text-center">© 2025 WorkSchedFlow. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}