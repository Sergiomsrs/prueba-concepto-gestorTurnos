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
      navigate("/");
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
    <div className="h-[calc(100vh-5rem-4.5rem)] flex overflow-hidden">
      {/* h-[calc(100vh - navbar(5rem) - footer(~3.5rem))] */}

      {/* Panel izquierdo - Branding y información */}
      <div
        className="hidden lg:flex lg:w-3/5 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}bg-image-loginForm.webp')`
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/75 to-transparent"></div>

        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12 text-white">
          <div className="mb-8">
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              Gestión de equipos de trabajo
            </p>
          </div>

          <div className="space-y-3 text-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm xl:text-base">Planificación de turnos inteligente</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm xl:text-base">Control de asistencia en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm xl:text-base">Reportes y análisis avanzados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario limpio */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white px-6 py-4">
        <div className="w-full max-w-md">

          {/* Header móvil simplificado */}
          <div
            className="lg:hidden relative mb-6 -mx-6 -mt-4 px-6 pt-6 pb-4 bg-cover bg-center"
            style={{
              backgroundImage: `url('${import.meta.env.BASE_URL}bg-image-loginForm.webp')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/75 to-transparent"></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-xl font-bold">
                WORK<span className="text-blue-300">SCHEDFLOW</span>
              </h1>
            </div>
          </div>

          {/* Título del formulario */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso al sistema
            </h2>
            <p className="text-gray-600 text-sm">
              Introduce tus credenciales para continuar
            </p>
          </div>

          {/* Formulario directo */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                DNI
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="dni"
                  id="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all outline-none placeholder-gray-400"
                  placeholder="Introduce tu DNI"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Introduce tu contraseña"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all outline-none placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m-7 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
              Iniciar sesión
            </button>

            {error && (
              <div className="mt-4">
                <AlertMessage isOpen={error} message={errorMessage} />
              </div>
            )}
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>


        </div>
      </div>
    </div>
  );
};
