import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    dni: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!loginResponse.ok) throw new Error('Error al iniciar sesión');

      const loginData = await loginResponse.json();
      const token = loginData.token;
      const role = loginData.role;

      const meResponse = await fetch('http://localhost:8081/api/emp/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!meResponse.ok) throw new Error('Error al obtener datos del usuario');

      const userData = await meResponse.json();
      login(token, role, userData);
      navigate("/report");
      setFormData({ dni: '', password: '' });

    } catch (error) {
      setError(true);
      let err = error.message === 'Failed to fetch' ? 'Error de conexión' : error.message;
      setErrorMessage({
        text: err,
        type: 'error'
      });
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <section className="w-3/4 min-h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div 
        className="flex flex-col items-center justify-center w-full min-h-[60vh] md:min-h-[70vh] px-6 py-8 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}bg-image-loginForm.webp')`
        }}
      >
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Acceso al sistema
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="dni" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DNI</label>
                <input
                  type="text"
                  name="dni"
                  id="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="Introduce tu DNI"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Iniciar sesión
              </button>
              {error && (
                <div className="mt-2">
                  <AlertMessage isOpen={error} message={errorMessage} />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
