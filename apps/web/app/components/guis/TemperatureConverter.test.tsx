import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '~/lib/test-utils'

import TemperatureConverter from './TemperatureConverter'

describe('temperatureConverter', () => {
  it('renders both input fields and labels', () => {
    renderWithProviders(<TemperatureConverter />)
    expect(screen.getByRole('spinbutton', {
      name: /celsius/i,
    })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', {
      name: /fahrenheit/i,
    })).toBeInTheDocument()
  })

  it('updates Fahrenheit when Celsius is changed', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)
    const celsiusInput = screen.getByRole('spinbutton', {
      name: /celsius/i,
    })

    await user.type(celsiusInput, '100') // 100°C

    const fahrenheitInput = screen.getByRole('spinbutton', {
      name: /fahrenheit/i,
    })
    expect(fahrenheitInput).toHaveValue(212) // 212°F
  })

  it('updates Celsius when Fahrenheit is changed', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)
    const fahrenheitInput = screen.getByRole('spinbutton', {
      name: /fahrenheit/i,
    })

    await user.type(fahrenheitInput, '32') // 32°F
    const celsiusInput = screen.getByRole('spinbutton', {
      name: /celsius/i,
    })
    expect(celsiusInput).toHaveValue(0) // 0°C
  })

  it('resets both fields if input is cleared', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)
    const fahrenheitInput = screen.getByRole('spinbutton', {
      name: /fahrenheit/i,
    })
    const celsiusInput = screen.getByRole('spinbutton', {
      name: /celsius/i,
    })

    // Enter some values first
    await user.type(celsiusInput, '25')
    expect(fahrenheitInput).not.toHaveValue(null)

    // Clear the Celsius input
    await user.clear(celsiusInput)
    expect(celsiusInput).toHaveValue(null)
    expect(fahrenheitInput).toHaveValue(null)
  })

  it('handles negative values correctly', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)
    const fahrenheitInput = screen.getByRole('spinbutton', {
      name: /fahrenheit/i,
    })
    const celsiusInput = screen.getByRole('spinbutton', {
      name: /celsius/i,
    })

    await user.type(celsiusInput, '-40') // -40°C
    expect(fahrenheitInput).toHaveValue(-40) // -40

    // Clear input to test the other direction
    await user.clear(celsiusInput)
    await user.type(fahrenheitInput, '-40') // -40°F
    expect(celsiusInput).toHaveValue(-40) // -40°C

    // Test backspace functionality
    await user.type(fahrenheitInput, '{backspace}')
    expect(fahrenheitInput).toHaveValue(-4)
    expect(celsiusInput).toHaveValue(-20) // -20°C
  })

  it('handles invalid number inputs gracefully', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)
    const celsiusInput = screen.getByRole('spinbutton', {
      name: /celsius/i,
    })

    // Simulate partially typed/invalid input
    await user.type(celsiusInput, 'abc')

    const fahrenheitInput = screen.getByRole('spinbutton', {
      name: /fahrenheit/i,
    })
    expect(fahrenheitInput).toHaveValue(null)
  })
})
