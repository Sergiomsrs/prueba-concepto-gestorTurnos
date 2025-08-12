import { Route, Routes, Link } from "react-router-dom"
import { LoginPage } from "./LoginPage"
import { Navbar } from "../utilComponents/Navbar"
import { EmployeeWeek } from "./EmployeeWeek"
import { Daily } from "../gridComponents/Daily"
import { Add } from "./Add"
import { Report } from "./Report"
import { AddTimeTrack } from "../timeTrack/pages/AddTimeTrack"
import { TimeTrackView } from "../timeTrack/pages/TimeTrackView"
import { Login } from "../timeTrack/pages/Login"
import { LogList } from "../timeTrack/pages/LogList"
import { Landing } from "./Landing"
import { TechInfo } from "./TechInfo"
import { useState } from "react"

export const MainPage = () => {
  const [showDemoBanner, setShowDemoBanner] = useState(true)

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen w-full max-w-full overflow-x-hidden p-4 sm:px-8 lg:px-16">
      <div className="container grid min-h-[100dvh] max-w-full grid-rows-[auto_1fr_auto] relative px-0">
        <header className="mb-6">
          <Navbar />
        </header>

        {/* Banner DEMO debajo de la navbar */}
        {showDemoBanner && (
          <div
            className="absolute right-6 z-30 flex items-center gap-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-5 py-3 rounded-lg shadow-lg mt-2"
            style={{ top: "4.5rem" }} 
          >
            <div>
              <span className="font-semibold block">
                ¡Estás usando una versión DEMO sin conexión a la API!
              </span>
              <span className="text-sm">
                Puedes explorar la app libremente. Si quieres más información,&nbsp;
                <Link
                  to="/info"
                  className="underline text-indigo-700 hover:text-indigo-900 font-semibold"
                >
                  haz clic aquí
                </Link>
                .
              </span>
            </div>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="ml-2 text-yellow-700 hover:text-yellow-900 font-bold text-lg leading-none"
              aria-label="Cerrar aviso demo"
            >
              ×
            </button>
          </div>
        )}
        {!showDemoBanner && (
          <button
            onClick={() => setShowDemoBanner(true)}
            className="absolute right-6 z-30 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-1 rounded-full shadow hover:bg-yellow-200 transition"
            style={{ top: "4.5rem" }}
            aria-label="Mostrar aviso demo"
          >
            Mostrar aviso DEMO
          </button>
        )}

        <main className="flex flex-col w-full max-w-full overflow-x-auto pl-0">
          <Routes>
            <Route path="/" element={<Daily />} />
            <Route path="/employeeweek" element={<EmployeeWeek />} />
            <Route path="/landing" element={<LoginPage />} />
            <Route path="/adduser" element={<Add />} />
            <Route path="/report" element={<Report />} />
            <Route path="/fichar" element={<AddTimeTrack />} />
            <Route path="/revisar" element={<TimeTrackView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loglist" element={<LogList />} />
            <Route path="/info" element={<Landing />} />
            <Route path="/techinfo" element={<TechInfo />} />
          </Routes>
        </main>

        <footer className="mt-8 mb-2">
          <p className="text-center">© 2025 My Website. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
