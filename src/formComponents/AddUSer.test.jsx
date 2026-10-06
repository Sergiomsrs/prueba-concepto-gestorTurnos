import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, test } from 'vitest';
import { AddUser } from './AddUSer';

describe('AddUser demo account protection', () => {
    test('does not allow editing or deleting the demo account', () => {
        const queryClient = new QueryClient();
        const employees = [{
            id: 1,
            name: 'Demo',
            lastName: 'Account',
            dni: '12345678C',
            email: 'demo@example.com',
            role: 'ADMIN'
        }];

        render(
            <QueryClientProvider client={queryClient}>
                <AddUser allEmployees={employees} />
            </QueryClientProvider>
        );

        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

        expect(screen.getByDisplayValue('Demo').disabled).toBe(true);
        expect(screen.getByDisplayValue('12345678C').disabled).toBe(true);
        expect(screen.queryByRole('button', { name: 'Actualizar Datos' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Eliminar Empleado' })).toBeNull();
        expect(screen.getByText('La cuenta demo está protegida y no se puede modificar ni eliminar.')).toBeTruthy();
    });
});
