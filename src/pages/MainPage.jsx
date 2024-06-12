import { Route, Routes } from "react-router-dom"
import { Daily } from "../Daily"
import { Landing } from "./Landing"
import { Navbar } from "../utilComponents/Navbar"

export const MainPage = () => {
  return (

    <div className="bg-gray-100 text-gray-900 min-h-screen">
        <div className="container mx-auto px-16 max-w-full py-8" >

        <header className="mb-8">
    <Navbar/>
  </header>

  <main className="">
    <Routes>
      <Route path="/" element={<Daily />} />
      <Route path="/landing" element={<Landing />} />
    </Routes>
  </main>

  <footer className="mt-8">
    <p className="text-center">© 2024 My Website. All rights reserved.</p>
  </footer>

        </div>  
        </div>



)
}
