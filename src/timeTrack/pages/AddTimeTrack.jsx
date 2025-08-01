
import { useState } from 'react'
import { AlertModal } from '../components/AlertModal'

export const AddTimeTrack = () => {

    const [formData, setFormData] = useState({ dni: '', password: '' })
    const [message, setMessage] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    

    const handleSubmit = async (e) => {
        e.preventDefault() 
      
        try {
          const response = await fetch('http://localhost:8081/api/timestamp/fichar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dni: formData.dni,
              password: formData.password,
            }),
          })
      
          if (!response.ok) {
            throw new Error('Error en el fichaje')
          }
          
          const data = await response.json()
          console.log('Fichaje exitoso:', data)
          
         
          setFormData({ dni: '', password: '' })
            setMessage({
                type: 'success',
                text: 'Fichaje exitoso',
            })
            setIsOpen(true)
            setTimeout(() => {
                setIsOpen(false)
            }, 1000)
          
        } catch (error) {
          console.error('Error:', error)
          setFormData({ dni: '', password: '' })
            setMessage({
                type: 'error',
                text: 'Se ha producido un error al fichar',})
            setIsOpen(true)
            setTimeout(() => {
                setIsOpen(false)
            }, 2000)
        }
      }
      



    return (
        <div className="min-h-full flex items-center justify-center">
            <div className='-mt-40'>

            <div className="mx-auto max-w-2xl text-center">
                <h1 className="mb-4 text-3xl  md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500">Time Track</h1>
                <p className="mt-2 text-lg text-gray-600">Registra aquí tu jornada!</p>
            </div>
            <form onSubmit={handleSubmit} method="POST" className="mx-auto max-w-xl sm:mt-10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                            DNI
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="dni"
                                name="dni"
                                type="text"
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                        </div>
                    </div>

                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="w-full rounded-md cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                        Enviar
                    </button>
                </div>
            </form>

            <AlertModal message={message} isOpen={isOpen}/>
                        </div>
        </div>
    )
}
