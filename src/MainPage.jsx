import { Daily } from "./Daily"

export const MainPage = () => {
  return (

    <div className="bg-gray-100 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl py-8" >

        <header className="mb-8">
    <h1 className="text-3xl font-bold">App Gestion Turnos de Trabajo</h1>
  </header>

  <main className="">
  <Daily/>
  </main>

  <footer className="mt-8">
    <p className="text-center">© 2024 My Website. All rights reserved.</p>
  </footer>

        </div>  
        </div>



)
}
