import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import { MainPage } from './MainPage'
import { AuthContext } from '../timeTrack/context/AuthContext'
import { AppContext } from '../context/AppContext'

describe('MainPage (Smoke Test)', () => {
    test('la página principal carga sin errores y muestra la estructura básica', () => {
        // ⚠️ Mocks MÍNIMOS solo para evitar crashes, no para testear funcionalidad
        const minimalAuthContext = {
            auth: {
                isAuthenticated: false,
                user: null,
                token: null,
                role: 'DEMO'
            }
        }

        const minimalAppContext = {
            holidayDates: [],
            data: [],
            alert: { isOpen: false },
            selectedOption: 'todos',
            // Funciones mock mínimas
            setData: vi.fn(),
            fetchShiftWeek: vi.fn(),
            saveData: vi.fn(),
            resetData: vi.fn()
        }

        const { container } = render(
            <MemoryRouter initialEntries={['/']}>
                <AuthContext.Provider value={minimalAuthContext}>
                    <AppContext.Provider value={minimalAppContext}>
                        <MainPage />
                    </AppContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        )

        // ✅ La app no crashea
        expect(container).toBeTruthy()

        // ✅ Estructura básica presente
        expect(container.querySelector('nav')).not.toBeNull()// Header/Navbar
        expect(container.querySelector('main')).not.toBeNull()// Contenido principal
        expect(container.querySelector('footer')).not.toBeNull()// Footer

        // ✅ Elemento crítico que indica que la app funciona
        expect(screen.getByText('WorkSchedFlow')).toBeDefined()
    })
})