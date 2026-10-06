import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { authService } from '@/auth/services/authService';
import { AuthContext } from '../context/AuthContext';
import { Login } from './Login';

vi.mock('@/auth/services/authService', () => ({
  authService: {
    login: vi.fn(),
    getMe: vi.fn()
  }
}));

describe('Login demo account', () => {
  const contextLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  const renderLogin = () => render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: contextLogin }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  test('authenticates with the demo account credentials when the API is available', async () => {
    const userData = { id: 5, role: 'ADMIN', companyName: 'Demo company' };
    authService.login.mockResolvedValue({ token: 'api-token', role: 'ADMIN' });
    authService.getMe.mockResolvedValue(userData);

    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));

    await waitFor(() => {
      expect(contextLogin).toHaveBeenCalledWith(
        'api-token',
        'ADMIN',
        { ...userData, isSharedDemoAccount: true },
        'Demo company'
      );
    });
    expect(authService.login).toHaveBeenCalledWith(
      { dni: '12345678C', password: 'demopassword' },
      { timeout: 10000 }
    );
    expect(sessionStorage.getItem('token')).toBe('api-token');
  });

  test('enters the existing offline demo mode when the API cannot be reached', async () => {
    authService.login.mockRejectedValue({ isAxiosError: true, code: 'ERR_NETWORK' });

    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));

    await waitFor(() => {
      expect(contextLogin).toHaveBeenCalledWith(
        'demo-token-12345',
        'ADMIN',
        expect.objectContaining({ dni: '00000000X' })
      );
    });
    expect(authService.getMe).not.toHaveBeenCalled();
  });

  test('does not use offline mode when the API rejects the demo credentials', async () => {
    authService.login.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 }
    });

    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));

    expect(await screen.findByText('No se pudo iniciar sesión con las credenciales de demo.')).toBeTruthy();
    expect(contextLogin).not.toHaveBeenCalled();
  });

  test('explains a forbidden response without entering offline demo mode', async () => {
    authService.login.mockRejectedValue({
      isAxiosError: true,
      config: { url: '/auth/login' },
      response: { status: 403 }
    });

    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));

    expect(await screen.findByText(
      'La API ha denegado el acceso en /auth/login. Comprueba que la cuenta demo exista en el servidor y tenga rol ADMIN o USER.'
    )).toBeTruthy();
    expect(contextLogin).not.toHaveBeenCalled();
  });
});
