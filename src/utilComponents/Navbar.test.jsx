import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { AuthContext } from "../timeTrack/context/AuthContext"
import { Navbar } from "./Navbar"
import { expect } from "vitest"


describe('Navbar', () => {

    test('muestra el nombre de la aplicacion', () => {
        const title = 'WorkSchedFlow'

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ auth: { isAuthenticated: false } }}>
                    <Navbar />
                </AuthContext.Provider>
            </BrowserRouter>
        )
        expect(screen.getByText(title)).toBeDefined();
    });

    test('muestra Log in cuando no hay usuario autenticado', () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ auth: { isAuthenticated: false } }}>
                    <Navbar />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        expect(screen.getByText('Log in')).toBeDefined();
    });

    test('muestra Log out cuando el usuario está autenticado', () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider
                    value={{
                        auth: { isAuthenticated: true, user: { name: 'Sergio', lastName: 'Msrs' } },
                        logout: vi.fn(),
                    }}
                >
                    <Navbar />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        screen.debug();

        expect(screen.getByText('Log out')).toBeDefined();
        expect(screen.getByText(/Sergio Msrs/)).toBeDefined();
    });


}) 