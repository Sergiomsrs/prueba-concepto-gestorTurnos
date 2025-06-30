import { Route, Routes } from "react-router-dom"
import { Landing } from "./Landing"
import { Navbar } from "../utilComponents/Navbar"
import { EmployeeWeek } from "./EmployeeWeek"
import { Daily } from "../gridComponents/Daily"
import { Add } from "./Add"
import { Report } from "./Report"
import { AddTimeTrack } from "../timeTrack/pages/AddTimeTrack"
import { TimeTrackView } from "../timeTrack/pages/TimeTrackView"
import { Login } from "../timeTrack/pages/Login"
import { LogList } from "../timeTrack/pages/LogList"

export const MainPage = () => {
  return (
    
    <div className="bg-gray-100 text-gray-900 min-h-screen w-full max-w-full overflow-x-hidden px-1 sm:px-8 lg:px-16">
      
      <div className="container grid min-h-[100dvh] max-w-full grid-rows-[auto_1fr_auto]" >

        <header className="mb-8">
          <Navbar />
        </header>

        <main className="flex flex-col items-center max-w-full overflow-auto">
          <Routes>
            <Route path="/" element={<Daily />} />
            <Route path="/employeeweek" element={<EmployeeWeek />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/adduser" element={<Add />} />
            <Route path="/report" element={<Report />} />
            <Route path="/fichar" element={<AddTimeTrack />} />
            <Route path="/revisar" element={<TimeTrackView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loglist" element={<LogList />} />
          </Routes>
        </main>

        <footer className="mt-8 mb-2">
          <p className="text-center">© 2024 My Website. All rights reserved.</p>
        </footer>

      </div>
    </div>
  )
}
