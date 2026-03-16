import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';
import { authService } from '@/auth/services/authService';
const API_URL = import.meta.env.VITE_API_URL;

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
      // 1. Intentar el login para obtener el TOKEN
      const loginData = await authService.login(formData);
      const { token, role } = loginData;

      // 2. IMPORTANTE: Guardar el token en sessionStorage manualmente AHORA
      // Esto asegura que el interceptor de Axios lo vea para la siguiente llamada
      sessionStorage.setItem('token', token);

      // 3. Ahora que el token está en el storage, pedimos los datos del usuario
      const userData = await authService.getMe();

      // 4. Una vez tenemos TODO, llamamos al login del Contexto
      // Esto actualizará el estado global y el resto de sessionStorage
      login(token, role, userData);

      // 5. Navegar según el rol
      navigate(role === "USER" ? "/schedules" : "/");

    } catch (error) {
      console.error("Error en el proceso de login:", error);
      setError(true);
      setErrorMessage({
        text: error.response?.status === 403
          ? "Sesión inválida o sin permisos"
          : "Credenciales incorrectas",
        type: 'error'
      });
    }
  };


  const handleDemoLogin = () => {
    const demoToken = "demo-token-12345";
    const demoRole = "ADMIN";
    const demoUserData = {
      id: 0,
      name: "Usuario",
      lastName: "de Demo",
      dni: "00000000X",
      email: "demo@workschdedflow.com",
      role: "ADMIN"
    };

    // Usamos la misma función login del contexto
    login(demoToken, demoRole, demoUserData);

    // Redirigimos al inicio
    navigate("/");
  };

  return (
    <div className="h-[calc(100vh-5rem-4.5rem)] flex overflow-hidden">

      {/* PANEL IZQUIERDO */}
      <div
        className="hidden lg:flex lg:w-3/5 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}bg-image-loginForm.webp')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-700/40"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">

          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            WORK<span className="text-blue-300">SCHEDFLOW</span>
          </h1>

          <p className="text-lg text-blue-100 max-w-md mb-10">
            Gestiona turnos, equipos y asistencia desde una plataforma moderna y sencilla.
          </p>

          <div className="space-y-4 text-blue-100">

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border border-blue-300 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
              Planificación inteligente de turnos
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border border-blue-300 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
              Control de asistencia en tiempo real
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border border-blue-300 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
              Reportes avanzados
            </div>

          </div>

        </div>
      </div>


      {/* PANEL DERECHO */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white px-8">

        <div className="w-full max-w-md">

          {/* HEADER MOBILE */}
          <div
            className="lg:hidden relative mb-8 -mx-8 -mt-6 px-8 pt-6 pb-6 bg-cover bg-center"
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


          {/* HERO DEMO CTA */}
          <div className="mb-10">

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Explorar la aplicación
            </h2>

            <p className="text-gray-600 text-sm mb-5">
              Accede al panel completo con datos de ejemplo.
            </p>

            <button
              onClick={handleDemoLogin}
              className="
  relative
  w-full
  py-4
  rounded-xl
  bg-gradient-to-r
  from-blue-600
  to-indigo-600
  text-white
  font-semibold
  flex
  items-center
  justify-center
  gap-3
  transition
  duration-300
  hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)]
  hover:scale-[1.02]
  active:scale-[0.98]
  group
"
            >

              <svg
                className="w-5 h-5 group-hover:scale-110 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>

              Entrar en modo demo

            </button>

            <p className="text-xs text-gray-500 mt-3">
              Sin registro · Acceso completo · Datos de prueba incluidos
            </p>

          </div>


          {/* LOGIN */}
          <div className="border-t border-gray-200 pt-8">

            <p className="text-sm text-gray-500 mb-4">
              O inicia sesión con tus credenciales
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  DNI
                </label>

                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="Introduce tu DNI"
                  className="
                w-full
                px-4
                py-3
                border
                border-gray-200
                rounded-lg
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                outline-none
                "
                  required
                />
              </div>


              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Introduce tu contraseña"
                  className="
                w-full
                px-4
                py-3
                border
                border-gray-200
                rounded-lg
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                outline-none
                "
                  required
                />
              </div>

              <button
                type="submit"
                className="
              w-full
              bg-gray-900
              text-white
              py-3
              rounded-lg
              font-medium
              hover:bg-black
              transition
              "
              >
                Iniciar sesión
              </button>

              {error && (
                <div className="mt-4">
                  <AlertMessage isOpen={error} message={errorMessage} />
                </div>
              )}

            </form>

            <div className="mt-5 text-center">
              <a className="text-sm text-blue-600 hover:text-blue-800">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
