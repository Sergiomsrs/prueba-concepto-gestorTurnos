import { Route, Routes } from "react-router-dom"
import { Landing } from "./Landing"
import { Navbar } from "../utilComponents/Navbar"
import { FormUser } from "./FormUser"
import { EmployeeWeek } from "./EmployeeWeek"
import { Daily } from "../gridComponents/Daily"
import { TechInfo } from "./TechInfo"
import { ScrollToTop } from "../landing/ScrollToTop "

export const MainPage = () => {
  return (
    
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      
      <div className="container mx-auto px-16 max-w-full py-8" >

        <header className="mb-8">
          <Navbar />
        </header>
        <ScrollToTop />
        <main className="">
          <Routes>
            <Route path="/" element={<Daily />} />
            <Route path="/employeeweek" element={<EmployeeWeek />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/adduser" element={<FormUser />} />
            <Route path="/techinfo" element={<TechInfo />} />
          </Routes>
        </main>

        <footer className="mt-8">
          <p className="text-center">© 2024 My Website. All rights reserved.</p>
        </footer>

      </div>
    </div>
  )
}
