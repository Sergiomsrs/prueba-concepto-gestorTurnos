import { describe, test, expect } from 'vitest'
import { getTimeFromIndex } from './timeManager'


describe('getTimeFromIndex', () => {
    test('devuelve 07:00 para el índice 0', () => {
        expect(getTimeFromIndex(0)).toBe('07:00')
    })

    test('devuelve 08:00 para el índice 4', () => {
        expect(getTimeFromIndex(4)).toBe('08:00')
    })

    test('devuelve 07:15 para el índice 1', () => {
        expect(getTimeFromIndex(1)).toBe('07:15')
    })

    test('devuelve 12:00 para un índice mayor (ejemplo 20)', () => {
        expect(getTimeFromIndex(20)).toBe('12:00')
    })
})
