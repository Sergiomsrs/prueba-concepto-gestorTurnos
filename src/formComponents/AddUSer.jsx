import { useState } from "react"


const initialState = {
    id: "",
    name: "",
    lastName: "",
    email: "",
    hireDate: "",
    terminationDate: ""
}




export const AddUSer = () => {

    const [createForm, setCreateForm] = useState(initialState);
    const [email, setEmail] = useState("")
    const [isExistingEmployee, setIsExistingEmployee] = useState(false);
    const [message, setMessage] = useState("")



    const handleInputCreateChange = (e) => {
        e.preventDefault()
        setCreateForm({
            ...createForm,
            [e.target.name]: e.target.value
        })
    }

    const handleInputEmailChange = (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    const handleSave = (e) => {
        fetch('http://localhost:8081/api/emp/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: createForm.name,
                lastName: createForm.lastName,
                email: createForm.email,
                hireDate: createForm.hireDate,
                terminationDate: createForm.terminationDate
            }),
          })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    }

    const handleUpdate = () => {
        fetch(`http://localhost:8081/api/emp/update/${createForm.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: createForm.name,
                lastName: createForm.lastName,
                email: createForm.email,
                hireDate: createForm.hireDate,
                terminationDate: createForm.terminationDate
            }),
          })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    }

    const handleDelete = () => {
        fetch(`http://localhost:8081/api/emp/delete/${createForm.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));

    }


    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/emp/search?email=${email}`);
            if (response.ok) {
                const foundEmployee = await response.json();
                setCreateForm(foundEmployee); // Guardamos el empleado encontrado
                setIsExistingEmployee(true); // Indicamos que es un empleado existente
                setMessage("")
            } else {
                setIsExistingEmployee(false); // No se encontró al empleado
                setMessage("No se encontró al empleado");
                
            }
        } catch (error) {
            console.error("Error buscando el empleado", error);
        }
    };

    const handleCancel = () => {
        setCreateForm(initialState)
    }


    return (
        <form>

            <div className="flex flex-row gap-4 mb-2">
                <div className="w-3/4">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 mb-2 text-gray-900">Buscar por Email</label>
                    <div className="">
                        <input onChange={handleInputEmailChange} type="text" name="name"   className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6 ">
                    <button type="button"  onClick={handleSearch} className="rounded-md mt-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Buscar</button>
                </div>

            </div>
                <div className="mb-4">
                    {message}
                </div>



            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="text" name="name" value={createForm.name || ""}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="text" name="lastName" value={createForm.lastName || ""}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange}  name="email" value={createForm.email || ""} type="email"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Hire Date</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="date" name="hireDate" value={createForm.hireDate || ""}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Termination Date</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="date" name="terminationDate" value={createForm.terminationDate || ""}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>





                    </div>
                </div>

            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button onClick={handleCancel} type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                {
                  isExistingEmployee? 
                 <>
                      <button onClick={handleUpdate} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Update</button>  
                      <button onClick={handleDelete} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Delete</button>  
                 </>
                
                  :<button onClick={handleSave} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                }
            </div>
        </form>

    )
}